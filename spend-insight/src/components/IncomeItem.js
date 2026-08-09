import React, { useState } from 'react';
import { Trash2, Edit2, TrendingUp } from 'lucide-react';
import api from '../api/api';
import { Button } from './ui';
import { format } from 'date-fns';

const IncomeItem = ({ date, amount, notes, id, userId, category, fetchMonthlyIncome, selectedMonth, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this income entry?")) {
      setIsDeleting(true);
      try {
        const response = await api.Income.delete(userId, id, date);
        if (response.status === 200) {
          fetchMonthlyIncome(selectedMonth);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formattedDate = date ? format(new Date(date), 'MMM d, yyyy') : '';

  return (
    <div className="group flex items-center justify-between p-3 sm:p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-100/40 dark:hover:bg-emerald-950/40 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/40 transition-all duration-200 mb-2 shadow-xs gap-2">
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
        {/* Category Circular Pastel Green Icon */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        
        {/* Title, Tag, Subtitle */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-foreground text-xs sm:text-sm leading-snug truncate">{category || 'Income'}</span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
              INCOME
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-muted-foreground truncate leading-tight mt-0.5">{notes || 'No description'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="flex flex-col items-end shrink-0">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-base tracking-tight whitespace-nowrap">
            +₹{amount.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium whitespace-nowrap">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary p-0"
            onClick={onEdit}
            title="Edit income"
          >
            <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-0"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete income"
          >
            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomeItem;
