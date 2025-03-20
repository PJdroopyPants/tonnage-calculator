import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { setPerimeterLength } from '../../store/operationsSlice';

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  color: var(--secondary-color);
`;

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

const PerimeterSection = () => {
  const dispatch = useDispatch();
  const { perimeter } = useSelector(state => state.operations);
  const { isMetric } = useSelector(state => state.parameters);
  
  const handleLengthChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      dispatch(setPerimeterLength(value));
    }
  };
  
  return (
    <SectionContainer>
      <SectionHeader>
        <Title>Perimeter Cutting</Title>
      </SectionHeader>
      
      <InputContainer>
        <Label htmlFor="perimeter-length">Perimeter Length</Label>
        <InputWrapper>
          <Input
            id="perimeter-length"
            type="number"
            min="0"
            step={isMetric ? "1" : "0.1"}
            value={perimeter.length}
            onChange={handleLengthChange}
          />
          <UnitLabel>{isMetric ? 'mm' : 'in'}</UnitLabel>
        </InputWrapper>
      </InputContainer>
    </SectionContainer>
  );
};

export default PerimeterSection; 