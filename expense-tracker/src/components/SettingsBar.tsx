import React from 'react';
import { SunIcon, MoonIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { useSettings } from '../contexts/SettingsContext';
import { Menu } from '@headlessui/react';

export default function SettingsBar() {
  const { settings, toggleTheme, setLanguage, translate } = useSettings();

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label={translate('settings.theme')}
      >
        {settings.theme === 'light' ? (
          <SunIcon className="h-6 w-6 text-yellow-500" />
        ) : (
          <MoonIcon className="h-6 w-6 text-gray-300" />
        )}
      </button>

      <Menu as="div" className="relative z-50">
        <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <LanguageIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } ${
                    settings.language === 'en' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                  } group flex w-full items-center px-4 py-2 text-sm transition-colors`}
                  onClick={() => setLanguage('en')}
                >
                  {translate('settings.language.en')}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } ${
                    settings.language === 'tr' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                  } group flex w-full items-center px-4 py-2 text-sm transition-colors`}
                  onClick={() => setLanguage('tr')}
                >
                  {translate('settings.language.tr')}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
} 