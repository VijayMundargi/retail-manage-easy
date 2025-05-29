
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export const useProducts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const createProduct = useMutation({
    mutationFn: async (productData: any) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('products')
        .insert([{ ...productData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast('Product created successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to create product: ${error.message}`);
    }
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...productData }: any) => {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast('Product updated successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to update product: ${error.message}`);
    }
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast('Product deleted successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to delete product: ${error.message}`);
    }
  });

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
