import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { calculateSurfaceFinish } from '../../services/SurfaceFinishService';

const SurfaceFinishCard = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: var(--primary-color);
`;

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  width: 100%;
`;

const ResultsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const ResultBox = styled.div`
  padding: 16px;
  border-radius: 4px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
`;

const ResultTitle = styled.h4`
  margin: 0 0 12px 0;
  color: var(--primary-color);
  font-size: 1.1rem;
`;

const ResultValue = styled.div`
  font-size: ${props => props.large ? '2rem' : '1.2rem'};
  font-weight: ${props => props.large ? 'bold' : 'normal'};
  color: ${props => props.color || 'inherit'};
  margin-bottom: ${props => props.large ? '12px' : '8px'};
`;

const ResultLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-light);
`;

const Gauge = styled.div`
  width: 100%;
  height: 12px;
  background-color: #e9ecef;
  border-radius: 6px;
  margin: 8px 0 16px 0;
  position: relative;
  overflow: hidden;
`;

const GaugeFill = styled.div`
  position: absolute;
  height: 100%;
  width: ${props => props.value}%;
  background: ${props => props.color};
  border-radius: 6px;
  transition: width 0.5s ease;
`;

const FactorsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border-color);
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 8px 4px;
  font-size: 0.9rem;
  
  &:first-of-type {
    color: var(--secondary-color);
  }
  
  &:last-of-type {
    text-align: right;
    font-weight: ${props => props.bold ? 'bold' : 'normal'};
  }
`;

const RecommendationsList = styled.ul`
  margin: 12px 0;
  padding-left: 20px;
`;

const RecommendationItem = styled.li`
  margin-bottom: 8px;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const MaterialPropertiesBox = styled.div`
  background-color: #f5f9ff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
  border-left: 3px solid #5c6bc0;
`;

const MaterialPropertiesTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
`;

const MaterialPropertyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const MaterialProperty = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PropertyName = styled.div`
  font-size: 0.85rem;
  color: var(--secondary-color);
`;

const PropertyValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin: 12px 0 0 0;
  line-height: 1.4;
  font-style: italic;
`;

const SurfaceFinishDisplay = () => {
  const material = useSelector(state => state.materials.selected);
  const parameters = useSelector(state => state.parameters);
  const temperatureRange = useSelector(state => state.materials.temperatureRange || 'room');
  
  const [formingParams, setFormingParams] = useState({
    formingSpeed: 'medium',
    toolCondition: 'good',
    lubricantType: 'none'
  });
  
  // Early return if no material selected
  if (!material) {
    return null;
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormingParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Get material properties for the current temperature range
  const materialProperties = material.properties?.[temperatureRange] || material.properties?.room || {};
  
  // Get surface roughness and friction coefficient from material properties
  const surfaceRoughness = materialProperties.surfaceRoughness;
  const frictionCoefficient = materialProperties.frictionCoefficient;
  
  // Calculate surface finish predictions
  const surfaceFinish = calculateSurfaceFinish(material, {
    ...parameters,
    ...formingParams
  }, { type: formingParams.lubricantType });
  
  // Calculate gauge percentage and color based on Ra value
  const getGaugeProps = (ra) => {
    // Convert Ra to a 0-100 scale (log scale since Ra ranges from <1 to >25)
    const percentage = Math.min(100, Math.max(0, Math.log10(ra * 5) * 50));
    
    // Determine color based on Ra value
    let color;
    if (ra < 1.6) color = 'linear-gradient(90deg, #28a745, #8fd19e)';
    else if (ra < 6.3) color = 'linear-gradient(90deg, #ffc107, #ffe083)';
    else color = 'linear-gradient(90deg, #dc3545, #f4a9b0)';
    
    return { value: percentage, color };
  };
  
  // Get lubricant factor for display
  const getLubricantInfo = (type) => {
    const lubricantFactors = {
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
      'chlorinated oil': 0.62,
      'EP oil with MoS2': 0.55,
      'chlorinated oil with EP': 0.52,
      'titanium lubricant': 0.50
    };
    
    const factor = lubricantFactors[type] || 1.0;
    const reduction = Math.round((1 - factor) * 100);
    let effectiveness = "Low";
    
    if (reduction > 40) effectiveness = "Excellent";
    else if (reduction > 30) effectiveness = "Very Good";
    else if (reduction > 20) effectiveness = "Good";
    else if (reduction > 10) effectiveness = "Moderate";
    
    return { factor, reduction, effectiveness };
  };
  
  const lubricantInfo = getLubricantInfo(formingParams.lubricantType);
  
  // If prediction calculation failed
  if (!surfaceFinish) {
    return null;
  }
  
  const gaugeProps = getGaugeProps(surfaceFinish.predictedRa);
  
  return (
    <SurfaceFinishCard>
      <CardHeader>
        <Title>Surface Finish Prediction</Title>
      </CardHeader>
      
      <MaterialPropertiesBox>
        <MaterialPropertiesTitle>Material Surface Properties</MaterialPropertiesTitle>
        <MaterialPropertyGrid>
          <MaterialProperty>
            <PropertyName>Base Surface Roughness</PropertyName>
            <PropertyValue>{surfaceRoughness ? `${surfaceRoughness.toFixed(2)} μm` : 'N/A'}</PropertyValue>
          </MaterialProperty>
          <MaterialProperty>
            <PropertyName>Friction Coefficient</PropertyName>
            <PropertyValue>{frictionCoefficient ? frictionCoefficient.toFixed(2) : 'N/A'}</PropertyValue>
          </MaterialProperty>
          <MaterialProperty>
            <PropertyName>Current Temperature Range</PropertyName>
            <PropertyValue>{temperatureRange === 'room' ? 'Room Temp' : 
                          temperatureRange === 'warm' ? 'Warm Temp' : 'Hot Temp'}</PropertyValue>
          </MaterialProperty>
          <MaterialProperty>
            <PropertyName>Impact Rating</PropertyName>
            <PropertyValue style={{ 
              color: frictionCoefficient > 0.4 ? 'var(--error-color)' : 
                     frictionCoefficient > 0.3 ? 'var(--warning-color)' : 
                     'var(--success-color)'
            }}>
              {frictionCoefficient > 0.4 ? 'High Friction' : 
               frictionCoefficient > 0.3 ? 'Moderate Friction' : 
               'Low Friction'}
            </PropertyValue>
          </MaterialProperty>
        </MaterialPropertyGrid>
        <InfoText>
          Base surface roughness and friction coefficient directly impact the final surface finish of formed parts. Materials with lower initial roughness and friction coefficients generally produce smoother surfaces and require less lubricant.
          {frictionCoefficient > 0.35 && (
            <span style={{ display: 'block', marginTop: '10px', color: 'var(--warning-color-dark)' }}>
              <strong>High Friction Detected:</strong> For materials with high friction coefficients like this one, 
              consider specialized lubricants such as EP Oil, Chlorinated Oil, or lubricants with MoS2 additives.
              {material.name.toLowerCase().includes('titanium') && 
                " Special titanium lubricants are specifically recommended for this material."}
            </span>
          )}
        </InfoText>
      </MaterialPropertiesBox>
      
      <InputContainer>
        <InputGroup>
          <Label>Lubricant Type</Label>
          <Select 
            name="lubricantType" 
            value={formingParams.lubricantType}
            onChange={handleInputChange}
          >
            <option value="none">None</option>
            <option value="light oil">Light Oil</option>
            <option value="medium oil">Medium Oil</option>
            <option value="heavy oil">Heavy Oil</option>
            <option value="emulsion">Emulsion</option>
            <option value="solid film">Solid Film</option>
            <option value="synthetic">Synthetic</option>
            <option value="EP oil">EP Oil (Extreme Pressure)</option>
            <option value="chlorinated oil">Chlorinated Oil</option>
            <option value="water-based">Water-Based</option>
            <option value="semi-synthetic">Semi-Synthetic</option>
            <option value="vegetable-based">Vegetable-Based</option>
            <option value="mineral oil">Mineral Oil</option>
            <optgroup label="Specialized High-Friction Lubricants">
              <option value="EP oil with MoS2">EP Oil with MoS2</option>
              <option value="chlorinated oil with EP">Chlorinated Oil with EP</option>
              <option value="titanium lubricant">Special Titanium Lubricant</option>
            </optgroup>
          </Select>
        </InputGroup>
        
        <InputGroup>
          <Label>Forming Speed</Label>
          <Select 
            name="formingSpeed" 
            value={formingParams.formingSpeed}
            onChange={handleInputChange}
          >
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="very high">Very High</option>
          </Select>
        </InputGroup>
        
        <InputGroup>
          <Label>Tool Condition</Label>
          <Select 
            name="toolCondition" 
            value={formingParams.toolCondition}
            onChange={handleInputChange}
          >
            <option value="new">New</option>
            <option value="good">Good</option>
            <option value="worn">Worn</option>
            <option value="damaged">Damaged</option>
          </Select>
        </InputGroup>
      </InputContainer>
      
      <ResultsPanel>
        <ResultBox>
          <ResultTitle>Surface Roughness (Ra)</ResultTitle>
          <ResultValue large color="var(--primary-color)">
            {surfaceFinish.predictedRa.toFixed(2)} μm
          </ResultValue>
          <ResultLabel>
            {surfaceFinish.surfaceFinishClassification}
          </ResultLabel>
          
          <Gauge>
            <GaugeFill value={gaugeProps.value} color={gaugeProps.color} />
          </Gauge>
          
          <ResultValue>
            {surfaceFinish.qualityAssessment}
          </ResultValue>
        </ResultBox>
        
        <ResultBox>
          <ResultTitle>Contributing Factors</ResultTitle>
          <FactorsTable>
            <tbody>
              <TableRow>
                <TableCell>Material Hardness</TableCell>
                <TableCell>
                  {surfaceFinish.factors && 
                   (surfaceFinish.factors.hardness !== undefined ? 
                    surfaceFinish.factors.hardness.toFixed(2) : "1.00")}x
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Surface Treatment</TableCell>
                <TableCell>
                  {surfaceFinish.factors && 
                   (surfaceFinish.factors.surfaceTreatment !== undefined ? 
                    surfaceFinish.factors.surfaceTreatment.toFixed(2) : "1.00")}x
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Forming Speed</TableCell>
                <TableCell>
                  {surfaceFinish.factors && 
                   (surfaceFinish.factors.speed !== undefined ? 
                    surfaceFinish.factors.speed.toFixed(2) : 
                    surfaceFinish.factors.speedFactor !== undefined ?
                    surfaceFinish.factors.speedFactor.toFixed(2) : "1.00")}x
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tool Condition</TableCell>
                <TableCell>
                  {surfaceFinish.factors && 
                   (surfaceFinish.factors.toolCondition !== undefined ? 
                    surfaceFinish.factors.toolCondition.toFixed(2) : 
                    surfaceFinish.factors.toolConditionFactor !== undefined ?
                    surfaceFinish.factors.toolConditionFactor.toFixed(2) : "1.00")}x
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lubricant Effect</TableCell>
                <TableCell style={{ color: lubricantInfo.reduction > 20 ? 'var(--success-color)' : 'inherit' }}>
                  {surfaceFinish.factors && 
                   (surfaceFinish.factors.lubricantFactor !== undefined ? 
                    surfaceFinish.factors.lubricantFactor.toFixed(2) : 
                    surfaceFinish.factors.lubricant !== undefined ?
                    surfaceFinish.factors.lubricant.toFixed(2) : "1.00")}x 
                  ({lubricantInfo.reduction}% reduction, {lubricantInfo.effectiveness} effectiveness)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell bold>Total</TableCell>
                <TableCell bold>
                  {surfaceFinish.totalFactor !== undefined ? 
                   surfaceFinish.totalFactor.toFixed(2) : "1.00"}x
                </TableCell>
              </TableRow>
            </tbody>
          </FactorsTable>
        </ResultBox>
        
        <ResultBox>
          <ResultTitle>Recommendations</ResultTitle>
          <RecommendationsList>
            {surfaceFinish.recommendations.map((rec, index) => (
              <RecommendationItem key={index}>
                {rec}
              </RecommendationItem>
            ))}
            {/* Add friction-based recommendation */}
            {frictionCoefficient > 0.4 && (
              <RecommendationItem style={{ color: 'var(--error-color)' }}>
                Material has high friction coefficient ({frictionCoefficient.toFixed(2)}). Consider using a heavier lubricant with EP additives.
              </RecommendationItem>
            )}
          </RecommendationsList>
        </ResultBox>
      </ResultsPanel>
    </SurfaceFinishCard>
  );
};

export default SurfaceFinishDisplay; 