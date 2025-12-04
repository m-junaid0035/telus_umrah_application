import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

interface InvoiceData {
  invoiceNumber: string;
  bookingId: string;
  bookingType: 'hotel' | 'package' | 'custom';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationality?: string;
  bookingDate: Date;
  checkInDate?: Date;
  checkOutDate?: Date;
  itemName: string;
  totalAmount: number;
  paymentMethod: string;
  additionalServices?: string[];
  travelers?: {
    adults: number;
    children: number;
  };
  rooms?: number;
  bedType?: string;
  airline?: string;
  airlineClass?: string;
  from?: string;
  to?: string;
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const primaryColor = rgb(0.05, 0.2, 0.4);
    const secondaryColor = rgb(0.1, 0.4, 0.8);
    const textColor = rgb(0.1, 0.1, 0.1);
    const lightTextColor = rgb(0.4, 0.4, 0.4);
    const whiteColor = rgb(1, 1, 1);
    const tableHeaderColor = rgb(0.94, 0.94, 0.94);

    const margin = 50;
    const { width, height } = page.getSize();
    let y = height - margin;

    // --- Header ---
    try {
        const logoPath = path.resolve(process.cwd(), 'src', 'assets', 'telus-umrah-blue.png');
        const logoBytes = await fs.readFile(logoPath);
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.35);
        page.drawImage(logoImage, {
            x: margin,
            y: y - logoDims.height + 15,
            width: logoDims.width,
            height: logoDims.height,
        });
    } catch (e) {
        // Did not find logo, skip embedding it
    }

    page.drawText('INVOICE', {
      x: width - margin - 150,
      y: y,
      font: boldFont,
      size: 26,
      color: primaryColor,
    });
    y -= 45;

    page.drawText(`Invoice #: ${invoiceData.invoiceNumber}`, {
      x: width - margin - 150,
      y: y,
      font: font,
      size: 10,
      color: lightTextColor,
    });
    y -= 15;
    page.drawText(`Booking ID: ${invoiceData.bookingId}`, {
      x: width - margin - 150,
      y: y,
      font: font,
      size: 10,
      color: lightTextColor,
    });
    y -= 15;
    page.drawText(`Date: ${new Date(invoiceData.bookingDate).toLocaleDateString()}`, {
      x: width - margin - 150,
      y: y,
      font: font,
      size: 10,
      color: lightTextColor,
    });
    
    y -= 40;

    // --- Billed To / From ---
    page.drawText('BILLED TO', { x: margin, y, font: boldFont, size: 10, color: lightTextColor });
    page.drawText('FROM', { x: width / 2, y, font: boldFont, size: 10, color: lightTextColor });
    y -= 15;
    page.drawText(invoiceData.customerName, { x: margin, y, font: boldFont, size: 12, color: textColor });
    page.drawText('Telus Umrah', { x: width / 2, y, font: boldFont, size: 12, color: textColor });
    y -= 15;
    page.drawText(invoiceData.customerEmail, { x: margin, y, font: font, size: 10, color: textColor });
    page.drawText('UG-14, Lucky Center', { x: width / 2, y, font: font, size: 10, color: textColor });
    y -= 15;
    page.drawText(invoiceData.customerPhone, { x: margin, y, font: font, size: 10, color: textColor });
    page.drawText('Lahore, 54000, Pakistan', { x: width / 2, y, font: font, size: 10, color: textColor });
    y -= 15;
    page.drawText(`support@telusumrah.com`, { x: width / 2, y, font: font, size: 10, color: textColor });

    y -= 40;

    // --- Booking Details Table ---
    const tableTop = y;
    const tableWidth = width - margin * 2;
    const rowHeight = 25;
    const col1 = margin;
    const col2 = 300;
    
    // Header
    page.drawRectangle({
        x: margin,
        y: y - rowHeight,
        width: tableWidth,
        height: rowHeight,
        color: tableHeaderColor,
    });
    y -= 17;
    page.drawText('DESCRIPTION', { x: col1 + 15, y, font: boldFont, size: 10, color: textColor });
    page.drawText('DETAILS', { x: col2 + 15, y, font: boldFont, size: 10, color: textColor });
    y += 17;

    const drawTableRow = (label: string, value: string) => {
      y -= rowHeight;
      page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lightTextColor });
      y -= 17;
      page.drawText(label, { x: col1 + 15, y, font: boldFont, size: 10, color: textColor });
      page.drawText(value, { x: col2 + 15, y, font: font, size: 10, color: textColor });
      y += 17;
    };
    
    const bookingTypeText = invoiceData.bookingType === 'hotel' 
      ? 'Hotel Booking' 
      : invoiceData.bookingType === 'package' 
      ? 'Umrah Package' 
      : 'Custom Umrah Request';
    drawTableRow('Booking Type', bookingTypeText);
    drawTableRow('Item', invoiceData.itemName);
    if(invoiceData.checkInDate) drawTableRow('Check-in', new Date(invoiceData.checkInDate).toLocaleDateString());
    if(invoiceData.checkOutDate) drawTableRow('Check-out', new Date(invoiceData.checkOutDate).toLocaleDateString());
    if(invoiceData.travelers) drawTableRow('Travelers', `${invoiceData.travelers.adults} Adult(s), ${invoiceData.travelers.children} Child(ren)`);
    if(invoiceData.rooms) drawTableRow('Rooms', `${invoiceData.rooms}`);
    if(invoiceData.bedType) drawTableRow('Bed Type', invoiceData.bedType);
    if(invoiceData.airline && invoiceData.from && invoiceData.to) drawTableRow('Flight', `${invoiceData.from} to ${invoiceData.to} (${invoiceData.airline})`);
    
    y -= rowHeight;
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lightTextColor });

    y -= 30;

    // --- Additional Services ---
    if (invoiceData.additionalServices && invoiceData.additionalServices.length > 0) {
        page.drawText('ADDITIONAL SERVICES', { x: margin, y, font: boldFont, size: 10, color: lightTextColor });
        y -= 20;
        invoiceData.additionalServices.forEach(service => {
            page.drawText(`• ${service}`, { x: margin + 15, y, font: font, size: 10, color: textColor });
            y -= 15;
        });
        y -= 15;
    }
    
    // --- Total ---
    const totalBoxY = y > 180 ? y - 50 : 130;
    page.drawRectangle({
        x: width - margin - 220,
        y: totalBoxY - 20,
        width: 220,
        height: 50,
        color: primaryColor,
    });
    page.drawText('TOTAL AMOUNT', { x: width - margin - 210, y: totalBoxY + 15, font: boldFont, size: 10, color: whiteColor });
    
    const amountText = `PKR ${invoiceData.totalAmount.toLocaleString()}`;
    const amountTextWidth = boldFont.widthOfTextAtSize(amountText, 20);
    page.drawText(amountText, { 
        x: width - margin - amountTextWidth - 15,
        y: totalBoxY - 5, 
        size: 20, 
        font: boldFont, 
        color: whiteColor 
    });

    // --- Footer ---
    const footerY = margin + 20;
    page.drawLine({ start: { x: margin, y: footerY }, end: { x: width - margin, y: footerY }, thickness: 0.5, color: lightTextColor });
    y = footerY - 15;
    page.drawText('Thank you for choosing Telus Umrah!', { x: width / 2 - 100, y, font: boldFont, size: 12, color: primaryColor });
    y -= 20;
    page.drawText('This is a computer-generated invoice and does not require a signature.', { x: width / 2 - 150, y, font: font, size: 8, color: lightTextColor });


    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);

  } catch (error: any) {
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

export function generateInvoiceNumber(bookingId: string, bookingType: string): string {
  const prefix = bookingType === 'hotel' ? 'HTL' : bookingType === 'package' ? 'PKG' : 'CUS';
  const timestamp = Date.now().toString().slice(-6);
  const shortId = bookingId.slice(-4).toUpperCase();
  return `${prefix}-${timestamp}-${shortId}`;
}
