import { createSlice } from '@reduxjs/toolkit';
import { metricToUsTons, usToMetricTons } from '../services/UnitConversionService';

const initialState = {
  thickness: 1.0,
  temperature: 20,
  batchQuantity: 1,
  isMetric: true
};

const parametersSlice = createSlice({
  name: 'parameters',
  initialState,
  reducers: {
    setThickness: (state, action) => {
      state.thickness = action.payload;
    },
    setTemperature: (state, action) => {
      state.temperature = action.payload;
    },
    setBatchQuantity: (state, action) => {
      state.batchQuantity = action.payload;
    },
    toggleUnits: (state) => {
      // Toggle metric flag
      state.isMetric = !state.isMetric;
      
      // Convert thickness between metric and imperial
      if (state.isMetric) {
        // Convert from inches to millimeters
        state.thickness = Math.round(state.thickness * 25.4 * 100) / 100;
      } else {
        // Convert from millimeters to inches
        state.thickness = Math.round(state.thickness / 25.4 * 1000) / 1000;
      }
      
      // Convert temperature between Celsius and Fahrenheit
      if (state.isMetric) {
        // Convert from Fahrenheit to Celsius
        state.temperature = Math.round((state.temperature - 32) * 5 / 9);
      } else {
        // Convert from Celsius to Fahrenheit
        state.temperature = Math.round(state.temperature * 9 / 5 + 32);
      }
      
      // NOTE: We do not convert tonnage values here
      // All tonnage values are stored as metric tons in the state
      // The display components will handle conversion to US tons when needed
    },
    resetParameters: () => initialState
  }
});

export const { 
  setThickness, 
  setTemperature, 
  setBatchQuantity, 
  toggleUnits, 
  resetParameters 
} = parametersSlice.actions;

export default parametersSlice.reducer; 