import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('businesses')) || ["POS", "Freelance"];

const businessSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    addBusiness: (state, action) => {
      if (!state.includes(action.payload)) {
        state.push(action.payload);
        localStorage.setItem('businesses', JSON.stringify(state));
      }
    },
    deleteBusiness: (state, action) => {
      const updated = state.filter(biz => biz !== action.payload);
      localStorage.setItem('businesses', JSON.stringify(updated));
      return updated;
    },
  },
});

export const { addBusiness, deleteBusiness } = businessSlice.actions;
export default businessSlice.reducer;
