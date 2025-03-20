import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { setTemperature } from '../../store/parametersSlice';
import { setTemperatureRange } from '../../store/materialsSlice';

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

const TemperatureRangeIndicator = styled.div`
  margin-top: 4px;
  font-size: 0.8rem;
  color: ${props => 
    props.range === 'room' ? 'var(--success-color)' : 
    props.range === 'warm' ? 'var(--warning-color)' : 
    'var(--error-color)'
  };
`;

const TemperatureInput = () => {
  const dispatch = useDispatch();
  const { temperature, isMetric } = useSelector(state => state.parameters);
  const { selected: selectedMaterial, temperatureRange } = useSelector(state => state.materials);
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      dispatch(setTemperature(value));
    }
  };
  
  // Determine temperature range for indicator
  const getTemperatureRange = () => {
    const tempCelsius = isMetric ? temperature : (temperature - 32) * 5 / 9;
    
    if (tempCelsius <= 100) {
      return { range: 'room', text: 'Room Temperature (≤ 100°C)' };
    } else if (tempCelsius <= 300) {
      return { range: 'warm', text: 'Warm Temperature (100-300°C)' };
    } else {
      return { range: 'hot', text: 'Hot Temperature (> 300°C)' };
    }
  };
  
  const tempRange = getTemperatureRange();
  
  // Automatically set the temperature range when temperature changes
  useEffect(() => {
    if (selectedMaterial && tempRange.range !== temperatureRange) {
      dispatch(setTemperatureRange(tempRange.range));
    }
  }, [dispatch, temperature, isMetric, selectedMaterial, tempRange.range, temperatureRange]);
  
  return (
    <InputContainer>
      <Label htmlFor="temperature-input">Temperature</Label>
      <InputWrapper>
        <Input
          id="temperature-input"
          type="number"
          min={isMetric ? "20" : "68"}
          max={isMetric ? "500" : "932"}
          step="1"
          value={temperature}
          onChange={handleChange}
          disabled={!selectedMaterial}
        />
        <UnitLabel>{isMetric ? '°C' : '°F'}</UnitLabel>
      </InputWrapper>
      {selectedMaterial && (
        <TemperatureRangeIndicator range={tempRange.range}>
          {tempRange.text}
        </TemperatureRangeIndicator>
      )}
    </InputContainer>
  );
};

export default TemperatureInput; 