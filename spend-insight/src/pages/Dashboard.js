import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentMonth, setTransactions, setSavings, setMonthlyIncome, setBalance, setIncomeArray } from '../store/transactionSlice';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle, Button, cn } from '../components/ui';

const Dashboard = ({ user }) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);
  const dispatch = useDispatch();
  const transactions = useSelector(state => state.transaction.transactions);
  const selectedMonth = useSelector(state => state.transaction.selectedMonth);
  const monthlySavings = useSelector(state => state.transaction.savings);
  const monthlyIncome = useSelector(state => state.transaction.monthlyIncome);
  const totalBalance = useSelector(state => state.transaction.balance);
  const incomeArray = useSelector(state => state.transaction.incomeArray);

  useEffect(() => {
    if (user !== undefined) {
      fetchTransactions(selectedMonth);
    }
  }, [selectedMonth, user]);

  useEffect(() => {
    calculateTotalExpense();
    calculateMonthlyIncome();
  }, [incomeArray, transactions]);

  const labelTotals = useMemo(() => {
    const totals = {};
    transactions.forEach((transaction) => {
      const { label, amount } = transaction;
      if (label) {
        totals[label] = (totals[label] || 0) + amount;
      }
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    let total = 0;
    transactions.forEach((transaction) => {
      const { category, amount } = transaction;
      totals[category] = (totals[category] || 0) + amount;
      total += amount;
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      percent: total !== 0 ? (value / total) * 100 : 0,
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const fetchTransactions = async (selectedMonth) => {
    try {
      const response = await api.Transaction.listByMonth(user?.sub, selectedMonth);
      if (response.status === 200) {
        dispatch(setTransactions(response.data.transactions));
        dispatch(setSavings(response.data.savings));
        dispatch(setIncomeArray(response.data.incomes));
        dispatch(setBalance(response.data.balance));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotalExpense = () => {
    let tempExpense = 0;
    transactions.forEach(t1 => tempExpense += t1.amount);
    setTotalExpense(tempExpense);
  }

  const calculateMonthlyIncome = () => {
    let tempIncome = 0;
    incomeArray.forEach(income => {
      tempIncome += income.amount;
    });
    dispatch(setMonthlyIncome(tempIncome));
  }

  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#475569', '#14b8a6', '#f43f5e'
  ];

  const handleMonthChange = (date) => {
    dispatch(setCurrentMonth(date));
    setCalendarVisible(false);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    dispatch(setCurrentMonth(nextMonth));
  }

  const goToPreviousMonth = () => {
    const previousMonth = new Date(selectedMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    dispatch(setCurrentMonth(previousMonth));
  }

  const KPI_CARDS = [
    { title: 'Total Balance', value: totalBalance, icon: Wallet, color: 'text-primary' },
    { title: 'Monthly Savings', value: monthlySavings, icon: PiggyBank, color: 'text-emerald-500' },
    { title: 'Monthly Income', value: monthlyIncome, icon: TrendingUp, color: 'text-emerald-500' },
    { title: 'Monthly Expenses', value: totalExpense, icon: TrendingDown, color: 'text-destructive' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Monitor your spending and income trends.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg self-start">
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
                  onChange={handleMonthChange}
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <Card key={card.title} className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={cn("w-4 h-4", card.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value < 0 ? '-' : ''}₹{Math.abs(card.value).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            {categoryTotals.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryTotals}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryTotals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                    formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground italic">No data for this month</div>
            )}
          </CardContent>
        </Card>

        <Card className="card-shadow overflow-hidden">
          <CardHeader>
            <CardTitle>Category Analytics</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-3 text-left font-semibold text-muted-foreground uppercase">Category</th>
                    <th className="px-6 py-3 text-center font-semibold text-muted-foreground uppercase">%</th>
                    <th className="px-6 py-3 text-right font-semibold text-muted-foreground uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categoryTotals.length > 0 ? (
                    categoryTotals.map((item, index) => (
                      <tr key={item.name} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 flex items-center">
                          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="font-medium">{item.name}</span>
                        </td>
                        <td className="px-6 py-4 text-center text-muted-foreground">{item.percent.toFixed(1)}%</td>
                        <td className="px-6 py-4 text-right font-semibold">₹{item.value.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground italic">No transactions found</td>
                  </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
