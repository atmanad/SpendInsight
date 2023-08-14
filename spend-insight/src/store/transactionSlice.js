import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: { transactions: [], selectedMonth: new Date(), },
    reducers: {
        setCurrentMonth(state, action) {
            state.selectedMonth = action.payload;
        },
        setTransactions(state, action) {
            state.transactions = action.payload;
        }
    }

});

export const { setCurrentMonth, setTransactions } = transactionSlice.actions;
export const transactionActions = transactionSlice.actions;
export default transactionSlice;