import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
  const { isDark, toggleTheme, isTransitioning } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-[55] p-3 rounded-xl shadow-xl transition-all duration-500 transform hover:scale-105 active:scale-95 border"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' 
          : 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
        borderColor: isDark ? '#334155' : '#fcd34d',
        boxShadow: isDark 
          ? '0 8px 32px rgba(15, 23, 42, 0.5)' 
          : '0 8px 32px rgba(251, 191, 36, 0.4)'
      }}
      data-testid="dark-mode-toggle"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <Sun 
          size={20} 
          className={`absolute inset-0 transition-all duration-500 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-amber-700'
          }`}
        />
        <Moon 
          size={20} 
          className={`absolute inset-0 transition-all duration-500 ${
            isDark ? 'opacity-100 rotate-0 scale-100 text-blue-300' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
      
      {isTransitioning && (
        <span 
          className="absolute inset-0 rounded-xl animate-ping"
          style={{
            background: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(251, 191, 36, 0.4)'
          }}
        />
      )}
    </button>
  );
};

export default DarkModeToggle;
