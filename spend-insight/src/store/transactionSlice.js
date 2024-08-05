import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        transactions: [],
        balance: 0,
        savings: 0,
        monthlyExpenses: 0,
        monthlyIncome: 0,
        incomeArray: [],
        selectedMonth: new Date(),
        selectedDate: new Date(),
        groupedAndSortedTransactions: {},
        groupedAndSortedIncomes: {},
        categoryArray: [],
        labelArray: []
    },
    reducers: {
        setCurrentMonth(state, action) {
            state.selectedMonth = action.payload;
        },
        setSelectedDate(state, action) {
            state.selectedDate = action.payload;
        },
        setTransactions(state, action) {
            state.transactions = action.payload;
        },
        setBalance(state, action) {
            state.balance = action.payload;
        },
        setSavings(state, action) {
            state.savings = action.payload;
        },
        setSortedTransactions(state, action) {
            state.groupedAndSortedTransactions = action.payload;
        },
        setSortedIncomes(state, action) {
            state.groupedAndSortedIncomes = action.payload;
        },
        setMonthlyIncome(state, action) {
            state.monthlyIncome = action.payload;
        },
        setIncomeArray(state, action) {
            state.incomeArray = action.payload;
        },
        setCategoryArray(state, action) {
            state.categoryArray = action.payload;
        },
        setLabelArray(state, action) {
            state.labelArray = action.payload;
        },

    }

});

export const { setCurrentMonth,
    setTransactions, setBalance,
    setSavings, setSelectedDate,
    setSortedTransactions, setSortedIncomes,
    setMonthlyIncome, setIncomeArray,
    setCategoryArray, setLabelArray } = transactionSlice.actions;
export const transactionActions = transactionSlice.actions;
export default transactionSlice;