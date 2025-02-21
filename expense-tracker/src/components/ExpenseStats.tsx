import { useMemo, useState } from 'react';
import { Expense } from '../types/expense';
import { useSettings } from '../contexts/SettingsContext';
import { ChartType, DateRange } from '../types/settings';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartOptions,
} from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

interface ExpenseStatsProps {
  expenses: Expense[];
}

const CHART_TYPES: ChartType[] = ['pie', 'bar', 'line', 'doughnut'];
const DATE_RANGES: DateRange[] = ['today', '7days', '15days', '30days', 'thisMonth', 'lastMonth', 'all'];

const ExpenseStats: React.FC<ExpenseStatsProps> = ({ expenses }) => {
  const { translate, settings, formatAmount, convertAmount } = useSettings();
  const isDark = settings.theme === 'dark';
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [dateRange, setDateRange] = useState<DateRange>('all');

  const getCategoryTranslation = (category: string) => {
    const translationKey = `category.${category.toLowerCase()}`;
    const translation = translate(translationKey);
    return translation === translationKey ? category : translation;
  };

  const getFilteredExpenses = (range: DateRange) => {
    // For 'all' range, return all expenses without filtering
    if (range === 'all') {
      return expenses;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const getStartDate = () => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      
      switch (range) {
        case 'today':
          return date;
        case '7days':
          date.setDate(date.getDate() - 7);
          return date;
        case '15days':
          date.setDate(date.getDate() - 15);
          return date;
        case '30days':
          date.setDate(date.getDate() - 30);
          return date;
        case 'thisMonth':
          date.setDate(1);
          return date;
        case 'lastMonth':
          date.setMonth(date.getMonth() - 1);
          date.setDate(1);
          return date;
        default:
          return new Date(0);
      }
    };
    
    const startDate = getStartDate();
    const endDate = range === 'lastMonth' 
      ? new Date(today.getFullYear(), today.getMonth(), 0) 
      : new Date(2025, 11, 31); // Set end date far in the future
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  const stats = useMemo(() => {
    const filteredExpenses = getFilteredExpenses(dateRange);
    
    // Calculate total (all amounts are in TRY)
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate by category
    const byCategory = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.keys(byCategory);
    const amounts = Object.values(byCategory);

    // Get daily expenses
    const dailyExpenses = new Map<string, number>();
    
    // Always ensure we have at least one day in the range
    const getStartDateForRange = () => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      
      switch (dateRange) {
        case 'today':
          return date;
        case '7days':
          date.setDate(date.getDate() - 7);
          return date;
        case '15days':
          date.setDate(date.getDate() - 15);
          return date;
        case '30days':
          date.setDate(date.getDate() - 30);
          return date;
        case 'thisMonth':
          date.setDate(1);
          return date;
        case 'lastMonth':
          date.setMonth(date.getMonth() - 1);
          date.setDate(1);
          return date;
        case 'all':
          return new Date(0);
      }
    };
    
    const startDate = filteredExpenses.length > 0 
      ? new Date(filteredExpenses[0].date)
      : getStartDateForRange();
    
    const endDate = filteredExpenses.length > 0
      ? new Date(filteredExpenses[filteredExpenses.length - 1].date)
      : new Date();

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyExpenses.set(dateStr, 0);
    }

    filteredExpenses.forEach(expense => {
      const dateStr = expense.date;
      dailyExpenses.set(dateStr, (dailyExpenses.get(dateStr) || 0) + expense.amount);
    });

    return {
      total,
      byCategory: {
        labels: categories.length > 0 ? categories : ['No Data'],
        amounts: amounts.length > 0 ? amounts : [0],
      },
      daily: {
        labels: Array.from(dailyExpenses.keys()).map(date => 
          new Date(date).toLocaleDateString(settings.language === 'tr' ? 'tr-TR' : 'en-US', 
            dateRange === '7days' ? { weekday: 'short' } : { month: 'short', day: 'numeric' }
          )
        ),
        amounts: Array.from(dailyExpenses.values()),
      },
    };
  }, [expenses, dateRange, settings.language]);

  const baseChartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#e5e7eb' : '#1f2937',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            return formatAmount(value);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#1f2937',
          callback: function(value) {
            if (typeof value === 'number') {
              return formatAmount(value);
            }
            return value;
          },
        },
      },
      x: {
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#1f2937',
        },
      },
    },
  };

  const circularChartOptions: ChartOptions<'pie' | 'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#e5e7eb' : '#1f2937',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            return formatAmount(value);
          },
        },
      },
    },
  };

  const chartData = {
    labels: stats.byCategory.labels.map(label => 
      label === 'No Data' ? translate('list.noExpenses') : getCategoryTranslation(label)
    ),
    datasets: [
      {
        data: stats.byCategory.amounts,
        backgroundColor: stats.byCategory.labels[0] === 'No Data' 
          ? ['#e5e7eb'] // Gray color for no data
          : [
              '#0EA5E9',
              '#6366F1',
              '#8B5CF6',
              '#EC4899',
              '#F43F5E',
              '#F97316',
              '#FBBF24',
              '#84CC16',
            ],
      },
    ],
  };

  const timeSeriesData = {
    labels: stats.daily.labels,
    datasets: [
      {
        label: translate('stats.total'),
        data: stats.daily.amounts,
        backgroundColor: '#0EA5E9',
        borderColor: '#0EA5E9',
        tension: 0.4,
      },
    ],
  };

  const renderChart = () => {
    // If no data, show a message
    if (stats.byCategory.labels[0] === 'No Data' && ['pie', 'doughnut'].includes(chartType)) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {translate('list.noExpenses')}
          </p>
        </div>
      );
    }

    switch (chartType) {
      case 'pie':
        return <Pie data={chartData} options={circularChartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={circularChartOptions} />;
      case 'bar':
        return <Bar data={timeSeriesData} options={baseChartOptions} />;
      case 'line':
        return <Line data={timeSeriesData} options={baseChartOptions} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {translate('stats.summary')}
        </h2>
        <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
          {formatAmount(stats.total)}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {translate('stats.total')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <select
          className="input py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-w-[160px]"
          value={chartType}
          onChange={(e) => setChartType(e.target.value as ChartType)}
        >
          {CHART_TYPES.map(type => (
            <option key={type} value={type}>
              {translate(`stats.chartType.${type}`)}
            </option>
          ))}
        </select>
        <select
          className="input py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-w-[180px]"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
        >
          {DATE_RANGES.map(range => (
            <option key={range} value={range}>
              {translate(`stats.dateRange.${range}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {translate('stats.byCategory')}
        </h3>
        <div className="aspect-square sm:aspect-[2/1]">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ExpenseStats; 