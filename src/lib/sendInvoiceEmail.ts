import nodemailer from 'nodemailer';
import { generateInvoicePDF } from './generateInvoice';
import { connectToDatabase } from '@/lib/db';
import { HotelBooking } from '@/models/HotelBooking';
import { PackageBooking } from '@/models/PackageBooking';
import { Hotel } from '@/models/Hotel';
import { UmrahPackage } from '@/models/UmrahPackage';

interface InvoiceEmailData {
  to: string;
  customerName: string;
  invoiceNumber: string;
  bookingType: string;
  invoiceUrl: string;
  bookingId: string;
}

export async function sendInvoiceEmail(data: InvoiceEmailData) {
  // Create transporter (use same configuration as OTP email)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "03104676590umary@gmail.com", // your Gmail
      pass: "tkddvduqxtmpskhe",           // your Google App Password
    },
  });

  // Generate PDF to attach to email
  let pdfBuffer: Buffer | null = null;
  try {
    await connectToDatabase();
    let booking: any;
    let itemName = '';

    if (data.bookingType === 'hotel') {
      booking = await HotelBooking.findById(data.bookingId).lean();
      if (booking) {
        const hotel = await Hotel.findById(booking.hotelId).lean();
        itemName = hotel?.name || booking.hotelName || 'Hotel Booking';
      }
    } else {
      booking = await PackageBooking.findById(data.bookingId).lean();
      if (booking) {
        const pkg = await UmrahPackage.findById(booking.packageId).lean();
        itemName = pkg?.name || 'Umrah Package';
      }
    }

    if (booking) {
      const invoiceData = {
        invoiceNumber: data.invoiceNumber,
        bookingId: data.bookingId,
        bookingType: data.bookingType as 'hotel' | 'package',
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        customerNationality: booking.customerNationality,
        bookingDate: booking.createdAt,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        itemName,
        totalAmount: booking.totalAmount || 0,
        paymentMethod: booking.paymentMethod || 'cash',
        travelers: data.bookingType === 'package' ? booking.travelers : undefined,
        rooms: booking.rooms,
        additionalServices: data.bookingType === 'hotel' 
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

      pdfBuffer = await generateInvoicePDF(invoiceData);
    }
  } catch (pdfError: any) {
    // Continue without PDF attachment if generation fails
  }

  const mailOptions: any = {
    from: `"Telus Umrah" <03104676590umary@gmail.com>`,
    to: data.to,
    subject: `Invoice for Your ${data.bookingType === 'hotel' ? 'Hotel' : 'Package'} Booking - ${data.invoiceNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9fafb; }
            .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Telus Umrah</h1>
            </div>
            <div class="content">
              <h2>Dear ${data.customerName},</h2>
              <p>Thank you for your booking with Telus Umrah!</p>
              <p>Your invoice <strong>${data.invoiceNumber}</strong> has been generated and is ready for download.</p>
              <p>Please download your invoice using the link below:</p>
              <div style="text-align: center;">
                <a href="${data.invoiceUrl}" class="button">Download Invoice (PDF)</a>
              </div>
              <p><strong>Payment Instructions:</strong></p>
              <p>Please visit our office to complete your payment:</p>
              <p>
                <strong>Telus Umrah</strong><br>
                UG-14, Lucky center, 7-8 Jail Road<br>
                Lahore, 54000 Pakistan<br>
                Phone: 080033333<br>
                Email: support@telusumrah.com
              </p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>Telus Umrah Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  // Attach PDF if generated successfully
  if (pdfBuffer) {
    mailOptions.attachments = [
      {
        filename: `invoice-${data.invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ];
  }

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

