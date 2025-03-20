/**
 * Calculates springback angle for a bend operation
 * 
 * @param {number} bendAngle - The target bend angle in degrees
 * @param {number} thickness - Material thickness in mm
 * @param {number} bendRadius - Bend radius in mm
 * @param {Object} material - Material properties object
 * @returns {number} - Springback angle in degrees
 */
export const calculateSpringbackAngle = (bendAngle, thickness, bendRadius, material) => {
  if (!material) return 0;
  
  // Get material properties
  const strainHardeningExponent = material.properties?.[material.temperatureRange || 'room']?.strainHardeningExponent || 0.2;
  const yieldStrength = material.yieldStrength || 300;
  const modulusOfElasticity = material.properties?.[material.temperatureRange || 'room']?.modulus || 200;
  const anisotropyRatio = material.properties?.[material.temperatureRange || 'room']?.anisotropyRatio || 1.0;
  
  // Convert bend angle to radians
  const bendRadians = (bendAngle * Math.PI) / 180;
  
  // Calculate Y/T ratio (yield strength to tensile strength ratio)
  const yieldToTensileRatio = material.yieldStrength / material.tensileStrength || 0.7;
  
  // Calculate r/t ratio (bend radius to thickness ratio)
  const radiusToThicknessRatio = bendRadius / thickness;
  
  // Simplified springback factor calculation
  // Higher strain hardening exponent (n) -> more springback
  // Higher Y/T ratio -> more springback
  // Higher r/t ratio -> more springback
  // Higher anisotropy ratio -> more springback
  const springbackFactor = (
    3.0 * strainHardeningExponent * 
    Math.pow(yieldToTensileRatio, 0.8) * 
    Math.sqrt(radiusToThicknessRatio) *
    (0.7 + (0.3 * anisotropyRatio))
  );
  
  // Calculate springback angle
  // Springback angle = bend angle * springback factor * (yield strength / elastic modulus)
  const springbackAngle = bendRadians * springbackFactor * (yieldStrength / modulusOfElasticity);
  
  // Convert back to degrees
  return (springbackAngle * 180) / Math.PI;
};

/**
 * Calculates compensation angle to achieve target bend angle
 * 
 * @param {number} targetAngle - The desired final bend angle in degrees
 * @param {number} thickness - Material thickness in mm
 * @param {number} bendRadius - Bend radius in mm
 * @param {Object} material - Material properties object
 * @returns {number} - The angle to bend to in order to achieve target angle
 */
export const calculateCompensationAngle = (targetAngle, thickness, bendRadius, material) => {
  if (!material) return targetAngle;
  
  const springbackAngle = calculateSpringbackAngle(targetAngle, thickness, bendRadius, material);
  
  // To achieve the target angle, we need to overbend by the springback amount
  return targetAngle + springbackAngle;
};

/**
 * Calculates the springback percentage for reporting
 * 
 * @param {number} targetAngle - The desired final bend angle in degrees
 * @param {number} thickness - Material thickness in mm
 * @param {number} bendRadius - Bend radius in mm
 * @param {Object} material - Material properties object
 * @returns {number} - Springback as a percentage of the target angle
 */
export const calculateSpringbackPercentage = (targetAngle, thickness, bendRadius, material) => {
  if (!material || targetAngle === 0) return 0;
  
  const springbackAngle = calculateSpringbackAngle(targetAngle, thickness, bendRadius, material);
  
  return (springbackAngle / targetAngle) * 100;
};

/**
 * Generates springback suggestions for the selected material
 * 
 * @param {Object} material - Material properties object
 * @returns {Object} - Springback suggestions object
 */
export const getSpringbackSuggestions = (material) => {
  if (!material) return null;
  
  const temperatureRange = material.temperatureRange || 'room';
  const properties = material.properties?.[temperatureRange] || {};
  
  const strainHardeningExponent = properties.strainHardeningExponent || 0.2;
  const yieldToTensileRatio = material.yieldStrength / material.tensileStrength || 0.7;
  const formingCharacteristics = material.formingCharacteristics || {};
  
  // Determine springback severity
  let severity = 'Low';
  if (strainHardeningExponent > 0.2 || yieldToTensileRatio > 0.8) {
    severity = 'High';
  } else if (strainHardeningExponent > 0.15 || yieldToTensileRatio > 0.7) {
    severity = 'Medium';
  }
  
  // Springback is affected by:
  // - Higher strain hardening exponent
  // - Higher yield strength to tensile strength ratio
  // - Higher bend radius to thickness ratio
  // - Material anisotropy
  // - Temperature (usually lower at higher temps)
  
  const suggestions = {
    severity,
    characteristics: formingCharacteristics.springback || severity,
    compensation: `Overbend by ${severity === 'Low' ? '2-5%' : severity === 'Medium' ? '5-10%' : '10-15%'} for optimal results`,
    tips: [
      `Maintain consistent ${formingCharacteristics.recommendedDieClearance || '6-8%'} die clearance`,
      `Use ${formingCharacteristics.lubricantType || 'appropriate'} lubricant to reduce friction`,
      `Set punch speed to ${formingCharacteristics.recommendedPunchSpeed || 'manufacturer recommended speed'}`
    ],
    minBendRadius: properties.minimumBendRadius || formingCharacteristics.minimumBendRadius || '1.5t'
  };
  
  return suggestions;
}; 