/**
 * Service for predicting surface finish quality based on material properties,
 * forming parameters, and lubricant properties
 */

/**
 * Calculate predicted surface roughness (Ra) based on material and process parameters
 * 
 * @param {Object} material - Material properties object
 * @param {Object} parameters - Forming parameters
 * @param {Object} lubricant - Lubricant properties (type, viscosity, additives)
 * @returns {Object} - Surface finish prediction data
 */
export const calculateSurfaceFinish = (material, parameters, lubricant = { type: 'none' }) => {
  if (!material || !material.properties) return null;
  
  const temperatureRange = material.temperatureRange || 'room';
  const properties = material.properties[temperatureRange] || {};
  
  // Calculate base surface roughness based on material properties
  const baseSurfaceRoughness = calculateBaseSurfaceRoughness(properties);
  
  // Calculate lubricant effect on surface finish
  const lubricantFactor = calculateLubricantFactor(lubricant.type, lubricant.viscosity, lubricant.additives);
  
  // Calculate forming speed effect
  const speedFactor = calculateSpeedFactor(parameters.formingSpeed || 'medium');
  
  // Calculate tool condition effect
  const toolConditionFactor = calculateToolConditionFactor(parameters.toolCondition || 'new');
  
  // Calculate temperature effect
  const temperatureFactor = calculateTemperatureFactor(temperatureRange);
  
  // Calculate final predicted surface roughness (Ra value in μm)
  const predictedSurfaceRoughness = baseSurfaceRoughness * lubricantFactor * speedFactor * 
                                   toolConditionFactor * temperatureFactor;
  
  // Convert Ra to RMS (Rq) - a common alternative measure
  const predictedRms = raToRms(predictedSurfaceRoughness);
  
  // Generate surface quality assessment
  const surfaceQualityAssessment = assessSurfaceQuality(predictedSurfaceRoughness);
  
  // Generate recommendations for improving surface finish
  const recommendations = generateRecommendations(
    predictedSurfaceRoughness,
    material,
    parameters,
    lubricant
  );
  
  // NEW: Calculate the effective friction coefficient based on material and lubricant
  const effectiveFrictionCoefficient = calculateEffectiveFrictionCoefficient(
    properties.frictionCoefficient || 0.3,
    lubricant.type,
    lubricant.viscosity,
    lubricant.additives,
    temperatureRange
  );
  
  return {
    predictedRa: predictedSurfaceRoughness,
    predictedRq: predictedRms,
    qualityAssessment: surfaceQualityAssessment,
    recommendations: recommendations,
    factors: {
      baseSurfaceRoughness,
      lubricantFactor,
      speedFactor,
      toolConditionFactor,
      temperatureFactor
    },
    surfaceFinishClassification: classifySurfaceFinish(predictedSurfaceRoughness),
    effectiveFrictionCoefficient  // NEW: Added effective friction coefficient
  };
};

/**
 * Calculate base surface roughness based on material properties
 * 
 * @param {Object} properties - Material properties
 * @returns {number} - Base surface roughness (Ra) in μm
 */
const calculateBaseSurfaceRoughness = (properties) => {
  // Material hardness has a significant effect on surface finish
  const hardness = properties.hardness || 150; // Default hardness if not provided
  
  // Grain size affects surface finish (smaller grain = smoother finish)
  const grainSizeFactor = properties.grainSize || 5; // Default grain size ASTM
  
  // Base calculation using empirical formula
  let baseRoughness = 0.5 + (250 / hardness) + (0.1 * grainSizeFactor);
  
  // For high tensile materials, adjust roughness
  if (properties.tensileStrength > 800) {
    baseRoughness *= 0.85; // High tensile materials can achieve better finish
  }
  
  return baseRoughness;
};

/**
 * Calculate effect of lubricant on surface finish
 * 
 * @param {string} lubricantType - Type of lubricant used
 * @param {string} viscosity - Viscosity level (low, medium, high)
 * @param {Array} additives - Array of additives in the lubricant
 * @returns {number} - Lubricant factor (multiplier for Ra)
 */
const calculateLubricantFactor = (lubricantType, viscosity = 'medium', additives = []) => {
  // Base lubricant type factors
  const lubricantTypeFactors = {
    'none': 1.3,
    'light oil': 0.9,
    'medium oil': 0.8,
    'heavy oil': 0.7,
    'emulsion': 0.85,
    'solid film': 0.6,
    'synthetic': 0.75,
    'water-based': 0.88,
    'semi-synthetic': 0.8,
    'vegetable-based': 0.82,
    'mineral oil': 0.78,
    'EP oil': 0.65,
    'chlorinated oil': 0.62,  // Enhanced surface finish due to boundary layer formation
    // Added specialized high-friction lubricants
    'EP oil with MoS2': 0.55,  // MoS2 provides additional friction reduction
    'chlorinated oil with EP': 0.52,  // Combined extreme pressure and chlorinated properties
    'titanium lubricant': 0.50   // Specialized for titanium and difficult materials
  };
  
  // NEW: Viscosity adjustment factors
  const viscosityFactors = {
    'low': 1.1,    // Thinner lubricants provide less surface protection
    'medium': 1.0, // Base reference
    'high': 0.9    // Thicker lubricants provide better surface protection
  };
  
  // NEW: Additive improvement factors
  const additiveFactors = {
    'EP': 0.9,        // Extreme pressure additives
    'AW': 0.92,       // Anti-wear additives
    'FM': 0.88,       // Friction modifiers
    'VI': 0.95,       // Viscosity index improvers
    'MoS2': 0.85,     // Molybdenum disulfide
    'PTFE': 0.82,     // Polytetrafluoroethylene (Teflon)
    'graphite': 0.87  // Graphite
  };
  
  // Get base lubricant factor
  const baseFactor = lubricantTypeFactors[lubricantType] || 1.0;
  
  // Apply viscosity adjustment
  const viscosityAdjustment = viscosityFactors[viscosity] || 1.0;
  
  // Calculate additive effects (multiplicative)
  let additiveAdjustment = 1.0;
  if (additives && additives.length > 0) {
    // Apply each additive effect
    additives.forEach(additive => {
      if (additiveFactors[additive]) {
        additiveAdjustment *= additiveFactors[additive];
      }
    });
    
    // Limit the maximum effect of additives to prevent unrealistically low values
    additiveAdjustment = Math.max(additiveAdjustment, 0.7);
  }
  
  // Calculate final factor
  return baseFactor * viscosityAdjustment * additiveAdjustment;
};

/**
 * Calculate effect of forming speed on surface finish
 * 
 * @param {string} speed - Forming speed (slow, medium, high)
 * @returns {number} - Speed factor (multiplier for Ra)
 */
const calculateSpeedFactor = (speed) => {
  const speedFactors = {
    'slow': 0.9,
    'medium': 1.0,
    'high': 1.2,
    'very high': 1.4
  };
  
  return speedFactors[speed] || 1.0;
};

/**
 * Calculate effect of tool condition on surface finish
 * 
 * @param {string} toolCondition - Condition of the forming tool
 * @returns {number} - Tool condition factor (multiplier for Ra)
 */
const calculateToolConditionFactor = (toolCondition) => {
  const toolConditionFactors = {
    'new': 0.8,
    'good': 1.0,
    'worn': 1.5,
    'damaged': 2.0
  };
  
  return toolConditionFactors[toolCondition] || 1.0;
};

/**
 * Calculate effect of temperature on surface finish
 * 
 * @param {string} temperatureRange - Temperature range (room, warm, hot)
 * @returns {number} - Temperature factor (multiplier for Ra)
 */
const calculateTemperatureFactor = (temperatureRange) => {
  const temperatureFactors = {
    'room': 1.0,
    'warm': 1.2,
    'hot': 1.5
  };
  
  return temperatureFactors[temperatureRange] || 1.0;
};

/**
 * Convert Ra (arithmetic average) to Rq (root mean square)
 * 
 * @param {number} ra - Surface roughness Ra value in μm
 * @returns {number} - Equivalent Rq value in μm
 */
const raToRms = (ra) => {
  // Empirical relation between Ra and Rq
  return ra * 1.11;
};

/**
 * Assess surface quality based on Ra value
 * 
 * @param {number} ra - Surface roughness Ra value in μm
 * @returns {string} - Quality assessment
 */
const assessSurfaceQuality = (ra) => {
  if (ra < 0.5) return "Excellent - Mirror finish";
  if (ra < 1.0) return "Very good - Fine machined surface";
  if (ra < 2.0) return "Good - Standard machined surface";
  if (ra < 4.0) return "Fair - Rough machined surface";
  if (ra < 8.0) return "Poor - Rough formed surface";
  return "Very poor - Extremely rough surface";
};

/**
 * Classify surface finish according to standard ranges
 * 
 * @param {number} ra - Surface roughness Ra value in μm
 * @returns {string} - Surface finish classification
 */
const classifySurfaceFinish = (ra) => {
  if (ra < 0.1) return "Super finish";
  if (ra < 0.5) return "Polished";
  if (ra < 1.6) return "Ground";
  if (ra < 3.2) return "Fine machined";
  if (ra < 6.3) return "Medium machined";
  if (ra < 12.5) return "Rough machined";
  if (ra < 25) return "Rough formed";
  return "Extremely rough";
};

/**
 * NEW: Calculate effective friction coefficient based on material properties and lubricant
 * 
 * @param {number} baseFrictionCoefficient - Base material friction coefficient
 * @param {string} lubricantType - Type of lubricant used
 * @param {string} viscosity - Viscosity level (low, medium, high)
 * @param {Array} additives - Array of additives in the lubricant
 * @param {string} temperatureRange - Temperature range (room, warm, hot)
 * @returns {number} - Effective friction coefficient
 */
const calculateEffectiveFrictionCoefficient = (
  baseFrictionCoefficient, 
  lubricantType = 'none', 
  viscosity = 'medium', 
  additives = [],
  temperatureRange = 'room'
) => {
  // Lubricant type reduction factors (how much each lubricant type reduces friction)
  const lubricantReductionFactors = {
    'none': 1.0,                // No reduction
    'light oil': 0.85,          // 15% reduction
    'medium oil': 0.75,         // 25% reduction
    'heavy oil': 0.65,          // 35% reduction
    'emulsion': 0.80,           // 20% reduction
    'solid film': 0.55,         // 45% reduction
    'synthetic': 0.70,          // 30% reduction
    'water-based': 0.82,        // 18% reduction
    'semi-synthetic': 0.72,     // 28% reduction
    'vegetable-based': 0.76,    // 24% reduction
    'mineral oil': 0.75,        // 25% reduction
    'EP oil': 0.60,             // 40% reduction
    'chlorinated oil': 0.55     // 45% reduction
  };
  
  // Viscosity effects on friction coefficient
  const viscosityEffects = {
    'low': 1.1,       // Higher friction with low viscosity
    'medium': 1.0,    // Base reference
    'high': 0.9       // Lower friction with high viscosity
  };
  
  // Additive friction reduction effects
  const additiveEffects = {
    'EP': 0.85,        // Extreme pressure additives
    'AW': 0.88,        // Anti-wear additives
    'FM': 0.80,        // Friction modifiers
    'VI': 0.95,        // Viscosity index improvers
    'MoS2': 0.75,      // Molybdenum disulfide
    'PTFE': 0.65,      // Polytetrafluoroethylene (Teflon)
    'graphite': 0.78   // Graphite
  };
  
  // Temperature effects on friction
  const temperatureEffects = {
    'room': 1.0,      // Base reference
    'warm': 1.15,     // Higher temperature typically increases friction by 15%
    'hot': 1.3        // High temperature can increase friction by 30%
  };
  
  // Get base reduction from lubricant type
  const lubricantReduction = lubricantReductionFactors[lubricantType] || 1.0;
  
  // Apply viscosity effect
  const viscosityEffect = viscosityEffects[viscosity] || 1.0;
  
  // Calculate additive effects (multiplicative)
  let additiveEffect = 1.0;
  if (additives && additives.length > 0) {
    // Apply each additive effect
    additives.forEach(additive => {
      if (additiveEffects[additive]) {
        additiveEffect *= additiveEffects[additive];
      }
    });
    
    // Limit the combined effect of additives
    additiveEffect = Math.max(additiveEffect, 0.55);
  }
  
  // Apply temperature effect
  const tempEffect = temperatureEffects[temperatureRange] || 1.0;
  
  // Calculate effective friction coefficient
  const effectiveFriction = baseFrictionCoefficient * lubricantReduction * viscosityEffect * additiveEffect * tempEffect;
  
  // Ensure the friction coefficient doesn't go below a realistic minimum
  return Math.max(effectiveFriction, 0.04);
};

/**
 * Generate recommendations for improving surface finish
 * 
 * @param {number} currentRa - Current predicted Ra value
 * @param {Object} material - Material properties
 * @param {Object} parameters - Forming parameters
 * @param {Object} lubricant - Lubricant properties
 * @returns {Array} - List of recommendations
 */
const generateRecommendations = (currentRa, material, parameters, lubricant) => {
  const recommendations = [];
  
  // Get material properties for temperature range
  const temperatureRange = material.temperatureRange || 'room';
  const properties = material.properties?.[temperatureRange] || {};
  
  // NEW: Enhanced lubricant recommendations based on material type and operation
  if (!lubricant || lubricant.type === 'none') {
    recommendations.push("Apply appropriate lubricant to significantly improve surface finish");
  } else if (lubricant.type === 'light oil' || lubricant.type === 'water-based') {
    // More specific recommendations based on material category
    if (material.category === 'stainless-steel') {
      recommendations.push("Use chlorinated oil or EP additives for better surface finish with stainless steel");
    } else if (material.category === 'titanium') {
      recommendations.push("Switch to specialized lubricant with MoS2 or PTFE additives for titanium materials");
    } else if (material.category === 'aluminum') {
      recommendations.push("Consider synthetic lubricant with lower friction for aluminum forming");
    } else {
      recommendations.push("Use a higher viscosity lubricant or solid film for improved surface finish");
    }
  }
  
  // NEW: Additive-specific recommendations
  if (lubricant && (!lubricant.additives || lubricant.additives.length === 0)) {
    // Hardness-based additive recommendations
    if (properties.hardness > 180) {
      recommendations.push("Add EP (Extreme Pressure) additives to lubricant for this hard material");
    } else {
      recommendations.push("Consider lubricant with friction modifiers to improve surface quality");
    }
  }
  
  // Recommend speed adjustments
  if (parameters.formingSpeed === 'high' || parameters.formingSpeed === 'very high') {
    recommendations.push("Reduce forming speed to improve surface finish");
  }
  
  // Recommend tool condition improvements
  if (parameters.toolCondition === 'worn' || parameters.toolCondition === 'damaged') {
    recommendations.push("Replace or refurbish forming tools to achieve better surface finish");
  }
  
  // Temperature-specific recommendations
  if (material.temperatureRange === 'hot') {
    recommendations.push("Consider reducing forming temperature if possible to improve surface quality");
    
    // NEW: Temperature-specific lubricant recommendation
    if (lubricant && lubricant.type !== 'solid film' && !lubricant.additives?.includes('EP')) {
      recommendations.push("Use high-temperature lubricant with EP additives for elevated temperature forming");
    }
  }
  
  // Material-specific recommendations
  if (properties.hardness < 150) {
    recommendations.push("Consider pre-hardening or using harder die materials for this soft material");
  }
  
  // If already good finish, provide maintenance recommendation
  if (currentRa < 1.6) {
    recommendations.push("Maintain current process parameters and regularly inspect tool condition");
  }
  
  return recommendations;
}; 