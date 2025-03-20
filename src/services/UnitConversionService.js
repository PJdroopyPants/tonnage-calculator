/**
 * Convert millimeters to inches
 * @param {number} mm - Value in millimeters
 * @returns {number} - Value in inches
 */
export const mmToInch = (mm) => {
  return mm / 25.4;
};

/**
 * Convert inches to millimeters
 * @param {number} inch - Value in inches
 * @returns {number} - Value in millimeters
 */
export const inchToMm = (inch) => {
  return inch * 25.4;
};

/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} - Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

/**
 * Convert Fahrenheit to Celsius
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} - Temperature in Celsius
 */
export const fahrenheitToCelsius = (fahrenheit) => {
  return (fahrenheit - 32) * 5/9;
};

/**
 * Convert Newtons to Pounds-force
 * @param {number} newtons - Force in Newtons
 * @returns {number} - Force in Pounds-force
 */
export const newtonsToPounds = (newtons) => {
  return newtons * 0.2248;
};

/**
 * Convert Pounds-force to Newtons
 * @param {number} pounds - Force in Pounds-force
 * @returns {number} - Force in Newtons
 */
export const poundsToNewtons = (pounds) => {
  return pounds / 0.2248;
};

/**
 * Convert Metric tons to US tons
 * @param {number} metricTons - Weight in metric tons
 * @returns {number} - Weight in US tons
 */
export const metricToUsTons = (metricTons) => {
  return metricTons * 1.1023;
};

/**
 * Convert US tons to Metric tons
 * @param {number} usTons - Weight in US tons
 * @returns {number} - Weight in metric tons
 */
export const usToMetricTons = (usTons) => {
  return usTons / 1.1023;
};

/**
 * Convert MPa to ksi (kilopounds per square inch)
 * @param {number} mpa - Pressure in MPa
 * @returns {number} - Pressure in ksi
 */
export const mpaToKsi = (mpa) => {
  return mpa * 0.145038;
};

/**
 * Convert ksi to MPa
 * @param {number} ksi - Pressure in ksi
 * @returns {number} - Pressure in MPa
 */
export const ksiToMpa = (ksi) => {
  return ksi / 0.145038;
};

/**
 * Format a value with the appropriate unit
 * @param {number} value - The value to format
 * @param {string} unit - The unit type ('length', 'temperature', 'force', 'pressure')
 * @param {boolean} isMetric - Whether to use metric units
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted value with unit
 */
export const formatWithUnit = (value, unit, isMetric, decimals = 2) => {
  if (value === undefined || value === null) {
    return '';
  }
  
  const roundedValue = Number(value.toFixed(decimals));
  
  switch (unit) {
    case 'length':
      return isMetric 
        ? `${roundedValue} mm` 
        : `${roundedValue} in`;
      
    case 'temperature':
      return isMetric 
        ? `${roundedValue} °C` 
        : `${roundedValue} °F`;
      
    case 'force':
      return isMetric 
        ? `${roundedValue} N` 
        : `${roundedValue} lbf`;
    
    case 'weight':
      return isMetric 
        ? `${roundedValue} kg` 
        : `${roundedValue} lb`;
      
    case 'pressure':
      return isMetric 
        ? `${roundedValue} MPa` 
        : `${roundedValue} ksi`;
    
    case 'tonnage':
      return isMetric 
        ? `${roundedValue} metric t` 
        : `${roundedValue} US ton`;
      
    default:
      return `${roundedValue}`;
  }
};

/**
 * Converts a value from one unit to another.
 * 
 * @param {number} value - The value to convert
 * @param {string} fromUnit - The unit to convert from
 * @param {string} toUnit - The unit to convert to
 * @returns {number} - The converted value
 */
export const convertUnits = (value, fromUnit, toUnit) => {
  // Same unit, no conversion needed
  if (fromUnit === toUnit) {
    return value;
  }
  
  // Length conversions
  if (fromUnit === 'in' && toUnit === 'mm') {
    return value * 25.4; // inches to millimeters
  }
  if (fromUnit === 'mm' && toUnit === 'in') {
    return value / 25.4; // millimeters to inches
  }
  
  // Temperature conversions
  if (fromUnit === 'F' && toUnit === 'C') {
    return (value - 32) * 5/9; // Fahrenheit to Celsius
  }
  if (fromUnit === 'C' && toUnit === 'F') {
    return (value * 9/5) + 32; // Celsius to Fahrenheit
  }
  
  // Pressure/Stress conversions
  if (fromUnit === 'ksi' && toUnit === 'MPa') {
    return value * 6.89476; // ksi to MPa
  }
  if (fromUnit === 'MPa' && toUnit === 'ksi') {
    return value / 6.89476; // MPa to ksi
  }
  
  // Weight/Force conversions
  if (fromUnit === 'lbf' && toUnit === 'N') {
    return value * 4.44822; // pound-force to Newtons
  }
  if (fromUnit === 'N' && toUnit === 'lbf') {
    return value / 4.44822; // Newtons to pound-force
  }
  
  // Tonnage conversions
  if (fromUnit === 't' && toUnit === 'ton') {
    return value * 1.1023; // metric tons to US tons
  }
  if (fromUnit === 'ton' && toUnit === 't') {
    return value / 1.1023; // US tons to metric tons
  }
  
  // Return original value if conversion not supported
  console.warn(`Conversion from ${fromUnit} to ${toUnit} not supported`);
  return value;
}; 