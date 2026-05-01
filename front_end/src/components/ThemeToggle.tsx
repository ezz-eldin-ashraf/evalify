import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './Button';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="p-2 rounded-full w-10 h-10 flex items-center justify-center pointer-events-auto"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-text-secondary hover:text-primary transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-text-secondary hover:text-primary transition-colors" />
      )}
    </Button>
  );
};
