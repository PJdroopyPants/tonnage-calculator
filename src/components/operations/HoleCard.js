import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { updateHole, removeHole } from '../../store/operationsSlice';

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid var(--border-color);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h4`
  font-size: 1rem;
  margin: 0;
  color: var(--secondary-color);
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #d32f2f;
  }
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  color: var(--secondary-color);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
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

const Select = styled.select`
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const UnitLabel = styled.span`
  margin-left: 8px;
  color: var(--secondary-color);
  font-size: 0.8rem;
  min-width: 25px;
`;

const HoleCard = ({ hole }) => {
  const dispatch = useDispatch();
  const { isMetric } = useSelector(state => state.parameters);
  
  const handleChange = (field, value) => {
    dispatch(updateHole({
      id: hole.id,
      [field]: value
    }));
  };
  
  const handleDelete = () => {
    dispatch(removeHole(hole.id));
  };
  
  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>Hole #{hole.id.slice(-4)}</CardTitle>
        <DeleteButton onClick={handleDelete}>×</DeleteButton>
      </CardHeader>
      
      <InputGrid>
        <InputContainer>
          <Label htmlFor={`hole-shape-${hole.id}`}>Shape</Label>
          <Select
            id={`hole-shape-${hole.id}`}
            value={hole.shape}
            onChange={(e) => handleChange('shape', e.target.value)}
          >
            <option value="circular">Circular</option>
            <option value="square">Square</option>
            <option value="rectangular">Rectangular</option>
          </Select>
        </InputContainer>
        
        <InputContainer>
          <Label htmlFor={`hole-diameter-${hole.id}`}>
            {hole.shape === 'circular' ? 'Diameter' : 
             hole.shape === 'square' ? 'Side Length' : 
             'Length'}
          </Label>
          <InputWrapper>
            <Input
              id={`hole-diameter-${hole.id}`}
              type="number"
              min="0.1"
              step={isMetric ? "0.1" : "0.01"}
              value={hole.diameter}
              onChange={(e) => handleChange('diameter', parseFloat(e.target.value))}
            />
            <UnitLabel>{isMetric ? 'mm' : 'in'}</UnitLabel>
          </InputWrapper>
        </InputContainer>
        
        {hole.shape === 'rectangular' && (
          <InputContainer>
            <Label htmlFor={`hole-width-${hole.id}`}>Width</Label>
            <InputWrapper>
              <Input
                id={`hole-width-${hole.id}`}
                type="number"
                min="0.1"
                step={isMetric ? "0.1" : "0.01"}
                value={hole.width || hole.diameter / 2}
                onChange={(e) => handleChange('width', parseFloat(e.target.value))}
              />
              <UnitLabel>{isMetric ? 'mm' : 'in'}</UnitLabel>
            </InputWrapper>
          </InputContainer>
        )}
        
        <InputContainer>
          <Label htmlFor={`hole-quantity-${hole.id}`}>Quantity</Label>
          <Input
            id={`hole-quantity-${hole.id}`}
            type="number"
            min="1"
            step="1"
            value={hole.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value, 10))}
          />
        </InputContainer>
      </InputGrid>
    </CardContainer>
  );
};

export default HoleCard; 