import React from 'react';
import { getMonthlyData, formatCurrency } from '../utils/calculations';
import { Transaction } from '../types/finance';

interface MonthlyChartProps {
  transactions: Transaction[];
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ transactions }) => {
  const monthlyData = getMonthlyData(transactions);
  const maxAmount = Math.max(
    ...monthlyData.map(item => Math.max(item.income, item.expenses)),
    1
  );

  if (monthlyData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Overview</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Overview</h2>
      
      <div className="space-y-6">
        {monthlyData.map((month, index) => (
          <div key={month.month} className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{month.month}</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Income</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(month.income)}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(month.income / maxAmount) * 100}%`,
                    animationDelay: `${index * 150}ms`
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">Expenses</span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {formatCurrency(month.expenses)}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(month.expenses / maxAmount) * 100}%`,
                    animationDelay: `${index * 150 + 75}ms`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};