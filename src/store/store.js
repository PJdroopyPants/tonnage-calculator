import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import materialsReducer from './materialsSlice';
import parametersReducer from './parametersSlice';
import operationsReducer from './operationsSlice';
import resultsReducer from './resultsSlice';
import uiReducer from './uiSlice';
import savedCalculationsReducer from './savedCalculationsSlice';
import calculationMiddleware from '../middleware/calculationMiddleware';
import batchActionsMiddleware from '../middleware/batchActionsMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['savedCalculations'] // Only persist saved calculations
};

const rootReducer = combineReducers({
  materials: materialsReducer,
  parameters: parametersReducer,
  operations: operationsReducer,
  results: resultsReducer,
  ui: uiReducer,
  savedCalculations: savedCalculationsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }).concat([
      validationMiddleware, // Run validation first
      thunk,
      calculationMiddleware,
      batchActionsMiddleware
    ]),
});

export const persistor = persistStore(store); 