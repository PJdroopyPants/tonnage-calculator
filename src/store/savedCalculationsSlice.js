import { createSlice, createAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Create a batched action for loading calculations
export const batchLoadCalculation = createAction('savedCalculations/batchLoadCalculation');

const initialState = {
  calculations: []
};

const savedCalculationsSlice = createSlice({
  name: 'savedCalculations',
  initialState,
  reducers: {
    saveCalculation: (state, action) => {
      const calculation = {
        id: uuidv4(),
        name: action.payload.name || `Calculation ${state.calculations.length + 1}`,
        timestamp: new Date().toISOString(),
        parameters: action.payload.parameters,
        material: action.payload.material,
        operations: action.payload.operations,
        results: action.payload.results
      };
      
      state.calculations.push(calculation);
    },
    
    updateCalculation: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.calculations.findIndex(calc => calc.id === id);
      
      if (index !== -1) {
        state.calculations[index] = {
          ...state.calculations[index],
          ...updates,
          timestamp: new Date().toISOString() // Update timestamp
        };
      }
    },
    
    deleteCalculation: (state, action) => {
      state.calculations = state.calculations.filter(calc => calc.id !== action.payload);
    },
    
    loadCalculation: (state, action) => {
      // This is handled by middleware that will set the app state
    },
    
    clearAllCalculations: (state) => {
      state.calculations = [];
    }
  }
});

// Middleware thunk to load a saved calculation into the current state
export const loadCalculationThunk = (id) => (dispatch, getState) => {
  const state = getState();
  const calculation = state.savedCalculations.calculations.find(calc => calc.id === id);
  
  if (calculation) {
    // Prepare a batch of actions to dispatch at once
    const actions = [];
    
    // Material action
    actions.push({ type: 'materials/selectMaterial', payload: calculation.material.id });
    
    // Parameters actions
    actions.push({ type: 'parameters/setThickness', payload: calculation.parameters.thickness });
    actions.push({ type: 'parameters/setTemperature', payload: calculation.parameters.temperature });
    actions.push({ type: 'parameters/setQuantity', payload: calculation.parameters.quantity });
    
    if (calculation.parameters.isMetric !== state.parameters.isMetric) {
      actions.push({ type: 'parameters/toggleUnits' });
    }
    
    // Reset operations
    actions.push({ type: 'operations/resetOperations' });
    
    // Load operations
    const { operations } = calculation;
    
    // Perimeter
    if (operations.perimeter?.enabled) {
      actions.push({ type: 'operations/toggleOperationType', payload: 'perimeter' });
      actions.push({ type: 'operations/setPerimeterLength', payload: operations.perimeter.length });
    }
    
    // Holes
    if (operations.holes?.enabled && operations.holes.items.length > 0) {
      actions.push({ type: 'operations/toggleOperationType', payload: 'holes' });
      
      // Add all holes in a single operation array
      const holeActions = operations.holes.items.map(hole => 
        ({ type: 'operations/addHole', payload: hole })
      );
      actions.push(...holeActions);
    }
    
    // Bends
    if (operations.bends?.enabled && operations.bends.items.length > 0) {
      actions.push({ type: 'operations/toggleOperationType', payload: 'bends' });
      
      // Add all bends in a single operation array
      const bendActions = operations.bends.items.map(bend => 
        ({ type: 'operations/addBend', payload: bend })
      );
      actions.push(...bendActions);
    }
    
    // Forms
    if (operations.forms?.enabled && operations.forms.items.length > 0) {
      actions.push({ type: 'operations/toggleOperationType', payload: 'forms' });
      
      // Add all forms in a single operation array
      const formActions = operations.forms.items.map(form => 
        ({ type: 'operations/addForm', payload: form })
      );
      actions.push(...formActions);
    }
    
    // Draws
    if (operations.draws?.enabled && operations.draws.items.length > 0) {
      actions.push({ type: 'operations/toggleOperationType', payload: 'draws' });
      
      // Add all draws in a single operation array
      const drawActions = operations.draws.items.map(draw => 
        ({ type: 'operations/addDraw', payload: draw })
      );
      actions.push(...drawActions);
    }
    
    // Trigger a single recalculation
    actions.push({ type: 'results/calculateTonnage' });
    
    // Switch to operations tab
    actions.push({ type: 'ui/setActiveTab', payload: 'operations' });
    
    // Dispatch batch action containing all the individual actions
    dispatch(batchLoadCalculation({ actions }));
  }
};

export const { 
  saveCalculation, 
  updateCalculation, 
  deleteCalculation, 
  loadCalculation, 
  clearAllCalculations 
} = savedCalculationsSlice.actions;

export default savedCalculationsSlice.reducer; 