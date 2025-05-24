
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Star, ShoppingBag, Calendar } from 'lucide-react';

const Customers = () => {
  const customers = [
    { id: 'C001', name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', totalOrders: 15, totalSpent: 2400, lastOrder: '2024-01-20', status: 'active' },
    { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8901', totalOrders: 8, totalSpent: 1200, lastOrder: '2024-01-19', status: 'active' },
    { id: 'C003', name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 234 567 8902', totalOrders: 23, totalSpent: 4500, lastOrder: '2024-01-18', status: 'vip' },
    { id: 'C004', name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 8903', totalOrders: 3, totalSpent: 180, lastOrder: '2024-01-15', status: 'new' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage customer relationships and profiles</p>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">+48 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">High-value customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2</div>
              <p className="text-xs text-muted-foreground">Per customer</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+33% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
            <CardDescription>All registered customers and their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{customer.name}</h4>
                      <Badge variant={
                        customer.status === 'vip' ? 'default' :
                        customer.status === 'new' ? 'secondary' : 'outline'
                      }>
                        {customer.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${customer.totalSpent}</p>
                    <p className="text-sm text-gray-600">{customer.totalOrders} orders</p>
                    <p className="text-xs text-gray-500">Last: {customer.lastOrder}</p>
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

export default Customers;
