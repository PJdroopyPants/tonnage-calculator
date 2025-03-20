import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { saveCalculation } from '../../store/savedCalculationsSlice';
import { formatWithUnit, metricToUsTons } from '../../services/UnitConversionService';
import SpringbackDisplay from './SpringbackDisplay';
import ProcessRecommendationsDisplay from './ProcessRecommendationsDisplay';
import ToolWearDisplay from './ToolWearDisplay';
import SurfaceFinishDisplay from './SurfaceFinishDisplay';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ResultsCard = styled.div`
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

const TotalTonnage = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
`;

const BatchInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background-color: #f5f9ff;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 3px solid var(--primary-color);
`;

const BatchProperty = styled.div`
  display: flex;
  flex-direction: column;
`;

const BatchLabel = styled.span`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const BatchValue = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const ResultItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ResultLabel = styled.div`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const ResultValue = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
`;

const MaterialInfo = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
`;

const MaterialProperty = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const PropertyLabel = styled.span`
  color: var(--secondary-color);
`;

const PropertyValue = styled.span`
  font-weight: 500;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`;

const SaveFeedback = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--primary-color);
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: opacity 0.3s, transform 0.3s;
  opacity: ${props => props.visible ? '1' : '0'};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(20px)'};
  pointer-events: none;
`;

const NoResultsMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  background-color: #f8f8f8;
  border-radius: 4px;
  color: var(--secondary-color);
`;

const ResultsPanel = () => {
  const dispatch = useDispatch();
  const results = useSelector(state => state.results);
  const material = useSelector(state => state.materials.selected);
  const parameters = useSelector(state => state.parameters);
  const operations = useSelector(state => state.operations);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  
  // Helper function to calculate the properly converted total tonnage in imperial units
  const calculateConvertedTotalTonnage = () => {
    if (parameters.isMetric) {
      return results.totalTonnage;
    }
    
    // In imperial mode, we need to recalculate the total
    let convertedTotal = 0;
    
    // Add each component with the correct conversion
    if (operations.perimeter.enabled) {
      convertedTotal += results.perimeterTonnage / 25.4 * 1.1023;
    }
    
    if (operations.holes.enabled) {
      convertedTotal += results.holesTonnage / 25.4 * 1.1023;
    }
    
    if (operations.bends.enabled) {
      convertedTotal += results.bendTonnage / 25.4 * 1.1023;
    }
    
    if (operations.forms.enabled) {
      convertedTotal += results.formTonnage / (25.4 * 25.4) * 1.1023;
    }
    
    if (operations.draws.enabled) {
      convertedTotal += results.drawTonnage / (25.4 * 25.4) * 1.1023;
    }
    
    return convertedTotal;
  };

  // Helper function to format tonnage with proper unit conversion
  const formatTonnage = (value, operationType) => {
    // FIX: Properly handle the conversion issue with a specific check for form and draw operations
    if (!parameters.isMetric) {
      // Use special case for the total tonnage
      if (operationType === 'total') {
        // Use pre-calculated total
        const total = calculateConvertedTotalTonnage();
        return `${total.toFixed(2)} US ton`;
      }
      
      // Special case for reverse tonnage which is calculated as a percentage of total
      if (operationType === 'reverse') {
        // Calculate reverse tonnage based on the corrected total
        const total = calculateConvertedTotalTonnage();
        const reverseFactor = material.reverseTonnageFactor || 0.7;
        const reverseValue = total * reverseFactor;
        return `${reverseValue.toFixed(2)} US ton`;
      }
      
      // Different handling based on operation type
      let usValue;
      
      if (operationType === 'form' || operationType === 'draw') {
        // For form and draw operations, use a different correction factor
        // The 25.4 factor is getting applied twice for these operations
        usValue = value / (25.4 * 25.4) * 1.1023;
      } else {
        // For other operations, use the standard correction
        usValue = value / 25.4 * 1.1023;
      }
      
      return `${usValue.toFixed(2)} US ton`;
    } else {
      // Display metric tons as is
      return `${value.toFixed(2)} metric t`;
    }
  };

  // Helper function to convert tensile strength between MPa and ksi
  const formatTensileStrength = (valueMPa) => {
    if (!parameters.isMetric) {
      // Convert MPa to ksi (1 MPa = 0.145038 ksi)
      const valueKsi = valueMPa * 0.145038;
      return `${valueKsi.toFixed(2)} ksi`;
    } else {
      // Display value in MPa as is
      return `${valueMPa.toFixed(2)} MPa`;
    }
  };
  
  const handleSave = () => {
    dispatch(saveCalculation({
      name: `${material.name} - ${new Date().toLocaleDateString()}`,
      parameters,
      material,
      operations,
      results
    }));
    
    // Show feedback
    setFeedbackVisible(true);
    
    // Hide feedback after 3 seconds
    setTimeout(() => {
      setFeedbackVisible(false);
    }, 3000);
  };
  
  if (!results.calculationComplete || !material) {
    return (
      <NoResultsMessage>
        No calculation results available. Please select a material and configure operations to calculate tonnage.
      </NoResultsMessage>
    );
  }
  
  return (
    <PanelContainer>
      <ResultsCard>
        <CardHeader>
          <Title>Tonnage Calculation Results</Title>
          <TotalTonnage>{formatTonnage(results.totalTonnage, 'total')}</TotalTonnage>
        </CardHeader>
        
        <BatchInfo>
          <BatchProperty>
            <BatchLabel>Per-Piece Tonnage</BatchLabel>
            <BatchValue>{formatTonnage(results.perPieceTotalTonnage || 0, 'total')}</BatchValue>
          </BatchProperty>
          
          <BatchProperty>
            <BatchLabel>Batch Quantity</BatchLabel>
            <BatchValue>{results.batchQuantity || parameters.batchQuantity || 1}</BatchValue>
          </BatchProperty>
          
          <BatchProperty>
            <BatchLabel>Total Batch Tonnage</BatchLabel>
            <BatchValue>{formatTonnage(results.totalTonnage, 'total')}</BatchValue>
          </BatchProperty>
        </BatchInfo>
        
        <ResultsGrid>
          {operations.perimeter.enabled && (
            <ResultItem>
              <ResultLabel>Perimeter Cutting</ResultLabel>
              <ResultValue>{formatTonnage(results.perimeterTonnage, 'perimeter')}</ResultValue>
            </ResultItem>
          )}
          
          {operations.holes.enabled && (
            <ResultItem>
              <ResultLabel>Hole Punching</ResultLabel>
              <ResultValue>{formatTonnage(results.holesTonnage, 'holes')}</ResultValue>
            </ResultItem>
          )}
          
          {operations.bends.enabled && (
            <ResultItem>
              <ResultLabel>Bending</ResultLabel>
              <ResultValue>{formatTonnage(results.bendTonnage, 'bends')}</ResultValue>
            </ResultItem>
          )}
          
          {operations.forms.enabled && (
            <ResultItem>
              <ResultLabel>Form Features</ResultLabel>
              <ResultValue>{formatTonnage(results.formTonnage, 'form')}</ResultValue>
            </ResultItem>
          )}
          
          {operations.draws.enabled && (
            <ResultItem>
              <ResultLabel>Drawing</ResultLabel>
              <ResultValue>{formatTonnage(results.drawTonnage, 'draw')}</ResultValue>
            </ResultItem>
          )}
          
          <ResultItem>
            <ResultLabel>Reverse Tonnage</ResultLabel>
            <ResultValue>{formatTonnage(results.reverseTonnage, 'reverse')}</ResultValue>
          </ResultItem>
        </ResultsGrid>
        
        <MaterialInfo>
          <MaterialProperty>
            <PropertyLabel>Material:</PropertyLabel>
            <PropertyValue>{material.name}</PropertyValue>
          </MaterialProperty>
          
          <MaterialProperty>
            <PropertyLabel>Thickness:</PropertyLabel>
            <PropertyValue>
              {parameters.thickness} {parameters.isMetric ? 'mm' : 'in'}
            </PropertyValue>
          </MaterialProperty>
          
          <MaterialProperty>
            <PropertyLabel>Temperature:</PropertyLabel>
            <PropertyValue>
              {parameters.temperature} {parameters.isMetric ? '°C' : '°F'}
            </PropertyValue>
          </MaterialProperty>
          
          <MaterialProperty>
            <PropertyLabel>Tensile Strength:</PropertyLabel>
            <PropertyValue>
              {formatTensileStrength(results.materialProperties.tensileStrength)}
            </PropertyValue>
          </MaterialProperty>
          
          <MaterialProperty>
            <PropertyLabel>Temperature Factor:</PropertyLabel>
            <PropertyValue>
              {results.temperatureEffects.factor?.toFixed(2) || "1.00"}
            </PropertyValue>
          </MaterialProperty>
        </MaterialInfo>
        
        <ButtonsContainer>
          <SaveButton onClick={handleSave}>
            Save Results
          </SaveButton>
        </ButtonsContainer>
      </ResultsCard>
      
      {operations.bends?.enabled && material && (
        <SpringbackDisplay />
      )}
      
      {material && (operations.perimeter?.enabled || operations.holes?.enabled || 
        operations.bends?.enabled || operations.forms?.enabled || operations.draws?.enabled) && (
        <ProcessRecommendationsDisplay />
      )}
      
      {material && (operations.perimeter?.enabled || operations.holes?.enabled || 
        operations.bends?.enabled || operations.forms?.enabled || operations.draws?.enabled) && (
        <ToolWearDisplay />
      )}
      
      {material && (operations.forms?.enabled || operations.draws?.enabled) && (
        <SurfaceFinishDisplay />
      )}
      
      {/* Feedback toast */}
      <SaveFeedback visible={feedbackVisible}>
        Calculation saved successfully
      </SaveFeedback>
    </PanelContainer>
  );
};

export default ResultsPanel; 