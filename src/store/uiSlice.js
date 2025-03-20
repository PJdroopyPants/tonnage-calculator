import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'operations',
  errors: {},
  warnings: [],
  loadingStates: {
    materials: false,
    calculations: false,
    export: false
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    setError: (state, action) => {
      const { key, message } = action.payload;
      state.errors[key] = message;
    },
    
    clearError: (state, action) => {
      const key = action.payload;
      delete state.errors[key];
    },
    
    clearAllErrors: (state) => {
      state.errors = {};
    },
    
    addWarning: (state, action) => {
      state.warnings.push(action.payload);
    },
    
    clearWarnings: (state) => {
      state.warnings = [];
    },
    
    setLoadingState: (state, action) => {
      const { key, isLoading } = action.payload;
      state.loadingStates[key] = isLoading;
    },
    
    resetUi: () => initialState
  }
});

export const { 
  setActiveTab, 
  setError, 
  clearError, 
  clearAllErrors, 
  addWarning, 
  clearWarnings, 
  setLoadingState, 
  resetUi 
} = uiSlice.actions;

export default uiSlice.reducer; 