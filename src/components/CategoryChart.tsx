
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CategoryChart = () => {
  const { products } = useProducts();
  const { sales } = useSales();

  const getCategoryData = () => {
    // Group products by category
    const categoryProducts = products.reduce((acc, product) => {
      const categoryName = product.categories?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = { products: 0, sales: 0, revenue: 0 };
      }
      acc[categoryName].products += 1;
      return acc;
    }, {} as any);

    // Add sales data by category
    sales.forEach(sale => {
      sale.sale_items?.forEach(item => {
        const categoryName = item.products?.categories?.name || 'Uncategorized';
        if (categoryProducts[categoryName]) {
          categoryProducts[categoryName].sales += item.quantity;
          categoryProducts[categoryName].revenue += Number(item.total_price);
        }
      });
    });

    return Object.entries(categoryProducts).map(([name, data]: [string, any]) => ({
      name,
      value: data.revenue,
      products: data.products,
      sales: data.sales
    }));
  };

  const data = getCategoryData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
