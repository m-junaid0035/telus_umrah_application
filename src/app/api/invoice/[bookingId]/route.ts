
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { HotelBooking } from '@/models/HotelBooking';
import { PackageBooking } from '@/models/PackageBooking';
import { CustomUmrahRequest } from '@/models/CustomUmrahRequest';
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/generateInvoice';
import { UmrahPackage } from '@/models/UmrahPackage';
import { Hotel } from '@/models/Hotel';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    await connectToDatabase();
    const { bookingId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'hotel'; // 'hotel' or 'package'

    let booking: any;
    let itemName = '';

    let hotel: any = null;
    let pkg: any = null;
    let calculatedTotal = 0;

    if (type === 'hotel') {
      booking = await HotelBooking.findById(bookingId).lean();
      
      if (booking) {
        hotel = await Hotel.findById(booking.hotelId).lean();
        itemName = hotel?.name || booking.hotelName || 'Hotel Booking';
        
        // Use the saved totalAmount that was calculated at booking time
        // This avoids needing roomType in the database
        if (booking.totalAmount && booking.totalAmount > 0) {
          calculatedTotal = booking.totalAmount;
        } else {
          // Fallback: recalculate if totalAmount is missing (for old bookings)
          if (hotel && booking.checkInDate && booking.checkOutDate) {
            const checkIn = booking.checkInDate instanceof Date 
              ? booking.checkInDate 
              : new Date(booking.checkInDate);
            const checkOut = booking.checkOutDate instanceof Date 
              ? booking.checkOutDate 
              : new Date(booking.checkOutDate);
            
            const timeDiff = checkOut.getTime() - checkIn.getTime();
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
            const nights = Math.max(1, Math.ceil(daysDiff));
            
            // Use standard room price as fallback
            let roomPricePerNight = hotel.standardRoomPrice || 0;
            if (hotel.deluxeRoomPrice && hotel.deluxeRoomPrice > 0 && !roomPricePerNight) {
              roomPricePerNight = hotel.deluxeRoomPrice;
            }
            if (hotel.familySuitPrice && hotel.familySuitPrice > 0 && !roomPricePerNight) {
              roomPricePerNight = hotel.familySuitPrice;
            }
            
            calculatedTotal = roomPricePerNight * nights * (booking.rooms || 1);
            
            if (booking.meals && hotel.mealsPrice) {
              calculatedTotal += hotel.mealsPrice * nights * (booking.rooms || 1);
            }
            if (booking.transport && hotel.transportPrice) {
              calculatedTotal += hotel.transportPrice;
            }
          }
        }
      }
    } else if (type === 'custom') {
      booking = await CustomUmrahRequest.findById(bookingId).lean();
      if (booking) {
        itemName = 'Custom Umrah Request';
        // Estimate price for custom request
        if (booking.adults) {
          const totalTravelers = (booking.adults || 0) + (booking.children || 0);
          calculatedTotal = 100000 * totalTravelers; // Base price per person

          // Add additional services (estimate prices)
          if (booking.umrahVisa) {
            calculatedTotal += 50000 * totalTravelers;
          }
          if (booking.transport) {
            calculatedTotal += 15000;
          }
          if (booking.zaiarat) {
            calculatedTotal += 20000;
          }
          if (booking.meals) {
            calculatedTotal += 30000 * totalTravelers;
          }
          if (booking.esim) {
            calculatedTotal += 5000 * totalTravelers;
          }
        }
      }
    } else {
      booking = await PackageBooking.findById(bookingId).lean();
      if (booking) {
        pkg = await UmrahPackage.findById(booking.packageId).lean();
        itemName = pkg?.name || 'Umrah Package';
        
        // Calculate package booking price
        if (pkg && booking.travelers) {
          const totalTravelers = (booking.travelers.adults || 0) + (booking.travelers.children || 0);
          calculatedTotal = (pkg.price || 0) * totalTravelers;
          
          // Add additional services (estimate prices)
          if (booking.umrahVisa) {
            calculatedTotal += 50000 * totalTravelers; // 50000 PKR per person for visa
          }
          if (booking.transport) {
            calculatedTotal += 15000; // 15000 PKR for transport
          }
          if (booking.zaiarat) {
            calculatedTotal += 20000; // 20000 PKR for zaiarat tours
          }
          if (booking.meals) {
            calculatedTotal += 30000 * totalTravelers; // 30000 PKR per person for meals
          }
          if (booking.esim) {
            calculatedTotal += 5000 * totalTravelers; // 5000 PKR per person for eSIM
          }
        }
      }
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Generate invoice number if not already generated
    let invoiceNumber = booking.invoiceNumber;
    if (!invoiceNumber) {
      invoiceNumber = generateInvoiceNumber(bookingId, type);
      const invoiceUrl = `/api/invoice/${bookingId}?type=${type}`;
      
      // Save invoice info to database
      if (type === 'hotel') {
        await HotelBooking.findByIdAndUpdate(bookingId, {
          invoiceGenerated: true,
          invoiceNumber,
          invoiceUrl,
        });
      } else if (type === 'package') {
        await PackageBooking.findByIdAndUpdate(bookingId, {
          invoiceGenerated: true,
          invoiceNumber,
          invoiceUrl,
        });
      } else if (type === 'custom') {
        await CustomUmrahRequest.findByIdAndUpdate(bookingId, {
          invoiceGenerated: true,
          invoiceNumber,
          invoiceUrl,
        });
      }
    }

    // Prepare invoice data
    const invoiceData = {
      invoiceNumber,
      bookingId,
      bookingType: type as 'hotel' | 'package' | 'custom',
      customerName: booking.customerName || booking.name,
      customerEmail: booking.customerEmail || booking.email,
      customerPhone: booking.customerPhone || booking.phone,
      customerNationality: booking.customerNationality || booking.nationality,
      bookingDate: booking.createdAt,
      checkInDate: booking.checkInDate || booking.departDate,
      checkOutDate: booking.checkOutDate || booking.returnDate,
      itemName,
      // Use saved totalAmount (calculated at booking time) - this is the correct price
      // Only recalculate if totalAmount is missing (for old bookings)
      totalAmount: booking.totalAmount && booking.totalAmount > 0 ? booking.totalAmount : (calculatedTotal || 0),
      paymentMethod: booking.paymentMethod || 'cash',
      travelers: type === 'package' || type === 'custom' ? { adults: booking.adults || 0, children: booking.children || 0 } : { adults: booking.adults || 0, children: booking.children || 0 },
      rooms: booking.rooms,
      bedType: type === 'hotel' ? booking.bedType : undefined,
      additionalServices: type === 'hotel'
        ? [
            ...(booking.meals ? ['Meals'] : []),
            ...(booking.transport ? ['Transport'] : []),
          ]
        : [
            ...(booking.umrahVisa ? ['Umrah Visa'] : []),
            ...(booking.transport ? ['Transport'] : []),
            ...(booking.zaiarat ? ['Zaiarat Tours'] : []),
            ...(booking.meals ? ['Meals'] : []),
            ...(booking.esim ? ['eSIM'] : []),
          ],
    };

    // Generate PDF
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generateInvoicePDF(invoiceData);
    } catch (pdfError: any) {
      return NextResponse.json(
        { error: 'Failed to generate PDF. Please try again later.', details: pdfError.message },
        { status: 500 }
      );
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate invoice', details: error.message },
      { status: 500 }
    );
  }
}

