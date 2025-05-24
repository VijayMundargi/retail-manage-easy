
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CreditCard, Users, Calendar, ShoppingCart, TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Sales = () => {
  const [activeTab, setActiveTab] = useState('sales');

  const salesData = [
    { id: 'S001', customer: 'John Doe', amount: 150000, items: 1, date: '2024-01-20', status: 'completed', type: 'sale' },
    { id: 'S002', customer: 'Jane Smith', amount: 5000, items: 1, date: '2024-01-20', status: 'completed', type: 'sale' },
    { id: 'S003', customer: 'Bob Johnson', amount: 30000, items: 1, date: '2024-01-19', status: 'completed', type: 'sale' },
    { id: 'S004', customer: 'Alice Brown', amount: 6000, items: 1, date: '2024-01-19', status: 'refunded', type: 'sale' },
    { id: 'S005', customer: 'Charlie Davis', amount: 45000, items: 3, date: '2024-01-18', status: 'completed', type: 'sale' },
  ];

  const purchaseData = [
    { id: 'P001', supplier: 'Tech Suppliers Ltd', amount: 120000, items: 10, date: '2024-01-18', status: 'received', type: 'purchase' },
    { id: 'P002', supplier: 'Electronics Hub', amount: 80000, items: 5, date: '2024-01-17', status: 'pending', type: 'purchase' },
    { id: 'P003', supplier: 'Global Tech', amount: 200000, items: 15, date: '2024-01-16', status: 'received', type: 'purchase' },
  ];

  const salesChartData = [
    { month: 'Jan', sales: 235000, purchases: 180000 },
    { month: 'Feb', sales: 320000, purchases: 220000 },
    { month: 'Mar', sales: 280000, purchases: 190000 },
    { month: 'Apr', sales: 450000, purchases: 300000 },
    { month: 'May', sales: 380000, purchases: 250000 },
    { month: 'Jun', sales: 520000, purchases: 350000 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, color: '#8884d8' },
    { name: 'Accessories', value: 30, color: '#82ca9d' },
    { name: 'Software', value: 15, color: '#ffc658' },
    { name: 'Others', value: 10, color: '#ff7300' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales & Purchases</h1>
          <p className="text-gray-600">Track and manage your sales transactions and purchases</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(235000)}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+8% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(180000)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.4%</div>
              <p className="text-xs text-muted-foreground">+3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales vs Purchases Trend</CardTitle>
              <CardDescription>Monthly comparison of sales and purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value) => [formatCurrency(Number(value)), '']}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="Sales" />
                    <Line type="monotone" dataKey="purchases" stroke="#82ca9d" strokeWidth={2} name="Purchases" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Sales and Purchases */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sales">Sales Transactions</TabsTrigger>
            <TabsTrigger value="purchases">Purchase Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>Latest sales transactions</CardDescription>
                </div>
                <Button>New Sale</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{sale.id}</h4>
                          <Badge variant={sale.status === 'completed' ? 'default' : 'destructive'}>
                            {sale.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{sale.customer}</p>
                        <p className="text-xs text-gray-500">{sale.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(sale.amount)}</p>
                        <p className="text-sm text-gray-600">{sale.items} item(s)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>Recent purchase transactions</CardDescription>
                </div>
                <Button>New Purchase</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchaseData.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{purchase.id}</h4>
                          <Badge variant={purchase.status === 'received' ? 'default' : 'secondary'}>
                            {purchase.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{purchase.supplier}</p>
                        <p className="text-xs text-gray-500">{purchase.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{formatCurrency(purchase.amount)}</p>
                        <p className="text-sm text-gray-600">{purchase.items} item(s)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Sales;
