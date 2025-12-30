
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { HotelBooking } from '@/models/HotelBooking';
import { PackageBooking } from '@/models/PackageBooking';
import { CustomUmrahRequest } from '@/models/CustomUmrahRequest';
import { generateInvoicePDF } from '@/lib/generateInvoice';
import { generateRequestFormPDF } from '@/lib/generateRequestForm';
import { generateBookingNumber } from '@/lib/utils';
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
        // This is a request form, not an invoice, so no price calculation
        calculatedTotal = 0;
      }
    } else {
      booking = await PackageBooking.findById(bookingId).lean();
      if (booking) {
        pkg = await UmrahPackage.findById(booking.packageId).lean();
        itemName = pkg?.name || 'Umrah Package';
        
        // Calculate package booking price
          if (pkg) {
            const adultsCount = Array.isArray(booking.adults) ? booking.adults.length : (booking.travelers?.adults || 0);
            const childrenCount = Array.isArray(booking.children) ? booking.children.length : (booking.travelers?.children || 0);
            const infantsCount = Array.isArray(booking.infants) ? booking.infants.length : 0;
            const totalTravelers = adultsCount + childrenCount + infantsCount;
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

    // For custom requests, this is not an invoice, so no invoice number is generated.
    // For other types, generate invoice number if not already generated.
    let invoiceNumber = booking.invoiceNumber;
    if (type !== 'custom' && !invoiceNumber) {
      invoiceNumber = generateBookingNumber(bookingId, type);
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
      }
    }

    // Prepare data
    const data = {
      invoiceNumber: invoiceNumber || `REQ-${bookingId.slice(-6)}`,
      bookingId,
      bookingType: type as 'hotel' | 'package' | 'custom',
      status: booking.status,
      // Derive customer details: for package bookings use family head from adults array
      customerName: ((): string => {
        if (type === 'package') {
          const head = Array.isArray(booking.adults) ? (booking.adults.find((a: any) => a.isHead) || booking.adults[0]) : null;
          return head?.name || booking.customerName || booking.name || '';
        }
        return booking.customerName || booking.name || '';
      })(),
      customerEmail: booking.customerEmail || booking.email,
      customerPhone: ((): string => {
        if (type === 'package') {
          const head = Array.isArray(booking.adults) ? (booking.adults.find((a: any) => a.isHead) || booking.adults[0]) : null;
          return head?.phone || booking.customerPhone || booking.phone || '';
        }
        return booking.customerPhone || booking.phone || '';
      })(),
      customerNationality: booking.customerNationality || booking.nationality,
      bookingDate: booking.createdAt,
      checkInDate: booking.checkInDate || booking.departDate,
      checkOutDate: booking.checkOutDate || booking.returnDate,
      itemName,
      totalAmount: calculatedTotal, // Will be 0 for custom requests
      paymentMethod: booking.paymentMethod || 'cash',
      // For package bookings include structured arrays
      adults: Array.isArray(booking.adults) ? booking.adults : undefined,
      children: Array.isArray(booking.children) ? booking.children : undefined,
      infants: Array.isArray(booking.infants) ? booking.infants : undefined,
      childAges: Array.isArray(booking.children) ? booking.children.map((c: any) => c.age).filter((a: any) => a !== undefined) : (booking.childAges || undefined),
      rooms: booking.rooms,
      bedType: booking.bedType,
      from: booking.from,
      to: booking.to,
      airline: booking.airline,
      airlineClass: booking.airlineClass,
      differentReturnCity: booking.differentReturnCity,
      returnFrom: booking.returnFrom,
      returnTo: booking.returnTo,
      hotels: booking.hotels,
      notes: booking.notes,
      additionalServices: booking.selectedServices
        ? booking.selectedServices.map((s: { serviceName: string; }) => s.serviceName)
        : (type === 'hotel'
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
              ]),
    };

    // Generate PDF
    let pdfBuffer: Buffer;
    try {
      if (type === 'custom') {
        pdfBuffer = await generateRequestFormPDF(data);
      } else {
        pdfBuffer = await generateInvoicePDF(data);
      }
    } catch (pdfError: any) {
      return NextResponse.json(
        { error: 'Failed to generate PDF. Please try again later.', details: pdfError.message },
        { status: 500 }
      );
    }

    const fileName = type === 'custom' 
      ? `request-form-${bookingId}.pdf`
      : `invoice-${invoiceNumber}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate invoice', details: error.message },
      { status: 500 }
    );
  }
}

