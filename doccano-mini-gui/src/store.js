import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './features/data/dataslice';
import stateReducer from './features/data/stateslice';
import experienceReducer from './features/data/experienceslice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
    state: stateReducer,
    experience: experienceReducer,
  },
});
