import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { addHole } from '../../store/operationsSlice';
import HoleCard from './HoleCard';

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

const HolesList = styled.div`
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

const HolesSection = () => {
  const dispatch = useDispatch();
  const { holes } = useSelector(state => state.operations);
  
  const handleAddHole = () => {
    dispatch(addHole());
  };
  
  return (
    <SectionContainer>
      <SectionHeader>
        <Title>Hole Punching</Title>
        <AddButton onClick={handleAddHole}>
          <span>+</span> Add Hole
        </AddButton>
      </SectionHeader>
      
      <HolesList>
        {holes.items.length > 0 ? (
          holes.items.map(hole => (
            <HoleCard key={hole.id} hole={hole} />
          ))
        ) : (
          <EmptyState>
            No holes added yet. Click "Add Hole" to create a hole operation.
          </EmptyState>
        )}
      </HolesList>
    </SectionContainer>
  );
};

export default HolesSection; 