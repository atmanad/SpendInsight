import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Tags, 
  LogOut, 
  Moon, 
  Sun,
  PieChart,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Wallet
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = ({ 
  isDarkMode, 
  toggleDarkMode,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleDesktopCollapse
}) => {
  const { logout } = useAuth0();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: Tags },
    { name: 'Labels', path: '/labels', icon: PieChart },
    { name: 'Profile', path: '/user', icon: User },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border 
        transition-all duration-300 ease-in-out h-screen
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0
        ${isCollapsedDesktop ? 'md:w-20' : 'md:w-64'}
        w-64
      `}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center h-16 border-b border-border px-4 ${isCollapsedDesktop ? 'justify-between md:justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          {(!isCollapsedDesktop || isOpenMobile) && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent truncate">
              SpendInsight
            </h1>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={onToggleDesktopCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
          title={isCollapsedDesktop ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsedDesktop ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsedDesktop ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onCloseMobile}
            title={isCollapsedDesktop ? item.name : undefined}
            className={({ isActive }) => `
              flex items-center px-3 py-3 text-sm font-medium transition-all duration-200 rounded-xl group
              ${isCollapsedDesktop ? 'md:justify-center' : ''}
              ${isActive 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' 
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
            `}
          >
            <item.icon className={`w-5 h-5 shrink-0 transition-colors ${!isCollapsedDesktop ? 'mr-3' : 'md:mr-0 mr-3'}`} />
            <span className={`${isCollapsedDesktop ? 'md:hidden' : 'block'} truncate`}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-border space-y-2">
        <button
          onClick={toggleDarkMode}
          title={isCollapsedDesktop ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          className={`flex items-center w-full px-3 py-3 text-sm font-medium text-muted-foreground transition-colors rounded-lg hover:bg-secondary hover:text-foreground group ${isCollapsedDesktop ? 'md:justify-center' : ''}`}
        >
          {isDarkMode ? (
            <>
              <Sun className={`w-5 h-5 shrink-0 ${!isCollapsedDesktop ? 'mr-3' : 'md:mr-0 mr-3'}`} />
              <span className={`${isCollapsedDesktop ? 'md:hidden' : 'block'} truncate`}>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className={`w-5 h-5 shrink-0 ${!isCollapsedDesktop ? 'mr-3' : 'md:mr-0 mr-3'}`} />
              <span className={`${isCollapsedDesktop ? 'md:hidden' : 'block'} truncate`}>Dark Mode</span>
            </>
          )}
        </button>

        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          title={isCollapsedDesktop ? 'Logout' : undefined}
          className={`flex items-center w-full px-3 py-3 text-sm font-medium text-destructive transition-colors rounded-lg hover:bg-destructive/10 group ${isCollapsedDesktop ? 'md:justify-center' : ''}`}
        >
          <LogOut className={`w-5 h-5 shrink-0 ${!isCollapsedDesktop ? 'mr-3' : 'md:mr-0 mr-3'}`} />
          <span className={`${isCollapsedDesktop ? 'md:hidden' : 'block'} truncate`}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
