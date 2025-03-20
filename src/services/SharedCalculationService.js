import { temperatureAdjustment } from './TemperatureService';
import { calculatePerimeterTonnage, calculateHoleTonnage, calculateBendTonnage, calculateFormTonnage, calculateDrawTonnage, calculateReverseTonnage } from './CalculationService';
import { convertUnits } from './UnitConversionService';
import { calculateSurfaceFinish } from './SurfaceFinishService';
import { calculateSpringbackAngle, calculateCompensationAngle, getSpringbackSuggestions } from './SpringbackService';
import { generateProcessRecommendations } from './ProcessRecommendationsService';
import { calculateToolWear } from './ToolWearService';

/**
 * Shared calculation logic for both middleware and thunks
 * @param {Object} state - The current Redux state
 * @returns {Object} - Calculation results
 */
export const performCalculations = (state) => {
  const { materials, parameters, operations } = state;
  
  // Only calculate if we have a selected material and valid thickness
  if (!materials.selected || parameters.thickness <= 0) {
    return null;
  }
  
  // Get selected material
  const material = materials.selected;
  
  // Determine temperature range
  const temperatureRange = 
    parameters.temperature <= 100 ? 'room' : 
    parameters.temperature <= 300 ? 'warm' : 'hot';
  
  // Get material properties for the current temperature range
  const materialProps = material.properties ? 
    material.properties[temperatureRange] : 
    {
      tensileStrength: material.tensileStrength,
      shearStrength: material.shearStrength,
      yieldStrength: material.yieldStrength
    };
  
  // Calculate temperature effects
  const tempFactor = temperatureAdjustment(
    parameters.temperature, 
    parameters.isMetric, 
    material.temperatureCoefficient
  );
  
  // Initialize results with explicit unit naming
  let perimeterTonnageMetric = 0;
  let holesTonnageMetric = 0;
  let bendTonnageMetric = 0;
  let formTonnageMetric = 0;
  let drawTonnageMetric = 0;
  
  // Operation-specific results for detailed tracking
  const holeResults = [];
  const bendResults = [];
  const formResults = [];
  const drawResults = [];
  
  // Initialize springback data
  let springbackInfo = null;
  
  // Convert thickness to metric if needed for calculations
  const thicknessInMm = parameters.isMetric 
    ? parameters.thickness 
    : convertUnits(parameters.thickness, 'in', 'mm');
  
  // Calculate perimeter cutting tonnage
  if (operations.perimeter.enabled) {
    const perimeterLengthMm = parameters.isMetric 
      ? operations.perimeter.length 
      : convertUnits(operations.perimeter.length, 'in', 'mm');
      
    perimeterTonnageMetric = calculatePerimeterTonnage(
      perimeterLengthMm,
      thicknessInMm,
      material.tensileStrength,
      tempFactor
    );
  }
  
  // Calculate hole punching tonnage
  if (operations.holes.enabled && operations.holes.items.length > 0) {
    holesTonnageMetric = operations.holes.items.reduce((total, hole) => {
      const diameterMm = parameters.isMetric 
        ? hole.diameter 
        : convertUnits(hole.diameter, 'in', 'mm');
        
      const holeTonnage = calculateHoleTonnage(
        diameterMm,
        thicknessInMm,
        material.tensileStrength,
        tempFactor,
        hole.shape,
        hole.quantity
      );
      
      holeResults.push({
        ...hole,
        tonnage: holeTonnage
      });
      
      return total + holeTonnage;
    }, 0);
  }
  
  // Calculate bending tonnage
  if (operations.bends.enabled && operations.bends.items.length > 0) {
    // Process each bend item
    bendTonnageMetric = operations.bends.items.reduce((total, bend) => {
      const bendLengthMm = parameters.isMetric 
        ? bend.length 
        : convertUnits(bend.length, 'in', 'mm');
        
      const bendTonnage = calculateBendTonnage(
        bendLengthMm,
        thicknessInMm,
        material.tensileStrength,
        tempFactor,
        bend.angle,
        bend.radiusToThickness,
        bend.type
      );
      
      bendResults.push({
        ...bend,
        tonnage: bendTonnage
      });
      
      return total + bendTonnage;
    }, 0);
    
    // Get the first bend item for springback calculations
    if (operations.bends.items.length > 0) {
      const firstBend = operations.bends.items[0];
      
      // Calculate bend radius in mm from radius-to-thickness ratio
      const bendRadiusInMm = firstBend.radiusToThickness * thicknessInMm;
      
      // Calculate springback using proper service functions
      const springbackAngle = calculateSpringbackAngle(
        firstBend.angle,
        thicknessInMm,
        bendRadiusInMm,
        material
      );
      
      const compensationAngle = calculateCompensationAngle(
        firstBend.angle,
        thicknessInMm,
        bendRadiusInMm,
        material
      );
      
      const recommendations = getSpringbackSuggestions(material);
      
      springbackInfo = {
        angle: springbackAngle,
        compensationAngle,
        materialFactor: material.springbackFactor || 1.0,
        thicknessFactor: (parameters.thickness > 3) ? 1.2 : 1.0,
        radiusFactor: firstBend.radiusToThickness,
        kFactor: 0.33 + (material.springbackFactor || 0.1),
        recommendations
      };
    }
  }
  
  // Calculate form features tonnage
  if (operations.forms.enabled && operations.forms.items.length > 0) {
    formTonnageMetric = operations.forms.items.reduce((total, form) => {
      // FIX: When converting from imperial, we need to be careful about the 
      // double conversion issue in form/draw operations that use area calculations
      let formDiameterMm, formDepthMm;
      
      if (parameters.isMetric) {
        formDiameterMm = form.diameter;
        formDepthMm = form.depth;
      } else {
        // When converting from imperial, convert directly to avoid double conversion
        formDiameterMm = convertUnits(form.diameter, 'in', 'mm');
        formDepthMm = convertUnits(form.depth, 'in', 'mm');
      }
        
      const formTonnage = calculateFormTonnage(
        formDiameterMm,
        formDepthMm,
        thicknessInMm,
        material.tensileStrength,
        tempFactor,
        form.type,
        form.quantity,
        materialProps
      );
      
      formResults.push({
        ...form,
        tonnage: formTonnage
      });
      
      return total + formTonnage;
    }, 0);
  }
  
  // Calculate drawing tonnage
  if (operations.draws.enabled && operations.draws.items.length > 0) {
    drawTonnageMetric = operations.draws.items.reduce((total, draw) => {
      // FIX: When converting from imperial, we need to be careful about the 
      // double conversion issue in form/draw operations that use area calculations
      let drawDiameterMm, drawDepthMm;
      
      if (parameters.isMetric) {
        drawDiameterMm = draw.diameter;
        drawDepthMm = draw.depth;
      } else {
        // When converting from imperial, convert directly to avoid double conversion
        drawDiameterMm = convertUnits(draw.diameter, 'in', 'mm');
        drawDepthMm = convertUnits(draw.depth, 'in', 'mm');
      }
        
      const drawTonnage = calculateDrawTonnage(
        drawDiameterMm,
        drawDepthMm,
        thicknessInMm,
        material.tensileStrength,
        tempFactor,
        draw.type,
        draw.quantity,
        materialProps
      );
      
      drawResults.push({
        ...draw,
        tonnage: drawTonnage
      });
      
      return total + drawTonnage;
    }, 0);
  }
  
  // Calculate per-piece tonnage
  // All tonnage values are calculated and stored in metric tons
  const perPieceTotalTonnageMetric = perimeterTonnageMetric + holesTonnageMetric + bendTonnageMetric + formTonnageMetric + drawTonnageMetric;
  const perPieceReverseTonnageMetric = calculateReverseTonnage(perPieceTotalTonnageMetric, materialProps);
  
  // Apply batch quantity multiplier
  const batchQuantity = parameters.batchQuantity || 1;
  const totalTonnageMetric = perPieceTotalTonnageMetric * batchQuantity;
  const reverseTonnageMetric = perPieceReverseTonnageMetric * batchQuantity;
  
  // Surface finish calculations for forming and drawing operations
  let surfaceFinishData = null;
  if (operations.forms.enabled || operations.draws.enabled) {
    surfaceFinishData = calculateSurfaceFinish(
      material,
      { ...parameters, formingSpeed: 'medium', toolCondition: 'good' },
      { type: 'none' }
    );
  }
  
  // Process recommendations
  let processRecommendations = null;
  if (operations.perimeter.enabled || operations.holes.enabled || 
      operations.bends.enabled || operations.forms.enabled || operations.draws.enabled) {
    processRecommendations = generateProcessRecommendations(
      material,
      parameters,
      operations
    );
  }
  
  // Tool wear calculations
  let toolWearData = null;
  if (operations.perimeter.enabled || operations.holes.enabled || 
      operations.bends.enabled || operations.forms.enabled || operations.draws.enabled) {
    
    // General tool wear for all operations
    const generalToolWear = calculateToolWear(
      material,
      'general',
      'D2',
      100
    );
    
    // Operation-specific tool wear calculations
    const operationData = [];
    
    if (operations.perimeter.enabled) {
      operationData.push({
        name: 'Perimeter Cutting',
        ...calculateToolWear(material, 'perimeter', 'D2', 100)
      });
    }
    
    if (operations.holes.enabled) {
      operationData.push({
        name: 'Hole Punching',
        ...calculateToolWear(material, 'hole', 'D2', 100)
      });
    }
    
    if (operations.bends.enabled) {
      operationData.push({
        name: 'Bending',
        ...calculateToolWear(material, 'bend', 'D2', 100)
      });
    }
    
    if (operations.forms.enabled) {
      operationData.push({
        name: 'Form Features',
        ...calculateToolWear(material, 'form', 'D2', 100)
      });
    }
    
    if (operations.draws.enabled) {
      operationData.push({
        name: 'Drawing',
        ...calculateToolWear(material, 'draw', 'D2', 100)
      });
    }
    
    toolWearData = {
      generalInfo: generalToolWear,
      operationData: operationData,
      recommendations: [
        "Regular tool maintenance is recommended to extend tool life",
        "Consider using hardened tool steel for abrasive materials",
        "Monitor tool wear patterns for early detection of issues"
      ]
    };
  }
  
  // Return the complete results object
  return {
    // Tonnage values (all in metric tons)
    perPieceTotalTonnage: perPieceTotalTonnageMetric,
    perPieceReverseTonnage: perPieceReverseTonnageMetric,
    totalTonnage: totalTonnageMetric,
    perimeterTonnage: perimeterTonnageMetric * batchQuantity,
    holesTonnage: holesTonnageMetric * batchQuantity,
    bendTonnage: bendTonnageMetric * batchQuantity,
    formTonnage: formTonnageMetric * batchQuantity,
    drawTonnage: drawTonnageMetric * batchQuantity,
    reverseTonnage: reverseTonnageMetric,
    batchQuantity,
    
    // Material and temperature data
    materialProperties: materialProps,
    temperatureEffects: {
      factor: tempFactor,
      temperature: parameters.temperature,
      isMetric: parameters.isMetric
    },
    
    // Detailed operation results
    operations: {
      perimeter: operations.perimeter,
      holes: holeResults,
      bends: bendResults,
      forms: formResults,
      draws: drawResults
    },
    
    // Additional data
    surfaceFinishData,
    processRecommendations,
    toolWearData,
    springbackData: springbackInfo || null,
    
    // Operation dependencies map for selective recalculation
    dependencies: {
      perimeter: operations.perimeter.enabled,
      holes: operations.holes.enabled,
      bends: operations.bends.enabled,
      forms: operations.forms.enabled,
      draws: operations.draws.enabled
    },
    
    calculationComplete: true
  };
};

/**
 * Performs selective recalculation only for affected operations
 * @param {Object} state - The current Redux state
 * @param {Object} previousResults - Previous calculation results
 * @param {String} changedOperation - The operation type that changed
 * @returns {Object} - Updated calculation results
 */
export const performSelectiveCalculation = (state, previousResults, changedOperation) => {
  // If no previous results or critical parameters changed, perform full calculation
  if (!previousResults || changedOperation === 'material' || 
      changedOperation === 'thickness' || changedOperation === 'temperature') {
    return performCalculations(state);
  }
  
  // Start with a copy of the previous results
  const results = { ...previousResults };
  
  // Get state components
  const { materials, parameters, operations } = state;
  const material = materials.selected;
  
  // If the material is not selected or thickness is invalid, return null
  if (!material || parameters.thickness <= 0) {
    return null;
  }
  
  // Temperature and material properties are needed for all calculations
  const temperatureRange = 
    parameters.temperature <= 100 ? 'room' : 
    parameters.temperature <= 300 ? 'warm' : 'hot';
  
  const materialProps = material.properties ? 
    material.properties[temperatureRange] : 
    {
      tensileStrength: material.tensileStrength,
      shearStrength: material.shearStrength,
      yieldStrength: material.yieldStrength
    };
  
  const tempFactor = temperatureAdjustment(
    parameters.temperature, 
    parameters.isMetric, 
    material.temperatureCoefficient
  );
  
  // Convert thickness for calculations
  const thicknessInMm = parameters.isMetric 
    ? parameters.thickness 
    : convertUnits(parameters.thickness, 'in', 'mm');
  
  // Update batch quantity
  const batchQuantity = parameters.batchQuantity || 1;
  
  // Determine which operations need to be recalculated
  const recalculatePerimeter = changedOperation === 'perimeter' || !results.dependencies.perimeter;
  const recalculateHoles = changedOperation === 'holes' || !results.dependencies.holes;
  const recalculateBends = changedOperation === 'bends' || !results.dependencies.bends;
  const recalculateForms = changedOperation === 'forms' || !results.dependencies.forms;
  const recalculateDraws = changedOperation === 'draws' || !results.dependencies.draws;
  
  // Variables to track changes
  let perimeterTonnageMetric = results.perimeterTonnage / batchQuantity;
  let holesTonnageMetric = results.holesTonnage / batchQuantity;
  let bendTonnageMetric = results.bendTonnage / batchQuantity;
  let formTonnageMetric = results.formTonnage / batchQuantity;
  let drawTonnageMetric = results.drawTonnage / batchQuantity;
  
  // Operation-specific results
  let holeResults = [...(results.operations?.holes || [])];
  let bendResults = [...(results.operations?.bends || [])];
  let formResults = [...(results.operations?.forms || [])];
  let drawResults = [...(results.operations?.draws || [])];
  
  // Selectively recalculate operations
  if (recalculatePerimeter && operations.perimeter.enabled) {
    const perimeterLengthMm = parameters.isMetric 
      ? operations.perimeter.length 
      : convertUnits(operations.perimeter.length, 'in', 'mm');
      
    perimeterTonnageMetric = calculatePerimeterTonnage(
      perimeterLengthMm,
      thicknessInMm,
      material.tensileStrength,
      tempFactor
    );
  } else if (!operations.perimeter.enabled) {
    perimeterTonnageMetric = 0;
  }
  
  // Recalculate holes if needed
  if (recalculateHoles && operations.holes.enabled && operations.holes.items.length > 0) {
    holesTonnageMetric = 0;
    holeResults = [];
    
    operations.holes.items.forEach(hole => {
      const diameterMm = parameters.isMetric 
        ? hole.diameter 
        : convertUnits(hole.diameter, 'in', 'mm');
        
      const holeTonnage = calculateHoleTonnage(
        diameterMm,
        thicknessInMm,
        material.tensileStrength,
        tempFactor,
        hole.shape,
        hole.quantity
      );
      
      holeResults.push({
        ...hole,
        tonnage: holeTonnage
      });
      
      holesTonnageMetric += holeTonnage;
    });
  } else if (!operations.holes.enabled) {
    holesTonnageMetric = 0;
    holeResults = [];
  }
  
  // Recalculate bends if needed
  if (recalculateBends && operations.bends.enabled && operations.bends.items.length > 0) {
    bendTonnageMetric = 0;
    bendResults = [];
    
    operations.bends.items.forEach(bend => {
      const bendLengthMm = parameters.isMetric 
        ? bend.length 
        : convertUnits(bend.length, 'in', 'mm');
        
      const bendTonnage = calculateBendTonnage(
        bendLengthMm,
        thicknessInMm,
        material.tensileStrength,
        tempFactor,
        bend.angle,
        bend.radiusToThickness,
        bend.type
      );
      
      bendResults.push({
        ...bend,
        tonnage: bendTonnage
      });
      
      bendTonnageMetric += bendTonnage;
    });
  } else if (!operations.bends.enabled) {
    bendTonnageMetric = 0;
    bendResults = [];
  }
  
  // Recalculate forms if needed
  if (recalculateForms && operations.forms.enabled && operations.forms.items.length > 0) {
    formTonnageMetric = 0;
    formResults = [];
    
    operations.forms.items.forEach(form => {
      // FIX: When converting from imperial, we need to be careful about the 
      // double conversion issue in form/draw operations that use area calculations
      let formDiameterMm, formDepthMm;
      
      if (parameters.isMetric) {
        formDiameterMm = form.diameter;
        formDepthMm = form.depth;
      } else {
        // When converting from imperial, convert directly to avoid double conversion
        formDiameterMm = convertUnits(form.diameter, 'in', 'mm');
        formDepthMm = convertUnits(form.depth, 'in', 'mm');
      }
        
      const formTonnage = calculateFormTonnage(
        formDiameterMm,
        formDepthMm,
        thicknessInMm,
        material.tensileStrength,
        tempFactor,
        form.type,
        form.quantity,
        materialProps
      );
      
      formResults.push({
        ...form,
        tonnage: formTonnage
      });
      
      formTonnageMetric += formTonnage;
    });
  } else if (!operations.forms.enabled) {
    formTonnageMetric = 0;
    formResults = [];
  }
  
  // Recalculate draws if needed
  if (recalculateDraws && operations.draws.enabled && operations.draws.items.length > 0) {
    drawTonnageMetric = 0;
    drawResults = [];
    
    operations.draws.items.forEach(draw => {
      // FIX: When converting from imperial, we need to be careful about the 
      // double conversion issue in form/draw operations that use area calculations
      let drawDiameterMm, drawDepthMm;
      
      if (parameters.isMetric) {
        drawDiameterMm = draw.diameter;
        drawDepthMm = draw.depth;
      } else {
        // When converting from imperial, convert directly to avoid double conversion
        drawDiameterMm = convertUnits(draw.diameter, 'in', 'mm');
        drawDepthMm = convertUnits(draw.depth, 'in', 'mm');
      }
          
      const drawTonnage = calculateDrawTonnage(
        drawDiameterMm,
        drawDepthMm,
        thicknessInMm,
        material.tensileStrength,
        tempFactor,
        draw.type,
        draw.quantity,
        materialProps
      );
      
      drawResults.push({
        ...draw,
        tonnage: drawTonnage
      });
      
      drawTonnageMetric += drawTonnage;
    });
  } else if (!operations.draws.enabled) {
    drawTonnageMetric = 0;
    drawResults = [];
  }
  
  // Calculate updated total tonnage
  const perPieceTotalTonnageMetric = perimeterTonnageMetric + holesTonnageMetric + bendTonnageMetric + formTonnageMetric + drawTonnageMetric;
  const perPieceReverseTonnageMetric = calculateReverseTonnage(perPieceTotalTonnageMetric, materialProps);
  const totalTonnageMetric = perPieceTotalTonnageMetric * batchQuantity;
  const reverseTonnageMetric = perPieceReverseTonnageMetric * batchQuantity;
  
  // Update results object
  results.perPieceTotalTonnage = perPieceTotalTonnageMetric;
  results.perPieceReverseTonnage = perPieceReverseTonnageMetric;
  results.totalTonnage = totalTonnageMetric;
  results.perimeterTonnage = perimeterTonnageMetric * batchQuantity;
  results.holesTonnage = holesTonnageMetric * batchQuantity;
  results.bendTonnage = bendTonnageMetric * batchQuantity;
  results.formTonnage = formTonnageMetric * batchQuantity;
  results.drawTonnage = drawTonnageMetric * batchQuantity;
  results.reverseTonnage = reverseTonnageMetric;
  results.batchQuantity = batchQuantity;
  
  // Update operations results
  results.operations = {
    perimeter: operations.perimeter,
    holes: holeResults,
    bends: bendResults,
    forms: formResults,
    draws: drawResults
  };
  
  // Update dependencies map
  results.dependencies = {
    perimeter: operations.perimeter.enabled,
    holes: operations.holes.enabled,
    bends: operations.bends.enabled,
    forms: operations.forms.enabled,
    draws: operations.draws.enabled
  };
  
  return results;
}; 