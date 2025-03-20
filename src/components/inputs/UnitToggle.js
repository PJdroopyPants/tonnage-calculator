import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { toggleUnits } from '../../store/parametersSlice';

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--primary-color);
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
  
  &:disabled + span {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const UnitLabel = styled.span`
  font-size: 0.9rem;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--secondary-color)'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const UnitToggle = () => {
  const dispatch = useDispatch();
  const { isMetric } = useSelector(state => state.parameters);
  const { selected: selectedMaterial } = useSelector(state => state.materials);
  
  const handleToggle = () => {
    dispatch(toggleUnits());
  };
  
  return (
    <ToggleContainer>
      <Label>Units</Label>
      <ToggleWrapper>
        <UnitLabel active={!isMetric}>Imperial</UnitLabel>
        <ToggleSwitch>
          <ToggleInput 
            type="checkbox" 
            checked={isMetric}
            onChange={handleToggle}
            disabled={!selectedMaterial}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <UnitLabel active={isMetric}>Metric</UnitLabel>
      </ToggleWrapper>
    </ToggleContainer>
  );
};

export default UnitToggle; 