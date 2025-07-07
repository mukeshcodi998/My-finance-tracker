import { Transaction, FinancialSummary } from '../types/finance';

export const calculateFinancialSummary = (transactions: Transaction[]): FinancialSummary => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
  
  return {
    totalIncome,
    totalExpenses,
    netIncome,
    savingsRate
  };
};

export const getCategorySpending = (transactions: Transaction[]) => {
  const categorySpending: { [key: string]: number } = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });
  
  return Object.entries(categorySpending)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const getMonthlyData = (transactions: Transaction[]) => {
  const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
  
  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short' 
    });
    
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expenses: 0 };
    }
    
    if (t.type === 'income') {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expenses += t.amount;
    }
  });
  
  return Object.entries(monthlyData)
    .map(([month, data]) => ({ month, ...data }))
    .slice(-6); // Last 6 months
};