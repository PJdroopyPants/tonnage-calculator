import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { addBend } from '../../store/operationsSlice';
import BendCard from './BendCard';

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

const AddButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: #1565c0;
  }
`;

const BendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: var(--secondary-color);
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const BendsSection = () => {
  const dispatch = useDispatch();
  const { bends } = useSelector(state => state.operations);
  
  const handleAddBend = () => {
    dispatch(addBend());
  };
  
  return (
    <SectionContainer>
      <SectionHeader>
        <Title>Bending</Title>
        <AddButton onClick={handleAddBend}>
          <span>+</span> Add Bend
        </AddButton>
      </SectionHeader>
      
      <BendsList>
        {bends.items.length > 0 ? (
          bends.items.map(bend => (
            <BendCard key={bend.id} bend={bend} />
          ))
        ) : (
          <EmptyState>
            No bends added yet. Click "Add Bend" to create a bend operation.
          </EmptyState>
        )}
      </BendsList>
    </SectionContainer>
  );
};

export default BendsSection; 