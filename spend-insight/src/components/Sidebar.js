import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Tags, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  PieChart,
  User
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = ({ isDarkMode, toggleDarkMode }) => {
  const { logout, user } = useAuth0();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: Tags },
    { name: 'Labels', path: '/labels', icon: PieChart },
    { name: 'Profile', path: '/user', icon: User },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out md:static md:translate-x-0">
      <div className="flex items-center justify-center h-16 border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          SpendInsight
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-lg group
              ${isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
            `}
          >
            <item.icon className="w-5 h-5 mr-3 transition-colors shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        <button
          onClick={toggleDarkMode}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-muted-foreground transition-colors rounded-lg hover:bg-secondary hover:text-foreground group"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-5 h-5 mr-3 shrink-0" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 mr-3 shrink-0" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* <div className="flex items-center p-3 rounded-lg bg-secondary/50">
          <img
            src={user?.picture}
            alt={user?.name}
            className="w-10 h-10 rounded-full border border-border"
          />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div> */}

        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-destructive transition-colors rounded-lg hover:bg-destructive/10 group"
        >
          <LogOut className="w-5 h-5 mr-3 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
