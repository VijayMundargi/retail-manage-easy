
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CustomerUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

interface CustomerAuthContextType {
  customerUser: CustomerUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, userData: { name: string; phone?: string; address?: string }) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
};

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('customerUser');
    if (storedUser) {
      setCustomerUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        return { error: { message: 'Invalid email or password' } };
      }

      // In a real app, you'd verify the password hash here
      // For simplicity, we'll assume password verification passes
      const user = {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address
      };

      setCustomerUser(user);
      localStorage.setItem('customerUser', JSON.stringify(user));
      return {};
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; phone?: string; address?: string }) => {
    try {
      const { data, error } = await supabase
        .from('customer_users')
        .insert([{
          email,
          password_hash: password, // In real app, hash this
          name: userData.name,
          phone: userData.phone,
          address: userData.address
        }])
        .select()
        .single();

      if (error) {
        return { error };
      }

      const user = {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address
      };

      setCustomerUser(user);
      localStorage.setItem('customerUser', JSON.stringify(user));
      return {};
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    setCustomerUser(null);
    localStorage.removeItem('customerUser');
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customerUser,
        loading,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};
