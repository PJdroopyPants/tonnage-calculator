import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { setBatchQuantity } from '../../store/parametersSlice';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2);
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Unit = styled.div`
  position: absolute;
  right: 12px;
  color: var(--text-light);
  font-size: 0.9rem;
  pointer-events: none;
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  color: var(--text-light);
  margin-top: 4px;
`;

const BatchQuantityInput = () => {
  const dispatch = useDispatch();
  const batchQuantity = useSelector(state => state.parameters.batchQuantity);
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value > 0) {
      dispatch(setBatchQuantity(value));
    }
  };
  
  return (
    <InputContainer>
      <Label htmlFor="batch-quantity">Batch Quantity</Label>
      <InputWrapper>
        <Input
          id="batch-quantity"
          type="number"
          min="1"
          value={batchQuantity}
          onChange={handleChange}
        />
        <Unit>pcs</Unit>
      </InputWrapper>
      <HelpText>Number of identical parts to produce</HelpText>
    </InputContainer>
  );
};

export default BatchQuantityInput; 