import { useState, useMemo } from 'react';
import { Expense, ExpenseCategory } from '../types/expense';
import { format } from 'date-fns';
import { TrashIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../contexts/SettingsContext';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

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
];

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  const { translate, settings, formatAmount } = useSettings();
  const [filter, setFilter] = useState<ExpenseCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const formatTranslation = (key: string, params: Record<string, any>) => {
    let translation = translate(key);
    Object.entries(params).forEach(([key, value]) => {
      translation = translation.replace(`{${key}}`, value.toString());
    });
    return translation;
  };

  const getCategoryTranslation = (category: string) => {
    const translationKey = `category.${category.toLowerCase()}`;
    const translation = translate(translationKey);
    return translation === translationKey ? category : translation;
  };

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        // Category filter
        const categoryMatch = filter === 'All' || expense.category === filter;
        
        // Search query filter
        if (!searchQuery) return categoryMatch;
        
        const query = searchQuery.toLowerCase();
        const matchDescription = expense.description.toLowerCase().includes(query);
        const matchAmount = expense.amount.toString().includes(query);
        const matchPerson = expense.debtDetails?.person?.toLowerCase().includes(query);
        const matchCategory = (typeof expense.category === 'string' ? expense.category : '').toLowerCase().includes(query);
        const matchDate = format(new Date(expense.date), 'MMM d, yyyy').toLowerCase().includes(query);
        
        return categoryMatch && (matchDescription || matchAmount || matchPerson || matchCategory || matchDate);
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return b.amount - a.amount;
      });
  }, [expenses, filter, sortBy, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="card animate-fade-in dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {translate('list.title')}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatTranslation('list.totalCount', { count: filteredExpenses.length })}
          </span>
        </div>

        {/* Search Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={translate('list.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <select
            className="input py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value as ExpenseCategory | 'All')}
          >
            <option value="All">{translate('list.filter.all')}</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {getCategoryTranslation(category)}
              </option>
            ))}
          </select>

          <select
            className="input py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
          >
            <option value="date">{translate('list.sort.date')}</option>
            <option value="amount">{translate('list.sort.amount')}</option>
          </select>
        </div>

        {/* Expenses List */}
        <div className="space-y-4 mt-4">
          {paginatedExpenses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              {translate('list.noExpenses')}
            </p>
          ) : (
            <>
              {paginatedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow animate-slide-in"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {expense.description}
                      </p>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                        {getCategoryTranslation(expense.category)}
                      </span>
                      {expense.debtDetails && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800">
                          {expense.debtDetails.person} • {translate(`debt.${expense.debtDetails.type}`)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatAmount(expense.amount, 'USD')}
                    </span>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn-secondary px-3 py-1 disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'btn-secondary'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn-secondary px-3 py-1 disabled:opacity-50"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList; 