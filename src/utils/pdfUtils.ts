
import jsPDF from 'jspdf';

interface BillData {
  saleId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  date: string;
}

export const generateBillPDF = (billData: BillData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('RetailPro Invoice', 20, 30);
  
  // Invoice details
  doc.setFontSize(12);
  doc.text(`Invoice #: ${billData.saleId}`, 20, 50);
  doc.text(`Date: ${new Date(billData.date).toLocaleDateString()}`, 20, 60);
  
  // Customer details
  doc.text('Bill To:', 20, 80);
  doc.text(billData.customerName, 20, 90);
  if (billData.customerEmail) {
    doc.text(billData.customerEmail, 20, 100);
  }
  if (billData.customerPhone) {
    doc.text(billData.customerPhone, 20, 110);
  }
  
  // Table header
  const startY = 130;
  doc.text('Item', 20, startY);
  doc.text('Qty', 80, startY);
  doc.text('Unit Price', 110, startY);
  doc.text('Total', 150, startY);
  
  // Draw line under header
  doc.line(20, startY + 5, 180, startY + 5);
  
  // Items
  let currentY = startY + 15;
  billData.items.forEach((item) => {
    doc.text(item.name, 20, currentY);
    doc.text(item.quantity.toString(), 80, currentY);
    doc.text(`$${item.unitPrice.toFixed(2)}`, 110, currentY);
    doc.text(`$${item.totalPrice.toFixed(2)}`, 150, currentY);
    currentY += 10;
  });
  
  // Total
  doc.line(20, currentY + 5, 180, currentY + 5);
  doc.setFontSize(14);
  doc.text(`Total: $${billData.totalAmount.toFixed(2)}`, 130, currentY + 20);
  
  // Footer
  doc.setFontSize(10);
  doc.text('Thank you for your business!', 20, currentY + 40);
  
  // Save the PDF
  doc.save(`invoice-${billData.saleId}.pdf`);
};
