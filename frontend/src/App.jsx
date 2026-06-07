import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import BlogEditorPage from './pages/BlogEditorPage.jsx';
import BlogViewPage from './pages/BlogViewPage.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">QuirkWrite</div>
        <div className="topbar-actions">
          <ThemeToggle />
        </div>
      </header>
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create" element={<BlogEditorPage />} />
          <Route path="/blogs/:id/edit" element={<BlogEditorPage editMode />} />
          <Route path="/blogs/:id" element={<BlogViewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('quirkwrite-theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('quirkwrite-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <BrowserRouter>
      <div className="theme-context" data-theme={themeValue.theme}>
        <Layout />
      </div>
    </BrowserRouter>
  );
}

export default App;
