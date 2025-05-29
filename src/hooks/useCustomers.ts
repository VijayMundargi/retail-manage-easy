
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

export const useCustomers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const createCustomer = useMutation({
    mutationFn: async (customerData: any) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('customers')
        .insert([{ ...customerData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast('Customer created successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to create customer: ${error.message}`);
    }
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...customerData }: any) => {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast('Customer updated successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to update customer: ${error.message}`);
    }
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast('Customer deleted successfully!');
    },
    onError: (error: any) => {
      toast(`Failed to delete customer: ${error.message}`);
    }
  });

  return {
    customers,
    isLoading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
};
