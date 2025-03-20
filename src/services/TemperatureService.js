/**
 * Calculates the temperature adjustment factor for tonnage calculations.
 * 
 * @param {number} temperature - The temperature value
 * @param {boolean} isMetric - Whether the temperature is in Celsius (true) or Fahrenheit (false)
 * @param {number} materialCoefficient - The material-specific temperature coefficient
 * @returns {number} - The temperature adjustment factor
 */
export const temperatureAdjustment = (temperature, isMetric, materialCoefficient = 0.0002) => {
  // Convert Fahrenheit to Celsius if needed
  const tempCelsius = isMetric ? temperature : (temperature - 32) * 5/9;
  
  // Reference temperature (room temperature)
  const referenceTemp = 20; // Celsius
  
  // Calculate the temperature difference from reference
  const tempDiff = tempCelsius - referenceTemp;
  
  // Apply the adjustment formula
  // Factor = 1 - (coefficient * temperature difference)
  // As temperature increases above reference, factor decreases below 1
  const factor = 1 - (materialCoefficient * tempDiff);
  
  // Ensure we don't return values below a certain threshold
  return Math.max(factor, 0.8);
};

/**
 * Adjusts material properties based on temperature
 * 
 * @param {Object} materialProperties - The material properties at room temperature
 * @param {number} temperature - The temperature in degrees
 * @param {boolean} isMetric - Whether the temperature is in metric units
 * @returns {Object} - The adjusted material properties
 */
export const adjustPropertiesForTemperature = (materialProperties, temperature, isMetric = true) => {
  const factor = temperatureAdjustment(temperature, isMetric);
  
  // Create a deep copy to avoid mutating the original
  const adjustedProperties = JSON.parse(JSON.stringify(materialProperties));
  
  // Adjust key strength properties
  if (adjustedProperties.tensileStrength) {
    adjustedProperties.tensileStrength *= factor;
  }
  
  if (adjustedProperties.yieldStrength) {
    adjustedProperties.yieldStrength *= factor;
  }
  
  if (adjustedProperties.shearStrength) {
    adjustedProperties.shearStrength *= factor;
  }
  
  // Adjust other temperature-dependent properties
  
  // Elongation typically increases with temperature
  if (adjustedProperties.elongation) {
    // Elongation can increase by up to 2x at high temperatures
    adjustedProperties.elongation /= factor;
  }
  
  // Hardness decreases with temperature
  if (adjustedProperties.hardness) {
    adjustedProperties.hardness *= factor;
  }
  
  return adjustedProperties;
};

/**
 * Gets the appropriate material properties for the selected temperature range
 * 
 * @param {Object} material - The material object containing properties for different temperature ranges
 * @param {string} temperatureRange - The temperature range (room, warm, hot)
 * @returns {Object} - The material properties for the selected temperature range
 */
export const getTemperatureRangeProperties = (material, temperatureRange = 'room') => {
  if (!material || !material.properties) {
    return material;
  }
  
  // Create a deep copy to avoid mutating the original
  const adjustedMaterial = JSON.parse(JSON.stringify(material));
  
  // Get the properties for the specified temperature range
  const rangeProperties = material.properties[temperatureRange] || material.properties.room;
  
  // Update the material properties with the temperature range specific values
  adjustedMaterial.tensileStrength = rangeProperties.tensileStrength;
  adjustedMaterial.yieldStrength = rangeProperties.yieldStrength;
  adjustedMaterial.shearStrength = rangeProperties.shearStrength;
  adjustedMaterial.reverseTonnageFactor = rangeProperties.reverseFactor || 0.7;
  
  // Include additional properties that may be useful for future calculations
  if (rangeProperties.elongation) {
    adjustedMaterial.elongation = rangeProperties.elongation;
  }
  
  if (rangeProperties.hardness) {
    adjustedMaterial.hardness = rangeProperties.hardness;
  }
  
  if (rangeProperties.strainHardeningExponent) {
    adjustedMaterial.strainHardeningExponent = rangeProperties.strainHardeningExponent;
  }
  
  if (rangeProperties.anisotropyRatio) {
    adjustedMaterial.anisotropyRatio = rangeProperties.anisotropyRatio;
  }
  
  return adjustedMaterial;
}; 