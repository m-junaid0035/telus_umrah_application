import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

interface InvoiceData {
  invoiceNumber: string;
  bookingId: string;
  bookingType: 'hotel' | 'package' | 'custom';
  status: string;
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
  differentReturnCity?: boolean;
  returnFrom?: string;
  returnTo?: string;
  hotels?: Array<{ 
    hotelClass: string;
    hotel: string;
    stayDuration: string;
    bedType: string;
    city: string;
  }>;
  childAges?: number[];
  notes?: string;
}

export async function generateRequestFormPDF(invoiceData: InvoiceData): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const primaryColor = rgb(0.05, 0.2, 0.4);
    const textColor = rgb(0.1, 0.1, 0.1);
    const lightTextColor = rgb(0.4, 0.4, 0.4);
    const whiteColor = rgb(1, 1, 1);
    const tableHeaderColor = rgb(0.94, 0.94, 0.94);

    const margin = 50;
    const { width, height } = page.getSize();
    let y = height - margin;
    const footerHeight = 60;

    const checkY = (spaceNeeded: number) => {
        if (y - spaceNeeded < margin + footerHeight) {
            page = pdfDoc.addPage([595, 842]);
            y = height - margin;
        }
    };

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
        // Logo not found
    }

    if (invoiceData.bookingType === 'custom') {
        const title = 'Custom Umrah Request';
        const titleWidth = boldFont.widthOfTextAtSize(title, 22);
        page.drawText(title, { x: width - margin - titleWidth, y: y, font: boldFont, size: 22, color: primaryColor });
        y -= 30;
        const requestIdText = `Request ID: ${invoiceData.bookingId}`;
        const requestIdTextWidth = font.widthOfTextAtSize(requestIdText, 10);
        page.drawText(requestIdText, { x: width - margin - requestIdTextWidth, y: y, font: font, size: 10, color: lightTextColor });
        y -= 15;
        const dateText = `Request Date: ${new Date(invoiceData.bookingDate).toLocaleDateString()}`;
        const dateTextWidth = font.widthOfTextAtSize(dateText, 10);
        page.drawText(dateText, { x: width - margin - dateTextWidth, y: y, font: font, size: 10, color: lightTextColor });
        y -= 40;

        const drawSectionHeader = (text: string) => {
            checkY(40);
            y -= 25;
            page.drawText(text, { x: margin, y, font: boldFont, size: 11, color: lightTextColor });
            page.drawLine({ start: { x: margin, y: y - 5 }, end: { x: width - margin, y: y - 5 }, thickness: 0.5, color: tableHeaderColor });
            y -= 15;
        };

        const drawInfoRow = (label: string, value: string | undefined) => {
            if (!value) return;
            checkY(20);
            y -= 20;
            page.drawText(label, { x: margin + 15, y, font: boldFont, size: 10, color: textColor });
            page.drawText(value, { x: margin + 180, y, font: font, size: 10, color: textColor });
        };
        
        drawSectionHeader('REQUESTER INFORMATION');
        drawInfoRow('Name', invoiceData.customerName);
        drawInfoRow('Email', invoiceData.customerEmail);
        drawInfoRow('Phone', invoiceData.customerPhone);
        drawInfoRow('Nationality', invoiceData.customerNationality || '');

        drawSectionHeader('TRAVELERS');
        drawInfoRow('Adults', `${invoiceData.travelers?.adults}`);
        drawInfoRow('Children', `${invoiceData.travelers?.children}`);
        if (invoiceData.childAges && invoiceData.childAges.length > 0) {
            drawInfoRow('Child Ages', invoiceData.childAges.join(', '));
        }
        drawInfoRow('Rooms', `${invoiceData.rooms}`);

        drawSectionHeader('FLIGHT DETAILS');
        drawInfoRow('Departure City', invoiceData.from || '');
        drawInfoRow('Destination City', invoiceData.to || '');
        drawInfoRow('Departure Date', invoiceData.checkInDate ? new Date(invoiceData.checkInDate).toLocaleDateString() : '');
        drawInfoRow('Return Date', invoiceData.checkOutDate ? new Date(invoiceData.checkOutDate).toLocaleDateString() : '');
        drawInfoRow('Airline', invoiceData.airline || '');
        drawInfoRow('Class', invoiceData.airlineClass || '');
        if (invoiceData.differentReturnCity) {
            drawInfoRow('Return From', invoiceData.returnFrom || '');
            drawInfoRow('Return To', invoiceData.returnTo || '');
        }

        if (invoiceData.hotels && invoiceData.hotels.length > 0) {
            drawSectionHeader('HOTEL PREFERENCES');
            invoiceData.hotels.forEach((hotel, index) => {
                checkY(100);
                y -= 15;
                page.drawText(`Hotel ${index + 1}: ${hotel.city}`, { x: margin + 15, y, font: boldFont, size: 10, color: textColor });
                y -= 5;
                drawInfoRow('  • Class', hotel.hotelClass);
                drawInfoRow('  • Hotel', hotel.hotel);
                drawInfoRow('  • Stay Duration', hotel.stayDuration);
                drawInfoRow('  • Bed Type', hotel.bedType);
            });
        }
        
        if (invoiceData.additionalServices && invoiceData.additionalServices.length > 0) {
            drawSectionHeader('ADDITIONAL SERVICES');
            invoiceData.additionalServices.forEach(service => {
                checkY(20);
                y -= 20;
                page.drawText(`• ${service}`, { x: margin + 15, y, font: font, size: 10, color: textColor });
            });
        }
        
        if (invoiceData.notes) {
            drawSectionHeader('NOTES');
            const lines = invoiceData.notes.split('\n');
            lines.forEach(line => {
                const maxWidth = width - (margin * 2) - 15;
                let currentLine = '';
                const words = line.split(' ');
                for(const word of words) {
                    const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;
                    if(font.widthOfTextAtSize(testLine, 10) > maxWidth) {
                        checkY(20);
                        y -= 20;
                        page.drawText(currentLine, { x: margin + 15, y, font: font, size: 10, color: textColor });
                        currentLine = word;
                    } else {
                        currentLine = testLine;
                    }
                }
                checkY(20);
                y -= 20;
                page.drawText(currentLine, { x: margin + 15, y, font: font, size: 10, color: textColor });
            });
        }

    } else {
        // ... (existing invoice logic)
    }

    const footerY = margin;
    page.drawLine({ start: { x: margin, y: footerY + 20 }, end: { x: width - margin, y: footerY + 20 }, thickness: 0.5, color: lightTextColor });
    
    const thankYouText = 'Thank you for your request with Telus Umrah!';
    const thankYouTextWidth = boldFont.widthOfTextAtSize(thankYouText, 12);
    page.drawText(thankYouText, { x: (width - thankYouTextWidth) / 2, y: footerY, font: boldFont, size: 12, color: primaryColor });
    
    const computerGeneratedText = 'This is a computer-generated document and does not require a signature.';
    const computerGeneratedTextWidth = font.widthOfTextAtSize(computerGeneratedText, 8);
    page.drawText(computerGeneratedText, { x: (width - computerGeneratedTextWidth) / 2, y: footerY - 15, font: font, size: 8, color: lightTextColor });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);

  } catch (error: any) {
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}


export function generateRequestFormNumber(bookingId: string, bookingType: string): string {
  const prefix = bookingType === 'hotel' ? 'HTL' : bookingType === 'package' ? 'PKG' : 'CUS';
  const timestamp = Date.now().toString().slice(-6);
  const shortId = bookingId.slice(-4).toUpperCase();
  return `${prefix}-${timestamp}-${shortId}`;
}
