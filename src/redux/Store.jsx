import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/TransactionSlice';
import businessReducer from './slices/BusinessSlice';
import totalReducer from './slices/TotalSlice';
import needsReducer from './slices/NeedSlice';
import businessLinesReducer from './slices/BusinessLinesSlice';
import incomeReducer from './slices/IncomeSlice';

const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    businesses: businessReducer,
    totals: totalReducer,
    needs:needsReducer,
    businessLines: businessLinesReducer,
    incomeSources: incomeReducer,
  },
});

export default store;
