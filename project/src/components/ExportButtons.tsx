import React from "react";
import { Download, FileText } from "lucide-react";
import { Transaction } from "../types/finance";
import { exportToCSV, exportToPDF } from "../utils/export";

interface ExportButtonsProps {
  transactions: Transaction[];
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  transactions,
}) => {
  const handleCSVExport = () => {
    const filename = `transactions_${new Date().toISOString().split("T")[0]}`;
    exportToCSV(transactions, filename);
  };

  const handlePDFExport = () => {
    const filename = `transactions_${new Date().toISOString().split("T")[0]}`;
    exportToPDF(transactions, filename);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleCSVExport}
        className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
      >
        <Download className="w-4 h-4" />
        <span>CSV</span>
      </button>

      <button
        onClick={handlePDFExport}
        className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
      >
        <FileText className="w-4 h-4" />
        <span>PDF</span>
      </button>
    </div>
  );
};
