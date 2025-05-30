import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Minus, Trash2, DollarSign } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import { useSales } from '@/hooks/useSales';
import { toast } from '@/components/ui/sonner';
import { generateBillPDF } from '@/utils/pdfUtils';

interface CartItem {
  product: any;
  quantity: number;
}

const POS = () => {
  const { products } = useProducts();
  const { customers } = useCustomers();
  const { createSale } = useSales();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('walk-in');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast('Not enough stock available');
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { product, quantity: 1 }]);
      } else {
        toast('Product out of stock');
      }
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.product.id !== productId));
    } else {
      const product = cart.find(item => item.product.id === productId)?.product;
      if (product && newQuantity <= product.stock) {
        setCart(cart.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        ));
      } else {
        toast('Not enough stock available');
      }
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const processSale = async () => {
    if (cart.length === 0) {
      toast('Cart is empty');
      return;
    }

    setIsProcessing(true);
    
    try {
      const saleData = {
        customer_id: selectedCustomer === 'walk-in' ? null : selectedCustomer,
        total_amount: getTotalAmount(),
        status: 'completed',
        sale_date: new Date().toISOString(),
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        }))
      };

      const sale = await createSale.mutateAsync(saleData);
      
      // Generate PDF bill
      const customer = customers.find(c => c.id === selectedCustomer);
      const billData = {
        saleId: sale.id,
        customerName: customer?.name || 'Walk-in Customer',
        customerEmail: customer?.email,
        customerPhone: customer?.phone,
        items: cart.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity
        })),
        totalAmount: getTotalAmount(),
        date: sale.sale_date
      };

      generateBillPDF(billData);
      
      // Clear cart after successful sale
      setCart([]);
      setSelectedCustomer('walk-in');
      toast('Sale completed successfully! Bill downloaded as PDF.');
    } catch (error) {
      console.error('Error processing sale:', error);
      toast('Failed to process sale');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600">Process customer transactions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Select products to add to cart</CardDescription>
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-green-600">${product.price}</span>
                            <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                              {product.stock} in stock
                            </Badge>
                          </div>
                          <Button 
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="w-full"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Selection */}
                <div className="space-y-2">
                  <Label>Customer (Optional)</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cart Items */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-600">${item.product.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.length === 0 && (
                  <p className="text-center text-gray-500 py-4">Cart is empty</p>
                )}

                {/* Total */}
                {cart.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span className="text-lg">${getTotalAmount().toFixed(2)}</span>
                    </div>
                    <Button 
                      onClick={processSale}
                      disabled={isProcessing}
                      className="w-full"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Processing...' : 'Complete Sale'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default POS;
