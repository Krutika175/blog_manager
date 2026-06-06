import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('quirkwrite-theme') || 'light');

  useEffect(() => {
    localStorage.setItem('quirkwrite-theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <button className="button icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}
