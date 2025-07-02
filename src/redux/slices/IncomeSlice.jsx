// redux/slices/IncomeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("incomeSources")) || {
  salary: 0,
  coding: 0,
  renting: 0,
  giftCard: 0,
  exchange: 0,
};

const incomeSlice = createSlice({
  name: "incomeSources",
  initialState,
  reducers: {
    addIncome: (state, action) => {
      const { source, amount } = action.payload;
      state[source] += amount;
      localStorage.setItem("incomeSources", JSON.stringify(state));
    },
    deleteIncomeSource: (state, action) => {
      const { source } = action.payload;
      delete state[source];
      localStorage.setItem("incomeSources", JSON.stringify(state));
    },
    resetIncomeSources: () => {
      const reset = {
        salary: 0,
        coding: 0,
        renting: 0,
        giftCard: 0,
        exchange: 0,
      };
      localStorage.setItem("incomeSources", JSON.stringify(reset));
      return reset;
    },
  },
});

export const { addIncome, resetIncomeSources, deleteIncomeSource } = incomeSlice.actions;
export default incomeSlice.reducer;
