
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingDown, RefreshCw } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

const Inventory = () => {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const totalItems = products.reduce((sum, product) => sum + (product.stock || 0), 0);
  const lowStockItems = products.filter(product => (product.stock || 0) < 10);
  const outOfStockItems = products.filter(product => (product.stock || 0) === 0);
  const reorderRequired = products.filter(product => (product.stock || 0) < 5);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', color: 'text-red-600', bgColor: 'bg-red-500', label: 'Out of Stock' };
    if (stock < 10) return { status: 'low', color: 'text-orange-600', bgColor: 'bg-orange-500', label: 'Low Stock' };
    return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-500', label: 'In Stock' };
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Monitor stock levels and manage inventory</p>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reorder Required</CardTitle>
              <RefreshCw className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{reorderRequired.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>Current inventory status</CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No products found. Add some products to see inventory.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => {
                  const stock = product.stock || 0;
                  const stockInfo = getStockStatus(stock);
                  
                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                        <p className="text-sm text-gray-600">Category: {product.categories?.name || 'Uncategorized'}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{stock} units</p>
                          <p className={`text-sm ${stockInfo.color}`}>
                            {stockInfo.label}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${stockInfo.bgColor}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;
