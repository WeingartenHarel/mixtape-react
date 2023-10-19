// store.js
import { configureStore } from '@reduxjs/toolkit';
import mixReducer from './slices/mixSlice';
import userReducer from './slices/userSlice';
import playerReducer from './slices/playerSlice';

const store = configureStore({
  reducer: {
    mixs: mixReducer,
    user:userReducer,
    player:playerReducer
  },
});

export default store;