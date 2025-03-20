import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import MaterialSelector from '../inputs/MaterialSelector';
import ThicknessInput from '../inputs/ThicknessInput';
import TemperatureInput from '../inputs/TemperatureInput';
import QuantityInput from '../inputs/QuantityInput';
import UnitToggle from '../inputs/UnitToggle';

const SidebarContainer = styled.aside`
  grid-area: sidebar;
  background-color: white;
  border-right: 1px solid var(--border-color);
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  color: var(--secondary-color);
  margin-top: 10px;
  margin-bottom: 5px;
`;

const CalculateButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1565c0;
  }
  
  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

const Sidebar = () => {
  const dispatch = useDispatch();
  const { selected: selectedMaterial } = useSelector(state => state.materials);

  const handleCalculate = () => {
    dispatch({ type: 'results/calculateTonnage' });
  };
  
  return (
    <SidebarContainer>
      <SectionTitle>Material Properties</SectionTitle>
      <MaterialSelector />
      
      <SectionTitle>Parameters</SectionTitle>
      <ThicknessInput />
      <TemperatureInput />
      <QuantityInput />
      <UnitToggle />
      
      <CalculateButton 
        onClick={handleCalculate}
        disabled={!selectedMaterial}
      >
        Calculate Tonnage
      </CalculateButton>
    </SidebarContainer>
  );
};

export default Sidebar; 