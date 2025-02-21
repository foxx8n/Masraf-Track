import { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, DebtType } from '../types/expense';
import { useSettings } from '../contexts/SettingsContext';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Debt',
  'Electronics',
  'Education',
  'Clothing',
  'Gifts',
  'Travel',
  'Insurance',
  'Pets',
  'Masraf',
  'Other',
  'Custom',
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const { translate, settings, convertAmount } = useSettings();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [customCategory, setCustomCategory] = useState('');
  
  // Get today's date in YYYY-MM-DD format for the default date
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  
  // Debt-specific states
  const [debtType, setDebtType] = useState<DebtType>('borrowed');
  const [debtPerson, setDebtPerson] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === 'Custom' ? customCategory : category;
    if (!finalCategory.trim()) return;

    const amountValue = parseFloat(amount);

    const expenseData: Omit<Expense, 'id'> = {
      description: category === 'Masraf' ? 'Masraf' : description,
      amount: amountValue,
      category: finalCategory,
      date: category === 'Debt' ? new Date().toISOString().split('T')[0] : date,
    };

    if (category === 'Debt') {
      expenseData.debtDetails = {
        type: debtType,
        person: debtPerson,
        dueDate: new Date().toISOString().split('T')[0], // Just use today's date as a placeholder
      };
    }

    onSubmit(expenseData);

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('Food');
    setCustomCategory('');
    setDate(todayStr);
    setDebtType('borrowed');
    setDebtPerson('');
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {translate('form.title')}
      </h2>

      {category !== 'Masraf' && (
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translate('form.description')}
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required={category !== 'Masraf'}
            className="input mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      )}

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {translate('form.amount')}
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
          className="input mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {translate('form.category')}
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          required
          className="input mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white max-h-60"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'Custom' ? translate('form.customCategory') : translate(`category.${cat.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </div>

      {category === 'Custom' && (
        <div>
          <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translate('form.enterCustomCategory')}
          </label>
          <input
            type="text"
            id="customCategory"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
            className="input mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={translate('form.customCategoryPlaceholder')}
          />
        </div>
      )}

      {category === 'Debt' ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="debtType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translate('debt.type')}
            </label>
            <select
              id="debtType"
              value={debtType}
              onChange={(e) => setDebtType(e.target.value as DebtType)}
              required
              className="input mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="borrowed">{translate('debt.borrowed')}</option>
              <option value="lent">{translate('debt.lent')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="debtPerson" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translate('debt.person')}
            </label>
            <input
              type="text"
              id="debtPerson"
              value={debtPerson}
              onChange={(e) => setDebtPerson(e.target.value)}
              required
              className="input mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={translate('debt.personPlaceholder')}
            />
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {translate('form.date')}
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayStr}
            required
            className="input mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full btn-primary"
      >
        {translate('form.submit')}
      </button>
    </form>
  );
};

export default ExpenseForm; 