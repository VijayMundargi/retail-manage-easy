
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export const useCategories = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const createCategory = useMutation({
    mutationFn: async (categoryData: { name: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...categoryData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast('Category created successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to create category: ${error.message}`);
    }
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...categoryData }: any) => {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast('Category updated successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to update category: ${error.message}`);
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast('Category deleted successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to delete category: ${error.message}`);
    }
  });

  return {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
