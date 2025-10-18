import { configureStore } from '@reduxjs/toolkit';

import { appleMusicApi } from './services/appleMusicApi';
import playerReducer from './features/playerSlice';

export const store = configureStore({
  reducer: {
    [appleMusicApi.reducerPath]: appleMusicApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appleMusicApi.middleware),
});