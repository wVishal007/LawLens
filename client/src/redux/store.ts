import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'

import authSlice from './slices/authSlice'
import documentSlice from './slices/documentSlice'
import uiSlice from './slices/uiSlice'

const persistConfig = {
  key: 'lawlens-root',
  storage,
  whitelist: ['auth', 'document'] // Only persist auth and document data
}

const rootReducer = combineReducers({
  auth: authSlice,
  document: documentSlice,
  ui: uiSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch