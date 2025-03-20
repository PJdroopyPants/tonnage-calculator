import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials, setSelectedMaterial } from '../../store/materialsSlice';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--secondary-color);
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  min-width: 250px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.div`
  color: var(--secondary-color);
  font-style: italic;
  font-size: 0.9rem;
`;

const ErrorText = styled.div`
  color: var(--error-color);
  font-size: 0.9rem;
  margin-top: 4px;
`;

const MaterialSelector = () => {
  const dispatch = useDispatch();
  const { items, selected, loading, error } = useSelector(state => state.materials);
  
  // Fetch materials on component mount
  useEffect(() => {
    if (items.length === 0 && !loading) {
      dispatch(fetchMaterials());
    }
  }, [dispatch, items, loading]);
  
  const handleChange = (e) => {
    const materialId = e.target.value;
    if (materialId) {
      const selectedMaterial = items.find(item => item.id === materialId);
      dispatch(setSelectedMaterial(selectedMaterial));
      // Temperature range will be set automatically by the TemperatureInput component
    } else {
      dispatch(setSelectedMaterial(null));
    }
  };
  
  if (loading) {
    return (
      <SelectorContainer>
        <Label>Material</Label>
        <LoadingText>Loading materials...</LoadingText>
      </SelectorContainer>
    );
  }
  
  if (error) {
    return (
      <SelectorContainer>
        <Label>Material</Label>
        <ErrorText>Error: {error}</ErrorText>
      </SelectorContainer>
    );
  }
  
  return (
    <SelectorContainer>
      <Label htmlFor="material-select">Material</Label>
      <Select 
        id="material-select"
        value={selected ? selected.id : ""}
        onChange={handleChange}
        disabled={items.length === 0}
      >
        <option value="">Select a material</option>
        
        {items.map(material => (
          <option key={material.id} value={material.id}>
            {material.name}
          </option>
        ))}
      </Select>
    </SelectorContainer>
  );
};

export default MaterialSelector; 