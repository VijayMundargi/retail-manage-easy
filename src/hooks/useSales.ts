
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export const useSales = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sales = [], isLoading, error } = useQuery({
    queryKey: ['sales', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers (
            id,
            name,
            email
          ),
          sale_items (
            id,
            quantity,
            unit_price,
            total_price,
            products (
              id,
              name,
              sku
            )
          )
        `)
        .eq('user_id', user.id)
        .order('sale_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const createSale = useMutation({
    mutationFn: async (saleData: any) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sales')
        .insert([{ ...saleData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast('Sale created successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to create sale: ${error.message}`);
    }
  });

  const getDashboardStats = () => {
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
    const totalSalesCount = sales.length;
    
    // Calculate monthly data for charts
    const monthlyData = sales.reduce((acc, sale) => {
      const month = new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, sales: 0, revenue: 0 };
      }
      acc[month].sales += 1;
      acc[month].revenue += Number(sale.total_amount);
      return acc;
    }, {} as any);

    return {
      totalRevenue,
      totalSalesCount,
      monthlyData: Object.values(monthlyData),
      recentSales: sales.slice(0, 4)
    };
  };

  return {
    sales,
    isLoading,
    error,
    createSale,
    getDashboardStats
  };
};
