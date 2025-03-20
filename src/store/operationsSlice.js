import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  perimeter: {
    enabled: false,
    length: 0
  },
  holes: {
    enabled: false,
    items: []
  },
  bends: {
    enabled: false,
    items: []
  },
  forms: {
    enabled: false,
    items: []
  },
  draws: {
    enabled: false,
    items: []
  }
};

const operationsSlice = createSlice({
  name: 'operations',
  initialState,
  reducers: {
    toggleOperationType: (state, action) => {
      const operationType = action.payload;
      state[operationType].enabled = !state[operationType].enabled;
    },
    
    setPerimeterLength: (state, action) => {
      state.perimeter.length = action.payload;
    },
    
    addHole: (state, action) => {
      state.holes.items.push({
        id: uuidv4(),
        diameter: action.payload?.diameter || 10,
        quantity: action.payload?.quantity || 1,
        shape: action.payload?.shape || 'circular'
      });
    },
    
    updateHole: (state, action) => {
      const { id, ...updates } = action.payload;
      const holeIndex = state.holes.items.findIndex(item => item.id === id);
      if (holeIndex !== -1) {
        state.holes.items[holeIndex] = {
          ...state.holes.items[holeIndex],
          ...updates
        };
      }
    },
    
    removeHole: (state, action) => {
      state.holes.items = state.holes.items.filter(item => item.id !== action.payload);
    },
    
    addBend: (state, action) => {
      state.bends.items.push({
        id: uuidv4(),
        length: action.payload?.length || 100,
        angle: action.payload?.angle || 90,
        radiusToThickness: action.payload?.radiusToThickness || 1,
        type: action.payload?.type || 'v-bend'
      });
    },
    
    updateBend: (state, action) => {
      const { id, ...updates } = action.payload;
      const bendIndex = state.bends.items.findIndex(item => item.id === id);
      if (bendIndex !== -1) {
        state.bends.items[bendIndex] = {
          ...state.bends.items[bendIndex],
          ...updates
        };
      }
    },
    
    removeBend: (state, action) => {
      state.bends.items = state.bends.items.filter(item => item.id !== action.payload);
    },
    
    addForm: (state, action) => {
      state.forms.items.push({
        id: uuidv4(),
        type: action.payload?.type || 'emboss',
        diameter: action.payload?.diameter || 20,
        depth: action.payload?.depth || 2,
        quantity: action.payload?.quantity || 1
      });
    },
    
    updateForm: (state, action) => {
      const { id, ...updates } = action.payload;
      const formIndex = state.forms.items.findIndex(item => item.id === id);
      if (formIndex !== -1) {
        state.forms.items[formIndex] = {
          ...state.forms.items[formIndex],
          ...updates
        };
      }
    },
    
    removeForm: (state, action) => {
      state.forms.items = state.forms.items.filter(item => item.id !== action.payload);
    },
    
    addDraw: (state, action) => {
      state.draws.items.push({
        id: uuidv4(),
        type: action.payload?.type || 'round',
        diameter: action.payload?.diameter || 50,
        depth: action.payload?.depth || 20,
        cornerRadius: action.payload?.cornerRadius || 5,
        quantity: action.payload?.quantity || 1
      });
    },
    
    updateDraw: (state, action) => {
      const { id, ...updates } = action.payload;
      const drawIndex = state.draws.items.findIndex(item => item.id === id);
      if (drawIndex !== -1) {
        state.draws.items[drawIndex] = {
          ...state.draws.items[drawIndex],
          ...updates
        };
      }
    },
    
    removeDraw: (state, action) => {
      state.draws.items = state.draws.items.filter(item => item.id !== action.payload);
    },
    
    resetOperations: () => initialState
  }
});

export const {
  toggleOperationType,
  setPerimeterLength,
  addHole,
  updateHole,
  removeHole,
  addBend,
  updateBend,
  removeBend,
  addForm,
  updateForm,
  removeForm,
  addDraw,
  updateDraw,
  removeDraw,
  resetOperations
} = operationsSlice.actions;

export default operationsSlice.reducer; 