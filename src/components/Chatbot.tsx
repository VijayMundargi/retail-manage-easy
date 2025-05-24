
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot = ({ isOpen, onToggle }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your retail assistant. I can help you with questions about products, inventory, sales, customers, and reports. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRetailResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Product-related queries
    if (message.includes('product') || message.includes('item') || message.includes('inventory')) {
      if (message.includes('add') || message.includes('create')) {
        return 'To add new products, go to the Products page and click "Add Product". You can enter product details like name, price, category, and stock levels.';
      }
      if (message.includes('stock') || message.includes('inventory')) {
        return 'You can check inventory levels on the Inventory page. Low stock items are highlighted, and you can update stock quantities there.';
      }
      if (message.includes('search') || message.includes('find')) {
        return 'Use the search function on the Products page to find specific items. You can search by name, category, or SKU.';
      }
      return 'For product management, visit the Products page where you can add, edit, view, and manage all your inventory items.';
    }

    // Sales-related queries
    if (message.includes('sales') || message.includes('revenue') || message.includes('order')) {
      if (message.includes('report') || message.includes('analytics')) {
        return 'Check the Reports page for detailed sales analytics. You can download daily, weekly, and monthly sales reports in Excel format.';
      }
      if (message.includes('today') || message.includes('daily')) {
        return 'Daily sales information is available on the Dashboard and detailed daily reports can be downloaded from the Reports page.';
      }
      return 'Sales data and analytics are available on the Sales page and Dashboard. You can track revenue, orders, and performance metrics there.';
    }

    // Customer-related queries
    if (message.includes('customer') || message.includes('client')) {
      if (message.includes('add') || message.includes('new')) {
        return 'Add new customers on the Customers page. You can store contact information, purchase history, and preferences.';
      }
      if (message.includes('analytics') || message.includes('behavior')) {
        return 'Customer analytics and behavior insights are available in the Reports section under "Customer Analytics".';
      }
      return 'Manage all customer information on the Customers page. You can view profiles, purchase history, and customer analytics.';
    }

    // Reports-related queries
    if (message.includes('report') || message.includes('export') || message.includes('download')) {
      return 'All business reports are available on the Reports page. You can download daily sales, weekly revenue, monthly inventory, customer analytics, and product performance reports in Excel format.';
    }

    // Dashboard queries
    if (message.includes('dashboard') || message.includes('overview') || message.includes('summary')) {
      return 'The Dashboard provides a complete overview of your retail business including sales metrics, recent orders, top products, and key performance indicators.';
    }

    // Settings queries
    if (message.includes('setting') || message.includes('configure') || message.includes('setup')) {
      return 'Business settings and configurations can be managed on the Settings page. This includes store information, payment methods, and system preferences.';
    }

    // Inventory management
    if (message.includes('low stock') || message.includes('reorder') || message.includes('stock level')) {
      return 'Low stock alerts are shown on the Inventory page. You can set reorder levels and receive notifications when items need restocking.';
    }

    // General help
    if (message.includes('help') || message.includes('how') || message.includes('?')) {
      return 'I can help you with: \n• Product management and inventory\n• Sales tracking and analytics\n• Customer management\n• Generating and downloading reports\n• Understanding dashboard metrics\n\nWhat specific area would you like help with?';
    }

    // Default response
    return 'I\'m here to help with your retail business questions! You can ask me about products, sales, customers, inventory, reports, or any other aspect of your retail operations. Could you please be more specific about what you\'d like to know?';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getRetailResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-lg z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-600" />
          Retail Assistant
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className="flex-shrink-0">
                  {message.sender === 'user' ? (
                    <User className="h-6 w-6 text-gray-600" />
                  ) : (
                    <Bot className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div
                  className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <Bot className="h-6 w-6 text-blue-600" />
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about products, sales, customers..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
