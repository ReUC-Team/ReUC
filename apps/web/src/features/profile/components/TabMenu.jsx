import React from 'react';
import { useAccessibility } from '@/context/AccesibilityContext';

const tabs = [
  { key: 'overview', label: 'Vista General' },
  { key: 'projects', label: 'Mis Proyectos' },
];

const TabMenu = ({ activeTab, onChange }) => {
  const { isDark, largeText, dyslexiaFont } = useAccessibility();
  
  return (
    <div className={`mt-6 border-b ml-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`
              pb-3 text-sm font-bold transition-colors
              ${largeText ? 'text-base' : 'text-sm'}
              ${dyslexiaFont ? 'font-dyslexia' : ''}
              ${activeTab === tab.key 
                ? `border-b-2 border-lime-600 ${isDark ? 'text-white' : 'text-gray-900'}` 
                : `border-b-2 border-transparent ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabMenu;