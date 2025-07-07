import React from 'react';
import { getCategorySpending, formatCurrency } from '../utils/calculations';
import { Transaction } from '../types/finance';

interface CategoryChartProps {
  transactions: Transaction[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
  const categoryData = getCategorySpending(transactions);
  const maxAmount = Math.max(...categoryData.map(item => item.amount), 1);
  
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-green-500'
  ];

  if (categoryData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Spending by Category</h2>
      
      <div className="space-y-4">
        {categoryData.slice(0, 8).map((item, index) => {
          const percentage = (item.amount / maxAmount) * 100;
          
          return (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.category}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(item.amount)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500 ease-out`}
                  style={{ 
                    width: `${percentage}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};