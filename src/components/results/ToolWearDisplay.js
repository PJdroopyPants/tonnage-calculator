import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { calculateToolWear } from '../../services/ToolWearService';
import { colors, spacing, typography, borders, shadows } from '../../assets/theme';
import { ToolWearComparisonChart, DataCorrelationChart } from '../common/EngineeringCharts';
import { LinearGauge, CircularGauge, SafetyFactorIndicator, MaterialLimitWarning } from '../common/EngineeringStatusIndicators';
import EngineeringDataCard, { TabContainer, Tab } from '../common/EngineeringDataCard';

const Container = styled.div`
  margin-top: ${spacing.lg};
`;

const Description = styled.p`
  font-size: ${typography.sizes.sm};
  color: ${colors.secondary.main};
  margin: 0 0 ${spacing.md} 0;
  line-height: ${typography.lineHeights.base};
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const Label = styled.label`
  font-size: ${typography.sizes.sm};
  color: ${colors.secondary.main};
`;

const Select = styled.select`
  padding: ${spacing.xs} ${spacing.sm};
  border: ${borders.width.thin} solid ${colors.neutral.extraLightGrey};
  border-radius: ${borders.radius.sm};
  font-size: ${typography.sizes.base};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const Input = styled.input`
  padding: ${spacing.xs} ${spacing.sm};
  border: ${borders.width.thin} solid ${colors.neutral.extraLightGrey};
  border-radius: ${borders.radius.sm};
  font-size: ${typography.sizes.base};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary.main};
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
  margin-bottom: ${spacing.md};
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const ResultCard = styled.div`
  background-color: ${colors.neutral.offWhite};
  border-radius: ${borders.radius.md};
  padding: ${spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const ResultLabel = styled.div`
  font-size: ${typography.sizes.sm};
  color: ${colors.secondary.main};
`;

const ResultValue = styled.div`
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.fontWeights.semiBold};
  color: ${({ color }) => color || colors.neutral.black};
`;

const ChartsContainer = styled.div`
  margin-top: ${spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

const ChartSection = styled.div`
  background-color: ${colors.neutral.white};
  border-radius: ${borders.radius.md};
  padding: ${spacing.lg};
  box-shadow: ${shadows.md};
`;

const ThresholdsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
`;

const Title = styled.h4`
  font-size: 1.1rem;
  margin: 0 0 16px 0;
  color: var(--primary-color);
`;

const ResultsSection = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h5`
  font-size: 1rem;
  color: var(--primary-color);
  margin: 0 0 12px 0;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
`;

const FactorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const FactorCard = styled.div`
  background-color: var(--bg-light);
  border-radius: 4px;
  padding: 10px;
  text-align: center;
`;

const FactorName = styled.div`
  font-size: 0.8rem;
  color: var(--secondary-color);
  margin-bottom: 4px;
`;

const FactorValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => 
    props.value > 2.0 ? 'var(--error-color)' : 
    props.value > 1.4 ? 'var(--warning-color)' : 
    'var(--success-color)'};
`;

const HorizontalTable = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const Th = styled.th`
  padding: 8px 12px;
  text-align: left;
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color-light);
  white-space: nowrap;
  
  &.recommended {
    font-weight: 500;
    color: var(--success-color);
  }
`;

const RecommendationsList = styled.ul`
  margin: 0 0 16px 0;
  padding-left: 18px;
`;

const RecommendationItem = styled.li`
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MaterialPropertiesSection = styled.div`
  margin-top: 20px;
  background-color: #f7f7f7;
  border-radius: 4px;
  padding: 16px;
  border-left: 3px solid #4caf50;
`;

const MaterialPropertiesTitle = styled.h5`
  font-size: 1rem;
  color: #424242;
  margin: 0 0 12px 0;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

const PropertyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PropertyLabel = styled.div`
  font-size: 0.85rem;
  color: var(--secondary-color);
`;

const PropertyValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const ExplanationText = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin: 12px 0 0 0;
  line-height: 1.4;
  font-style: italic;
`;

const generateWearComparisonData = (operations, selectedOperation, toolMaterial, productionRate, batchQuantity) => {
  // Simplified mock data for visualization
  if (!operations) return [];
  
  const data = [];
  const operationTypes = {
    perimeter: 'Perimeter Cutting',
    holes: 'Hole Punching',
    bends: 'Bending',
    forms: 'Forming',
    draws: 'Drawing'
  };
  
  // Tool material wear factors - different materials wear at different rates
  const toolMaterialFactor = {
    steel: 1.0,      // Standard tool steel (baseline)
    carbide: 0.4,    // Tungsten carbide (more wear resistant)
    ceramic: 0.3,    // Ceramic (very wear resistant)
    diamond: 0.15    // Diamond coated (extremely wear resistant)
  };

  // Typical tool life cycles by operation type
  const baseLifeCycles = {
    perimeter: 50000,
    holes: 30000,
    bends: 100000,
    forms: 75000,
    draws: 40000
  };
  
  Object.keys(operations).forEach(opType => {
    if (operations[opType]?.enabled && operations[opType]?.items && operations[opType].items.length > 0) {
      // Skip if filtering by operation type and this is not the selected one
      if (selectedOperation !== 'all' && selectedOperation !== opType) {
        return;
      }
      
      // Calculate operations count for this type
      const operationsCount = operations[opType].items.length;
      
      // Base wear rate per 10,000 operations (as percentage)
      const baseWearRate = 100 / (baseLifeCycles[opType] / 10000);
      
      // Apply material-specific adjustments
      const wearRate = baseWearRate * (toolMaterialFactor[toolMaterial] || 1.0);
      
      // Current wear calculation - assume some initial wear (0.5-5%)
      // This represents the current state of the tool before the batch
      const initialWear = Math.random() * 4.5 + 0.5;
      
      // Operations per batch
      const batchOperations = operationsCount * (batchQuantity || 1000);
      
      // Additional wear from completing the batch
      const batchWear = (wearRate * batchOperations) / 10000;
      
      // Projected wear combines initial wear with batch wear
      const projectedWear = initialWear + batchWear;
      
      data.push({
        operationName: operationTypes[opType],
        operationType: opType,
        currentWear: parseFloat(initialWear.toFixed(1)),
        projectedWear: Math.min(100, parseFloat(projectedWear.toFixed(1))),
        wearRate: parseFloat(wearRate.toFixed(2)),
        operationsCount: operationsCount,
        batchOperations: batchOperations
      });
    }
  });
  
  // Sort by projected wear for better visualization
  return data.sort((a, b) => b.projectedWear - a.projectedWear);
};

const generateToolLifeCorrelationData = (operations, toolMaterial, baseProductionRate) => {
  // If no operations, return empty array
  if (!operations) return [];
  
  // Get the enabled operations
  const enabledOperations = Object.keys(operations).filter(opType => 
    operations[opType]?.enabled && operations[opType]?.items && operations[opType].items.length > 0
  );
  
  // If no enabled operations, return empty array
  if (enabledOperations.length === 0) return [];
  
  // Tool material factors (same as in main calculation)
  const toolMaterialFactor = {
    steel: 1.0,      // Standard tool steel (baseline)
    carbide: 0.4,    // Tungsten carbide (more wear resistant)
    ceramic: 0.3,    // Ceramic (very wear resistant)
    diamond: 0.15    // Diamond coated (extremely wear resistant)
  };
  
  // Tool material costs - impacts replacement economics
  const toolMaterialCosts = {
    steel: 1.0,      // Baseline cost
    carbide: 2.5,    // 2.5x more expensive than steel
    ceramic: 3.2,    // 3.2x more expensive than steel
    diamond: 5.0     // 5x more expensive than steel
  };

  // Base life cycles - will be adjusted by material and production rate
  const baseLifeCycles = {
    perimeter: 50000,
    holes: 30000,
    bends: 100000,
    forms: 75000,
    draws: 40000
  };
  
  const data = [];
  // Generate points for a range of production rates (50% to 200% of base rate)
  const minRate = Math.max(100, baseProductionRate * 0.5);
  const maxRate = baseProductionRate * 2;
  const steps = 15;
  
  for (let i = 0; i < steps; i++) {
    // Calculate a production rate in the range
    const rate = minRate + ((maxRate - minRate) * i / (steps - 1));
    
    // Weighted average tool life based on enabled operations
    let totalOperations = 0;
    let weightedLifeSum = 0;
    
    enabledOperations.forEach(opType => {
      const opCount = operations[opType].items.length;
      totalOperations += opCount;
      
      // Adjust life cycles based on tool material
      const adjustedLifeCycle = baseLifeCycles[opType] * (1 / (toolMaterialFactor[toolMaterial] || 1.0));
      
      // Tool life decreases as production rate increases (wear rate increases with speed)
      // Use a more realistic curve - exponential decay of tool life with increasing production rate
      const rateImpact = Math.pow(0.95, (rate / 1000)); // 5% reduction per 1000 parts/day
      const finalLifeCycle = adjustedLifeCycle * rateImpact;
      
      weightedLifeSum += opCount * finalLifeCycle;
    });
    
    // Calculate average tool life (weighted by operation count)
    const avgToolLife = totalOperations > 0 ? weightedLifeSum / totalOperations : 0;
    
    // Add natural variation (±5%)
    const variation = 0.95 + (Math.random() * 0.1);
    
    data.push({
      productionRate: Math.round(rate),
      toolLife: Math.round(avgToolLife * variation),
      // Include cost data for economics calculations
      dailyCost: Math.round((rate / avgToolLife) * 100 * toolMaterialCosts[toolMaterial])
    });
  }
  
  return data;
};

const calculateLifecycleData = (wearData, toolMaterial, productionRate, batchQuantity) => {
  // Base costs by tool material (average tool cost in dollars)
  const baseCosts = {
    steel: 800,
    carbide: 2000,
    ceramic: 2600,
    diamond: 4000
  };
  
  // Production days to complete the batch
  const productionDays = Math.ceil(batchQuantity / productionRate);
  
  // Get the highest wear operation
  const highestWearOp = wearData.comparisonData.length > 0 ? 
    wearData.comparisonData[0] : null;
  
  // If no operations or wear data, return null
  if (!highestWearOp) return null;
  
  // Calculate days until replacement needed
  const currentWearPercent = highestWearOp.currentWear;
  const wearPerDay = (highestWearOp.projectedWear - currentWearPercent) / productionDays;
  const daysUntilReplacement = wearPerDay > 0 ? 
    Math.floor((50 - currentWearPercent) / wearPerDay) : 180; // 50% is replacement threshold
  
  // Tool cost based on material
  const toolCost = baseCosts[toolMaterial] || baseCosts.steel;
  
  // Calculate replacement costs for the batch
  const replacementsNeeded = Math.max(1, Math.ceil(productionDays / daysUntilReplacement));
  const totalReplacementCost = replacementsNeeded * toolCost;
  
  // Daily maintenance cost (inspection, minor repairs)
  const dailyMaintenanceCost = toolCost * 0.01; // 1% of tool cost per day
  
  // Downtime cost for replacement (assume 2 hours per replacement at $500/hour)
  const downtimeCostPerReplacement = 1000;
  const totalDowntimeCost = replacementsNeeded * downtimeCostPerReplacement;
  
  // Calculate cost per part
  const totalCost = totalReplacementCost + (dailyMaintenanceCost * productionDays) + totalDowntimeCost;
  const costPerPart = batchQuantity > 0 ? (totalCost / batchQuantity) : 0;
  
  // Return lifecycle data
  return {
    currentWearPercent,
    daysUntilReplacement,
    replacementsNeeded,
    costPerPart: costPerPart.toFixed(2),
    totalToolCost: totalReplacementCost,
    maintenanceCost: Math.round(dailyMaintenanceCost * productionDays),
    downtimeCost: totalDowntimeCost,
    totalCost: Math.round(totalCost)
  };
};

const ToolWearDisplay = () => {
  const [selectedOperation, setSelectedOperation] = useState('all');
  const [toolMaterial, setToolMaterial] = useState('carbide');
  const [productionRate, setProductionRate] = useState(5000);
  const [activeTab, setActiveTab] = useState('comparison');
  
  const operations = useSelector(state => state.operations);
  const parameters = useSelector(state => state.parameters);
  const { selected: material, temperatureRange } = useSelector(state => state.materials);
  
  const wearData = useMemo(() => {
    const comparisonData = generateWearComparisonData(
      operations, 
      selectedOperation, 
      toolMaterial, 
      productionRate,
      parameters.batchQuantity
    );
    
    // Calculate also the original wearData for backward compatibility
    const calculatedWear = calculateToolWear(
      selectedOperation === 'all' ? null : selectedOperation,
      toolMaterial,
      productionRate,
      operations
    );
    
    return {
      ...calculatedWear,
      comparisonData
    };
  }, [operations, selectedOperation, toolMaterial, productionRate, parameters.batchQuantity]);
  
  const toolLifeData = useMemo(() => generateToolLifeCorrelationData(
    operations,
    toolMaterial, 
    productionRate
  ), [operations, toolMaterial, productionRate]);
  
  const lifecycleData = useMemo(() => calculateLifecycleData(
    wearData,
    toolMaterial,
    productionRate,
    parameters.batchQuantity || 1000
  ), [wearData, toolMaterial, productionRate, parameters.batchQuantity]);
  
  const handleOperationChange = (e) => {
    setSelectedOperation(e.target.value);
  };
  
  const handleToolMaterialChange = (e) => {
    setToolMaterial(e.target.value);
  };
  
  const handleProductionRateChange = (e) => {
    setProductionRate(parseInt(e.target.value));
  };
  
  // Get the highest wear value for warning indicators
  const maxCurrentWear = wearData.comparisonData.length > 0 
    ? Math.max(...wearData.comparisonData.map(d => d.currentWear))
    : 0;
  
  const maxProjectedWear = wearData.comparisonData.length > 0 
    ? Math.max(...wearData.comparisonData.map(d => d.projectedWear))
    : 0;
  
  if (!wearData) {
    return null;
  }
  
  // Get material properties from the already-fetched material data
  const materialProperties = material?.properties?.[temperatureRange] || material?.properties?.room || {};
  
  return (
    <Container>
      <EngineeringDataCard 
        title="Tool Wear Analysis & Prediction" 
        severity={maxProjectedWear > 50 ? 'danger' : maxProjectedWear > 25 ? 'warning' : 'success'} 
        collapsible={false}
      >
      <Description>
          This analysis estimates tool wear based on material properties, operation types, 
          and batch size. Each operation type has different wear characteristics, and tool 
          material choice significantly impacts wear rates. The current batch of {parameters.batchQuantity || 1000} parts 
          will contribute additional wear to the tools.
      </Description>
      
      <SettingsGrid>
        <InputGroup>
            <Label htmlFor="operation-selector">Operation Type</Label>
          <Select
              id="operation-selector"
              value={selectedOperation}
            onChange={handleOperationChange}
          >
              <option value="all">All Operations</option>
              <option value="perimeter">Perimeter Cutting</option>
              <option value="holes">Hole Punching</option>
              <option value="bends">Bending</option>
              <option value="forms">Forming</option>
              <option value="draws">Drawing</option>
          </Select>
        </InputGroup>
        
        <InputGroup>
            <Label htmlFor="tool-material">Tool Material</Label>
          <Select
              id="tool-material"
            value={toolMaterial}
            onChange={handleToolMaterialChange}
          >
              <option value="steel">Tool Steel</option>
            <option value="carbide">Tungsten Carbide</option>
              <option value="ceramic">Ceramic</option>
              <option value="diamond">Diamond Coated</option>
          </Select>
        </InputGroup>
        
        <InputGroup>
            <Label htmlFor="production-rate">Production Rate (parts/day)</Label>
          <Input
              id="production-rate"
            type="number"
              min="100"
              max="50000"
              step="100"
            value={productionRate}
            onChange={handleProductionRateChange}
          />
        </InputGroup>
          
          <InputGroup>
            <Label htmlFor="batch-quantity">Batch Quantity</Label>
            <Input
              id="batch-quantity"
              type="number"
              value={parameters.batchQuantity || 1000}
              disabled
            />
          </InputGroup>
        </SettingsGrid>
        
        <ThresholdsContainer>
          <LinearGauge 
            value={maxCurrentWear} 
            warning={15} 
            critical={30}
            label="Current Wear Level" 
            unit="%" 
            markers={[
              { value: 15, label: 'Inspect', color: colors.status.warning.main },
              { value: 30, label: 'Replace', color: colors.status.danger.main }
            ]}
          />
          
          <LinearGauge 
            value={maxProjectedWear} 
            warning={25} 
            critical={50}
            label="Projected End-of-Batch Wear" 
            unit="%" 
            markers={[
              { value: 25, label: 'Plan', color: colors.status.warning.main },
              { value: 50, label: 'Critical', color: colors.status.danger.main }
            ]}
          />
        </ThresholdsContainer>
        
        <SafetyFactorIndicator 
          value={2.5} 
          minimum={1.5}
          description="Tool life safety factor relative to expected production volume"
        />
        
        {maxProjectedWear > 50 && (
          <MaterialLimitWarning status="danger">
            Warning: Tool replacement will be necessary before completing the current production batch
          </MaterialLimitWarning>
        )}
        
        <TabContainer>
          <Tab 
            active={activeTab === 'comparison'} 
            onClick={() => setActiveTab('comparison')}
          >
            Wear Comparison
          </Tab>
          <Tab 
            active={activeTab === 'correlation'} 
            onClick={() => setActiveTab('correlation')}
          >
            Production Rate Impact
          </Tab>
          <Tab 
            active={activeTab === 'lifecycle'} 
            onClick={() => setActiveTab('lifecycle')}
          >
            Lifecycle Analysis
          </Tab>
        </TabContainer>
        
        <ChartsContainer>
          {activeTab === 'comparison' && (
            <>
              <ToolWearComparisonChart 
                data={wearData.comparisonData}
                xAxisLabel="Operation Type"
                yAxisLabel="Tool Wear (%)"
                height="350px"
                legendLabels={{
                  currentWear: "Current Wear",
                  projectedWear: "Projected End-of-Batch"
                }}
              />
              <Description>
                The chart shows current tool wear and projected wear after processing the current batch.
                Tool life is based on operation type, material properties, and tool material. 
                {wearData.comparisonData.length > 0 && wearData.comparisonData[0].projectedWear > 30 && (
                  ` Tools for ${wearData.comparisonData[0].operationName} will need replacement sooner.`
                )}
              </Description>
              <ResultsGrid>
                {wearData.comparisonData.map((item, index) => (
                  <ResultCard key={index}>
                    <ResultLabel>{item.operationName}</ResultLabel>
                    <ResultValue>
                      Wear rate: {item.wearRate}% per 10k operations
                    </ResultValue>
                    <div style={{ fontSize: typography.sizes.sm, color: colors.neutral.mediumGrey }}>
                      Operations per batch: {item.operationsCount} × {parameters.batchQuantity || 1000} = {item.batchOperations.toLocaleString()}
                    </div>
                  </ResultCard>
                ))}
              </ResultsGrid>
            </>
          )}
          
          {activeTab === 'correlation' && (
            <>
              <DataCorrelationChart 
                data={toolLifeData}
                xAxisDataKey="productionRate"
                yAxisDataKey="toolLife"
                xAxisLabel="Production Rate (parts/day)"
                yAxisLabel="Expected Tool Life (cycles)"
                height="350px"
                legendLabel="Tool Life Data Points"
              />
              <Description>
                This chart shows how production rate impacts tool life expectancy. Higher production speeds 
                cause increased wear rates due to higher temperatures and forces at the tool-material interface.
                The selected tool material ({toolMaterial}) has a significant impact on this relationship.
              </Description>
              <ResultsGrid>
                {toolLifeData.length > 0 && [
                  toolLifeData[0], 
                  toolLifeData[Math.floor(toolLifeData.length / 2)],
                  toolLifeData[toolLifeData.length - 1]
                ].map((item, index) => (
                  <ResultCard key={index}>
                    <ResultLabel>
                      {index === 0 ? 'Low Rate' : index === 1 ? 'Current Rate' : 'High Rate'}
                    </ResultLabel>
                    <ResultValue>
                      {item.productionRate.toLocaleString()} parts/day
                    </ResultValue>
                    <div style={{ fontSize: typography.sizes.sm, color: colors.neutral.mediumGrey }}>
                      Tool life: {item.toolLife.toLocaleString()} cycles<br/>
                      Daily cost: ${item.dailyCost}
                    </div>
                  </ResultCard>
                ))}
              </ResultsGrid>
            </>
          )}
          
          {activeTab === 'lifecycle' && lifecycleData && (
            <>
              <ResultsGrid>
                <CircularGauge 
                  value={Math.floor(100 - maxCurrentWear)}
                  min={0}
                  max={100}
                  warning={40}
                  critical={20}
                  label="Remaining Tool Life"
                  unit="%"
                  size="150px"
                />
                
                <ResultCard>
                  <ResultLabel>Time Until Replacement</ResultLabel>
                  <ResultValue color={lifecycleData.daysUntilReplacement < 7 ? colors.status.danger.main : 
                                lifecycleData.daysUntilReplacement < 14 ? colors.status.warning.main : 
                                colors.primary.main}>
                    {lifecycleData.daysUntilReplacement} days
                  </ResultValue>
                  <div style={{ fontSize: typography.sizes.sm, color: colors.neutral.mediumGrey }}>
                    Based on current wear of {lifecycleData.currentWearPercent.toFixed(1)}%
                  </div>
                </ResultCard>
                
                <ResultCard>
                  <ResultLabel>Batch Economics</ResultLabel>
                  <ResultValue>
                    ${lifecycleData.costPerPart} per part
                  </ResultValue>
                  <div style={{ fontSize: typography.sizes.sm, color: colors.neutral.mediumGrey }}>
                    Total tooling cost: ${lifecycleData.totalCost.toLocaleString()}
                  </div>
                </ResultCard>
              </ResultsGrid>
              
              <Description style={{ marginTop: spacing.lg }}>
                Economic breakdown for processing {parameters.batchQuantity || 1000} parts with 
                {toolMaterial === 'steel' ? ' standard steel' : 
                 toolMaterial === 'carbide' ? ' tungsten carbide' : 
                 toolMaterial === 'ceramic' ? ' ceramic' : 
                 ' diamond-coated'} tools:
              </Description>
              
              <ResultsGrid>
                <ResultCard>
                  <ResultLabel>Tool Replacement</ResultLabel>
                  <ResultValue>
                    ${lifecycleData.totalToolCost.toLocaleString()}
                  </ResultValue>
                  <div style={{ fontSize: typography.sizes.sm, color: colors.neutral.mediumGrey }}>
                    Replacements needed: {lifecycleData.replacementsNeeded}
                  </div>
                </ResultCard>
                
                <ResultCard>
                  <ResultLabel>Maintenance Cost</ResultLabel>
                  <ResultValue>
                    ${lifecycleData.maintenanceCost.toLocaleString()}
                  </ResultValue>
                  <div style={{ fontSize: typography.sizes.sm, color: colors.neutral.mediumGrey }}>
                    Includes inspection and minor repairs
                  </div>
                </ResultCard>
                
                <ResultCard>
                  <ResultLabel>Downtime Cost</ResultLabel>
                  <ResultValue>
                    ${lifecycleData.downtimeCost.toLocaleString()}
                  </ResultValue>
                  <div style={{ fontSize: typography.sizes.sm, color: colors.neutral.mediumGrey }}>
                    Lost production during tool changes
                  </div>
                </ResultCard>
              </ResultsGrid>
            </>
          )}
        </ChartsContainer>
      </EngineeringDataCard>
    </Container>
  );
};

export default ToolWearDisplay; 