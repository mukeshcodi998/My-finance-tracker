import React, { useState, useEffect } from 'react';
import { Plus, Wallet, TrendingUp, PieChart, Calendar, Filter, Repeat } from 'lucide-react';
import { Transaction, RecurringTransaction, FilterOptions } from './types/finance';
import { storage } from './utils/storage';
import { calculateFinancialSummary } from './utils/calculations';
import { processRecurringTransactions } from './utils/recurring';
import { filterTransactions } from './utils/filters';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { CategoryChart } from './components/CategoryChart';
import { MonthlyChart } from './components/MonthlyChart';
import { ThemeToggle } from './components/ThemeToggle';
import { ExportButtons } from './components/ExportButtons';
import { FilterPanel } from './components/FilterPanel';
import { RecurringTransactionForm } from './components/RecurringTransactionForm';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRecurringFormOpen, setIsRecurringFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const savedTransactions = storage.getTransactions();
    const savedRecurring = storage.getRecurringTransactions();
    
    setTransactions(savedTransactions);
    setRecurringTransactions(savedRecurring);
    
    // Process recurring transactions
    const { transactions: newTransactions, updatedRecurring } = processRecurringTransactions(savedRecurring);
    
    if (newTransactions.length > 0) {
      const allTransactions = [...savedTransactions, ...newTransactions];
      setTransactions(allTransactions);
      storage.saveTransactions(allTransactions);
    }
    
    if (updatedRecurring.length > 0) {
      setRecurringTransactions(updatedRecurring);
      storage.saveRecurringTransactions(updatedRecurring);
    }
  }, []);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString()
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
  };

  const handleAddRecurring = (recurringData: Omit<RecurringTransaction, 'id'>) => {
    const newRecurring: RecurringTransaction = {
      ...recurringData,
      id: Date.now().toString()
    };
    
    const updatedRecurring = [...recurringTransactions, newRecurring];
    setRecurringTransactions(updatedRecurring);
    storage.saveRecurringTransactions(updatedRecurring);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
  };

  const filteredTransactions = filterTransactions(transactions, filters);
  const summary = calculateFinancialSummary(filteredTransactions);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'monthly', label: 'Monthly', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinanceTracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ExportButtons transactions={filteredTransactions} />
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  Object.keys(filters).length > 0
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              
              <button
                onClick={() => setIsRecurringFormOpen(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Repeat className="w-4 h-4" />
                <span>Recurring</span>
              </button>
              
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mb-6">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              transactions={transactions}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <Dashboard summary={summary} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryChart transactions={filteredTransactions} />
              <TransactionList 
                transactions={filteredTransactions} 
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionList 
            transactions={filteredTransactions} 
            onDeleteTransaction={handleDeleteTransaction}
            showAll={true}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart transactions={filteredTransactions} />
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Insights</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Your savings rate is {summary.savingsRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Financial experts recommend saving at least 20% of your income
                  </p>
                </div>
                
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Total transactions: {filteredTransactions.length}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    You're actively tracking your finances!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyChart transactions={filteredTransactions} />
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This Month's Income</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹0
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This Month's Expenses</span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    ₹0
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Net This Month</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    ₹0
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Transaction Form Modal */}
      <TransactionForm
        onAddTransaction={handleAddTransaction}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Recurring Transaction Form Modal */}
      <RecurringTransactionForm
        onAddRecurring={handleAddRecurring}
        isOpen={isRecurringFormOpen}
        onClose={() => setIsRecurringFormOpen(false)}
      />
    </div>
  );
}

export default App;