import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { 
  calculateSpringbackAngle, 
  calculateCompensationAngle, 
  calculateSpringbackPercentage,
  getSpringbackSuggestions
} from '../../services/SpringbackService';

const Container = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 16px;
`;

const Title = styled.h4`
  font-size: 1.1rem;
  margin: 0 0 16px 0;
  color: var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectContainer = styled.div`
  margin-bottom: 20px;
`;

const SelectLabel = styled.label`
  font-size: 0.9rem;
  color: var(--secondary-color);
  margin-right: 10px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const ResultBox = styled.div`
  background-color: var(--bg-light);
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const ResultLabel = styled.span`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const ResultValue = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-color);
`;

const HighlightedValue = styled(ResultValue)`
  color: var(--primary-color);
  font-weight: 600;
`;

const SeverityBadge = styled.span`
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  background-color: ${props => 
    props.severity === 'Low' ? 'var(--success-color-light)' : 
    props.severity === 'Medium' ? 'var(--warning-color-light)' : 
    'var(--error-color-light)'
  };
  color: ${props => 
    props.severity === 'Low' ? 'var(--success-color-dark)' : 
    props.severity === 'Medium' ? 'var(--warning-color-dark)' : 
    'var(--error-color-dark)'
  };
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  
  &:hover {
    color: var(--primary-color-dark);
  }
`;

const TipsList = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 16px;
  font-size: 0.9rem;
`;

const TipItem = styled.li`
  margin-bottom: 4px;
`;

const BendInfo = styled.div`
  background-color: #f0f7ff;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
  border-left: 3px solid var(--primary-color);
`;

const BendInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const BendInfoLabel = styled.span`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const BendInfoValue = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const MaterialFactorsBox = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
  border-left: 3px solid #8884d8;
`;

const MaterialFactorsTitle = styled.h5`
  font-size: 1rem;
  margin: 0 0 12px 0;
  color: #555;
`;

const SpringbackDisplay = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMaterialFactors, setShowMaterialFactors] = useState(false);
  const [selectedBendIndex, setSelectedBendIndex] = useState(0);
  
  const { selected: material, temperatureRange } = useSelector(state => state.materials);
  const { thickness, isMetric } = useSelector(state => state.parameters);
  const { bends } = useSelector(state => state.operations);
  
  if (!material || !bends.items || bends.items.length === 0) {
    return null;
  }
  
  const handleBendChange = (e) => {
    setSelectedBendIndex(parseInt(e.target.value, 10));
  };
  
  const selectedBend = bends.items[selectedBendIndex];
  const bendAngle = selectedBend.angle;
  
  // Convert radius-to-thickness to actual radius
  const thicknessInMm = isMetric ? thickness : thickness * 25.4;
  const bendRadiusInMm = selectedBend.radiusToThickness * thicknessInMm;
  
  // Calculate springback
  const springbackAngle = calculateSpringbackAngle(bendAngle, thicknessInMm, bendRadiusInMm, material);
  const compensationAngle = calculateCompensationAngle(bendAngle, thicknessInMm, bendRadiusInMm, material);
  const springbackPercentage = calculateSpringbackPercentage(bendAngle, thicknessInMm, bendRadiusInMm, material);
  
  // Get suggestions
  const suggestions = getSpringbackSuggestions(material);
  
  // Convert bend radius to display units
  const displayBendRadius = isMetric
    ? bendRadiusInMm
    : bendRadiusInMm / 25.4; // Convert mm to inches
    
  // Get material properties from the current temperature range
  const materialProperties = material.properties?.[temperatureRange] || material.properties?.room || {};
  
  // Get modulus and other properties
  const modulus = materialProperties.modulus;
  
  // Check if formingCharacteristics exists and get grain direction effect
  const formingCharacteristics = material.formingCharacteristics || {};
  const grainDirectionEffect = formingCharacteristics.grainDirectionEffect || 'Not specified';
  
  return (
    <Container>
      <Title>
        Springback Prediction
        {suggestions && (
          <SeverityBadge severity={suggestions.severity}>
            {suggestions.severity} Springback
          </SeverityBadge>
        )}
      </Title>
      
      {bends.items.length > 1 && (
        <SelectContainer>
          <SelectLabel htmlFor="bend-select">Select Bend:</SelectLabel>
          <Select
            id="bend-select"
            value={selectedBendIndex}
            onChange={handleBendChange}
          >
            {bends.items.map((bend, index) => (
              <option key={bend.id} value={index}>
                Bend #{index + 1} - {bend.type}, {bend.angle}°
              </option>
            ))}
          </Select>
        </SelectContainer>
      )}
      
      <BendInfo>
        <BendInfoRow>
          <BendInfoLabel>Bend Type:</BendInfoLabel>
          <BendInfoValue>{selectedBend.type === 'v-bend' ? 'V-Bend' : 'U-Bend'}</BendInfoValue>
        </BendInfoRow>
        <BendInfoRow>
          <BendInfoLabel>Bend Angle:</BendInfoLabel>
          <BendInfoValue>{bendAngle}°</BendInfoValue>
        </BendInfoRow>
        <BendInfoRow>
          <BendInfoLabel>Bend Length:</BendInfoLabel>
          <BendInfoValue>{selectedBend.length} {isMetric ? 'mm' : 'in'}</BendInfoValue>
        </BendInfoRow>
        <BendInfoRow>
          <BendInfoLabel>Inner Bend Radius:</BendInfoLabel>
          <BendInfoValue>{displayBendRadius.toFixed(2)} {isMetric ? 'mm' : 'in'}</BendInfoValue>
        </BendInfoRow>
        <BendInfoRow>
          <BendInfoLabel>Radius/Thickness Ratio:</BendInfoLabel>
          <BendInfoValue>{selectedBend.radiusToThickness}</BendInfoValue>
        </BendInfoRow>
      </BendInfo>
      
      <ResultBox>
        <ResultRow>
          <ResultLabel>Material Thickness:</ResultLabel>
          <ResultValue>{thickness} {isMetric ? 'mm' : 'in'}</ResultValue>
        </ResultRow>
        
        <ResultRow>
          <ResultLabel>Target Angle:</ResultLabel>
          <ResultValue>{bendAngle.toFixed(1)}°</ResultValue>
        </ResultRow>
        
        <ResultRow>
          <ResultLabel>Springback:</ResultLabel>
          <ResultValue>{springbackAngle.toFixed(2)}° ({springbackPercentage.toFixed(1)}%)</ResultValue>
        </ResultRow>
        
        <ResultRow>
          <ResultLabel>Overbend To:</ResultLabel>
          <HighlightedValue>{compensationAngle.toFixed(1)}°</HighlightedValue>
        </ResultRow>
        
        <ResultRow>
          <ResultLabel>Recommended Min. Bend Radius:</ResultLabel>
          <ResultValue>{suggestions?.minBendRadius || '1.5t'}</ResultValue>
        </ResultRow>
        
        <ResultRow>
          <ResultLabel>Elastic Modulus:</ResultLabel>
          <ResultValue>{modulus ? `${modulus} GPa` : 'N/A'}</ResultValue>
        </ResultRow>
        
        <ResultRow>
          <ResultLabel>Grain Direction Effect:</ResultLabel>
          <ResultValue>{grainDirectionEffect}</ResultValue>
        </ResultRow>
      </ResultBox>
      
      <div style={{ marginTop: '16px' }}>
        <ToggleButton onClick={() => setShowMaterialFactors(!showMaterialFactors)}>
          {showMaterialFactors ? 'Hide Material Factors' : 'Show Material Factors'}
        </ToggleButton>
      </div>
      
      {showMaterialFactors && (
        <MaterialFactorsBox>
          <MaterialFactorsTitle>Material Factors Affecting Springback</MaterialFactorsTitle>
          
          <ResultRow>
            <ResultLabel>Elastic Modulus:</ResultLabel>
            <ResultValue>{modulus ? `${modulus} GPa` : 'N/A'}</ResultValue>
          </ResultRow>
          
          <ResultRow>
            <ResultLabel>Yield/Tensile Ratio:</ResultLabel>
            <ResultValue>
              {material.yieldStrength && material.tensileStrength 
                ? (material.yieldStrength / material.tensileStrength).toFixed(2) 
                : 'N/A'}
            </ResultValue>
          </ResultRow>
          
          <ResultRow>
            <ResultLabel>Strain Hardening Exponent:</ResultLabel>
            <ResultValue>
              {materialProperties.strainHardeningExponent 
                ? materialProperties.strainHardeningExponent.toFixed(2) 
                : 'N/A'}
            </ResultValue>
          </ResultRow>
          
          <ResultRow>
            <ResultLabel>Anisotropy Ratio:</ResultLabel>
            <ResultValue>
              {materialProperties.anisotropyRatio 
                ? materialProperties.anisotropyRatio.toFixed(2) 
                : 'N/A'}
            </ResultValue>
          </ResultRow>
          
          <ResultRow>
            <ResultLabel>Grain Direction Effect:</ResultLabel>
            <ResultValue>{grainDirectionEffect}</ResultValue>
          </ResultRow>
        </MaterialFactorsBox>
      )}
      
      {suggestions && (
        <>
          <div style={{ marginTop: '16px' }}>
            <ToggleButton onClick={() => setShowSuggestions(!showSuggestions)}>
              {showSuggestions ? 'Hide Recommendations' : 'Show Recommendations'}
            </ToggleButton>
          </div>
          
          {showSuggestions && (
            <ResultBox>
              <ResultRow>
                <ResultLabel>Compensation:</ResultLabel>
                <ResultValue>{suggestions.compensation}</ResultValue>
              </ResultRow>
              
              <div style={{ marginTop: '8px' }}>
                <ResultLabel>Recommendations:</ResultLabel>
                <TipsList>
                  {suggestions.tips.map((tip, index) => (
                    <TipItem key={index}>{tip}</TipItem>
                  ))}
                </TipsList>
              </div>
            </ResultBox>
          )}
        </>
      )}
    </Container>
  );
};

export default SpringbackDisplay; 