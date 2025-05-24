
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Users, FileText, Settings, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'Get an overview of your business performance',
      link: '/',
      color: 'bg-blue-500'
    },
    {
      icon: Package,
      title: 'Products',
      description: 'Manage your product catalog and inventory',
      link: '/products',
      color: 'bg-green-500'
    },
    {
      icon: ShoppingCart,
      title: 'Inventory',
      description: 'Track stock levels and manage inventory',
      link: '/inventory',
      color: 'bg-orange-500'
    },
    {
      icon: TrendingUp,
      title: 'Sales & Purchases',
      description: 'Monitor sales performance and purchase orders',
      link: '/sales',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Customers',
      description: 'Manage customer relationships and data',
      link: '/customers',
      color: 'bg-pink-500'
    },
    {
      icon: FileText,
      title: 'Reports',
      description: 'Generate detailed business reports',
      link: '/reports',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <h1 className="text-xl font-bold">RetailPro</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Complete Retail Management
            <span className="text-blue-600"> Solution</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your retail operations with our comprehensive management system. Track sales, manage inventory, and grow your business with powerful analytics.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login to Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need to manage your retail business</h2>
          <p className="mt-4 text-lg text-gray-600">Powerful tools to help you succeed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={feature.link}>
                  <Button variant="outline" className="w-full">
                    Explore {feature.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to transform your retail business?</h2>
            <p className="mt-4 text-lg text-blue-100">Join thousands of retailers who trust RetailPro</p>
            <div className="mt-8">
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 RetailPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
