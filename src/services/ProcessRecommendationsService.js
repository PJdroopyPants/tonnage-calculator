/**
 * Generates process recommendations for the selected material and operation
 * 
 * @param {Object} material - Material properties object
 * @param {string} operationType - Type of operation (perimeter, hole, bend, form, draw)
 * @returns {Object} - Process recommendations object
 */
export const generateProcessRecommendations = (material, operationType) => {
  if (!material || !material.properties) return null;
  
  const temperatureRange = material.temperatureRange || 'room';
  const properties = material.properties[temperatureRange] || {};
  const formingCharacteristics = material.formingCharacteristics || {};
  
  // Base recommendations from material characteristics
  const recommendations = {
    dieClearance: formingCharacteristics.recommendedDieClearance || '6%',
    punchSpeed: formingCharacteristics.recommendedPunchSpeed || '150-300mm/s',
    blankHoldingForce: formingCharacteristics.blankHoldingForce || 'Medium',
    lubricantType: formingCharacteristics.lubricantType || 'Standard lubricant',
    grainDirectionEffect: formingCharacteristics.grainDirectionEffect || 'Moderate',
    temperatureRange: translateTemperatureRange(temperatureRange),
    maxFormingDepth: formingCharacteristics.maxFormingDepth || '60% of diameter'
  };
  
  // Adjust recommendations based on operation type
  switch(operationType) {
    case 'perimeter':
      recommendations.title = 'Cutting Recommendations';
      recommendations.description = 'Optimal parameters for perimeter cutting operations';
      recommendations.dieClearance = adjustClearanceForCutting(recommendations.dieClearance, properties);
      recommendations.specific = {
        edgeQuality: getEdgeQualityRecommendation(properties),
        toolLife: getToolLifeRecommendation(properties.hardness, properties.frictionCoefficient)
      };
      break;
      
    case 'hole':
      recommendations.title = 'Punching Recommendations';
      recommendations.description = 'Optimal parameters for hole punching operations';
      recommendations.dieClearance = adjustClearanceForCutting(recommendations.dieClearance, properties);
      recommendations.specific = {
        minimumDiameter: `${Math.max(properties.thickness || 1, 1.5)}mm`,
        recommendedSpacing: `${Math.max(properties.thickness * 2 || 3, 3)}mm`,
        toolLife: getToolLifeRecommendation(properties.hardness, properties.frictionCoefficient)
      };
      break;
      
    case 'bend':
      recommendations.title = 'Bending Recommendations';
      recommendations.description = 'Optimal parameters for bending operations';
      recommendations.specific = {
        minimumBendRadius: properties.minimumBendRadius || formingCharacteristics.minimumBendRadius || '1.5t',
        springback: formingCharacteristics.springback || 'Medium',
        grainDirection: getGrainDirectionRecommendation(formingCharacteristics.grainDirectionEffect)
      };
      break;
      
    case 'form':
      recommendations.title = 'Forming Recommendations';
      recommendations.description = 'Optimal parameters for forming operations';
      recommendations.specific = {
        surfaceFinish: getSurfaceFinishRecommendation(properties.surfaceRoughness),
        maxDepth: formingCharacteristics.maxFormingDepth || '60% of diameter',
        stretchability: getStretchabilityRating(properties.elongation, properties.strainHardeningExponent)
      };
      break;
      
    case 'draw':
      recommendations.title = 'Drawing Recommendations';
      recommendations.description = 'Optimal parameters for drawing operations';
      recommendations.specific = {
        drawRatio: getMaxDrawRatio(properties),
        blankHolderPressure: getBlankHolderPressure(formingCharacteristics.blankHoldingForce),
        surfaceFinish: getSurfaceFinishRecommendation(properties.surfaceRoughness)
      };
      break;
      
    default:
      recommendations.title = 'General Recommendations';
      recommendations.description = 'General process parameters for this material';
  }
  
  // Calculate tonnage efficiency factor
  recommendations.tonnageEfficiencyFactor = calculateTonnageEfficiencyFactor(
    properties, 
    temperatureRange, 
    operationType
  );
  
  return recommendations;
};

/**
 * Translates temperature range code to human-readable description
 * 
 * @param {string} rangeCode - Temperature range code (room, warm, hot) 
 * @returns {string} - Human-readable description
 */
const translateTemperatureRange = (rangeCode) => {
  switch(rangeCode) {
    case 'room':
      return 'Room Temperature (≤100°C)';
    case 'warm':
      return 'Warm Temperature (100-300°C)';
    case 'hot':
      return 'Hot Temperature (>300°C)';
    default:
      return 'Room Temperature';
  }
};

/**
 * Adjusts die clearance recommendation for cutting operations
 * 
 * @param {string} baseClearance - Base clearance recommendation 
 * @param {Object} properties - Material properties
 * @returns {string} - Adjusted clearance recommendation
 */
const adjustClearanceForCutting = (baseClearance, properties) => {
  // Extract numeric value from percentage string
  const baseValue = parseFloat(baseClearance) || 6;
  
  // Adjust based on tensile strength
  let adjustment = 0;
  const tensileStrength = properties.tensileStrength || 400;
  
  if (tensileStrength > 600) {
    adjustment = 1.5; // Increase clearance for high-strength materials
  } else if (tensileStrength < 300) {
    adjustment = -0.5; // Decrease clearance for low-strength materials
  }
  
  return `${(baseValue + adjustment).toFixed(1)}%`;
};

/**
 * Generates edge quality recommendation based on material properties
 * 
 * @param {Object} properties - Material properties
 * @returns {string} - Edge quality recommendation
 */
const getEdgeQualityRecommendation = (properties) => {
  const tensileStrength = properties.tensileStrength || 400;
  const elongation = properties.elongation || 20;
  
  if (tensileStrength > 600 || elongation < 10) {
    return 'Consider secondary deburring operation';
  } else if (tensileStrength > 400 || elongation < 20) {
    return 'Standard edge quality expected';
  } else {
    return 'Good edge quality expected';
  }
};

/**
 * Generates tool life recommendation based on hardness and friction
 * 
 * @param {number} hardness - Material hardness
 * @param {number} frictionCoefficient - Material friction coefficient
 * @returns {string} - Tool life recommendation
 */
const getToolLifeRecommendation = (hardness = 100, frictionCoefficient = 0.4) => {
  if (hardness > 200 || frictionCoefficient > 0.5) {
    return 'Reduced tool life expected - increase inspection frequency';
  } else if (hardness > 100 || frictionCoefficient > 0.4) {
    return 'Average tool life expected';
  } else {
    return 'Above average tool life expected';
  }
};

/**
 * Provides grain direction recommendation based on material characteristics
 * 
 * @param {string} grainEffect - Grain direction effect from material data
 * @returns {string} - Grain direction recommendation
 */
const getGrainDirectionRecommendation = (grainEffect) => {
  switch(grainEffect) {
    case 'Significant':
    case 'Very Significant':
    case 'Extremely Critical':
      return 'Align bend axis perpendicular to grain direction';
    case 'Moderate':
      return 'Consider grain direction for critical dimensions';
    default:
      return 'Grain direction has minimal impact';
  }
};

/**
 * Provides surface finish recommendation based on material surface roughness
 * 
 * @param {number} roughness - Material surface roughness value
 * @returns {string} - Surface finish recommendation
 */
const getSurfaceFinishRecommendation = (roughness = 0.8) => {
  if (roughness < 0.5) {
    return 'High surface quality expected';
  } else if (roughness < 1.0) {
    return 'Standard surface quality expected';
  } else {
    return 'Rougher surface finish expected';
  }
};

/**
 * Calculate stretchability rating based on elongation and strain hardening
 * 
 * @param {number} elongation - Material elongation percentage
 * @param {number} strainHardening - Material strain hardening exponent
 * @returns {string} - Stretchability rating
 */
const getStretchabilityRating = (elongation = 20, strainHardening = 0.2) => {
  const stretchIndex = (elongation / 20) * (strainHardening / 0.2);
  
  if (stretchIndex > 1.5) {
    return 'Excellent stretchability';
  } else if (stretchIndex > 0.8) {
    return 'Good stretchability';
  } else {
    return 'Limited stretchability';
  }
};

/**
 * Calculate maximum drawing ratio based on material properties
 * 
 * @param {Object} properties - Material properties
 * @returns {string} - Maximum drawing ratio
 */
const getMaxDrawRatio = (properties) => {
  const anisotropy = properties.anisotropyRatio || 1.0;
  const strainHardening = properties.strainHardeningExponent || 0.2;
  
  // Higher values of both properties lead to better drawability
  const drawIndex = anisotropy * (1 + strainHardening * 2);
  
  if (drawIndex > 2.0) {
    return '2.2 - 2.4 LDR';
  } else if (drawIndex > 1.5) {
    return '2.0 - 2.2 LDR';
  } else if (drawIndex > 1.0) {
    return '1.8 - 2.0 LDR';
  } else {
    return '1.6 - 1.8 LDR';
  }
};

/**
 * Provides blank holder pressure recommendation based on holding force category
 * 
 * @param {string} blankHoldingForce - Blank holding force category
 * @returns {string} - Pressure recommendation
 */
const getBlankHolderPressure = (blankHoldingForce) => {
  switch(blankHoldingForce) {
    case 'Very High':
      return '3.0 - 4.0 MPa';
    case 'High':
      return '2.0 - 3.0 MPa';
    case 'Medium':
    case 'Medium-High':
    case 'Moderate':
    case 'Moderate to High':
      return '1.5 - 2.0 MPa';
    case 'Low':
    case 'Low-Medium':
      return '1.0 - 1.5 MPa';
    default:
      return '1.5 - 2.5 MPa';
  }
};

/**
 * Calculates tonnage efficiency factor based on material properties and operation
 * 
 * @param {Object} properties - Material properties
 * @param {string} temperatureRange - Temperature range
 * @param {string} operationType - Type of operation
 * @returns {number} - Efficiency factor
 */
const calculateTonnageEfficiencyFactor = (properties, temperatureRange, operationType) => {
  // Base efficiency factor
  let factor = 1.0;
  
  // Adjust for temperature
  if (temperatureRange === 'warm') {
    factor *= 0.95; // Slightly more efficient at warm temperatures
  } else if (temperatureRange === 'hot') {
    factor *= 0.90; // More efficient at hot temperatures
  }
  
  // Adjust for operation type
  if (operationType === 'bend') {
    factor *= 1.05; // Bending typically needs more tonnage safety margin
  } else if (operationType === 'draw') {
    factor *= 1.10; // Drawing operations have more variables
  }
  
  return parseFloat(factor.toFixed(2));
}; 