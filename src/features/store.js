import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import candidatesReducer from './candidatesSlice';
import sessionReducer from './sessionSlice';

// Configuration for redux-persist
const persistConfig = {
  key: 'crisp-interview-root',
  version: 1,
  storage,
  // We whitelist the slices we want to persist. Both are needed for the resume functionality.
  whitelist: ['candidates', 'session'],
};

// Combine our reducers
const rootReducer = combineReducers({
  candidates: candidatesReducer,
  session: sessionReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // This is important to avoid errors with redux-persist.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor object
export const persistor = persistStore(store);