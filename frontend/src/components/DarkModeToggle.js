import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
  const { isDark, toggleTheme, isTransitioning } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' 
          : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        boxShadow: isDark 
          ? '0 10px 40px rgba(30, 58, 95, 0.5)' 
          : '0 10px 40px rgba(251, 191, 36, 0.5)'
      }}
      data-testid="dark-mode-toggle"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-6 h-6">
        {/* Sun icon */}
        <Sun 
          size={24} 
          className={`absolute inset-0 text-white transition-all duration-500 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        {/* Moon icon */}
        <Moon 
          size={24} 
          className={`absolute inset-0 text-white transition-all duration-500 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
      
      {/* Ripple effect on click */}
      {isTransitioning && (
        <span 
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'
          }}
        />
      )}
    </button>
  );
};

export default DarkModeToggle;
