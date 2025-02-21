import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from './types/expense';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseStats from './components/ExpenseStats';
import SettingsBar from './components/SettingsBar';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import expensesData from './data/expenses.json';

function AppContent() {
  const { translate } = useSettings();
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    // Try to load from localStorage first
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      return JSON.parse(savedExpenses);
    }
    // If no data in localStorage, use our imported data
    return expensesData;
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...expenseData,
      id: uuidv4(),
    };
    setExpenses([expense, ...expenses]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {translate('app.title')}
          </h1>
          <SettingsBar />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="space-y-8">
              <ExpenseForm onSubmit={addExpense} />
              <ExpenseList expenses={expenses} onDelete={deleteExpense} />
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <ExpenseStats expenses={expenses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App; 