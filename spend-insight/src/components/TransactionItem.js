import React, { useState } from 'react';
import { Trash2, Edit2, Utensils, Plane, Home, ShoppingBag, Receipt, HeartPulse, Zap, Car } from 'lucide-react';
import api from '../api/api';
import { Button } from './ui';
import { format } from 'date-fns';

const TransactionItem = ({ category, label, amount, notes, id, fetchTransactions, selectedMonth, date, userId, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setIsDeleting(true);
      try {
        const response = await api.Transaction.delete(userId, id, date);
        if (response.status === 200) {
          fetchTransactions(selectedMonth);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getCategoryConfig = (cat) => {
    const catLower = (cat || '').toLowerCase();
    if (catLower.includes('food') || catLower.includes('eat') || catLower.includes('dining')) {
      return {
        icon: Utensils,
        bg: 'bg-amber-100 dark:bg-amber-950/40',
        text: 'text-amber-600 dark:text-amber-400'
      };
    }
    if (catLower.includes('travel') || catLower.includes('transport') || catLower.includes('flight')) {
      return {
        icon: Plane,
        bg: 'bg-sky-100 dark:bg-sky-950/40',
        text: 'text-sky-600 dark:text-sky-400'
      };
    }
    if (catLower.includes('cab') || catLower.includes('fuel') || catLower.includes('car')) {
      return {
        icon: Car,
        bg: 'bg-blue-100 dark:bg-blue-950/40',
        text: 'text-blue-600 dark:text-blue-400'
      };
    }
    if (catLower.includes('home') || catLower.includes('rent') || catLower.includes('gas')) {
      return {
        icon: Home,
        bg: 'bg-emerald-100 dark:bg-emerald-950/40',
        text: 'text-emerald-600 dark:text-emerald-400'
      };
    }
    if (catLower.includes('shop') || catLower.includes('store') || catLower.includes('cloth')) {
      return {
        icon: ShoppingBag,
        bg: 'bg-purple-100 dark:bg-purple-950/40',
        text: 'text-purple-600 dark:text-purple-400'
      };
    }
    if (catLower.includes('health') || catLower.includes('medical') || catLower.includes('doctor')) {
      return {
        icon: HeartPulse,
        bg: 'bg-rose-100 dark:bg-rose-950/40',
        text: 'text-rose-600 dark:text-rose-400'
      };
    }
    if (catLower.includes('bill') || catLower.includes('utility') || catLower.includes('power')) {
      return {
        icon: Zap,
        bg: 'bg-amber-100 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300'
      };
    }
    return {
      icon: Receipt,
      bg: 'bg-indigo-100 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400'
    };
  };

  const config = getCategoryConfig(category);
  const CategoryIcon = config.icon;

  const formattedDate = date ? format(new Date(date), 'MMM d, yyyy') : '';

  return (
    <div className="group flex items-center justify-between p-3 sm:p-3.5 bg-card hover:bg-muted/40 rounded-2xl border border-border/50 transition-all duration-200 mb-2 shadow-xs gap-2">
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
        {/* Category Circular Pastel Icon */}
        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${config.bg} ${config.text} flex items-center justify-center shrink-0 shadow-xs`}>
          <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        
        {/* Title, Tag, Subtitle */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-foreground text-xs sm:text-sm leading-snug truncate">{category}</span>
            {label && (
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200/40 dark:border-blue-800/40 shrink-0">
                {label}
              </span>
            )}
          </div>
          <span className="text-[11px] sm:text-xs text-muted-foreground truncate leading-tight mt-0.5">{notes || 'No description'}</span>
        </div>
      </div>

      {/* Right Side: Amount, Date, Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex flex-col items-end shrink-0">
          <span className="font-bold text-red-600 dark:text-red-400 text-xs sm:text-base tracking-tight whitespace-nowrap">
            -₹{amount.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium whitespace-nowrap">{formattedDate}</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary p-0"
            onClick={onEdit}
            title="Edit transaction"
          >
            <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-0"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete transaction"
          >
            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
