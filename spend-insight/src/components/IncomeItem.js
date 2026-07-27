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

  return (
    <div className="group flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-all border-b border-emerald-100 dark:border-emerald-900/30 last:border-0 overflow-hidden">
      <div className="flex items-center gap-4 min-w-0">
        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground truncate">{category || 'Income'}</span>
          </div>
          <span className="text-sm text-muted-foreground truncate">{notes || 'No description'}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹{amount.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">{format(new Date(date), 'MMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center gap-1 opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomeItem;
