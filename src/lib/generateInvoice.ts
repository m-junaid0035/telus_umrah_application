import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface InvoiceData {
  invoiceNumber: string;
  bookingId: string;
  bookingType: 'hotel' | 'package';
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
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed standard fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add a page
    const page = pdfDoc.addPage([595, 842]); // A4 size in points
    
    // Set up dimensions
    const margin = 50;
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    let yPosition = pageHeight - margin;
    
    // Colors
    const primaryColor = rgb(0.2, 0.4, 0.8); // Blue
    const darkGray = rgb(0.2, 0.2, 0.2);
    const lightGray = rgb(0.9, 0.9, 0.9);
    const tableHeaderColor = rgb(0.95, 0.95, 0.95);
    
    // Helper function to add text
    const addText = (
      text: string,
      x: number,
      y: number,
      size: number = 10,
      font: any = helveticaFont,
      color: any = darkGray,
      align: 'left' | 'center' | 'right' = 'left'
    ) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      let xPos = x;
      if (align === 'center') {
        xPos = x - textWidth / 2;
      } else if (align === 'right') {
        xPos = x - textWidth;
      }
      page.drawText(text, {
        x: xPos,
        y: y,
        size: size,
        font: font,
        color: color,
      });
    };
    
    // Helper function to draw rectangle
    const drawRect = (x: number, y: number, width: number, height: number, color: any) => {
      page.drawRectangle({
        x: x,
        y: y - height,
        width: width,
        height: height,
        color: color,
      });
    };
    
    // Helper function to draw line
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: any = darkGray, width: number = 1) => {
      page.drawLine({
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
        color: color,
        thickness: width,
      });
    };
    
    // Header Section with colored background
    const headerHeight = 80;
    drawRect(margin, yPosition + 20, pageWidth - 2 * margin, headerHeight, primaryColor);
    addText('TELUS UMRAH', pageWidth / 2, yPosition - 15, 28, helveticaBoldFont, rgb(1, 1, 1), 'center');
    addText('INVOICE', pageWidth / 2, yPosition - 40, 14, helveticaBoldFont, rgb(1, 1, 1), 'center');
    yPosition -= headerHeight + 20;
    
    // Invoice Details Box (Right side)
    const invoiceBoxWidth = 200;
    const invoiceBoxHeight = 70;
    const invoiceBoxX = pageWidth - margin - invoiceBoxWidth;
    drawRect(invoiceBoxX, yPosition + invoiceBoxHeight, invoiceBoxWidth, invoiceBoxHeight, tableHeaderColor);
    drawLine(invoiceBoxX, yPosition + invoiceBoxHeight, invoiceBoxX + invoiceBoxWidth, yPosition + invoiceBoxHeight, darkGray, 1);
    drawLine(invoiceBoxX, yPosition, invoiceBoxX + invoiceBoxWidth, yPosition, darkGray, 1);
    drawLine(invoiceBoxX, yPosition + invoiceBoxHeight, invoiceBoxX, yPosition, darkGray, 1);
    drawLine(invoiceBoxX + invoiceBoxWidth, yPosition + invoiceBoxHeight, invoiceBoxX + invoiceBoxWidth, yPosition, darkGray, 1);
    
    addText('Invoice Number', invoiceBoxX + 10, yPosition + invoiceBoxHeight - 15, 9, helveticaBoldFont, darkGray);
    addText(invoiceData.invoiceNumber, invoiceBoxX + 10, yPosition + invoiceBoxHeight - 30, 10, helveticaFont, darkGray);
    addText('Invoice Date', invoiceBoxX + 10, yPosition + invoiceBoxHeight - 45, 9, helveticaBoldFont, darkGray);
    addText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), invoiceBoxX + 10, yPosition + invoiceBoxHeight - 60, 10, helveticaFont, darkGray);
    
    // Company Info (Left side)
    addText('From:', margin, yPosition + invoiceBoxHeight - 10, 11, helveticaBoldFont, darkGray);
    yPosition -= 20;
    addText('Telus Umrah', margin, yPosition + invoiceBoxHeight - 10, 11, helveticaBoldFont, primaryColor);
    yPosition -= 15;
    addText('UG-14, Lucky center, 7-8 Jail Road', margin, yPosition + invoiceBoxHeight - 10, 10, helveticaFont, darkGray);
    yPosition -= 12;
    addText('Lahore, 54000 Pakistan', margin, yPosition + invoiceBoxHeight - 10, 10, helveticaFont, darkGray);
    yPosition -= 12;
    addText('Phone: 080033333 | Email: support@telusumrah.com', margin, yPosition + invoiceBoxHeight - 10, 9, helveticaFont, darkGray);
    yPosition -= 30;
    
    // Customer Info Box
    addText('Bill To:', margin, yPosition, 11, helveticaBoldFont, darkGray);
    yPosition -= 18;
    drawRect(margin, yPosition + 60, 250, 60, rgb(0.98, 0.98, 0.98));
    drawLine(margin, yPosition + 60, margin + 250, yPosition + 60, darkGray, 1);
    drawLine(margin, yPosition, margin + 250, yPosition, darkGray, 1);
    drawLine(margin, yPosition + 60, margin, yPosition, darkGray, 1);
    drawLine(margin + 250, yPosition + 60, margin + 250, yPosition, darkGray, 1);
    
    addText(invoiceData.customerName, margin + 10, yPosition + 45, 11, helveticaBoldFont, darkGray);
    yPosition -= 15;
    addText(invoiceData.customerEmail, margin + 10, yPosition + 45, 10, helveticaFont, darkGray);
    yPosition -= 12;
    addText(invoiceData.customerPhone, margin + 10, yPosition + 45, 10, helveticaFont, darkGray);
    yPosition -= 12;
    if (invoiceData.customerNationality) {
      addText(`Nationality: ${invoiceData.customerNationality}`, margin + 10, yPosition + 45, 10, helveticaFont, darkGray);
    }
    yPosition -= 20;
    
    // Booking Details Section
    addText('Booking Information', margin, yPosition, 12, helveticaBoldFont, primaryColor);
    yPosition -= 20;
    
    // Create a table for booking details
    const tableStartY = yPosition;
    const tableWidth = pageWidth - 2 * margin;
    const rowHeight = 20;
    let currentY = tableStartY;
    
    // Table Header
    drawRect(margin, currentY + rowHeight, tableWidth, rowHeight, tableHeaderColor);
    drawLine(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight, darkGray, 1);
    drawLine(margin, currentY, margin + tableWidth, currentY, darkGray, 1);
    drawLine(margin, currentY + rowHeight, margin, currentY, darkGray, 1);
    drawLine(margin + tableWidth, currentY + rowHeight, margin + tableWidth, currentY, darkGray, 1);
    
    addText('Description', margin + 10, currentY + 12, 10, helveticaBoldFont, darkGray);
    addText('Details', margin + tableWidth / 2, currentY + 12, 10, helveticaBoldFont, darkGray);
    currentY -= rowHeight;
    
    // Booking Type Row
    drawLine(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight, rgb(0.8, 0.8, 0.8), 0.5);
    addText('Booking Type', margin + 10, currentY + 12, 10, helveticaFont, darkGray);
    addText(invoiceData.bookingType === 'hotel' ? 'Hotel Booking' : 'Umrah Package', margin + tableWidth / 2, currentY + 12, 10, helveticaFont, darkGray);
    currentY -= rowHeight;
    
    // Item Name Row
    drawLine(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight, rgb(0.8, 0.8, 0.8), 0.5);
    addText('Item', margin + 10, currentY + 12, 10, helveticaFont, darkGray);
    addText(invoiceData.itemName, margin + tableWidth / 2, currentY + 12, 10, helveticaFont, darkGray);
    currentY -= rowHeight;
    
    // Dates
    if (invoiceData.checkInDate) {
      drawLine(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight, rgb(0.8, 0.8, 0.8), 0.5);
      addText('Check-in Date', margin + 10, currentY + 12, 10, helveticaFont, darkGray);
      addText(new Date(invoiceData.checkInDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), margin + tableWidth / 2, currentY + 12, 10, helveticaFont, darkGray);
      currentY -= rowHeight;
    }
    if (invoiceData.checkOutDate) {
      drawLine(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight, rgb(0.8, 0.8, 0.8), 0.5);
      addText('Check-out Date', margin + 10, currentY + 12, 10, helveticaFont, darkGray);
      addText(new Date(invoiceData.checkOutDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), margin + tableWidth / 2, currentY + 12, 10, helveticaFont, darkGray);
      currentY -= rowHeight;
    }
    
    // Travelers
    if (invoiceData.travelers) {
      drawLine(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight, rgb(0.8, 0.8, 0.8), 0.5);
      addText('Travelers', margin + 10, currentY + 12, 10, helveticaFont, darkGray);
      addText(`${invoiceData.travelers.adults} Adult(s), ${invoiceData.travelers.children} Child(ren)`, margin + tableWidth / 2, currentY + 12, 10, helveticaFont, darkGray);
      currentY -= rowHeight;
    }
    
    // Rooms
    if (invoiceData.rooms) {
      drawLine(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight, rgb(0.8, 0.8, 0.8), 0.5);
      addText('Rooms', margin + 10, currentY + 12, 10, helveticaFont, darkGray);
      addText(`${invoiceData.rooms}`, margin + tableWidth / 2, currentY + 12, 10, helveticaFont, darkGray);
      currentY -= rowHeight;
    }
    
    // Bed Type
    if (invoiceData.bedType) {
      drawLine(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight, rgb(0.8, 0.8, 0.8), 0.5);
      addText('Bed Type', margin + 10, currentY + 12, 10, helveticaFont, darkGray);
      addText(invoiceData.bedType.charAt(0).toUpperCase() + invoiceData.bedType.slice(1), margin + tableWidth / 2, currentY + 12, 10, helveticaFont, darkGray);
      currentY -= rowHeight;
    }
    
    // Flight Info
    if (invoiceData.airline && invoiceData.from && invoiceData.to) {
      drawLine(margin, currentY + rowHeight, margin + tableWidth, currentY + rowHeight, rgb(0.8, 0.8, 0.8), 0.5);
      addText('Flight', margin + 10, currentY + 12, 10, helveticaFont, darkGray);
      addText(`${invoiceData.from} to ${invoiceData.to} (${invoiceData.airline}, ${invoiceData.airlineClass})`, margin + tableWidth / 2, currentY + 12, 10, helveticaFont, darkGray);
      currentY -= rowHeight;
    }
    
    // Close table
    drawLine(margin, currentY, margin + tableWidth, currentY, darkGray, 1);
    yPosition = currentY - 20;
    
    // Additional Services Table
    if (invoiceData.additionalServices && invoiceData.additionalServices.length > 0) {
      addText('Additional Services', margin, yPosition, 12, helveticaBoldFont, primaryColor);
      yPosition -= 20;
      
      const servicesTableWidth = pageWidth - 2 * margin;
      const servicesRowHeight = 18;
      let servicesY = yPosition;
      
      // Services Table Header
      drawRect(margin, servicesY + servicesRowHeight, servicesTableWidth, servicesRowHeight, tableHeaderColor);
      drawLine(margin, servicesY + servicesRowHeight, margin + servicesTableWidth, servicesY + servicesRowHeight, darkGray, 1);
      drawLine(margin, servicesY, margin + servicesTableWidth, servicesY, darkGray, 1);
      drawLine(margin, servicesY + servicesRowHeight, margin, servicesY, darkGray, 1);
      drawLine(margin + servicesTableWidth, servicesY + servicesRowHeight, margin + servicesTableWidth, servicesY, darkGray, 1);
      
      addText('Service', margin + 10, servicesY + 10, 10, helveticaBoldFont, darkGray);
      addText('Status', margin + servicesTableWidth - 100, servicesY + 10, 10, helveticaBoldFont, darkGray);
      servicesY -= servicesRowHeight;
      
      // Services Rows
      invoiceData.additionalServices.forEach((service, index) => {
        drawLine(margin, servicesY + servicesRowHeight, margin + servicesTableWidth, servicesY + servicesRowHeight, rgb(0.8, 0.8, 0.8), 0.5);
        addText(service, margin + 10, servicesY + 10, 10, helveticaFont, darkGray);
        addText('Included', margin + servicesTableWidth - 100, servicesY + 10, 10, helveticaFont, rgb(0, 0.6, 0));
        servicesY -= servicesRowHeight;
      });
      
      drawLine(margin, servicesY, margin + servicesTableWidth, servicesY, darkGray, 1);
      yPosition = servicesY - 20;
    }
    
    // Payment Method
    addText('Payment Method', margin, yPosition, 12, helveticaBoldFont, primaryColor);
    yPosition -= 18;
    drawRect(margin, yPosition + 25, 200, 25, rgb(0.98, 0.98, 0.98));
    drawLine(margin, yPosition + 25, margin + 200, yPosition + 25, darkGray, 1);
    drawLine(margin, yPosition, margin + 200, yPosition, darkGray, 1);
    drawLine(margin, yPosition + 25, margin, yPosition, darkGray, 1);
    drawLine(margin + 200, yPosition + 25, margin + 200, yPosition, darkGray, 1);
    addText(invoiceData.paymentMethod === 'cash' ? 'Cash Payment' : 'Online Payment', margin + 10, yPosition + 12, 11, helveticaBoldFont, primaryColor);
    yPosition -= 40;
    
    // Total Amount Box
    const totalBoxWidth = 300;
    const totalBoxHeight = 50;
    const totalBoxX = pageWidth - margin - totalBoxWidth;
    drawRect(totalBoxX, yPosition + totalBoxHeight, totalBoxWidth, totalBoxHeight, primaryColor);
    drawLine(totalBoxX, yPosition + totalBoxHeight, totalBoxX + totalBoxWidth, yPosition + totalBoxHeight, darkGray, 2);
    drawLine(totalBoxX, yPosition, totalBoxX + totalBoxWidth, yPosition, darkGray, 2);
    drawLine(totalBoxX, yPosition + totalBoxHeight, totalBoxX, yPosition, darkGray, 2);
    drawLine(totalBoxX + totalBoxWidth, yPosition + totalBoxHeight, totalBoxX + totalBoxWidth, yPosition, darkGray, 2);
    
    addText('Total Amount', totalBoxX + 15, yPosition + totalBoxHeight - 20, 12, helveticaBoldFont, rgb(1, 1, 1));
    addText(`PKR ${invoiceData.totalAmount.toLocaleString()}`, totalBoxX + totalBoxWidth - 15, yPosition + totalBoxHeight - 20, 16, helveticaBoldFont, rgb(1, 1, 1), 'right');
    yPosition -= 60;
    
    // Footer
    drawLine(margin, yPosition, pageWidth - margin, yPosition, lightGray, 1);
    yPosition -= 20;
    addText('Thank you for choosing Telus Umrah!', pageWidth / 2, yPosition, 10, helveticaBoldFont, primaryColor, 'center');
    yPosition -= 15;
    addText('Please visit our office to complete your payment.', pageWidth / 2, yPosition, 9, helveticaFont, darkGray, 'center');
    yPosition -= 12;
    addText('For inquiries: support@telusumrah.com | Phone: 080033333', pageWidth / 2, yPosition, 8, helveticaFont, darkGray, 'center');
    yPosition -= 12;
    addText('This is a computer-generated invoice. No signature required.', pageWidth / 2, yPosition, 7, helveticaFont, rgb(0.5, 0.5, 0.5), 'center');
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Convert to Buffer
    return Buffer.from(pdfBytes);
  } catch (error: any) {
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

export function generateInvoiceNumber(bookingId: string, bookingType: string): string {
  const prefix = bookingType === 'hotel' ? 'HTL' : 'PKG';
  const timestamp = Date.now().toString().slice(-6);
  const shortId = bookingId.slice(-4).toUpperCase();
  return `${prefix}-${timestamp}-${shortId}`;
}
