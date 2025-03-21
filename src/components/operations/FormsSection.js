import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { addForm } from '../../store/operationsSlice';
import FormCard from './FormCard';

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

const FormsList = styled.div`
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

const FormsSection = () => {
  const dispatch = useDispatch();
  const forms = useSelector(state => state.operations.forms.items);
  
  const handleAddForm = () => {
    dispatch(addForm());
  };
  
  return (
    <SectionContainer>
      <SectionHeader>
        <Title>Form Features</Title>
        <AddButton onClick={handleAddForm}>
          <span>+</span> Add Form
        </AddButton>
      </SectionHeader>
      
      <FormsList>
        {forms.length > 0 ? (
          forms.map(form => (
            <FormCard key={form.id} form={form} />
          ))
        ) : (
          <EmptyState>
            No forms added yet. Click "Add Form" to create a form operation.
          </EmptyState>
        )}
      </FormsList>
    </SectionContainer>
  );
};

export default FormsSection; 