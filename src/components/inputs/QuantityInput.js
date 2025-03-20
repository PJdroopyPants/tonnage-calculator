import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { setQuantity } from '../../store/parametersSlice';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--secondary-color);
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

const QuantityInput = () => {
  const dispatch = useDispatch();
  const { quantity } = useSelector(state => state.parameters);
  const { selected: selectedMaterial } = useSelector(state => state.materials);
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      dispatch(setQuantity(value));
    }
  };
  
  return (
    <InputContainer>
      <Label htmlFor="quantity-input">Part Quantity</Label>
      <Input
        id="quantity-input"
        type="number"
        min="1"
        step="1"
        value={quantity}
        onChange={handleChange}
        disabled={!selectedMaterial}
      />
    </InputContainer>
  );
};

export default QuantityInput; 