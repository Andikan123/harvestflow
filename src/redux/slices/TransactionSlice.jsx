import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('transactions')) || [];

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.unshift(action.payload);
      localStorage.setItem('transactions', JSON.stringify(state));
    },
    resetTransactions: () => {
      localStorage.removeItem('transactions');
      return [];
    },
  },
});

export const { addTransaction, resetTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
