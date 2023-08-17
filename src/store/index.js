// store.js
import { configureStore } from '@reduxjs/toolkit';
import mixReducer from './slices/mixSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    mixs: mixReducer,
    user:userReducer
  },
});

export default store;