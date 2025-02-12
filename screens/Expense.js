import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, Home, Settings, Wallet } from 'lucide-react';

const Expense = () => {
  const [currentPage, setCurrentPage] = useState('overview'); // 'overview', 'list', 'input'
  const [currentDate, setCurrentDate] = useState('2024/01');

  const categories = {
    food: { icon: '🍽️', color: '#FF9999', label: '食物', amount: 6500 },
    drinks: { icon: '☕', color: '#FFB366', label: '飲品', amount: 1000 },
    transport: { icon: '🚌', color: '#99FF99', label: '交通', amount: 2000 },
    shopping: { icon: '🛍️', color: '#99FFFF', label: '消費', amount: 3000 },
    entertainment: { icon: '🎮', color: '#9999FF', label: '娛樂', amount: 3000 },
    tech: { icon: '📱', color: '#FF99FF', label: '3C', amount: 2000 },
    housing: { icon: '🏠', color: '#FFFF99', label: '居家', amount: 1000 },
    medical: { icon: '⚕️', color: '#FF99CC', label: '醫療', amount: 500 },
    income: { icon: '💰', color: '#90EE90', label: '收入', amount: 50000 },
    other: { icon: '📦', color: '#CCCCCC', label: '其他', amount: 3000 }
  };

  const transactions = [
    { id: 1, category: 'food', name: '早餐', amount: 150 },
    { id: 2, category: 'food', name: '五桶好', amount: 75 },
    { id: 3, category: 'transport', name: '捷運', amount: 200 },
    { id: 4, category: 'income', name: '薪水', amount: 50000 }
  ];

  const Overview = () => {
    const data = Object.entries(categories).map(([key, value]) => ({
      name: value.label,
      value: value.amount
    }));

    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-lg">{currentDate}</span>
          <ChevronRight className="w-6 h-6" />
        </div>
        
        <div className="relative flex justify-center mb-8">
          <PieChart width={300} height={300}>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={Object.values(categories)[index].color}
                />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl text-green-600">+28,000</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {Object.entries(categories).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-3">
                <span className="text-xl">{value.icon}</span>
                <span>{value.label}</span>
              </div>
              <span>${value.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TransactionList = () => (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4">
        <ChevronLeft className="w-6 h-6" />
        <span className="text-lg">2024/01/25</span>
        <ChevronRight className="w-6 h-6" />
      </div>
      
      <div className="flex-1">
        {transactions.map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-3">
              <span className="text-xl">{categories[transaction.category].icon}</span>
              <span>{transaction.name}</span>
            </div>
            <span>${transaction.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const InputTransaction = () => {
    const [amount, setAmount] = useState('150');
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-lg">2024/01/25</span>
          <ChevronRight className="w-6 h-6" />
        </div>

        <div className="p-4">
          <div className="text-3xl mb-4">${amount}</div>
          
          <div className="grid grid-cols-5 gap-4 mb-6">
            {Object.entries(categories).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                  <span className="text-xl">{value.icon}</span>
                </div>
                <span className="text-xs">{value.label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            {['早餐', '午餐', '晚餐', '宵夜', '下午茶'].map(meal => (
              <Button
                key={meal}
                variant="outline"
                className="bg-green-50"
              >
                {meal}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[7,8,9,4,5,6,1,2,3,'←',0,'.'].map((num, i) => (
              <Button
                key={i}
                variant="ghost"
                className="h-12 text-xl"
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md h-[600px] mx-auto">
      {currentPage === 'overview' && <Overview />}
      {currentPage === 'list' && <TransactionList />}
      {currentPage === 'input' && <InputTransaction />}
      
      <div className="border-t flex justify-around p-4">
        <Button
          variant="ghost"
          className={currentPage === 'overview' ? 'text-green-600' : ''}
          onClick={() => setCurrentPage('overview')}
        >
          <Wallet className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          className={currentPage === 'list' ? 'text-green-600' : ''}
          onClick={() => setCurrentPage('list')}
        >
          <Home className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          className={currentPage === 'input' ? 'text-green-600' : ''}
          onClick={() => setCurrentPage('input')}
        >
          <Settings className="w-6 h-6" />
        </Button>
      </div>
    </Card>
  );
};

export default Expense;