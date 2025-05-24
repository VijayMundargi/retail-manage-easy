
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, Users, Calendar } from 'lucide-react';

const Sales = () => {
  const recentSales = [
    { id: 'S001', customer: 'John Doe', amount: 1500, items: 1, date: '2024-01-20', status: 'completed' },
    { id: 'S002', customer: 'Jane Smith', amount: 50, items: 1, date: '2024-01-20', status: 'completed' },
    { id: 'S003', customer: 'Bob Johnson', amount: 300, items: 1, date: '2024-01-19', status: 'completed' },
    { id: 'S004', customer: 'Alice Brown', amount: 60, items: 1, date: '2024-01-19', status: 'refunded' },
    { id: 'S005', customer: 'Charlie Davis', amount: 450, items: 3, date: '2024-01-18', status: 'completed' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600">Track and manage your sales transactions</p>
        </div>

        {/* Sales Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,350</div>
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
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">+5% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$73.40</div>
              <p className="text-xs text-muted-foreground">+3% from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions and orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
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
                    <p className="font-semibold text-green-600">${sale.amount}</p>
                    <p className="text-sm text-gray-600">{sale.items} item(s)</p>
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

export default Sales;
