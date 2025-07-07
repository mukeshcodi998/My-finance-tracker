import { RecurringTransaction, Transaction } from '../types/finance';

export const shouldProcessRecurring = (recurring: RecurringTransaction): boolean => {
  if (!recurring.isActive) return false;
  
  const now = new Date();
  const startDate = new Date(recurring.startDate);
  const lastProcessed = recurring.lastProcessed ? new Date(recurring.lastProcessed) : null;
  
  if (now < startDate) return false;
  if (recurring.endDate && now > new Date(recurring.endDate)) return false;
  
  if (!lastProcessed) return true;
  
  const daysSinceProcessed = Math.floor((now.getTime() - lastProcessed.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (recurring.frequency) {
    case 'daily':
      return daysSinceProcessed >= 1;
    case 'weekly':
      return daysSinceProcessed >= 7;
    case 'monthly':
      return daysSinceProcessed >= 30;
    case 'yearly':
      return daysSinceProcessed >= 365;
    default:
      return false;
  }
};

export const processRecurringTransactions = (
  recurringTransactions: RecurringTransaction[]
): { transactions: Transaction[]; updatedRecurring: RecurringTransaction[] } => {
  const newTransactions: Transaction[] = [];
  const updatedRecurring: RecurringTransaction[] = [];
  
  recurringTransactions.forEach(recurring => {
    if (shouldProcessRecurring(recurring)) {
      const transaction: Transaction = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: recurring.type,
        amount: recurring.amount,
        category: recurring.category,
        description: recurring.description,
        date: new Date().toISOString().split('T')[0],
        isRecurring: true,
        recurringId: recurring.id
      };
      
      newTransactions.push(transaction);
      
      updatedRecurring.push({
        ...recurring,
        lastProcessed: new Date().toISOString().split('T')[0]
      });
    } else {
      updatedRecurring.push(recurring);
    }
  });
  
  return { transactions: newTransactions, updatedRecurring };
};