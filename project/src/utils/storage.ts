import { Transaction, Budget, SavingsGoal, RecurringTransaction } from '../types/finance';

export const storage = {
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem('finance-transactions');
    return data ? JSON.parse(data) : [];
  },
  
  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  },
  
  getBudgets: (): Budget[] => {
    const data = localStorage.getItem('finance-budgets');
    return data ? JSON.parse(data) : [];
  },
  
  saveBudgets: (budgets: Budget[]) => {
    localStorage.setItem('finance-budgets', JSON.stringify(budgets));
  },
  
  getSavingsGoals: (): SavingsGoal[] => {
    const data = localStorage.getItem('finance-savings-goals');
    return data ? JSON.parse(data) : [];
  },
  
  saveSavingsGoals: (goals: SavingsGoal[]) => {
    localStorage.setItem('finance-savings-goals', JSON.stringify(goals));
  },

  getRecurringTransactions: (): RecurringTransaction[] => {
    const data = localStorage.getItem('finance-recurring-transactions');
    return data ? JSON.parse(data) : [];
  },
  
  saveRecurringTransactions: (recurring: RecurringTransaction[]) => {
    localStorage.setItem('finance-recurring-transactions', JSON.stringify(recurring));
  }
};