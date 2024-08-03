import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        transactions: [],
        balance: 0,
        savings: 0,
        monthlyExpenses: 0,
        selectedMonth: new Date(),
    },
    reducers: {
        setCurrentMonth(state, action) {
            state.selectedMonth = action.payload;
        },
        setTransactions(state, action) {
            state.transactions = action.payload;
        },
        setBalance(state, action) {
            state.balance = action.payload;
        },
        setSavings(state, action) {
            state.savings = action.payload;
        }

    }

});

export const { setCurrentMonth, setTransactions, setBalance, setSavings } = transactionSlice.actions;
export const transactionActions = transactionSlice.actions;
export default transactionSlice;