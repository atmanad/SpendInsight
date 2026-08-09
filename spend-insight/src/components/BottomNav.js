import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Tags, Layers } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: Tags },
    { name: 'Labels', path: '/labels', icon: Layers },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border md:hidden flex justify-around items-center py-1 px-2 shadow-lg transition-colors duration-300">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[64px]
            ${isActive 
              ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-semibold' 
              : 'text-muted-foreground hover:text-foreground'}
          `}
        >
          <item.icon className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
