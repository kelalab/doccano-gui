import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    currentMessage: 0,
    labeling: false,
    userId: 0,
    projectId: -1,
    loggedIn: false,
    guideLine: {},
    language: 'en',
  },
};

export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    updateCurrent: (state, action) => {
      console.log('updateCurrent', state, action);
      const nextMessage = action.payload;
      state.value.currentMessage = nextMessage;
    },
    setLabeling: (state, action) => {
      state.value.labeling = action.payload;
    },
    setUserId: (state, action) => {
      state.value.userId = action.payload;
    },
    setProjectId: (state, action) => {
      state.value.projectId = action.payload;
    },
    setLoggedIn: (state, action) => {
      console.log('setting loggedin', action.payload);
      state.value.loggedIn = action.payload;
    },
    setGuideLine: (state, action) => {
      state.value.guideLine = action.payload;
    },
    setLanguage: (state, action) => {
      state.value.language = action.payload;
    },
  },
});

export const {
  updateCurrent,
  setLabeling,
  setUserId,
  setProjectId,
  setLoggedIn,
  setGuideLine,
  setLanguage,
} = stateSlice.actions;

export default stateSlice.reducer;
