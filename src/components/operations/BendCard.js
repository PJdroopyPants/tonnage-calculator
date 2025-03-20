import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { updateBend, removeBend } from '../../store/operationsSlice';
import { ForceDistributionChart } from '../common/EngineeringCharts';
import { colors, spacing, typography, borders } from '../../assets/theme';
import EngineeringDataCard from '../common/EngineeringDataCard';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background-color: ${colors.neutral.white};
  border-radius: ${borders.radius.md};
  border: ${borders.width.thin} solid ${colors.neutral.extraLightGrey};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h4`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.fontWeights.semiBold};
  margin: 0;
  color: ${colors.primary.main};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${colors.status.danger.main};
  cursor: pointer;
  font-size: ${typography.sizes.xl};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${colors.status.danger.dark};
  }
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.md};
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const Label = styled.label`
  font-size: ${typography.sizes.sm};
  color: ${colors.secondary.main};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
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
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
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

const UnitLabel = styled.span`
  margin-left: ${spacing.sm};
  color: ${colors.secondary.main};
  font-size: ${typography.sizes.sm};
  min-width: 25px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary.main};
  cursor: pointer;
  font-size: ${typography.sizes.sm};
  padding: ${spacing.xs} ${spacing.sm};
  display: flex;
  align-items: center;
  margin-top: ${spacing.sm};
  font-weight: ${typography.fontWeights.medium};
  
  &:hover {
    color: ${colors.primary.dark};
    text-decoration: underline;
  }
`;

// Generate force distribution data based on bend parameters
const generateForceDistributionData = (bend, material, thickness) => {
  const { length, angle, radiusToThickness, type } = bend;
  const dataPoints = 20;
  const data = [];
  
  // These are simplified calculations for visualization purposes
  const baseForce = thickness * (angle / 90) * (type === 'v-bend' ? 1 : 1.2);
  const peakMultiplier = type === 'v-bend' ? 1.5 : 1.2;
  
  for (let i = 0; i <= dataPoints; i++) {
    const position = (i / dataPoints) * length;
    const normalized = i / dataPoints;
    
    // Bell curve distribution with edges having less force
    let forceMultiplier;
    if (normalized <= 0.5) {
      forceMultiplier = Math.sin(normalized * Math.PI) * peakMultiplier;
    } else {
      forceMultiplier = Math.sin((1 - normalized) * Math.PI + Math.PI) * peakMultiplier + 1;
    }
    
    data.push({
      position: parseFloat(position.toFixed(1)),
      force: parseFloat((baseForce * forceMultiplier).toFixed(2))
    });
  }
  
  return data;
};

const BendCard = ({ bend }) => {
  const dispatch = useDispatch();
  const { isMetric } = useSelector(state => state.parameters);
  const { selected: material } = useSelector(state => state.materials);
  const { thickness } = useSelector(state => state.parameters);
  const [showVisualization, setShowVisualization] = useState(false);
  
  const handleChange = (field, value) => {
    dispatch(updateBend({
      id: bend.id,
      [field]: value
    }));
  };
  
  const handleDelete = () => {
    dispatch(removeBend(bend.id));
  };
  
  const forceDistributionData = generateForceDistributionData(bend, material, thickness);
  
  // Calculate max force for the reference line
  const maxForce = Math.max(...forceDistributionData.map(d => d.force));
  
  // Material yield strength reference line (simplified for visualization)
  const materialYieldReference = material ? {
    value: maxForce * 0.8,
    label: 'Material Yield Point',
    color: colors.status.warning.main,
    dashed: true
  } : null;
  
  const referenceLines = materialYieldReference ? [materialYieldReference] : [];
  
  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>Bend #{bend.id.slice(-4)}</CardTitle>
        <DeleteButton onClick={handleDelete}>×</DeleteButton>
      </CardHeader>
      
      <InputGrid>
        <InputContainer>
          <Label htmlFor={`bend-type-${bend.id}`}>Bend Type</Label>
          <Select
            id={`bend-type-${bend.id}`}
            value={bend.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="v-bend">V-Bend</option>
            <option value="u-bend">U-Bend</option>
          </Select>
        </InputContainer>
        
        <InputContainer>
          <Label htmlFor={`bend-length-${bend.id}`}>Bend Length</Label>
          <InputWrapper>
            <Input
              id={`bend-length-${bend.id}`}
              type="number"
              min="0.1"
              step={isMetric ? "1" : "0.1"}
              value={bend.length}
              onChange={(e) => handleChange('length', parseFloat(e.target.value))}
            />
            <UnitLabel>{isMetric ? 'mm' : 'in'}</UnitLabel>
          </InputWrapper>
        </InputContainer>
        
        <InputContainer>
          <Label htmlFor={`bend-angle-${bend.id}`}>Bend Angle</Label>
          <InputWrapper>
            <Input
              id={`bend-angle-${bend.id}`}
              type="number"
              min="1"
              max="180"
              step="1"
              value={bend.angle}
              onChange={(e) => handleChange('angle', parseFloat(e.target.value))}
            />
            <UnitLabel>°</UnitLabel>
          </InputWrapper>
        </InputContainer>
        
        <InputContainer>
          <Label htmlFor={`bend-radius-${bend.id}`}>Radius/Thickness Ratio</Label>
          <Input
            id={`bend-radius-${bend.id}`}
            type="number"
            min="0.1"
            step="0.1"
            value={bend.radiusToThickness}
            onChange={(e) => handleChange('radiusToThickness', parseFloat(e.target.value))}
          />
        </InputContainer>
      </InputGrid>
      
      <ToggleButton 
        onClick={() => setShowVisualization(!showVisualization)}
      >
        {showVisualization ? "Hide Force Distribution" : "Show Force Distribution"}
      </ToggleButton>
      
      {showVisualization && material && (
        <EngineeringDataCard
          title="Force Distribution Along Bend"
          severity={maxForce > (materialYieldReference?.value || Infinity) ? 'warning' : 'success'}
          confidenceLevel={85}
        >
          <ForceDistributionChart 
            data={forceDistributionData}
            xAxisLabel={`Position (${isMetric ? 'mm' : 'in'})`}
            yAxisLabel="Force (kN)"
            referenceLines={referenceLines}
            legendLabels={{
              force: `${bend.type === 'v-bend' ? 'V' : 'U'}-Bend Force`
            }}
          />
        </EngineeringDataCard>
      )}
    </CardContainer>
  );
};

export default BendCard; 