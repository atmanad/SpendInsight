import React, { useState } from 'react';
import { Trash2, Edit2, Receipt } from 'lucide-react';
import api from '../api/api';
import { Badge, Button } from './ui';
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

  const getCategoryColor = (cat) => {
    const colors = {
      Food: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      Transport: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Shopping: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      Bills: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      Entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      Health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return colors[cat] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  };

  const colorClasses = getCategoryColor(category).split(' ');

  return (
    <div className="group flex items-center justify-between p-4 bg-card hover:bg-muted/30 transition-all border-b border-border last:border-0 overflow-hidden">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`p-2 rounded-lg ${colorClasses[0]} bg-opacity-10`}>
          <Receipt className={`w-5 h-5 ${colorClasses[1]}`} />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground truncate">{category}</span>
            {label && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal border-muted-foreground/30">
                {label}
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground truncate">{notes || 'No description'}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="font-bold text-destructive">-₹{amount.toLocaleString()}</span>
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

export default TransactionItem;
