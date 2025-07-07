import React from "react";
import { ArrowUpRight, ArrowDownRight, Trash2, Repeat } from "lucide-react";
import { Transaction } from "../types/finance";
import { formatCurrency } from "../utils/calculations";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  showAll?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDeleteTransaction,
  showAll = false,
}) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayTransactions = showAll
    ? sortedTransactions
    : sortedTransactions.slice(0, 10);

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No transactions yet. Add your first transaction to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {showAll ? "All Transactions" : "Recent Transactions"}
        </h2>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {displayTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    transaction.type === "income"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    {transaction.isRecurring && (
                      <Repeat
                        className="w-3 h-3 text-blue-500"
                        title="Recurring transaction"
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.category} •{" "}
                    {new Date(transaction.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>

                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
