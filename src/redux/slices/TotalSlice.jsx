// redux/slices/TotalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("totals")) || {
  generalIncome: 0,
  businessIncome: 0,
  otherIncome: 0,
  exchangeIncome: 0,
  tithe: 0,
  partnership: 0,
  expenses: 0,
  saving: 0,
   debt: [],
  availableIncome: 0,
  statusFlags: {
    tithe: false,
    partnership: false,
    saving: false,
  },
 
};

const totalSlice = createSlice({
  name: "totals",
  initialState,
 reducers: {
 updateTotals: (state, action) => {
  Object.entries(action.payload).forEach(([key, value]) => {
    if (key === "statusFlags") {
      state.statusFlags = { ...state.statusFlags, ...value };
    } else if (key === "generalIncome") {
      state.generalIncome = value;
    } else {
      state[key] = value; // ✅ CHANGE THIS FROM += TO =
    }
  });
  localStorage.setItem("totals", JSON.stringify(state));
},

  updateGeneralIncome: (state, action) => {
    const amount = action.payload;
    state.generalIncome = (state.generalIncome || 0) + amount;
    localStorage.setItem("totals", JSON.stringify(state));
  },
  addDebt: (state, action) => {
    state.debt.push(action.payload);
    localStorage.setItem("totals", JSON.stringify(state));
  },
  payDebt: (state, action) => {
    const debtId = action.payload;
    const debtIndex = state.debt.findIndex((d) => d.id === debtId);
    if (debtIndex !== -1) {
      const paidDebt = state.debt[debtIndex];
      state.debt.splice(debtIndex, 1);
      state.expenses = (state.expenses || 0) + paidDebt.amount;
      localStorage.setItem("totals", JSON.stringify(state));
    }
  },
  togglePaidStatus: (state, action) => {
    const key = action.payload;
    if (!state.statusFlags) state.statusFlags = {};
    const currentAmount = state[key];
    const wasPaid = state.statusFlags[key]?.paid;
    if (!wasPaid && currentAmount > 0) {
      state.statusFlags[key] = {
        paid: true,
        date: new Date().toISOString(),
      };
      state[key] = 0;
      setTimeout(() => {
        state.statusFlags[key] = {
          paid: false,
          date: null,
        };
        localStorage.setItem("totals", JSON.stringify(state));
      }, 100);
    }
    localStorage.setItem("totals", JSON.stringify(state));
  },
  resetTotals: () => {
    const reset = {
      generalIncome: 0,
      businessIncome: 0,
      otherIncome: 0,
      tithe: 0,
      partnership: 0,
      expenses: 0,
      saving: 0,
      debt: [],
      availableIncome: 0,
      statusFlags: {
        tithe: false,
        partnership: false,
        saving: false,
      },
    };
    localStorage.setItem("totals", JSON.stringify(reset));
    return reset;
  },
  setExpensesFromNeeds: (state, action) => {
    state.expenses = action.payload;
    localStorage.setItem("totals", JSON.stringify(state));
  },
  markAsPaidAndReset: (state, action) => {
    const key = action.payload;
    const amount = state[key];
    if (amount > 0) {
      const transaction = {
        type: key === "tithe" ? "tithe" : "partnership",
        amount,
        date: new Date().toISOString(),
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} Paid`,
      };
      const existingTxns = JSON.parse(localStorage.getItem("transactions")) || [];
      localStorage.setItem("transactions", JSON.stringify([transaction, ...existingTxns]));
      state[key] = 0;
      localStorage.setItem("totals", JSON.stringify(state));
    }
  },

  // ✅ ADD THIS
  setDebts: (state, action) => {
    state.debt = action.payload;
    localStorage.setItem("totals", JSON.stringify(state));
  },
}

});

export const { updateTotals, resetTotals,setDebts, setExpensesFromNeeds, updateGeneralIncome, togglePaidStatus,markAsPaidAndReset ,addDebt,payDebt } = totalSlice.actions;
export default totalSlice.reducer;
