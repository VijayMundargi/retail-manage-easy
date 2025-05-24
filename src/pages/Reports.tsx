
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, TrendingUp, FileExcel } from 'lucide-react';
import { downloadReportAsExcel, type ReportData } from '@/utils/excelUtils';
import { toast } from '@/components/ui/sonner';

const Reports = () => {
  const reports: ReportData[] = [
    { name: 'Daily Sales Report', type: 'daily' },
    { name: 'Weekly Revenue Report', type: 'weekly' },
    { name: 'Monthly Inventory Report', type: 'monthly' },
    { name: 'Customer Analytics', type: 'analytics' },
    { name: 'Product Performance', type: 'products' },
  ];

  const handleDownload = (report: ReportData) => {
    try {
      downloadReportAsExcel(report);
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
          <p className="text-gray-600">Generate and download business reports</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Auto-generated</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Generate and download business intelligence reports in Excel format</CardDescription>
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
                        {report.type === 'daily' && 'Sales summary for today'}
                        {report.type === 'weekly' && 'Revenue analysis for this week'}
                        {report.type === 'monthly' && 'Inventory status for this month'}
                        {report.type === 'analytics' && 'Customer behavior insights'}
                        {report.type === 'products' && 'Top and bottom performing products'}
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
                      <FileExcel className="h-4 w-4 mr-2 text-green-600" />
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
