
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, Edit, Trash, Plus, Tag, X, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

const Products = () => {
  const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, createCategory, deleteCategory } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category_id: '',
    price: '',
    stock: '',
    description: ''
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category_id || !newProduct.price) {
      return;
    }

    try {
      await createProduct.mutateAsync({
        name: newProduct.name,
        sku: newProduct.sku,
        category_id: newProduct.category_id,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 0,
        description: newProduct.description || null
      });

      setNewProduct({
        name: '',
        sku: '',
        category_id: '',
        price: '',
        stock: '',
        description: ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        name: editingProduct.name,
        sku: editingProduct.sku,
        category_id: editingProduct.category_id,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock) || 0,
        description: editingProduct.description || null
      });

      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct.mutateAsync(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await createCategory.mutateAsync({ name: newCategoryName.trim() });
      setNewCategoryName('');
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const productsInCategory = products.filter(product => product.category_id === categoryId);
    
    if (productsInCategory.length > 0) {
      return;
    }

    try {
      await deleteCategory.mutateAsync(categoryId);
      if (categoryFilter === categoryId) {
        setCategoryFilter('all');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Manage Categories
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Manage Categories</DialogTitle>
                  <DialogDescription>
                    Add new categories or delete existing ones.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">New Category Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="categoryName"
                        placeholder="Enter category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      <Button onClick={handleAddCategory} disabled={createCategory.isPending}>
                        {createCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Existing Categories</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{category.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={deleteCategory.isPending}
                          >
                            {deleteCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the product details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name*</Label>
                    <Input
                      id="productName"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU*</Label>
                    <Input
                      id="sku"
                      placeholder="Enter SKU"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <Select onValueChange={(value) => setNewProduct({...newProduct, category_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price*</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Product description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddProduct} className="w-full" disabled={createProduct.isPending}>
                    {createProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Add Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </div>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </div>
                <CardDescription>SKU: {product.sku}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Category:</span>
                  <Badge variant="outline">
                    {product.categories?.name || 'No Category'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-semibold text-green-600">${product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.stock} units
                  </span>
                </div>
                {product.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deleteProduct.isPending}
                  >
                    {deleteProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details below.
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editProductName">Product Name*</Label>
                  <Input
                    id="editProductName"
                    placeholder="Enter product name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSku">SKU*</Label>
                  <Input
                    id="editSku"
                    placeholder="Enter SKU"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCategory">Category*</Label>
                  <Select value={editingProduct.category_id} onValueChange={(value) => setEditingProduct({...editingProduct, category_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editPrice">Price*</Label>
                    <Input
                      id="editPrice"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editStock">Stock</Label>
                    <Input
                      id="editStock"
                      type="number"
                      placeholder="0"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Input
                    id="editDescription"
                    placeholder="Product description"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>
                <Button onClick={handleEditProduct} className="w-full" disabled={updateProduct.isPending}>
                  {updateProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Update Product
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first product'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Products;
