import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { setTemperatureRange } from '../../store/materialsSlice';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  color: var(--secondary-color);
  margin-top: 4px;
`;

const TemperatureRangeSelector = () => {
  const dispatch = useDispatch();
  const { temperatureRange } = useSelector(state => state.materials);
  const { selected: selectedMaterial } = useSelector(state => state.materials);
  
  const handleChange = (e) => {
    dispatch(setTemperatureRange(e.target.value));
  };
  
  return (
    <SelectorContainer>
      <Label htmlFor="temp-range-select">Temperature Range</Label>
      <Select 
        id="temp-range-select"
        value={temperatureRange || "room"}
        onChange={handleChange}
        disabled={!selectedMaterial}
      >
        <option value="room">Room Temperature (≤ 100°C)</option>
        <option value="warm">Warm Temperature (100-300°C)</option>
        <option value="hot">Hot Temperature ({'>'}300°C)</option>
      </Select>
      <HelpText>
        Select the operating temperature range for accurate material properties
      </HelpText>
    </SelectorContainer>
  );
};

export default TemperatureRangeSelector; 