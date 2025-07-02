import { createSlice } from "@reduxjs/toolkit";

const initialNeeds = [
  { id: 1, title: "Laptop Repair", amount: 40000, priority: "High", met: false },
  { id: 2, title: "School Fees", amount: 60000, priority: "Critical", met: false },
  { id: 3, title: "Data Subscription", amount: 15000, priority: "Medium", met: false },
];

const needsSlice = createSlice({
  name: "needs",
  initialState: initialNeeds,
  reducers: {
    toggleNeedMet: (state, action) => {
      const need = state.find((n) => n.id === action.payload);
      if (need) need.met = !need.met;
    },
    addNeed: (state, action) => {
      state.push({ ...action.payload, met: false });
    },
    deleteNeed: (state, action) => {
      return state.filter((need) => need.id !== action.payload);
    },
    setNeeds: (state, action) => {
      return action.payload;  // replace the whole needs array with Firebase data
    },
  },
});

export const { toggleNeedMet, addNeed, deleteNeed, setNeeds } = needsSlice.actions;
export default needsSlice.reducer;
