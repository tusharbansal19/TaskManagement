import { createSlice } from '@reduxjs/toolkit';

const initialState = 
{ bgColor: "linear-gradient(to right, #062379, #101e30)", bgGradient: "", textColor: "#d2ee11", textGradient: "", textSize: "28px", iconColor: "#c9ed92" }

const styleSlice = createSlice({
  name: 'style',
  initialState,
  reducers: {
    setBgColor: (state, action) => {
      state.bgColor = action.payload;
    },
    setBgGradient: (state, action) => {
      state.bgGradient = action.payload;
    },
    setTextColor: (state, action) => {
      state.textColor = action.payload;
    },
    setTextGradient: (state, action) => {
      state.textGradient = action.payload;
    },
    setTextSize: (state, action) => {
      state.textSize = action.payload;
    },
    setIconColor: (state, action) => {
      state.iconColor = action.payload;
    },
  },
});

export const {
  setBgColor,
  setBgGradient,
  setTextColor,
  setTextGradient,
  setTextSize,
  setIconColor,
} = styleSlice.actions;

export default styleSlice.reducer;
