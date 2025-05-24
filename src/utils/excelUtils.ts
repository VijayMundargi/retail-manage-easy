
import * as XLSX from 'xlsx';

export interface ReportData {
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'analytics' | 'products';
}

export const downloadReportAsExcel = (report: ReportData) => {
  let data: any[] = [];
  let filename = '';

  switch (report.type) {
    case 'daily':
      data = [
        { Date: '2024-01-15', Sales: '₹45,000', Orders: 23, Revenue: '₹42,000' },
        { Date: '2024-01-14', Sales: '₹38,000', Orders: 18, Revenue: '₹35,500' },
        { Date: '2024-01-13', Sales: '₹52,000', Orders: 28, Revenue: '₹48,000' },
      ];
      filename = 'daily_sales_report.xlsx';
      break;
    
    case 'weekly':
      data = [
        { Week: 'Week 1', Sales: '₹2,15,000', Orders: 125, Revenue: '₹2,05,000' },
        { Week: 'Week 2', Sales: '₹1,98,000', Orders: 110, Revenue: '₹1,88,000' },
        { Week: 'Week 3', Sales: '₹2,42,000', Orders: 145, Revenue: '₹2,32,000' },
      ];
      filename = 'weekly_revenue_report.xlsx';
      break;
    
    case 'monthly':
      data = [
        { Product: 'Laptop', Stock: 45, 'Low Stock Alert': 'No', 'Reorder Level': 20 },
        { Product: 'Mouse', Stock: 12, 'Low Stock Alert': 'Yes', 'Reorder Level': 15 },
        { Product: 'Keyboard', Stock: 28, 'Low Stock Alert': 'No', 'Reorder Level': 10 },
      ];
      filename = 'monthly_inventory_report.xlsx';
      break;
    
    case 'analytics':
      data = [
        { Customer: 'John Doe', 'Total Orders': 12, 'Total Spent': '₹85,000', 'Last Order': '2024-01-15' },
        { Customer: 'Jane Smith', 'Total Orders': 8, 'Total Spent': '₹62,000', 'Last Order': '2024-01-14' },
        { Customer: 'Bob Johnson', 'Total Orders': 15, 'Total Spent': '₹1,12,000', 'Last Order': '2024-01-13' },
      ];
      filename = 'customer_analytics_report.xlsx';
      break;
    
    case 'products':
      data = [
        { Product: 'Laptop', 'Units Sold': 45, Revenue: '₹4,50,000', 'Growth': '+15%' },
        { Product: 'Mouse', 'Units Sold': 120, Revenue: '₹36,000', 'Growth': '+8%' },
        { Product: 'Keyboard', 'Units Sold': 85, Revenue: '₹68,000', 'Growth': '-2%' },
      ];
      filename = 'product_performance_report.xlsx';
      break;
    
    default:
      data = [{ Message: 'No data available for this report type' }];
      filename = 'report.xlsx';
  }

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename);
};
