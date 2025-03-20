import { createSlice } from '@reduxjs/toolkit';
import { performCalculations } from '../services/SharedCalculationService';

const initialState = {
  totalTonnage: 0,
  perPieceTotalTonnage: 0,
  perimeterTonnage: 0,
  holesTonnage: 0,
  bendTonnage: 0,
  formTonnage: 0,
  drawTonnage: 0,
  reverseTonnage: 0,
  perPieceReverseTonnage: 0,
  batchQuantity: 1,
  materialProperties: {},
  temperatureEffects: {},
  surfaceFinishData: {},
  springbackData: {},
  processRecommendations: [],
  toolWearData: {},
  operations: {
    holes: [],
    bends: [],
    forms: [],
    draws: []
  },
  calculationComplete: false,
  dependencies: {
    perimeter: false,
    holes: false,
    bends: false,
    forms: false,
    draws: false
  }
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    calculateTonnage: (state, action) => {
      // This is a placeholder - the actual calculation is done in middleware
      state.calculationComplete = true;
    },
    
    setResults: (state, action) => {
      return {
        ...state,
        ...action.payload,
        calculationComplete: true
      };
    },
    
    setMaterialProperties: (state, action) => {
      state.materialProperties = action.payload;
    },
    
    setTemperatureEffects: (state, action) => {
      state.temperatureEffects = action.payload;
    },
    
    setSurfaceFinishData: (state, action) => {
      state.surfaceFinishData = action.payload;
    },
    
    setSpringbackData: (state, action) => {
      state.springbackData = action.payload;
    },
    
    setProcessRecommendations: (state, action) => {
      state.processRecommendations = action.payload;
    },
    
    setToolWearData: (state, action) => {
      state.toolWearData = action.payload;
    },
    
    resetResults: () => initialState
  }
});

// Middleware thunk to handle the actual calculations
export const calculateTonnageThunk = () => (dispatch, getState) => {
  const state = getState();
  
  // Use the shared calculation service
  const results = performCalculations(state);
  
  if (results) {
    // Dispatch all results at once
    dispatch(setResults(results));
  } else {
    dispatch(resetResults());
  }
};

export const { 
  calculateTonnage, 
  setResults, 
  setMaterialProperties, 
  setTemperatureEffects, 
  setSurfaceFinishData,
  setSpringbackData,
  setProcessRecommendations,
  setToolWearData,
  resetResults 
} = resultsSlice.actions;
export default resultsSlice.reducer; 