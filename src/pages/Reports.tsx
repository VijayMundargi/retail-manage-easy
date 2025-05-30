
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, TrendingUp, File } from 'lucide-react';
import { downloadReportAsExcel, type ReportData } from '@/utils/excelUtils';
import { toast } from '@/components/ui/sonner';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import { useSales } from '@/hooks/useSales';

const Reports = () => {
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { sales, getDashboardStats } = useSales();
  const stats = getDashboardStats();

  const reports: ReportData[] = [
    { name: 'Daily Sales Report', type: 'daily' },
    { name: 'Weekly Revenue Report', type: 'weekly' },
    { name: 'Monthly Inventory Report', type: 'monthly' },
    { name: 'Customer Analytics', type: 'analytics' },
    { name: 'Product Performance', type: 'products' },
  ];

  const handleDownload = (report: ReportData) => {
    try {
      // Create report data based on actual user data
      const reportData = {
        ...report,
        data: {
          products: products,
          customers: customers,
          sales: sales,
          stats: stats
        }
      };
      downloadReportAsExcel(reportData);
      toast(`${report.name} downloaded successfully!`);
    } catch (error) {
      toast(`Failed to download ${report.name}. Please try again.`);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and download business reports based on your data</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSalesCount}</div>
              <p className="text-xs text-muted-foreground">Completed transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From all sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Generate and download business intelligence reports based on your actual data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {report.type === 'analytics' ? (
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-gray-600">
                        {report.type === 'daily' && `Sales data for today (${stats.totalSalesCount} sales)`}
                        {report.type === 'weekly' && `Revenue analysis (${products.length} products)`}
                        {report.type === 'monthly' && `Inventory report (${products.length} items)`}
                        {report.type === 'analytics' && `Customer insights (${customers.length} customers)`}
                        {report.type === 'products' && `Product performance (${products.length} products)`}
                      </p>
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Ready
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(report)}
                    >
                      <File className="h-4 w-4 mr-2 text-green-600" />
                      Download Excel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
