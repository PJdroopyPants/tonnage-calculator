import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { setThickness } from '../../store/parametersSlice';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
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
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

const UnitLabel = styled.span`
  margin-left: 8px;
  color: var(--secondary-color);
  font-size: 0.9rem;
  min-width: 30px;
`;

const ThicknessInput = () => {
  const dispatch = useDispatch();
  const { thickness, isMetric } = useSelector(state => state.parameters);
  const { selected: selectedMaterial } = useSelector(state => state.materials);
  
  const handleChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      dispatch(setThickness(value));
    }
  };
  
  return (
    <InputContainer>
      <Label htmlFor="thickness-input">Material Thickness</Label>
      <InputWrapper>
        <Input
          id="thickness-input"
          type="number"
          min="0.01"
          step={isMetric ? "0.1" : "0.001"}
          value={thickness}
          onChange={handleChange}
          disabled={!selectedMaterial}
        />
        <UnitLabel>{isMetric ? 'mm' : 'in'}</UnitLabel>
      </InputWrapper>
    </InputContainer>
  );
};

export default ThicknessInput; 