import jsPDF from "jspdf";
//import 'jspdf-autotable';
import autoTable from "jspdf-autotable";
import { Transaction } from "../types/finance";
import { formatCurrency } from "./calculations";

export const exportToCSV = (
  transactions: Transaction[],
  filename: string = "transactions"
) => {
  const headers = ["Date", "Type", "Category", "Description", "Amount (INR)"];
  const csvContent = [
    headers.join(","),
    ...transactions.map((t) =>
      [
        t.date,
        t.type,
        t.category,
        `"${t.description}"`,
        t.amount.toString(),
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (
  transactions: Transaction[],
  filename: string = "transactions"
) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Financial Transactions Report", 14, 22);

  // Date Range
  doc.setFontSize(12);
  const dates = transactions.map((t) => new Date(t.date));
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
  doc.text(
    `Period: ${minDate.toLocaleDateString(
      "en-IN"
    )} to ${maxDate.toLocaleDateString("en-IN")}`,
    14,
    32
  );

  // Summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 14, 42);
  doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 14, 52);
  doc.text(
    `Net Amount: ${formatCurrency(totalIncome - totalExpenses)}`,
    14,
    62
  );

  // Table Data
  const tableData = transactions.map((t) => [
    new Date(t.date).toLocaleDateString("en-IN"),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.category,
    t.description,
    formatCurrency(t.amount),
  ]);

  autoTable(doc, {
    head: [["Date", "Type", "Category", "Description", "Amount"]],
    body: tableData,
    startY: 72,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`${filename}.pdf`);
};
