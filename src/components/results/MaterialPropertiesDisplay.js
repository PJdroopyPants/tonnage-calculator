import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { colors, spacing, typography, borders } from '../../assets/theme';
import { TemperatureEffectChart, MaterialPropertyRadarChart } from '../common/EngineeringCharts';
import EngineeringDataCard, { TabContainer, Tab } from '../common/EngineeringDataCard';
import { MaterialLimitWarning } from '../common/EngineeringStatusIndicators';

const PropertiesContainer = styled.div`
  margin-top: ${spacing.lg};
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const PropertyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  background-color: ${colors.neutral.offWhite};
  padding: ${spacing.md};
  border-radius: ${borders.radius.md};
`;

const PropertyLabel = styled.span`
  font-size: ${typography.sizes.sm};
  color: ${colors.secondary.main};
`;

const PropertyValue = styled.span`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.neutral.black};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary.main};
  font-size: ${typography.sizes.sm};
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-top: ${spacing.md};
  
  &:hover {
    color: ${colors.primary.dark};
  }
`;

const TemperatureRangeBadge = styled.span`
  font-size: ${typography.sizes.xs};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borders.radius.round};
  font-weight: ${typography.fontWeights.medium};
  margin-left: ${spacing.sm};
  background-color: ${props => 
    props.range === 'room' ? colors.status.success.bg : 
    props.range === 'warm' ? colors.status.warning.bg : 
    colors.status.danger.bg
  };
  color: ${props => 
    props.range === 'room' ? colors.status.success.dark : 
    props.range === 'warm' ? colors.status.warning.dark : 
    colors.status.danger.dark
  };
`;

const TemperatureInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
  font-size: ${typography.sizes.sm};
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.neutral.offWhite};
  border-radius: ${borders.radius.md};
`;

const Description = styled.p`
  font-size: ${typography.sizes.sm};
  color: ${colors.secondary.main};
  margin: 0 0 ${spacing.md} 0;
  line-height: ${typography.lineHeights.base};
`;

const ChartContainer = styled.div`
  margin-top: ${spacing.xl};
`;

// Generate temperature effect data
const generateTemperatureEffectData = (material) => {
  if (!material || !material.properties) return [];
  
  const roomProps = material.properties.room || {};
  const warmProps = material.properties.warm || {};
  const hotProps = material.properties.hot || {};
  
  // Temperature points (approximately)
  const roomTemp = 25;
  const warmTemp = 200;
  const hotTemp = 400;
  
  const data = [
    {
      temperature: roomTemp,
      tensileStrength: roomProps.tensileStrength || 0,
      yieldStrength: roomProps.yieldStrength || 0,
      elongation: roomProps.elongation || 0
    }
  ];
  
  if (warmProps.tensileStrength) {
    data.push({
      temperature: warmTemp,
      tensileStrength: warmProps.tensileStrength || 0,
      yieldStrength: warmProps.yieldStrength || 0,
      elongation: warmProps.elongation || 0
    });
  }
  
  if (hotProps.tensileStrength) {
    data.push({
      temperature: hotTemp,
      tensileStrength: hotProps.tensileStrength || 0,
      yieldStrength: hotProps.yieldStrength || 0,
      elongation: hotProps.elongation || 0
    });
  }
  
  // Add intermediate points if we have enough data
  if (data.length >= 2) {
    // Add more points to make a smoother curve
    const enhanced = [];
    
    for (let i = 0; i < data.length - 1; i++) {
      enhanced.push(data[i]);
      
      // Add intermediate points
      const current = data[i];
      const next = data[i + 1];
      const middle = {
        temperature: (current.temperature + next.temperature) / 2,
        tensileStrength: (current.tensileStrength + next.tensileStrength) / 2,
        yieldStrength: (current.yieldStrength + next.yieldStrength) / 2,
        elongation: (current.elongation + next.elongation) / 2
      };
      
      enhanced.push(middle);
    }
    
    enhanced.push(data[data.length - 1]);
    return enhanced;
  }
  
  return data;
};

// Generate normalized property radar data
const generatePropertyRadarData = (properties) => {
  if (!properties) return [];
  
  // Normalize properties to a 0-100 scale based on typical ranges
  const normalizeValue = (value, min, max) => {
    if (!value) return 0;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };
  
  return [
    {
      property: 'Tensile Strength',
      value: normalizeValue(properties.tensileStrength, 100, 1500)
    },
    {
      property: 'Yield Strength',
      value: normalizeValue(properties.yieldStrength, 50, 1200)
    },
    {
      property: 'Elongation',
      value: normalizeValue(properties.elongation, 0, 50)
    },
    {
      property: 'Hardness',
      value: normalizeValue(properties.hardness, 50, 500)
    },
    {
      property: 'Machinability',
      value: normalizeValue(properties.machinability, 0, 100)
    },
    {
      property: 'Weldability',
      value: normalizeValue(properties.weldability, 0, 100)
    }
  ];
};

const MaterialPropertiesDisplay = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const { selected: material, temperatureRange } = useSelector(state => state.materials);
  const { temperature, isMetric } = useSelector(state => state.parameters);
  
  if (!material || !material.properties) {
    return null;
  }
  
  const tempInCelsius = isMetric ? temperature : Math.round((temperature - 32) * 5 / 9);
  
  const rangeLabel = 
    temperatureRange === 'room' ? 'Room Temperature' : 
    temperatureRange === 'warm' ? 'Warm Temperature' : 
    'Hot Temperature';
  
  // Safely get properties with fallbacks to room temperature or defaults
  const getProperties = () => {
    if (!material.properties) return {};
    
    const rangeProps = material.properties[temperatureRange] || material.properties.room || {};
    return rangeProps;
  };
  
  const properties = getProperties();
  
  // Generate visualization data
  const temperatureEffectData = useMemo(
    () => generateTemperatureEffectData(material),
    [material]
  );
  
  const propertyRadarData = useMemo(
    () => generatePropertyRadarData(properties),
    [properties]
  );
  
  // Calculate if we're approaching material limits
  const isNearYieldLimit = tempInCelsius > 100 && temperatureRange !== 'hot';
  const isAtCriticalTemp = tempInCelsius > 300 && temperatureRange !== 'hot';
  
  // Determine severity based on temperature
  const getSeverity = () => {
    if (isAtCriticalTemp) return 'danger';
    if (isNearYieldLimit) return 'warning';
    return 'success';
  };
  
  return (
    <PropertiesContainer>
      <EngineeringDataCard 
        title={`Material Properties: ${material.name}`} 
        severity={getSeverity()}
      >
        <Description>
          Properties shown are adjusted for the current operating temperature 
          of {temperature}°{isMetric ? 'C' : 'F'} ({tempInCelsius}°C).
          {isNearYieldLimit && ' Approaching temperature limits for this material.'}
        </Description>
        
        {isAtCriticalTemp && (
          <MaterialLimitWarning status="danger">
            Warning: Current temperature exceeds recommended operating range for this material.
            Material properties may be significantly degraded.
          </MaterialLimitWarning>
        )}
        
        <TemperatureInfo>
          <span>Temperature regime:</span>
          <TemperatureRangeBadge range={temperatureRange || 'room'}>
            {rangeLabel}
          </TemperatureRangeBadge>
        </TemperatureInfo>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'properties'} 
            onClick={() => setActiveTab('properties')}
          >
            Key Properties
          </Tab>
          <Tab 
            active={activeTab === 'temperature'} 
            onClick={() => setActiveTab('temperature')}
          >
            Temperature Effects
          </Tab>
          <Tab 
            active={activeTab === 'comparison'} 
            onClick={() => setActiveTab('comparison')}
          >
            Property Comparison
          </Tab>
        </TabContainer>
        
        {activeTab === 'properties' && (
          <>
            <PropertyGrid>
              <PropertyItem>
                <PropertyLabel>Tensile Strength</PropertyLabel>
                <PropertyValue>{properties.tensileStrength || 'N/A'} MPa</PropertyValue>
              </PropertyItem>
              
              <PropertyItem>
                <PropertyLabel>Yield Strength</PropertyLabel>
                <PropertyValue>{properties.yieldStrength || 'N/A'} MPa</PropertyValue>
              </PropertyItem>
              
              <PropertyItem>
                <PropertyLabel>Shear Strength</PropertyLabel>
                <PropertyValue>{properties.shearStrength || 'N/A'} MPa</PropertyValue>
              </PropertyItem>
              
              {showAdvanced && (
                <>
                  <PropertyItem>
                    <PropertyLabel>Reverse Factor</PropertyLabel>
                    <PropertyValue>{properties.reverseFactor ? properties.reverseFactor.toFixed(2) : 'N/A'}</PropertyValue>
                  </PropertyItem>
                  
                  <PropertyItem>
                    <PropertyLabel>Elongation</PropertyLabel>
                    <PropertyValue>{properties.elongation ? `${properties.elongation}%` : 'N/A'}</PropertyValue>
                  </PropertyItem>
                  
                  <PropertyItem>
                    <PropertyLabel>Strain Hardening</PropertyLabel>
                    <PropertyValue>
                      {properties.strainHardeningExponent 
                        ? `n = ${properties.strainHardeningExponent.toFixed(2)}` 
                        : 'N/A'}
                    </PropertyValue>
                  </PropertyItem>
                  
                  <PropertyItem>
                    <PropertyLabel>Density</PropertyLabel>
                    <PropertyValue>{properties.density ? `${properties.density} g/cm³` : 'N/A'}</PropertyValue>
                  </PropertyItem>
                  
                  <PropertyItem>
                    <PropertyLabel>Min Bend Radius</PropertyLabel>
                    <PropertyValue>{properties.minimumBendRadius ? `${properties.minimumBendRadius}t` : 'N/A'}</PropertyValue>
                  </PropertyItem>
                  
                  <PropertyItem>
                    <PropertyLabel>Anisotropy Ratio</PropertyLabel>
                    <PropertyValue>
                      {properties.anisotropyRatio 
                        ? properties.anisotropyRatio.toFixed(2) 
                        : 'N/A'}
                    </PropertyValue>
                  </PropertyItem>
                </>
              )}
            </PropertyGrid>
            
            <ToggleButton onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? 'Show Less Properties' : 'Show More Properties'}
            </ToggleButton>
          </>
        )}
        
        {activeTab === 'temperature' && (
          <ChartContainer>
            <TemperatureEffectChart 
              data={temperatureEffectData}
              xAxisLabel="Temperature (°C)"
              yAxisLabel="Property Value (MPa / %)"
              height="350px"
              legendLabels={{
                tensileStrength: "Tensile Strength (MPa)",
                yieldStrength: "Yield Strength (MPa)",
                elongation: "Elongation (%)"
              }}
            />
            <Description>
              This chart shows how key material properties change with temperature. Note that
              tensile and yield strength typically decrease with increasing temperature, while
              elongation may initially increase and then decrease at very high temperatures.
            </Description>
          </ChartContainer>
        )}
        
        {activeTab === 'comparison' && (
          <ChartContainer>
            <MaterialPropertyRadarChart 
              data={propertyRadarData}
              height="350px"
            />
            <Description>
              This radar chart compares different material properties on a normalized scale,
              showing the relative strengths and weaknesses of this material. Values closer
              to the outer edge indicate better performance in that property.
            </Description>
          </ChartContainer>
        )}
      </EngineeringDataCard>
    </PropertiesContainer>
  );
};

export default MaterialPropertiesDisplay; 