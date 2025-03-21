import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { generateProcessRecommendations } from '../../services/ProcessRecommendationsService';

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

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--secondary-color);
  margin: 0 0 16px 0;
`;

const OperationSelector = styled.div`
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const RecommendationCard = styled.div`
  background-color: var(--bg-light);
  border-radius: 4px;
  padding: 12px;
  border-left: 3px solid var(--primary-color);
`;

const ParameterName = styled.div`
  font-size: 0.85rem;
  color: var(--secondary-color);
  margin-bottom: 4px;
`;

const ParameterValue = styled.div`
  font-size: 1.05rem;
  font-weight: 500;
`;

const SpecificRecommendations = styled.div`
  background-color: var(--bg-light);
  border-radius: 4px;
  padding: 16px;
  margin-top: 16px;
`;

const SpecificTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary-color);
  margin-bottom: 12px;
`;

const SpecificItem = styled.div`
  margin-bottom: 12px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SpecificLabel = styled.div`
  font-size: 0.85rem;
  color: var(--secondary-color);
  margin-bottom: 2px;
`;

const SpecificValue = styled.div`
  font-size: 0.95rem;
`;

const EfficiencyIndicator = styled.div`
  margin-top: 16px;
  font-size: 0.9rem;
  font-style: italic;
  color: var(--secondary-color);
`;

const RecommendationSection = styled.div`
  margin-bottom: 24px;
`;

const SectionHeader = styled.h5`
  font-size: 1rem;
  color: var(--primary-color);
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
`;

const InfoText = styled.p`
  font-size: 0.85rem;
  color: var(--text-light);
  margin: 12px 0;
  padding: 8px 12px;
  background-color: rgba(25, 118, 210, 0.05);
  border-left: 2px solid var(--primary-color);
  border-radius: 2px;
`;

const ProcessRecommendationsDisplay = () => {
  const [selectedOperation, setSelectedOperation] = useState('general');
  const { selected: material } = useSelector(state => state.materials);
  const operations = useSelector(state => state.operations);
  
  if (!material) {
    return null;
  }
  
  const handleOperationChange = (e) => {
    setSelectedOperation(e.target.value);
  };
  
  // Generate recommendations based on selected operation type
  const recommendations = generateProcessRecommendations(material, selectedOperation);
  
  if (!recommendations) {
    return null;
  }
  
  // Get enabled operations for the selector
  const enabledOperations = [];
  if (operations.perimeter?.enabled) enabledOperations.push({ id: 'perimeter', name: 'Cutting' });
  if (operations.holes?.enabled) enabledOperations.push({ id: 'hole', name: 'Punching' });
  if (operations.bends?.enabled) enabledOperations.push({ id: 'bend', name: 'Bending' });
  if (operations.forms?.enabled) enabledOperations.push({ id: 'form', name: 'Forming' });
  if (operations.draws?.enabled) enabledOperations.push({ id: 'draw', name: 'Drawing' });
  
  return (
    <Container>
      <Title>{recommendations.title || 'Process Recommendations'}</Title>
      
      <Description>{recommendations.description}</Description>
      
      <OperationSelector>
        <Select 
          value={selectedOperation}
          onChange={handleOperationChange}
        >
          <option value="general">General Parameters</option>
          {enabledOperations.map(op => (
            <option key={op.id} value={op.id}>{op.name} Parameters</option>
          ))}
        </Select>
      </OperationSelector>
      
      <RecommendationSection>
        <SectionHeader>Key Process Parameters</SectionHeader>
        <RecommendationsGrid>
          <RecommendationCard>
            <ParameterName>Die Clearance</ParameterName>
            <ParameterValue>{recommendations.dieClearance}</ParameterValue>
          </RecommendationCard>
          
          <RecommendationCard>
            <ParameterName>Punch Speed</ParameterName>
            <ParameterValue>{recommendations.punchSpeed}</ParameterValue>
          </RecommendationCard>
          
          <RecommendationCard>
            <ParameterName>Blank Holding Force</ParameterName>
            <ParameterValue>{recommendations.blankHoldingForce}</ParameterValue>
          </RecommendationCard>
          
          <RecommendationCard>
            <ParameterName>Lubricant Type</ParameterName>
            <ParameterValue>{recommendations.lubricantType}</ParameterValue>
          </RecommendationCard>
          
          <RecommendationCard>
            <ParameterName>Temperature Range</ParameterName>
            <ParameterValue>{recommendations.temperatureRange}</ParameterValue>
          </RecommendationCard>
          
          <RecommendationCard>
            <ParameterName>Maximum Forming Depth</ParameterName>
            <ParameterValue>{recommendations.maxFormingDepth}</ParameterValue>
          </RecommendationCard>
        </RecommendationsGrid>
        
        <InfoText>
          These parameters are optimized for the selected material and operation. 
          Proper die clearance, punch speed, and blank holding force are critical for reducing tonnage requirements 
          and improving part quality.
        </InfoText>
      </RecommendationSection>
      
      <RecommendationSection>
        <SectionHeader>Material-Specific Process Factors</SectionHeader>
        <RecommendationsGrid>
          <RecommendationCard>
            <ParameterName>Grain Direction Effect</ParameterName>
            <ParameterValue>{recommendations.grainDirectionEffect}</ParameterValue>
          </RecommendationCard>
          
          {recommendations.specific && Object.entries(recommendations.specific)
            .filter(([key]) => !['blankHolderPressure'].includes(key))
            .slice(0, 5)
            .map(([key, value]) => (
              <RecommendationCard key={key}>
                <ParameterName>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</ParameterName>
                <ParameterValue>{value}</ParameterValue>
              </RecommendationCard>
            ))
          }
        </RecommendationsGrid>
      </RecommendationSection>
      
      {recommendations.specific && recommendations.specific.blankHolderPressure && (
        <SpecificRecommendations>
          <SpecificTitle>Advanced Process Settings</SpecificTitle>
          <SpecificItem>
            <SpecificLabel>Blank Holder Pressure</SpecificLabel>
            <SpecificValue>{recommendations.specific.blankHolderPressure}</SpecificValue>
          </SpecificItem>
          {selectedOperation === 'draw' && (
            <InfoText>
              Proper blank holder pressure is critical for drawing operations to prevent wrinkling while allowing material flow.
              Adjust blank holder pressure throughout the stroke for optimal results.
            </InfoText>
          )}
        </SpecificRecommendations>
      )}
      
      {recommendations.specific && Object.entries(recommendations.specific).length > 6 && (
        <SpecificRecommendations>
          <SpecificTitle>Operation-Specific Parameters</SpecificTitle>
          
          {Object.entries(recommendations.specific)
            .filter(([key]) => !['blankHolderPressure'].includes(key))
            .slice(5)
            .map(([key, value]) => (
              <SpecificItem key={key}>
                <SpecificLabel>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</SpecificLabel>
                <SpecificValue>{value}</SpecificValue>
              </SpecificItem>
            ))
          }
        </SpecificRecommendations>
      )}
      
      <EfficiencyIndicator>
        Tonnage Efficiency Factor: {recommendations.tonnageEfficiencyFactor}
        {recommendations.tonnageEfficiencyFactor < 1 
          ? ' (Reduces required tonnage)' 
          : ' (Increases required tonnage)'}
      </EfficiencyIndicator>
    </Container>
  );
};

export default ProcessRecommendationsDisplay; 