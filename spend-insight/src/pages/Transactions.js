import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  Filter,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { groupBy } from 'lodash';
import api from '../api/api';
import TransactionItem from '../components/TransactionItem.js';
import IncomeItem from '../components/IncomeItem';
import { 
  setSavings, 
  setSortedIncomes, 
  setSortedTransactions, 
  setMonthlyIncome, 
  setTransactions, 
  setCurrentMonth, 
  setBalance, 
  setSelectedDate, 
  setIncomeArray, 
  setCategoryArray, 
  setLabelArray 
} from '../store/transactionSlice';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import Modal from '../components/ui/Modal';
import { cn } from '../components/ui';

const Transactions = ({ user }) => {
  const dispatch = useDispatch();
  
  const selectedMonth = useSelector(state => state.transaction.selectedMonth);
  const totalBalance = useSelector(state => state.transaction.balance);
  const selectedDate = useSelector(state => state.transaction.selectedDate);
  const groupedSortedIncomes = useSelector(state => state.transaction.groupedAndSortedIncomes);
  const groupedSortedTransactions = useSelector(state => state.transaction.groupedAndSortedTransactions);
  const monthlySavings = useSelector(state => state.transaction.savings);
  const monthlyIncome = useSelector(state => state.transaction.monthlyIncome);
  const transactions = useSelector(state => state.transaction.transactions);
  const incomeArray = useSelector(state => state.transaction.incomeArray);
  const categoryArray = useSelector(state => state.transaction.categoryArray);
  const labelArray = useSelector(state => state.transaction.labelArray);

  const [showModal, setShowModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);
  const [filterCategory, setFilterCategory] = useState('All');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [income, setIncome] = useState({
    date: new Date(),
    amount: '',
    notes: '',
    category: ''
  });

  const [transaction, setTransaction] = useState({
    category: '',
    amount: '',
    notes: '',
    label: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchLabels();
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(true);
      fetchTransactions(selectedMonth);
    }
  }, [selectedMonth, user]);

  useEffect(() => {
    calculateTotalExpense();
  }, [transactions]);

  useEffect(() => {
    calculateMonthlyIncome();
  }, [incomeArray]);

  const handleChange = (event) => {
    setTransaction({ ...transaction, [event.target.name]: event.target.value });
  };

  const handleIncomeChange = (event) => {
    setIncome({ ...income, [event.target.name]: event.target.value });
  };

  const fetchTransactions = async (selectedMonth) => {
    try {
      const response = await api.Transaction.listByMonth(user?.sub, selectedMonth);
      if (response.status === 200) {
        dispatch(setTransactions(response.data.transactions));
        groupAndSortByDate(response.data.transactions, setSortedTransactions);
        dispatch(setSavings(response.data.savings));
        dispatch(setIncomeArray(response.data.incomes));
        groupAndSortByDate(response.data.incomes, setSortedIncomes);
        dispatch(setBalance(response.data.balance));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.Category.list(user?.sub);
      if (response.status === 200) {
        dispatch(setCategoryArray(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLabels = async () => {
    try {
      const response = await api.Label.list(user?.sub);
      if (response.status === 200) {
        dispatch(setLabelArray(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const groupAndSortByDate = (itemArray, setItemArrayAction) => {
    const grouped = groupBy(itemArray, (item) => format(new Date(item.date), 'dd MMM yy'));
    const sorted = Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    dispatch(setItemArrayAction(Object.fromEntries(sorted)));
  };

  const calculateTotalExpense = () => {
    let tempExpense = 0;
    transactions.forEach(t => tempExpense += t.amount);
    setTotalExpense(tempExpense);
  };

  const calculateMonthlyIncome = () => {
    let tempIncome = 0;
    incomeArray.forEach(i => tempIncome += i.amount);
    dispatch(setMonthlyIncome(tempIncome));
  };

  const handleAddIncome = async () => {
    if (!income.amount || !income.category) {
      alert('Please enter an amount and category');
      return;
    }
    setSubmitting(true);
    try {
      const incomeData = {
        date: income.date.toISOString().substring(0, 10),
        amount: income.amount,
        notes: income.notes,
        category: income.category
      };
      
      let response;
      if (isEditing) {
        response = await api.Income.update({ 
          userId: user.sub, 
          incomeId: editId, 
          income: incomeData,
          date: incomeData.date // Adding date context for backend if needed
        });
      } else {
        response = await api.Income.insert({ userId: user.sub, income: incomeData });
      }

      if (response.status === 200) {
        setIncome({ date: new Date(), amount: '', notes: '', category: '' });
        setShowIncomeModal(false);
        setIsEditing(false);
        setEditId(null);
        fetchTransactions(selectedMonth);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditIncome = (item) => {
    setIncome({
      date: new Date(item.date),
      amount: item.amount,
      notes: item.notes,
      category: item.category
    });
    setEditId(item._id);
    setIsEditing(true);
    setShowIncomeModal(true);
  };

  const handleAddTransaction = async () => {
    if (!transaction.category || !transaction.amount) {
      alert('Please select a category and enter an amount');
      return;
    }
    setSubmitting(true);
    try {
      const transactionData = {
        category: transaction.category,
        date: selectedDate.toISOString().substring(0, 10),
        amount: transaction.amount,
        notes: transaction.notes,
        label: transaction.label
      };

      let response;
      if (isEditing) {
        response = await api.Transaction.update({ 
          userId: user.sub, 
          transactionId: editId, 
          transaction: transactionData,
          date: transactionData.date // Adding date context for backend
        });
      } else {
        response = await api.Transaction.insert({ userId: user.sub, transaction: transactionData });
      }

      if (response.status === 200) {
        setTransaction({ category: '', amount: '', notes: '', label: '' });
        fetchTransactions(selectedMonth);
        if (!keepOpen) {
          setShowModal(false);
          setIsEditing(false);
          setEditId(null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTransaction = (item) => {
    setTransaction({
      category: item.category,
      amount: item.amount,
      notes: item.notes,
      label: item.label || ''
    });
    dispatch(setSelectedDate(new Date(item.date)));
    setEditId(item._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    dispatch(setCurrentMonth(nextMonth));
  };

  const goToPreviousMonth = () => {
    const previousMonth = new Date(selectedMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    dispatch(setCurrentMonth(previousMonth));
  };

  const KPI_CARDS = [
    { title: 'Balance', value: totalBalance, icon: Wallet, color: 'text-primary' },
    { title: 'Savings', value: monthlySavings, icon: PiggyBank, color: 'text-emerald-500' },
    { title: 'Income', value: monthlyIncome, icon: TrendingUp, color: 'text-emerald-500' },
    { title: 'Expenses', value: totalExpense, icon: TrendingDown, color: 'text-destructive' },
  ];

  const filteredTransactions = filterCategory === 'All' 
    ? groupedSortedTransactions 
    : Object.fromEntries(
        Object.entries(groupedSortedTransactions).map(([date, items]) => [
          date,
          items.filter(item => item.category === filterCategory)
        ]).filter(([_, items]) => items.length > 0)
      );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">Manage your detailed income and expense history.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-lg">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="relative">
              <Button 
                variant="ghost" 
                className="px-3 py-1 font-medium min-w-[140px]"
                onClick={() => setCalendarVisible(!isCalendarVisible)}
              >
                <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Button>
              {isCalendarVisible && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-[100] bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                  <DatePicker
                    selected={selectedMonth}
                    onChange={(date) => { dispatch(setCurrentMonth(date)); setCalendarVisible(false); }}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    inline
                  />
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => { setIsEditing(false); setShowIncomeModal(true); }} variant="outline" size="sm" className="hidden sm:flex">
                <ArrowUpRight className="w-4 h-4 mr-2 text-emerald-500" />
                Add Income
            </Button>
            <Button onClick={() => { setIsEditing(false); setShowModal(true); }} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <Card key={card.title} className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</CardTitle>
              <card.icon className={cn("w-3.5 h-3.5", card.color)} />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl font-bold">
                ₹{Math.abs(card.value).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8">
        <Card className="card-shadow overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border py-4 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">History</CardTitle>
            <div className="relative">
              <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("text-muted-foreground", filterCategory !== 'All' && "text-primary")}
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
              >
                  <Filter className="w-4 h-4 mr-2" />
                  {filterCategory === 'All' ? 'Filter' : filterCategory}
              </Button>
              {isFilterVisible && (
                <div className="absolute right-0 top-full mt-2 z-[100] bg-card border border-border rounded-xl shadow-xl p-2 min-w-[200px] animate-in fade-in zoom-in slide-in-from-top-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Filter by Category</div>
                  <div className="space-y-1">
                    <button 
                      className={cn("w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors", filterCategory === 'All' && "bg-primary/10 text-primary")}
                      onClick={() => { setFilterCategory('All'); setIsFilterVisible(false); }}
                    >
                      All Categories
                    </button>
                    {categoryArray.map(cat => (
                      <button 
                        key={cat._id}
                        className={cn("w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors", filterCategory === cat.categoryName && "bg-primary/10 text-primary")}
                        onClick={() => { setFilterCategory(cat.categoryName); setIsFilterVisible(false); }}
                      >
                        {cat.categoryName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="bg-muted rounded-lg w-10 h-10" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <div className="divide-y divide-border">
                  {Object.keys(groupedSortedIncomes).length === 0 && Object.keys(filteredTransactions).length === 0 && (
                    <div className="p-12 text-center text-muted-foreground italic flex flex-col items-center">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                            <Receipt className="w-8 h-8 opacity-20" />
                        </div>
                        No records found for this month.
                    </div>
                  )}
                  
                  {Object.keys(groupedSortedIncomes).map(date => (
                    <div key={`income-${date}`}>
                      {groupedSortedIncomes[date].map(item => (
                        <IncomeItem 
                          key={item._id} 
                          {...item} 
                          id={item._id}
                          userId={user?.sub} 
                          fetchMonthlyIncome={() => fetchTransactions(selectedMonth)} 
                          selectedMonth={selectedMonth} 
                          onEdit={() => handleEditIncome(item)}
                        />
                      ))}
                    </div>
                  ))}

                  {/* Render Transactions grouped by date */}
                {Object.keys(filteredTransactions).map(date => (
                  <div key={date}>
                    <div className="bg-muted/30 px-6 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] border-y border-border/50">
                      {date}
                    </div>
                    {filteredTransactions[date].map(item => (
                      <TransactionItem 
                        key={item._id} 
                        {...item} 
                        id={item._id}
                        userId={user?.sub} 
                        fetchTransactions={fetchTransactions} 
                        selectedMonth={selectedMonth} 
                        onEdit={() => handleEditTransaction(item)}
                      />
                    ))}
                  </div>
                ))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal 
        isOpen={showIncomeModal} 
        onClose={() => { setShowIncomeModal(false); setIsEditing(false); setEditId(null); }}
        title={isEditing ? "Edit Income" : "Add Income"}
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowIncomeModal(false); setIsEditing(false); setEditId(null); }}>Cancel</Button>
            <Button onClick={handleAddIncome} disabled={submitting}>
              {submitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Income')}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Date</label>
            <DatePicker 
              selected={income.date} 
              onChange={(date) => setIncome({...income, date})} 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount</label>
            <input 
              type="number" 
              name="amount" 
              value={income.amount}
              onChange={handleIncomeChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <select 
              name="category" 
              value={income.category} 
              onChange={handleIncomeChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Bonus">Bonus</option>
              <option value="Gifts">Gifts</option>
              <option value="Freelancing">Freelancing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Notes</label>
            <textarea 
              name="notes" 
              value={income.notes}
              onChange={handleIncomeChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[80px]"
              placeholder="Add some notes..."
            />
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setIsEditing(false); setEditId(null); }}
        title={isEditing ? "Edit Transaction" : "Add Transaction"}
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="keepOpen" 
                    checked={keepOpen} 
                    onChange={() => setKeepOpen(!keepOpen)} 
                    className="rounded border-input text-primary focus:ring-primary"
                />
                <label htmlFor="keepOpen" className="text-sm text-muted-foreground">Keep open</label>
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" onClick={() => { setShowModal(false); setIsEditing(false); setEditId(null); }}>Cancel</Button>
                <Button onClick={handleAddTransaction} disabled={submitting}>
                    {submitting ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Transaction' : 'Add Transaction')}
                </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <select 
                name="category" 
                value={transaction.category} 
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                <option value="">Select Category</option>
                {categoryArray.map((cat) => (
                    <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
                ))}
                </select>
            </div>
            <div className="space-y-1.5">
                <label className="text-sm font-medium">Label</label>
                <select 
                name="label" 
                value={transaction.label} 
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                <option value="">Select Label</option>
                {labelArray.map((lbl) => (
                    <option key={lbl._id} value={lbl.labelName}>{lbl.labelName}</option>
                ))}
                </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Date</label>
            <DatePicker 
              selected={selectedDate} 
              onChange={(date) => dispatch(setSelectedDate(date))} 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Amount</label>
            <input 
              type="number" 
              name="amount" 
              value={transaction.amount}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Notes</label>
            <textarea 
              name="notes" 
              value={transaction.notes}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[80px]"
              placeholder="Add some notes..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Transactions;