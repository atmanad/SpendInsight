import React from 'react';
import { Menu, Wallet, Moon, Sun, Bell } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const HeaderBar = ({ onOpenMobile, isDarkMode, toggleDarkMode, user }) => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/transactions':
        return 'Transactions';
      case '/categories':
        return 'Categories';
      case '/labels':
        return 'Labels';
      case '/user':
        return 'Profile';
      default:
        return 'SpendInsight';
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-card/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="flex items-center gap-3">
        {/* <button
          onClick={onOpenMobile}
          className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button> */}

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 md:hidden">
            <Wallet className="w-5 h-5" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-foreground">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Toggle theme"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors relative"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-card" />
        </button>

        <Link
          to="/user"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
          title="Profile"
        >
          {user?.picture ? (
            <img src={user.picture} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <span>{userInitial}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default HeaderBar;
