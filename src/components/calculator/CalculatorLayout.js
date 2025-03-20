import React from 'react';
import styled from '@emotion/styled';
import MaterialSelector from '../inputs/MaterialSelector';
import UnitToggle from '../inputs/UnitToggle';
import ThicknessInput from '../inputs/ThicknessInput';
import TemperatureInput from '../inputs/TemperatureInput';
import BatchQuantityInput from '../inputs/BatchQuantityInput';
import MaterialPropertiesDisplay from '../results/MaterialPropertiesDisplay';
import OperationsPanel from '../operations/OperationsPanel';
import ResultsPanel from '../results/ResultsPanel';

const CalculatorContainer = styled.div`
  display: flex;
  height: 100%;
  gap: 24px;
`;

const LeftPanel = styled.div`
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: var(--primary-color);
`;

const ParametersForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const CalculatorLayout = () => {
  return (
    <CalculatorContainer>
      <LeftPanel>
        <SectionHeader>
          <Title>Parameters</Title>
        </SectionHeader>
        <ParametersForm>
          <UnitToggle />
          <ThicknessInput />
          <TemperatureInput />
          <BatchQuantityInput />
        </ParametersForm>
        
        <SectionHeader>
          <Title>Material</Title>
        </SectionHeader>
        <ParametersForm>
          <MaterialSelector />
          <MaterialPropertiesDisplay />
        </ParametersForm>
      </LeftPanel>
      
      <RightPanel>
        <OperationsPanel />
        <ResultsPanel />
      </RightPanel>
    </CalculatorContainer>
  );
};

export default CalculatorLayout; 