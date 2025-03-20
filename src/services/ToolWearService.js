/**
 * Calculates tool wear rate based on material properties
 * 
 * @param {Object} material - Material properties object
 * @param {string} operationType - Type of operation (perimeter, hole, bend, form, draw)
 * @param {string} toolMaterial - Tool material type
 * @param {number} productionRate - Parts per hour
 * @param {string} toolCoating - Type of tool coating (optional)
 * @returns {Object} - Tool wear estimation data
 */
export const calculateToolWear = (material, operationType, toolMaterial = 'D2', productionRate = 100, toolCoating = 'none') => {
  if (!material || !material.properties) return null;
  
  const temperatureRange = material.temperatureRange || 'room';
  const properties = material.properties[temperatureRange] || {};
  
  // Base wear factors (hits/failure)
  const baseWearFactors = {
    perimeter: 10000,
    hole: 8000,
    bend: 15000,
    form: 6000,
    draw: 5000,
    general: 8000
  };
  
  // Tool material multipliers
  const toolMaterialFactors = {
    'D2': 1.0,
    'A2': 0.8,
    'M2': 1.2,
    'M4': 1.5,
    'PM-M4': 2.0,
    'carbide': 4.0,
    'powdered': 2.5
  };
  
  // NEW: Tool coating factors - higher values mean better wear resistance
  const toolCoatingFactors = {
    'none': 1.0,
    'TiN': 2.5,        // Titanium Nitride
    'TiCN': 3.0,       // Titanium Carbonitride
    'TiAlN': 3.2,      // Titanium Aluminum Nitride
    'CrN': 2.2,        // Chromium Nitride
    'DLC': 4.0,        // Diamond-Like Carbon
    'AlCrN': 3.5,      // Aluminum Chromium Nitride
    'ZrN': 2.0,        // Zirconium Nitride
    'CVD-diamond': 6.0 // Chemical Vapor Deposition Diamond
  };
  
  // Get base wear factor
  const baseWearFactor = baseWearFactors[operationType] || baseWearFactors.general;
  
  // Get tool material factor
  const toolMaterialFactor = toolMaterialFactors[toolMaterial] || 1.0;
  
  // NEW: Get coating factor
  const coatingFactor = toolCoatingFactors[toolCoating] || 1.0;
  
  // Calculate material-specific wear factors
  const hardnessWearFactor = calculateHardnessWearFactor(properties.hardness);
  const frictionWearFactor = calculateFrictionWearFactor(properties.frictionCoefficient);
  const temperatureWearFactor = calculateTemperatureWearFactor(temperatureRange);
  
  // Calculate total wear factor - now includes coating factor
  const totalWearFactor = (hardnessWearFactor * frictionWearFactor * temperatureWearFactor) / coatingFactor;
  
  // Define base values for life calculation
  const baseLifeHits = 10000; // Base number of hits for tool life calculation
  const baseWearRate = 0.015; // Base wear rate in mm per 10,000 hits
  
  // Calculate estimated tool life in hits
  const estimatedLife = Math.round(baseLifeHits / (baseWearRate * totalWearFactor) * coatingFactor);
  
  // Calculate hours until maintenance
  const hoursUntilMaintenance = Math.round(estimatedLife / productionRate);
  
  // Calculate wear rate (mm per 10,000 hits)
  const wearRate = calculateWearRate(properties.hardness, properties.frictionCoefficient) / coatingFactor;
  
  // Calculate maintenance intervals
  const maintenanceIntervals = calculateMaintenanceIntervals(estimatedLife, productionRate);
  
  // Calculate cost factors - updated to include coating costs
  const costFactors = calculateCostFactors(toolMaterialFactor, totalWearFactor, toolCoating);
  
  // Generate wear recommendations
  const recommendations = generateWearRecommendations(operationType, properties, totalWearFactor, toolCoating);
  
  // Generate tool material comparisons
  const materialComparisons = generateToolMaterialComparisons(toolMaterial, totalWearFactor, estimatedLife, productionRate);
  
  // NEW: Generate coating comparisons
  const coatingComparisons = generateCoatingComparisons(toolCoating, totalWearFactor, estimatedLife, productionRate);
  
  return {
    estimatedLifeInHits: estimatedLife,
    hoursUntilMaintenance,
    wearRate,
    wearFactor: totalWearFactor,
    materialHardnessFactor: hardnessWearFactor,
    materialFrictionFactor: frictionWearFactor,
    temperatureFactor: temperatureWearFactor,
    coatingFactor: coatingFactor,  // NEW: Added coating factor to output
    maintenanceIntervals,
    recommendations,
    materialComparisons,
    coatingComparisons,   // NEW: Added coating comparisons to output
    costFactors
  };
};

/**
 * Calculates wear factor based on material hardness
 * 
 * @param {number} hardness - Material hardness value
 * @returns {number} - Hardness wear factor
 */
const calculateHardnessWearFactor = (hardness = 100) => {
  // Higher hardness = higher wear factor
  // Normalized around 100 HB (common for mild steel)
  const hardnessFactor = Math.pow(hardness / 100, 1.5);
  
  // Limit to reasonable range
  return Math.max(0.2, Math.min(hardnessFactor, 5.0));
};

/**
 * Calculates wear factor based on friction coefficient
 * 
 * @param {number} frictionCoefficient - Material friction coefficient
 * @returns {number} - Friction wear factor
 */
const calculateFrictionWearFactor = (frictionCoefficient = 0.3) => {
  // Higher friction = higher wear factor
  // Normalized around 0.3 (common value)
  const frictionFactor = Math.pow(frictionCoefficient / 0.3, 2);
  
  // Limit to reasonable range
  return Math.max(0.5, Math.min(frictionFactor, 3.0));
};

/**
 * Calculates wear factor based on temperature range
 * 
 * @param {string} temperatureRange - Temperature range (room, warm, hot)
 * @returns {number} - Temperature wear factor
 */
const calculateTemperatureWearFactor = (temperatureRange) => {
  switch(temperatureRange) {
    case 'room':
      return 1.0;
    case 'warm':
      return 1.5;
    case 'hot':
      return 2.2;
    default:
      return 1.0;
  }
};

/**
 * Calculates wear rate in mm per 10,000 hits
 * 
 * @param {number} hardness - Material hardness value
 * @param {number} frictionCoefficient - Material friction coefficient
 * @returns {number} - Wear rate in mm per 10,000 hits
 */
const calculateWearRate = (hardness = 100, frictionCoefficient = 0.3) => {
  // Base wear rate is 0.015mm per 10,000 hits (typical for D2 tool steel on mild steel)
  const baseWearRate = 0.015;
  
  // Calculate wear rate multiplier
  const wearMultiplier = (hardness / 100) * Math.pow(frictionCoefficient / 0.3, 1.2);
  
  return parseFloat((baseWearRate * wearMultiplier).toFixed(4));
};

/**
 * Calculates maintenance intervals
 * 
 * @param {number} estimatedLife - Estimated tool life in hits
 * @param {number} productionRate - Parts per hour
 * @returns {Object} - Maintenance interval recommendations
 */
const calculateMaintenanceIntervals = (estimatedLife, productionRate) => {
  // Recommended inspections at 20%, 40%, 60%, and 80% of estimated life
  const inspections = [0.2, 0.4, 0.6, 0.8].map(percentage => {
    const hits = Math.round(estimatedLife * percentage);
    const hours = Math.round(hits / productionRate);
    const shifts = Math.ceil(hours / 8);
    
    return {
      percentage: Math.round(percentage * 100),
      hits,
      hours,
      shifts
    };
  });
  
  return {
    inspections,
    resharpening: Math.round(estimatedLife * 0.6),
    replacement: estimatedLife
  };
};

/**
 * Calculates cost factors for tooling
 * 
 * @param {number} toolMaterialFactor - Tool material factor
 * @param {number} totalWearFactor - Total wear factor
 * @param {string} toolCoating - Tool coating type
 * @returns {Object} - Cost factor data
 */
const calculateCostFactors = (toolMaterialFactor, totalWearFactor, toolCoating = 'none') => {
  // Base costs (relative values)
  const baseCost = 1.0;
  
  // Tool material cost factor
  const materialCostFactor = Math.pow(toolMaterialFactor, 0.8);
  
  // NEW: Coating cost factors
  const coatingCostFactors = {
    'none': 0,
    'TiN': 0.25,
    'TiCN': 0.35,
    'TiAlN': 0.40,
    'CrN': 0.30,
    'DLC': 0.70,
    'AlCrN': 0.45,
    'ZrN': 0.28,
    'CVD-diamond': 1.20
  };
  
  // Get coating cost factor
  const coatingCostFactor = coatingCostFactors[toolCoating] || 0;
  
  // Maintenance cost factor based on wear
  const maintenanceCostFactor = Math.sqrt(totalWearFactor);
  
  // Cost per 10,000 hits
  const costPer10k = parseFloat((baseCost * materialCostFactor * maintenanceCostFactor).toFixed(2));
  
  // Initial tool cost including coating
  const initialToolCost = baseCost * materialCostFactor + coatingCostFactor;
  
  return {
    baseCost,
    materialCostFactor,
    coatingCostFactor,
    maintenanceCostFactor,
    initialToolCost,
    costPer10k
  };
};

/**
 * Generates wear recommendations based on material properties and operation
 * 
 * @param {string} operationType - Operation type
 * @param {Object} properties - Material properties
 * @param {number} totalWearFactor - Total wear factor
 * @param {string} toolCoating - Tool coating type
 * @returns {Array} - Array of recommendation strings
 */
const generateWearRecommendations = (operationType, properties, totalWearFactor, toolCoating = 'none') => {
  const recommendations = [];
  
  // General recommendations
  if (totalWearFactor > 3.0) {
    recommendations.push('Consider higher grade tool materials to increase tool life.');
  }
  
  if (properties.hardness > 200) {
    recommendations.push('Use carbide tools or inserts for extended tool life.');
  }
  
  if (properties.frictionCoefficient > 0.4) {
    recommendations.push('Apply appropriate lubricant to reduce friction and tool wear.');
  }
  
  // NEW: Coating recommendations based on material and operation
  if (toolCoating === 'none') {
    if (properties.hardness > 150) {
      recommendations.push('Apply TiAlN or AlCrN coating to significantly increase tool life for this hard material.');
    } else {
      recommendations.push('Consider TiN or TiCN coating to improve wear resistance.');
    }
  }
  
  // Operation-specific recommendations
  switch(operationType) {
    case 'perimeter':
    case 'hole':
      recommendations.push('Keep tools sharp to minimize burr formation and reduce wear.');
      recommendations.push('Maintain proper die clearance to optimize tool life.');
      
      // NEW: Operation-specific coating recommendations
      if (toolCoating === 'none' || toolCoating === 'TiN') {
        recommendations.push('For cutting operations, AlCrN or TiAlN coatings provide superior performance.');
      }
      break;
      
    case 'bend':
      recommendations.push('Regularly polish tool surfaces to prevent material pickup.');
      
      // NEW: Operation-specific coating recommendations
      if (toolCoating === 'none') {
        recommendations.push('For bending operations, CrN coatings reduce galling and material pickup.');
      }
      break;
      
    case 'form':
    case 'draw':
      recommendations.push('Use appropriate surface treatments on tools to prevent galling.');
      recommendations.push('Implement effective lubrication strategy to maximize tool life.');
      
      // NEW: Operation-specific coating recommendations
      if (toolCoating === 'none') {
        recommendations.push('For forming operations with high friction, DLC coatings provide optimal performance.');
      }
      break;

    default:
      recommendations.push('Follow manufacturer guidelines for maintenance and lubrication.');
      break;
  }
  
  // Temperature-specific recommendations
  if (properties.temperature > 'room') {
    recommendations.push('Consider tool steel grades designed for elevated temperatures.');
    
    // NEW: Temperature-specific coating recommendations
    if (toolCoating !== 'TiAlN' && toolCoating !== 'AlCrN') {
      recommendations.push('For elevated temperatures, TiAlN and AlCrN coatings maintain hardness better than other coatings.');
    }
  }
  
  return recommendations;
};

/**
 * Generates tool material comparison data
 * 
 * @param {string} currentMaterial - Current tool material
 * @param {number} totalWearFactor - Total wear factor
 * @param {number} currentLife - Current estimated life
 * @param {number} productionRate - Parts per hour
 * @returns {Array} - Array of comparison objects
 */
const generateToolMaterialComparisons = (currentMaterial, totalWearFactor, currentLife, productionRate) => {
  // Tool material options to compare
  const materials = ['D2', 'A2', 'M2', 'M4', 'PM-M4', 'carbide', 'powdered'];
  
  // Tool material factors
  const toolMaterialFactors = {
    'D2': 1.0,
    'A2': 0.8,
    'M2': 1.2,
    'M4': 1.5,
    'PM-M4': 2.0,
    'carbide': 4.0,
    'powdered': 2.5
  };
  
  // Tool material costs (relative to D2)
  const toolMaterialCosts = {
    'D2': 1.0,
    'A2': 0.9,
    'M2': 1.3,
    'M4': 1.6,
    'PM-M4': 2.2,
    'carbide': 4.5,
    'powdered': 2.8
  };
  
  // Filter out current material
  const alternativeMaterials = materials.filter(material => material !== currentMaterial);
  
  // Generate comparisons
  return alternativeMaterials.map(material => {
    const materialFactor = toolMaterialFactors[material];
    const materialCost = toolMaterialCosts[material];
    
    // Calculate life with this material
    const lifeWithMaterial = Math.round(currentLife * (materialFactor / toolMaterialFactors[currentMaterial]));
    
    // Calculate hours between replacements
    const hoursBetweenReplacements = Math.round(lifeWithMaterial / productionRate);
    
    // Calculate cost-effectiveness (life increase / cost increase)
    const costEffectiveness = ((lifeWithMaterial / currentLife) / (materialCost / toolMaterialCosts[currentMaterial])).toFixed(2);
    
    return {
      material,
      lifeIncrease: ((materialFactor / toolMaterialFactors[currentMaterial]) * 100 - 100).toFixed(0) + '%',
      estimatedLife: lifeWithMaterial,
      hoursBetweenReplacements,
      costIncrease: ((materialCost / toolMaterialCosts[currentMaterial]) * 100 - 100).toFixed(0) + '%',
      costEffectiveness,
      recommended: costEffectiveness > 1.1 // Recommended if at least 10% more cost-effective
    };
  });
};

/**
 * NEW: Generates tool coating comparison data
 * 
 * @param {string} currentCoating - Current tool coating
 * @param {number} totalWearFactor - Total wear factor
 * @param {number} currentLife - Current estimated life
 * @param {number} productionRate - Parts per hour
 * @returns {Array} - Array of comparison objects
 */
const generateCoatingComparisons = (currentCoating, totalWearFactor, currentLife, productionRate) => {
  // Tool coating options to compare
  const coatings = ['none', 'TiN', 'TiCN', 'TiAlN', 'CrN', 'DLC', 'AlCrN', 'ZrN', 'CVD-diamond'];
  
  // Tool coating factors
  const toolCoatingFactors = {
    'none': 1.0,
    'TiN': 2.5,
    'TiCN': 3.0,
    'TiAlN': 3.2,
    'CrN': 2.2,
    'DLC': 4.0,
    'AlCrN': 3.5,
    'ZrN': 2.0,
    'CVD-diamond': 6.0
  };
  
  // Tool coating costs (relative to uncoated)
  const toolCoatingCosts = {
    'none': 0,
    'TiN': 0.25,
    'TiCN': 0.35,
    'TiAlN': 0.40,
    'CrN': 0.30,
    'DLC': 0.70,
    'AlCrN': 0.45,
    'ZrN': 0.28,
    'CVD-diamond': 1.20
  };
  
  // Filter out current coating
  const alternativeCoatings = coatings.filter(coating => coating !== currentCoating);
  
  // Generate comparisons
  return alternativeCoatings.map(coating => {
    const coatingFactor = toolCoatingFactors[coating];
    const coatingCost = toolCoatingCosts[coating];
    const currentCoatingFactor = toolCoatingFactors[currentCoating];
    
    // Calculate life with this coating
    const lifeWithCoating = Math.round(currentLife * (coatingFactor / currentCoatingFactor));
    
    // Calculate hours between replacements
    const hoursBetweenReplacements = Math.round(lifeWithCoating / productionRate);
    
    // Calculate cost-effectiveness (life increase relative to cost increase)
    // For none coating, we need to handle differently
    const baseCost = 1.0; // Base tool cost without coating
    const currentTotalCost = currentCoating === 'none' ? baseCost : baseCost + toolCoatingCosts[currentCoating];
    const newTotalCost = coating === 'none' ? baseCost : baseCost + coatingCost;
    
    const costEffectiveness = ((lifeWithCoating / currentLife) / (newTotalCost / currentTotalCost)).toFixed(2);
    
    return {
      coating,
      lifeIncrease: ((coatingFactor / currentCoatingFactor) * 100 - 100).toFixed(0) + '%',
      estimatedLife: lifeWithCoating,
      hoursBetweenReplacements,
      additionalCost: coatingCost === 0 ? "0%" : '+' + (coatingCost * 100).toFixed(0) + '%',
      costEffectiveness,
      recommended: parseFloat(costEffectiveness) > 1.1 // Recommended if at least 10% more cost-effective
    };
  });
}; 