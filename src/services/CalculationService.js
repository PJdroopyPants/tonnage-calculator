import { adjustPropertiesForTemperature, getTemperatureRangeProperties } from './TemperatureService';
import { getSpringbackSuggestions } from './SpringbackService';

/**
 * Calculates the tonnage required for perimeter cutting.
 * 
 * @param {number} length - The length of the perimeter in mm
 * @param {number} thickness - The material thickness in mm
 * @param {number} tensileStrength - The material tensile strength in MPa
 * @param {number} tempFactor - The temperature adjustment factor
 * @returns {number} - The calculated tonnage
 */
export const calculatePerimeterTonnage = (length, thickness, tensileStrength, tempFactor) => {
  // Formula: (Perimeter Length * Thickness * Tensile Strength * Temperature Factor) / 1000
  const tonnage = (length * thickness * tensileStrength * tempFactor) / 1000;
  return tonnage;
};

/**
 * Calculates the tonnage required for hole punching.
 * 
 * @param {number} diameter - The hole diameter in mm
 * @param {number} thickness - The material thickness in mm
 * @param {number} tensileStrength - The material tensile strength in MPa
 * @param {number} tempFactor - The temperature adjustment factor
 * @param {string} shape - The hole shape (circular, rectangular, etc.)
 * @param {number} quantity - The number of holes
 * @returns {number} - The calculated tonnage
 */
export const calculateHoleTonnage = (diameter, thickness, tensileStrength, tempFactor, shape, quantity) => {
  let perimeter;
  
  if (shape === 'circular') {
    // Perimeter of a circle: π * diameter
    perimeter = Math.PI * diameter;
  } else if (shape === 'rectangular') {
    // For simplicity, assuming width = diameter and height = diameter * 0.8
    const width = diameter;
    const height = diameter * 0.8;
    perimeter = 2 * (width + height);
  } else {
    // Default to circular
    perimeter = Math.PI * diameter;
  }
  
  // Formula: (Perimeter * Thickness * Tensile Strength * Temperature Factor * Quantity) / 1000
  const tonnage = (perimeter * thickness * tensileStrength * tempFactor * quantity) / 1000;
  return tonnage;
};

/**
 * Calculates the tonnage required for bending.
 * 
 * @param {number} length - The bend length in mm
 * @param {number} thickness - The material thickness in mm
 * @param {number} tensileStrength - The material tensile strength in MPa
 * @param {number} tempFactor - The temperature adjustment factor
 * @param {number} angle - The bend angle in degrees
 * @param {number} radiusToThickness - The ratio of bend radius to material thickness
 * @param {string} type - The type of bend (v-bend, etc.)
 * @returns {number} - The calculated tonnage
 */
export const calculateBendTonnage = (length, thickness, tensileStrength, tempFactor, angle, radiusToThickness, type) => {
  // Correction factor based on bend angle
  const angleFactor = angle <= 90 ? 1.0 : 1.0 + (angle - 90) * 0.01;
  
  // Correction factor based on radius to thickness ratio
  const radiusFactor = 0.8 + (0.2 * radiusToThickness);
  
  // Bend type factor
  let typeFactor = 1.0;
  if (type === 'air-bend') {
    typeFactor = 0.8;
  } else if (type === 'bottoming') {
    typeFactor = 1.2;
  }
  
  // Formula: (Length * Thickness^2 * Tensile Strength * Angle Factor * Radius Factor * Type Factor * Temperature Factor) / 1000
  const tonnage = (length * Math.pow(thickness, 2) * tensileStrength * angleFactor * radiusFactor * typeFactor * tempFactor) / 1000;
  return tonnage;
};

/**
 * Calculates the tonnage required for form features.
 * 
 * @param {number} diameter - The form diameter in mm
 * @param {number} depth - The form depth in mm
 * @param {number} thickness - The material thickness in mm
 * @param {number} tensileStrength - The material tensile strength in MPa
 * @param {number} tempFactor - The temperature adjustment factor
 * @param {string} type - The type of form (emboss, dimple, louver, etc.)
 * @param {number} quantity - The number of forms
 * @param {Object} materialProps - Optional material properties
 * @returns {number} - The calculated tonnage
 */
export const calculateFormTonnage = (diameter, depth, thickness, tensileStrength, tempFactor, type, quantity, materialProps) => {
  // Input validation for physical impossibilities
  if (diameter <= 0 || depth <= 0 || thickness <= 0 || tensileStrength <= 0) {
    console.warn('Form calculation received invalid dimensions:', { diameter, depth, thickness, tensileStrength });
    return 0;
  }
  
  // Validate form depth against material limitations
  // Typically, form depth should not exceed 3-4x material thickness for most materials
  const maxSafeDepth = thickness * 4;
  if (depth > maxSafeDepth) {
    console.warn(`Form depth (${depth}mm) exceeds recommended maximum (${maxSafeDepth}mm) for material thickness ${thickness}mm`);
    // We'll still calculate, but with a warning
  }
  
  // Area of the form
  const area = Math.PI * Math.pow(diameter / 2, 2);
  
  // Improved non-linear depth factor calculation
  // As depth increases, the force increases non-linearly due to strain hardening
  const depthToThicknessRatio = depth / thickness;
  const depthFactor = 0.5 + 0.3 * Math.pow(depth / diameter, 1.3) + 0.1 * Math.min(depthToThicknessRatio / 5, 1);
  
  // Enhanced form type factors based on industry standards
  let typeFactor = 1.0; // Default for basic forms
  
  switch (type) {
    case 'emboss':
      // Embosses require more force due to bidirectional material flow
      typeFactor = 1.2 + 0.1 * Math.min(depthToThicknessRatio / 3, 0.3);
      break;
    case 'dimple':
      // Dimples typically require less force than embosses
      typeFactor = 1.0 + 0.05 * Math.min(depthToThicknessRatio / 3, 0.2);
      break; 
    case 'louver':
      // Louvers involve material shearing and bending
      typeFactor = 1.4 + 0.1 * Math.min(depthToThicknessRatio / 2, 0.4);
      break;
    case 'bead':
      // Beads involve stretching along a line
      typeFactor = 1.1 + 0.05 * Math.min(depthToThicknessRatio / 3, 0.3);
      break;
    case 'rib':
      // Ribs involve stretching and bending
      typeFactor = 1.3 + 0.1 * Math.min(depthToThicknessRatio / 2, 0.3);
      break;
    default:
      // Default case for simple forms
      typeFactor = 1.0 + 0.05 * Math.min(depthToThicknessRatio / 4, 0.2);
  }
  
  // Material strain hardening effect
  // Use material-specific strain hardening exponent if available, otherwise approximate based on tensile strength
  const strainHardeningExponent = materialProps?.strainHardeningExponent || 0.2;
  const strainHardeningFactor = 1.0 + (strainHardeningExponent * 0.5);
  
  // Corner radius effect - estimated based on form type
  // Sharper corners require more force
  const cornerFactor = type === 'emboss' || type === 'rib' ? 1.1 : 1.0;
  
  // Formula: (Area * Thickness * Tensile Strength * Depth Factor * Type Factor * Strain Hardening Factor * Corner Factor * Temperature Factor * Quantity) / 1000
  const tonnage = (area * thickness * tensileStrength * depthFactor * typeFactor * strainHardeningFactor * cornerFactor * tempFactor * quantity) / 1000;
  
  return tonnage;
};

/**
 * Calculates the tonnage required for drawing operations.
 * 
 * @param {number} diameter - The draw diameter in mm
 * @param {number} depth - The draw depth in mm
 * @param {number} thickness - The material thickness in mm
 * @param {number} tensileStrength - The material tensile strength in MPa
 * @param {number} tempFactor - The temperature adjustment factor
 * @param {string} type - The type of draw
 * @param {number} quantity - The number of draws
 * @returns {number} - The calculated tonnage
 */
export const calculateDrawTonnage = (diameter, depth, thickness, tensileStrength, tempFactor, type, quantity, materialProps) => {
  // Input validation for physical impossibilities
  if (diameter <= 0 || depth <= 0 || thickness <= 0 || tensileStrength <= 0) {
    console.warn('Draw calculation received invalid dimensions:', { diameter, depth, thickness, tensileStrength });
    return 0;
  }
  
  // Use material-specific strain hardening exponent if available
  const strainHardeningExponent = materialProps?.strainHardeningExponent || 0.2;
  
  // Validate draw depth against Limiting Drawing Ratio (LDR)
  // Calculate the limiting drawing ratio (LDR) based on material strength and strain hardening
  // Higher strength materials have lower LDR
  // Higher strain hardening exponent increases LDR
  const baseLDR = 2.5 - (tensileStrength / 1000) + (strainHardeningExponent * 0.5); 
  const ldr = Math.max(1.8, Math.min(2.2, baseLDR));
  
  // Check if draw ratio exceeds LDR
  const drawRatio = depth / diameter;
  if (drawRatio > ldr) {
    console.warn(`Draw depth to diameter ratio (${drawRatio.toFixed(2)}) exceeds the calculated limiting drawing ratio (${ldr.toFixed(2)}) for this material strength (${tensileStrength} MPa)`);
    // We'll still calculate, but with a warning
  }
  
  // Check if material thickness is appropriate for the draw
  // Very thin materials may wrinkle, very thick ones may fracture
  if (thickness < diameter * 0.005) {
    console.warn(`Material may be too thin (${thickness}mm) for this draw diameter (${diameter}mm), wrinkling may occur`);
  } else if (thickness > diameter * 0.1) {
    console.warn(`Material may be too thick (${thickness}mm) for this draw diameter (${diameter}mm), fracturing may occur`);
  }
  
  // Area of the draw
  const area = Math.PI * Math.pow(diameter / 2, 2);
  
  // Depth to diameter ratio
  const depthRatio = depth / diameter;
  
  // Check if we're approaching the limiting drawing ratio
  // As we approach LDR, the required force increases exponentially
  const ldrFactor = depthRatio >= ldr * 0.8 ? 
    1.0 + Math.pow((depthRatio - ldr * 0.8) / (ldr * 0.2), 2) * 0.5 : 
    1.0;
  
  // Non-linear depth factor that better represents actual drawing behavior
  // Uses an exponential component for deeper draws
  const depthFactor = 0.7 + 0.3 * Math.pow(depthRatio, 1.5) + 0.3 * depthRatio;
  
  // Enhanced type factor with more draw types
  let typeFactor = 1.0; // Round/circular draw (default)
  if (type === 'rectangular') {
    // Rectangular draws have higher forces at corners
    typeFactor = 1.1 + 0.1 * Math.min(depthRatio, 1.0); // Corner effect increases with depth
  } else if (type === 'irregular') {
    // Irregular draws have even higher forces due to complex material flow
    typeFactor = 1.2 + 0.15 * Math.min(depthRatio, 1.0);
  } else if (type === 'tapered') {
    // Tapered draws require less force due to gradual material flow
    typeFactor = 0.9 + 0.1 * Math.min(depthRatio, 1.0);
  }
  
  // Material friction coefficient affects required force
  // Use material-specific friction coefficient if available
  const frictionCoefficient = materialProps?.frictionCoefficient || 0.15;
  const frictionFactor = 1.0 + frictionCoefficient * 4; // Scale friction coefficient to a factor
  
  // Flange holddown factor - increases with draw depth
  const holddownFactor = 1.0 + 0.1 * Math.min(depthRatio * 2, 0.5);
  
  // Formula: (Area * Thickness * Tensile Strength * Depth Factor * Type Factor * Temperature Factor * Friction Factor * Holddown Factor * LDR Factor * Quantity) / 1000
  const tonnage = (area * thickness * tensileStrength * depthFactor * typeFactor * tempFactor * frictionFactor * holddownFactor * ldrFactor * quantity) / 1000;
  
  return tonnage;
};

/**
 * Calculate reverse tonnage
 * 
 * @param {number} totalTonnage - Total forward tonnage
 * @param {Object} materialProps - Material properties
 * @returns {number} - Reverse tonnage
 */
export const calculateReverseTonnage = (totalTonnage, materialProps) => {
  // Reverse tonnage is typically a percentage of the total tonnage
  // This percentage is stored in the reverseFactor property
  return totalTonnage * (materialProps.reverseFactor || 0.7);
};

/**
 * Calculates the total tonnage for all operations.
 * 
 * @param {Array} operations - Array of operation objects
 * @param {Object} material - The selected material
 * @param {Object} parameters - Global parameters like thickness, temperature
 * @returns {Object} - The calculated tonnage results
 */
export const calculateTotalTonnage = (operations, material, parameters) => {
  if (!operations || !material || !parameters) {
    return {
      tonnage: 0,
      reverseTonnage: 0,
      totalTonnage: 0,
      operationResults: [],
      temperatureAdjustmentFactor: 1
    };
  }
  
  // Get the temperature adjustment factor
  const tempAdjust = adjustPropertiesForTemperature(
    { tensileStrength: 1 }, 
    parameters.temperature, 
    parameters.isMetric
  ).tensileStrength; // Use as a simple factor
  
  // Get material properties based on the temperature range
  const temperatureRangeMaterial = getTemperatureRangeProperties(
    material, 
    material.temperatureRange || 'room'
  );

  const results = {
    tonnage: 0,
    reverseTonnage: 0,
    totalTonnage: 0,
    operationResults: [],
    temperatureRange: material.temperatureRange || 'room',
    temperatureAdjustmentFactor: tempAdjust,
    calculationComplete: true
  };
  
  // Process each operation
  operations.forEach(operation => {
    let operationResult = {
      id: operation.id,
      type: operation.type,
      tonnage: 0,
      details: {}
    };
    
    // ... rest of the operation calculation logic
    
    results.operationResults.push(operationResult);
    results.tonnage += operationResult.tonnage;
  });
  
  // Calculate reverse tonnage
  results.reverseTonnage = calculateReverseTonnage(results.tonnage, temperatureRangeMaterial);
  results.totalTonnage = results.tonnage + results.reverseTonnage;
  
  // Calculate per-piece and batch tonnage
  results.perPieceTotalTonnage = results.totalTonnage;
  results.batchQuantity = parameters.batchQuantity || 1;
  results.totalBatchTonnage = results.totalTonnage * results.batchQuantity;
  
  // Add material forming characteristics for process recommendations
  if (material.properties && material.temperatureRange) {
    // Get forming characteristics
    const formingCharacteristics = material.formingCharacteristics || {};
    const tempRangeProps = material.properties[material.temperatureRange] || material.properties.room || {};
    
    // Add springback predictions if the material has the necessary properties
    const springbackInfo = getSpringbackSuggestions(material);
    
    results.formingCharacteristics = {
      springback: springbackInfo?.severity || formingCharacteristics.springback || 'Medium',
      blankHoldingForce: formingCharacteristics.blankHoldingForce || 'Medium',
      recommendedDieClearance: formingCharacteristics.recommendedDieClearance || '6-8%',
      recommendedPunchSpeed: formingCharacteristics.recommendedPunchSpeed || 'Medium speed',
      minimumBendRadius: tempRangeProps.minimumBendRadius || 
                         formingCharacteristics.minimumBendRadius || '1.5t',
      lubricantType: formingCharacteristics.lubricantType || 'Standard lubricant',
      grainDirectionEffect: formingCharacteristics.grainDirectionEffect || 'Moderate'
    };
  }
  
  return results;
}; 