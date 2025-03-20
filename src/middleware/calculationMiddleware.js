import { createAction } from '@reduxjs/toolkit';
import { performCalculations, performSelectiveCalculation } from '../services/SharedCalculationService';
import { setResults, setMaterialProperties, setTemperatureEffects, setSurfaceFinishData, setSpringbackData, setProcessRecommendations, setToolWearData } from '../store/resultsSlice';

const calculationMiddleware = store => next => action => {
  // First, pass the action to the next middleware or reducer
  const result = next(action);
  
  // Check if we need to recalculate tonnage
  const shouldCalculate = [
    'materials/setSelectedMaterial',
    'parameters/setThickness',
    'parameters/setTemperature',
    'parameters/setBatchQuantity',
    'parameters/toggleUnits',
    'operations/toggleOperationType',
    'operations/setPerimeterLength',
    'operations/addHole',
    'operations/updateHole',
    'operations/removeHole',
    'operations/addBend',
    'operations/updateBend',
    'operations/removeBend',
    'operations/addForm',
    'operations/updateForm',
    'operations/removeForm',
    'operations/addDraw',
    'operations/updateDraw',
    'operations/removeDraw'
  ].includes(action.type);
  
  if (shouldCalculate) {
    const state = store.getState();
    
    // Determine what changed to enable selective recalculation
    let changedOperation = null;
    
    if (action.type === 'materials/setSelectedMaterial') {
      changedOperation = 'material';
    } else if (action.type === 'parameters/setThickness') {
      changedOperation = 'thickness';
    } else if (action.type === 'parameters/setTemperature') {
      changedOperation = 'temperature';
    } else if (action.type.includes('perimeter')) {
      changedOperation = 'perimeter';
    } else if (action.type.includes('hole')) {
      changedOperation = 'holes';
    } else if (action.type.includes('bend')) {
      changedOperation = 'bends';
    } else if (action.type.includes('form')) {
      changedOperation = 'forms';
    } else if (action.type.includes('draw')) {
      changedOperation = 'draws';
    }
    
    // Get previous results for selective recalculation
    const previousResults = state.results;
    
    // Perform selective calculation if possible, otherwise do full calculation
    const calculations = performSelectiveCalculation(state, previousResults, changedOperation);
    
    // If calculations are null, it means we don't have the necessary data to calculate
    if (!calculations) {
      return result;
    }
    
    // Dispatch main results
    store.dispatch(setResults({
      perPieceTotalTonnage: calculations.perPieceTotalTonnage,
      perPieceReverseTonnage: calculations.perPieceReverseTonnage,
      totalTonnage: calculations.totalTonnage,
      perimeterTonnage: calculations.perimeterTonnage,
      holesTonnage: calculations.holesTonnage,
      bendTonnage: calculations.bendTonnage,
      formTonnage: calculations.formTonnage,
      drawTonnage: calculations.drawTonnage,
      reverseTonnage: calculations.reverseTonnage,
      batchQuantity: calculations.batchQuantity,
      operations: calculations.operations
    }));
    
    // Set material properties
    store.dispatch(setMaterialProperties(calculations.materialProperties));
    
    // Set temperature effects
    store.dispatch(setTemperatureEffects(calculations.temperatureEffects));
    
    // Set surface finish data if available
    if (calculations.surfaceFinishData) {
      store.dispatch(setSurfaceFinishData(calculations.surfaceFinishData));
    }
    
    // Set springback data if available
    if (calculations.springbackData) {
      store.dispatch(setSpringbackData(calculations.springbackData));
    }
    
    // Set process recommendations if available
    if (calculations.processRecommendations) {
      store.dispatch(setProcessRecommendations(calculations.processRecommendations));
    }
    
    // Set tool wear data if available
    if (calculations.toolWearData) {
      store.dispatch(setToolWearData(calculations.toolWearData));
    }
  }
  
  return result;
};

export default calculationMiddleware; 