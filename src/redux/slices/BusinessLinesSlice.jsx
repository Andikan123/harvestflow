import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  salary: 0,
  coding: 0,
  renting: 0,
  giftCard: 0,
  exchange: 0,
};

const businessLinesSlice = createSlice({
  name: "businessLines",
  initialState,
  reducers: {
    updateBusiness: (state, action) => {
      const { key, amount } = action.payload;
      state[key] = amount;
    },
  },
});

export const { updateBusiness } = businessLinesSlice.actions;
export default businessLinesSlice.reducer;
