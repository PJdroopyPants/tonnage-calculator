import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch materials
export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async () => {
    // Use the full repository path for GitHub Pages
    const basePath = window.location.hostname === 'pjdroopypants.github.io' ? '/tonnage-calculator' : '';
    const response = await fetch(`${basePath}/data/materials.JSON`);
    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }
    const data = await response.json();
    
    // Transform the data from the comprehensive JSON structure to our app format
    const transformedData = Object.entries(data).map(([id, material]) => ({
      id,
      name: material.name,
      category: material.category,
      tensileStrength: material.properties.room.tensileStrength,
      shearStrength: material.properties.room.shearStrength,
      yieldStrength: material.properties.room.yieldStrength,
      reverseTonnageFactor: material.properties.room.reverseFactor || 0.7,
      temperatureCoefficient: 0.0002,
      properties: material.properties,
      formingCharacteristics: material.formingCharacteristics || {}
    }));
    
    return transformedData;
  }
);

const initialState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
  temperatureRange: 'room'
};

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    setSelectedMaterial: (state, action) => {
      // Store the selected material
      if (action.payload) {
        // Create a new copy rather than modifying the original
        const material = JSON.parse(JSON.stringify(action.payload));
        
        // Update the material's properties based on the temperature range
        const tempRange = state.temperatureRange || 'room';
        
        if (material.properties && material.properties[tempRange]) {
          material.tensileStrength = material.properties[tempRange].tensileStrength;
          material.shearStrength = material.properties[tempRange].shearStrength;
          material.yieldStrength = material.properties[tempRange].yieldStrength;
          material.reverseTonnageFactor = material.properties[tempRange].reverseFactor || 0.7;
        }
        
        state.selected = material;
      } else {
        state.selected = null;
      }
    },
    
    setTemperatureRange: (state, action) => {
      state.temperatureRange = action.payload;
      
      // Update the selected material's properties based on the temperature range
      if (state.selected) {
        const tempRange = action.payload || 'room';
        
        // Instead of modifying directly, create a new copy
        const material = JSON.parse(JSON.stringify(state.selected));
        
        if (material.properties && material.properties[tempRange]) {
          material.tensileStrength = material.properties[tempRange].tensileStrength;
          material.shearStrength = material.properties[tempRange].shearStrength;
          material.yieldStrength = material.properties[tempRange].yieldStrength;
          material.reverseTonnageFactor = material.properties[tempRange].reverseFactor || 0.7;
        }
        
        state.selected = material;
      }
    },
    
    addMaterial: (state, action) => {
      state.items.push(action.payload);
    },
    
    updateMaterial: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    
    deleteMaterial: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selected && state.selected.id === action.payload) {
        state.selected = null;
      }
    },
    
    resetMaterials: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch materials';
      });
  }
});

export const {
  setSelectedMaterial,
  setTemperatureRange,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  resetMaterials
} = materialsSlice.actions;

export default materialsSlice.reducer; 