import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    exp: 0,
    isDirty: false,
  },
};

export const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    setExp: (state, action) => {
      const newexp = action.payload;
      state.value.exp = newexp;
      // also set isDirty false as we have updated the exp value
      state.value.isDirty = false;
    },
    setIsDirty: (state, action) => {
      state.value.isDirty = action.payload;
    },
  },
});

export const { setExp, setIsDirty } = experienceSlice.actions;

export default experienceSlice.reducer;
