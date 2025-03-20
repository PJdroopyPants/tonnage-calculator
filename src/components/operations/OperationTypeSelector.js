import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { toggleOperationType, addHole, addBend, addForm, addDraw } from '../../store/operationsSlice';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  color: var(--secondary-color);
`;

const OperationTypes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const OperationLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: ${props => props.checked ? 'rgba(25, 118, 210, 0.1)' : '#f5f5f5'};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.checked ? 'rgba(25, 118, 210, 0.15)' : '#e0e0e0'};
  }
`;

const CheckboxInput = styled.input`
  margin: 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
  width: 16px;
  height: 16px;
  
  &:focus {
    outline: 2px solid rgba(25, 118, 210, 0.6);
  }
`;

const LabelText = styled.span`
  font-size: 0.9rem;
`;

const operationTypes = [
  { id: 'perimeter', label: 'Perimeter Cutting' },
  { id: 'holes', label: 'Hole Punching' },
  { id: 'bends', label: 'Bending' },
  { id: 'forms', label: 'Form Features' },
  { id: 'draws', label: 'Drawing' }
];

const OperationTypeSelector = () => {
  const dispatch = useDispatch();
  const operations = useSelector(state => state.operations);
  
  const handleToggle = (operationType) => {
    const isCurrentlyEnabled = operations[operationType].enabled;
    
    // First toggle the operation type
    dispatch(toggleOperationType(operationType));
    
    // If we're enabling (not disabling) and it's not perimeter, automatically add a default item
    if (!isCurrentlyEnabled && operationType !== 'perimeter') {
      // Check if there are no items already (first time)
      if (operations[operationType].items.length === 0) {
        // Add the appropriate default item based on the operation type
        switch (operationType) {
          case 'holes':
            dispatch(addHole());
            break;
          case 'bends':
            dispatch(addBend());
            break;
          case 'forms':
            dispatch(addForm());
            break;
          case 'draws':
            dispatch(addDraw());
            break;
          default:
            break;
        }
      }
    }
  };
  
  return (
    <SelectorContainer>
      <Title>Select Operations</Title>
      <OperationTypes>
        {operationTypes.map(operation => {
          const isEnabled = operations[operation.id].enabled;
          return (
            <OperationLabel 
              key={operation.id}
              htmlFor={`operation-${operation.id}`}
              checked={isEnabled}
            >
              <CheckboxInput
                type="checkbox"
                id={`operation-${operation.id}`}
                checked={isEnabled}
                onChange={() => handleToggle(operation.id)}
              />
              <LabelText>{operation.label}</LabelText>
            </OperationLabel>
          );
        })}
      </OperationTypes>
    </SelectorContainer>
  );
};

export default OperationTypeSelector; 