import { Transaction, FilterOptions } from '../types/finance';

export const filterTransactions = (transactions: Transaction[], filters: FilterOptions): Transaction[] => {
  return transactions.filter(transaction => {
    // Type filter
    if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Category filter
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    
    // Date range filter
    if (filters.dateFrom && transaction.date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && transaction.date > filters.dateTo) {
      return false;
    }
    
    // Amount range filter
    if (filters.amountMin !== undefined && transaction.amount < filters.amountMin) {
      return false;
    }
    if (filters.amountMax !== undefined && transaction.amount > filters.amountMax) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
};

export const getUniqueCategories = (transactions: Transaction[]): string[] => {
  const categories = new Set(transactions.map(t => t.category));
  return Array.from(categories).sort();
};