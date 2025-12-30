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
  adults?: Array<{ name?: string; age?: number }>;
  children?: Array<{ name?: string; age?: number }>;
  infants?: Array<{ name?: string; age?: number }>;
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

    // Professional color palette
    const primaryColor = rgb(0.05, 0.2, 0.4); // Dark blue
    const accentColor = rgb(0.1, 0.4, 0.8); // Bright blue
    const textColor = rgb(0.2, 0.2, 0.2); // Dark gray
    const lightTextColor = rgb(0.5, 0.5, 0.5); // Medium gray
    const whiteColor = rgb(1, 1, 1);
    const lightGrayBg = rgb(0.96, 0.96, 0.96);
    const borderColor = rgb(0.85, 0.85, 0.85);

    // Page setup with proper margins
    const marginLeft = 45;
    const marginRight = 45;
    const marginTop = 45;
    const marginBottom = 45;
    const { width, height } = page.getSize();
    const contentWidth = width - marginLeft - marginRight;
    let currentY = height - marginTop;

    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    // ========== HEADER SECTION ==========
    // Top accent bar
    page.drawRectangle({
      x: 0,
      y: height - 5,
      width: width,
      height: 5,
      color: accentColor,
    });

    currentY -= 25;

    // Logo and Invoice Title Row
    let logoHeight = 0;
    try {
      const logoPath = path.resolve(process.cwd(), 'src', 'assets', 'telus-umrah-blue.png');
      const logoBytes = await fs.readFile(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.3);
      logoHeight = logoDims.height;
      
      page.drawImage(logoImage, {
        x: marginLeft,
        y: currentY - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
      });
    } catch (e) {
      // Logo not found, use text instead
      page.drawText('TELUS UMRAH', {
        x: marginLeft,
        y: currentY,
        font: boldFont,
        size: 18,
        color: primaryColor,
      });
      logoHeight = 20;
    }

    // Invoice title aligned to right
    page.drawText('INVOICE', {
      x: width - marginRight - boldFont.widthOfTextAtSize('INVOICE', 28),
      y: currentY - 5,
      font: boldFont,
      size: 28,
      color: primaryColor,
    });

    currentY -= Math.max(logoHeight, 30) + 30;

    // ========== INVOICE INFO & COMPANY INFO ==========
    // Two-column layout for company and invoice details
    const leftColX = marginLeft;
    const rightColX = width - marginRight - 180;
    const colStartY = currentY;

    // Left Column - Company Details
    page.drawText('FROM', {
      x: leftColX,
      y: currentY,
      font: boldFont,
      size: 9,
      color: lightTextColor,
    });
    currentY -= 16;

    page.drawText('Telus Umrah', {
      x: leftColX,
      y: currentY,
      font: boldFont,
      size: 11,
      color: textColor,
    });
    currentY -= 14;

    page.drawText('UG-14, Lucky Center', {
      x: leftColX,
      y: currentY,
      font: font,
      size: 9,
      color: textColor,
    });
    currentY -= 12;

    page.drawText('Jail Road, Lahore, Pakistan', {
      x: leftColX,
      y: currentY,
      font: font,
      size: 9,
      color: textColor,
    });
    currentY -= 12;

    page.drawText('support@telusumrah.com', {
      x: leftColX,
      y: currentY,
      font: font,
      size: 9,
      color: accentColor,
    });

    // Right Column - Invoice Details (centered vertically inside box)
    const infoBoxX = rightColX - 10;
    const infoBoxY = colStartY - 80; // box bottom Y
    const infoBoxW = 190;
    const infoBoxH = 80;

    // Draw the info box
    page.drawRectangle({
      x: infoBoxX,
      y: infoBoxY,
      width: infoBoxW,
      height: infoBoxH,
      color: lightGrayBg,
      borderColor: borderColor,
      borderWidth: 0.5,
    });

    // Prepare lines and vertical centering math
    const infoLabelX = rightColX;
    const infoValueX = rightColX + 75;
    const infoFontSize = 8;
    const infoLineHeight = 14;
    const infoLines = [
      { label: 'INVOICE NO:', value: invoiceData.invoiceNumber, labelBold: true, valueBold: true },
      { label: 'BOOKING ID:', value: invoiceData.bookingId },
      { label: 'INVOICE DATE:', value: new Date(invoiceData.bookingDate).toLocaleDateString() },
      { label: 'PAYMENT METHOD:', value: String(invoiceData.paymentMethod) },
    ];

    // Approximate content height: first line uses font size height, gaps use lineHeight
    const infoContentHeight = (infoLines.length - 1) * infoLineHeight + infoFontSize;
    // Center the first baseline within the box area
    let infoY = infoBoxY + (infoBoxH + infoContentHeight) / 2 - infoFontSize / 2;

    infoLines.forEach((row, idx) => {
      page.drawText(row.label, {
        x: infoLabelX,
        y: infoY,
        font: row.labelBold ? boldFont : font,
        size: infoFontSize,
        color: lightTextColor,
      });
      page.drawText(row.value, {
        x: infoValueX,
        y: infoY,
        font: row.valueBold ? boldFont : font,
        size: infoFontSize,
        color: textColor,
      });
      infoY -= infoLineHeight;
    });

    currentY -= 30;

    // ========== BILL TO SECTION ==========
    currentY -= 40;
    
    page.drawText('BILL TO', {
      x: marginLeft,
      y: currentY,
      font: boldFont,
      size: 9,
      color: lightTextColor,
    });
    currentY -= 16;

    page.drawText(`${invoiceData.customerName} (Family Head)`, {
      x: marginLeft,
      y: currentY,
      font: boldFont,
      size: 11,
      color: textColor,
    });
    currentY -= 14;

    page.drawText(invoiceData.customerEmail, {
      x: marginLeft,
      y: currentY,
      font: font,
      size: 9,
      color: textColor,
    });
    currentY -= 12;

    page.drawText(invoiceData.customerPhone, {
      x: marginLeft,
      y: currentY,
      font: font,
      size: 9,
      color: textColor,
    });
    currentY -= 12;

    if (invoiceData.customerNationality) {
      page.drawText(String(invoiceData.customerNationality), {
        x: marginLeft,
        y: currentY,
        font: font,
        size: 9,
        color: textColor,
      });
      currentY -= 12;
    }

    currentY -= 23;

    // ========== BOOKING DETAILS TABLE ==========
    // Table header with accent color
    const tableStartY = currentY;
    const tableRowHeight = 28;
    const descColX = marginLeft + 15;
    const detailsColX = marginLeft + contentWidth / 2 + 15;

    // Header background
    page.drawRectangle({
      x: marginLeft,
      y: currentY - tableRowHeight,
      width: contentWidth,
      height: tableRowHeight,
      color: primaryColor,
    });

    currentY -= 18;
    page.drawText('DESCRIPTION', {
      x: descColX,
      y: currentY,
      font: boldFont,
      size: 10,
      color: whiteColor,
    });
    page.drawText('DETAILS', {
      x: detailsColX,
      y: currentY,
      font: boldFont,
      size: 10,
      color: whiteColor,
    });

    currentY -= 18;

    // Table rows with alternating background
    let rowIndex = 0;
    const drawDetailRow = (label: string, value: string) => {
      // Alternating row colors
      if (rowIndex % 2 === 1) {
        page.drawRectangle({
          x: marginLeft,
          y: currentY - tableRowHeight + 8,
          width: contentWidth,
          height: tableRowHeight,
          color: lightGrayBg,
        });
      }

      currentY -= 10;
      
      // Wrap value text if too long
      const maxValueWidth = contentWidth / 2 - 30;
      const valueLines = wrapText(value, maxValueWidth, 9);
      
      page.drawText(label, {
        x: descColX,
        y: currentY,
        font: boldFont,
        size: 9,
        color: textColor,
      });

      valueLines.forEach((line, idx) => {
        page.drawText(line, {
          x: detailsColX,
          y: currentY - (idx * 11),
          font: font,
          size: 9,
          color: textColor,
        });
      });

      const lineHeight = valueLines.length > 1 ? valueLines.length * 11 + 8 : 18;
      currentY -= lineHeight;
      
      // Separator line
      page.drawLine({
        start: { x: marginLeft, y: currentY + 8 },
        end: { x: width - marginRight, y: currentY + 8 },
        thickness: 0.3,
        color: borderColor,
      });

      rowIndex++;
    };

    const bookingTypeText = invoiceData.bookingType === 'hotel' 
      ? 'Hotel Booking' 
      : invoiceData.bookingType === 'package' 
      ? 'Umrah Package' 
      : 'Custom Umrah Request';
    
    drawDetailRow('Booking Type', bookingTypeText);
    drawDetailRow('Item', invoiceData.itemName);
    
    if (invoiceData.checkInDate) {
      drawDetailRow('Check-in Date', new Date(invoiceData.checkInDate).toLocaleDateString());
    }
    if (invoiceData.checkOutDate) {
      drawDetailRow('Check-out Date', new Date(invoiceData.checkOutDate).toLocaleDateString());
    }
    if (invoiceData.adults || invoiceData.children || invoiceData.infants) {
      const adultsCount = invoiceData.adults ? invoiceData.adults.length : 0;
      const childrenCount = invoiceData.children ? invoiceData.children.length : 0;
      const infantsCount = invoiceData.infants ? invoiceData.infants.length : 0;
      let travelersText = `${adultsCount} Adult(s)`;
      travelersText += `, ${childrenCount} Child(ren)`;
      if (infantsCount > 0) travelersText += `, ${infantsCount} Infant(s)`;
      drawDetailRow('Travelers', travelersText);
    }
    if (invoiceData.rooms) {
      drawDetailRow('Rooms', `${invoiceData.rooms}`);
    }
    if (invoiceData.bedType) {
      drawDetailRow('Bed Type', invoiceData.bedType);
    }
    if (invoiceData.airline && invoiceData.from && invoiceData.to) {
      drawDetailRow('Flight', `${invoiceData.from} to ${invoiceData.to} via ${invoiceData.airline}`);
    }

    currentY -= 15;

    // ========== ADDITIONAL SERVICES ==========
    if (invoiceData.additionalServices && invoiceData.additionalServices.length > 0) {
      currentY -= 10;
      
      page.drawText('ADDITIONAL SERVICES', {
        x: marginLeft,
        y: currentY,
        font: boldFont,
        size: 10,
        color: primaryColor,
      });
      currentY -= 18;

      invoiceData.additionalServices.forEach(service => {
        page.drawText(`•`, {
          x: marginLeft + 5,
          y: currentY,
          font: font,
          size: 9,
          color: textColor,
        });
        page.drawText(service, {
          x: marginLeft + 20,
          y: currentY,
          font: font,
          size: 9,
          color: textColor,
        });
        currentY -= 14;
      });

      currentY -= 10;
    }

    // ========== TOTAL SECTION ==========
    currentY -= 20;
    
    // Compact total box with accent strip and border
    const totalBoxWidth = 180;
    const totalBoxHeight = 56;
    const totalBoxX = width - marginRight - totalBoxWidth;
    const totalBoxY = currentY - totalBoxHeight;

    // Card background with border
    page.drawRectangle({
      x: totalBoxX,
      y: totalBoxY,
      width: totalBoxWidth,
      height: totalBoxHeight,
      color: whiteColor,
      borderColor: borderColor,
      borderWidth: 0.75,
    });

    // Accent strip at top
    page.drawRectangle({
      x: totalBoxX,
      y: totalBoxY + totalBoxHeight - 6,
      width: totalBoxWidth,
      height: 6,
      color: accentColor,
    });

    // Total label
    page.drawText('TOTAL', {
      x: totalBoxX + 12,
      y: totalBoxY + totalBoxHeight - 18,
      font: boldFont,
      size: 9,
      color: lightTextColor,
    });

    // Amount (right aligned within box)
    const amountText = `PKR ${invoiceData.totalAmount.toLocaleString()}`;
    const amountTextWidth = boldFont.widthOfTextAtSize(amountText, 18);
    page.drawText(amountText, {
      x: totalBoxX + totalBoxWidth - amountTextWidth - 12,
      y: totalBoxY + 22,
      size: 18,
      font: boldFont,
      color: primaryColor,
    });

    // Tax notice small and subtle
    page.drawText('(Includes all applicable taxes)', {
      x: totalBoxX + 12,
      y: totalBoxY + 10,
      size: 7,
      font: font,
      color: lightTextColor,
    });

    currentY = totalBoxY - 24;

    // ========== TERMS AND CONDITIONS ==========
    const termsStartY = currentY;
    const minTermsY = marginBottom + 60;
    
    if (currentY > minTermsY) {
      currentY -= 5;
      
      // Terms header
      page.drawRectangle({
        x: marginLeft,
        y: currentY - 18,
        width: contentWidth,
        height: 20,
        color: lightGrayBg,
      });

      currentY -= 13;
      page.drawText('TERMS AND CONDITIONS', {
        x: marginLeft + 10,
        y: currentY,
        font: boldFont,
        size: 9,
        color: primaryColor,
      });

      currentY -= 20;

      const terms = [
        '1. All bookings are subject to availability and confirmation.',
        '2. Full payment must be received before the service date.',
        '3. Cancellation policy applies as per the terms agreed upon at booking.',
        '4. Telus Umrah is not responsible for delays or cancellations by third-party service providers.',
        '5. Prices are subject to change without prior notice until booking is confirmed.',
        '6. Customer is responsible for valid travel documents including passport and visa.',
      ];

      const termsLineHeight = 11;
      terms.forEach((term, idx) => {
        if (currentY > minTermsY) {
          page.drawText(term, {
            x: marginLeft + 10,
            y: currentY,
            font: font,
            size: 7,
            color: textColor,
          });
          currentY -= termsLineHeight;
        }
      });
    }

    // ========== FOOTER ==========
    const footerY = marginBottom + 25;
    
    // Footer separator line
    page.drawLine({
      start: { x: marginLeft, y: footerY + 10 },
      end: { x: width - marginRight, y: footerY + 10 },
      thickness: 0.5,
      color: borderColor,
    });

    // Thank you message
    const thankYouText = 'Thank you for choosing Telus Umrah!';
    const thankYouWidth = boldFont.widthOfTextAtSize(thankYouText, 11);
    page.drawText(thankYouText, {
      x: (width - thankYouWidth) / 2,
      y: footerY - 5,
      font: boldFont,
      size: 11,
      color: primaryColor,
    });

    // Bottom message
    const bottomText = 'This is a computer-generated invoice and does not require a signature.';
    const bottomTextWidth = font.widthOfTextAtSize(bottomText, 7);
    page.drawText(bottomText, {
      x: (width - bottomTextWidth) / 2,
      y: footerY - 20,
      font: font,
      size: 7,
      color: lightTextColor,
    });

    // Bottom accent bar
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 5,
      color: accentColor,
    });

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
