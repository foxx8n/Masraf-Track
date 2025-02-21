export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Housing'
  | 'Utilities'
  | 'Entertainment'
  | 'Shopping'
  | 'Healthcare'
  | 'Debt'
  | 'Electronics'
  | 'Education'
  | 'Clothing'
  | 'Gifts'
  | 'Travel'
  | 'Insurance'
  | 'Pets'
  | 'Masraf'
  | 'Sports'
  | 'Beauty'
  | 'Books'
  | 'Other'
  | string; // Allow custom categories

export type DebtType = 'borrowed' | 'lent';

export interface DebtDetails {
  type: DebtType;
  person: string;
  dueDate: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  debtDetails?: DebtDetails;
}

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory;
  description: string;
  date: string;
  debtDetails?: DebtDetails;
} 