/**
 * Middleware for validating inputs before they're stored in Redux state.
 * This prevents invalid states from being created that could cause calculation errors.
 */
const validationMiddleware = store => next => action => {
  // Validate thickness value
  if (action.type === 'parameters/setThickness') {
    const thickness = parseFloat(action.payload);
    
    // Check if thickness is a valid number
    if (isNaN(thickness) || thickness <= 0) {
      // Replace with a default valid value to prevent errors
      action.payload = 1.0;
      console.warn('Invalid thickness value detected and corrected');
    }
    
    // Check if thickness is within reasonable range (0.1mm to 100mm or 0.004" to 4")
    const isMetric = store.getState().parameters.isMetric;
    const minThickness = isMetric ? 0.1 : 0.004;
    const maxThickness = isMetric ? 100 : 4;
    
    if (thickness < minThickness) {
      action.payload = minThickness;
      console.warn(`Thickness value too small, set to minimum: ${minThickness}`);
    } else if (thickness > maxThickness) {
      action.payload = maxThickness;
      console.warn(`Thickness value too large, set to maximum: ${maxThickness}`);
    }
  }
  
  // Validate temperature value
  if (action.type === 'parameters/setTemperature') {
    const temperature = parseFloat(action.payload);
    
    // Check if temperature is a valid number
    if (isNaN(temperature)) {
      action.payload = 20; // Room temperature default
      console.warn('Invalid temperature value detected and corrected');
    }
    
    // Check if temperature is within reasonable range (-50°C to 1200°C or -58°F to 2192°F)
    const isMetric = store.getState().parameters.isMetric;
    const minTemp = isMetric ? -50 : -58;
    const maxTemp = isMetric ? 1200 : 2192;
    
    if (temperature < minTemp) {
      action.payload = minTemp;
      console.warn(`Temperature value too low, set to minimum: ${minTemp}`);
    } else if (temperature > maxTemp) {
      action.payload = maxTemp;
      console.warn(`Temperature value too high, set to maximum: ${maxTemp}`);
    }
  }
  
  // Validate perimeter length
  if (action.type === 'operations/setPerimeterLength') {
    const length = parseFloat(action.payload);
    
    // Check if length is a valid number
    if (isNaN(length) || length <= 0) {
      action.payload = 100; // Default value in mm
      console.warn('Invalid perimeter length detected and corrected');
    }
    
    // Check if length is within reasonable range (1mm to 10000mm or 0.04" to 400")
    const isMetric = store.getState().parameters.isMetric;
    const minLength = isMetric ? 1 : 0.04;
    const maxLength = isMetric ? 10000 : 400;
    
    if (length < minLength) {
      action.payload = minLength;
      console.warn(`Perimeter length too small, set to minimum: ${minLength}`);
    } else if (length > maxLength) {
      action.payload = maxLength;
      console.warn(`Perimeter length too large, set to maximum: ${maxLength}`);
    }
  }
  
  // Validate hole dimensions
  if (action.type === 'operations/addHole' || action.type === 'operations/updateHole') {
    const payload = { ...action.payload };
    const diameter = parseFloat(payload.diameter);
    
    // Check if diameter is a valid number
    if (isNaN(diameter) || diameter <= 0) {
      payload.diameter = 10; // Default value in mm
      console.warn('Invalid hole diameter detected and corrected');
    }
    
    // Check if diameter is within reasonable range (0.5mm to 500mm or 0.02" to 20")
    const isMetric = store.getState().parameters.isMetric;
    const minDiameter = isMetric ? 0.5 : 0.02;
    const maxDiameter = isMetric ? 500 : 20;
    
    if (diameter < minDiameter) {
      payload.diameter = minDiameter;
      console.warn(`Hole diameter too small, set to minimum: ${minDiameter}`);
    } else if (diameter > maxDiameter) {
      payload.diameter = maxDiameter;
      console.warn(`Hole diameter too large, set to maximum: ${maxDiameter}`);
    }
    
    // Validate quantity
    const quantity = parseInt(payload.quantity);
    if (isNaN(quantity) || quantity < 1) {
      payload.quantity = 1;
      console.warn('Invalid hole quantity detected and corrected');
    }
    
    // Update the action with validated payload
    action.payload = payload;
  }
  
  // Validate bend dimensions
  if (action.type === 'operations/addBend' || action.type === 'operations/updateBend') {
    const payload = { ...action.payload };
    const length = parseFloat(payload.length);
    const angle = parseFloat(payload.angle);
    const radiusToThickness = parseFloat(payload.radiusToThickness);
    
    // Check if length is a valid number
    if (isNaN(length) || length <= 0) {
      payload.length = 100; // Default value in mm
      console.warn('Invalid bend length detected and corrected');
    }
    
    // Check if angle is a valid number
    if (isNaN(angle) || angle <= 0 || angle > 180) {
      payload.angle = 90; // Default 90-degree bend
      console.warn('Invalid bend angle detected and corrected');
    }
    
    // Check if radius-to-thickness ratio is a valid number
    if (isNaN(radiusToThickness) || radiusToThickness < 0.5) {
      payload.radiusToThickness = 1.0; // Default ratio
      console.warn('Invalid radius-to-thickness ratio detected and corrected');
    }
    
    // Update the action with validated payload
    action.payload = payload;
  }
  
  // Similar validation for forms and draws would go here
  
  return next(action);
};

export default validationMiddleware; 