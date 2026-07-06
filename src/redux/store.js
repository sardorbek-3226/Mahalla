import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';
import chatReducer from './slices/chatSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notifications: notificationReducer,
  chat: chatReducer,
});

// Persist only auth + ui. Volatile data (chat presence, notifications) stays in memory
// and server data is owned by React Query.
// NOTE: key bumped to v2 when switching from cookie/mock auth to the real
// Bearer-token backend — this auto-discards any stale mock session (e.g. an old
// super_admin user) that would otherwise hit admin endpoints and 403.
const persistConfig = {
  key: 'smart-mahalla-v2',
  version: 2,
  storage,
  whitelist: ['auth', 'ui'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);
