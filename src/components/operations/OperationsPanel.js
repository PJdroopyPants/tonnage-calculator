import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import OperationTypeSelector from './OperationTypeSelector';
import PerimeterSection from './PerimeterSection';
import HolesSection from './HolesSection';
import BendsSection from './BendsSection';
import FormsSection from './FormsSection';
import DrawsSection from './DrawsSection';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NoMaterialMessage = styled.div`
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 4px;
  text-align: center;
  color: var(--secondary-color);
`;

const OperationsPanel = () => {
  const { selected: selectedMaterial } = useSelector(state => state.materials);
  const operations = useSelector(state => state.operations);
  
  if (!selectedMaterial) {
    return (
      <NoMaterialMessage>
        Please select a material to configure operations.
      </NoMaterialMessage>
    );
  }
  
  return (
    <PanelContainer>
      <OperationTypeSelector />
      
      {operations.perimeter.enabled && (
        <PerimeterSection />
      )}
      
      {operations.holes.enabled && (
        <HolesSection />
      )}
      
      {operations.bends.enabled && (
        <BendsSection />
      )}
      
      {operations.forms.enabled && (
        <FormsSection />
      )}
      
      {operations.draws.enabled && (
        <DrawsSection />
      )}
    </PanelContainer>
  );
};

export default OperationsPanel; 