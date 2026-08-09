import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import UserDetails from './pages/UserDetails';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import CategoryManagement from './pages/CategoryManagement';
import LabelManagement from './pages/LabelManagement';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from './store/authSlice';
import 'react-loading-skeleton/dist/skeleton.css';
import Dashboard from './pages/Dashboard';
import './App.css';

import BottomNav from './components/BottomNav';

const App = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(authActions.login(user));
    } else {
      dispatch(authActions.logout());
    }
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  console.log(user)

  const toggleDesktopCollapse = () => {
    setIsCollapsedDesktop((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {isAuthenticated && (
        <>
          {/* Backdrop overlay for mobile drawer */}
          {isMobileOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
              onClick={() => setIsMobileOpen(false)}
            />
          )}

          <Sidebar
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isOpenMobile={isMobileOpen}
            onCloseMobile={() => setIsMobileOpen(false)}
            isCollapsedDesktop={isCollapsedDesktop}
            onToggleDesktopCollapse={toggleDesktopCollapse}
          />
        </>
      )}

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {isAuthenticated && (
          <HeaderBar
            onOpenMobile={() => setIsMobileOpen(true)}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            user={user}
          />
        )}
        <div className={`flex-1 overflow-y-auto ${isAuthenticated ? 'p-4 pb-20 md:p-8 md:pb-8' : ''}`}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/" />} />
            <Route path="/transactions" element={isAuthenticated ? <Transactions user={user} /> : <Navigate to="/" />} />
            <Route path="/categories" element={isAuthenticated ? <CategoryManagement user={user} /> : <Navigate to="/" />} />
            <Route path="/labels" element={isAuthenticated ? <LabelManagement user={user} /> : <Navigate to="/" />} />
            <Route path="/user" element={isAuthenticated ? <UserDetails /> : <Navigate to="/" />} />
          </Routes>
        </div>
        {isAuthenticated && <BottomNav />}
      </main>
    </div>
  );
};

export default App;
