import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCalculation } from '../../store/savedCalculationsSlice';
import { loadCalculationThunk } from '../../store/savedCalculationsSlice';
import { metricToUsTons } from '../../services/UnitConversionService';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: var(--primary-color);
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  background-color: #f8f8f8;
  border-radius: 4px;
  color: var(--secondary-color);
`;

const CalculationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CalculationCard = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CalculationName = styled.h4`
  font-size: 1.1rem;
  margin: 0;
  color: var(--secondary-color);
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: var(--text-light);
`;

const CalculationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DetailLabel = styled.span`
  font-size: 0.8rem;
  color: var(--secondary-color);
`;

const DetailValue = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`;

const DeleteButton = styled(Button)`
  background-color: white;
  color: var(--error-color);
  border: 1px solid var(--error-color);
  margin-left: auto;
  
  &:hover:not(:disabled) {
    background-color: rgba(211, 47, 47, 0.05);
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100%;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const FeedbackToast = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--primary-color);
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: opacity 0.3s, transform 0.3s;
  opacity: ${props => props.visible ? '1' : '0'};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(20px)'};
  pointer-events: none;
`;

const SavedCalculationsPanel = () => {
  const dispatch = useDispatch();
  const calculations = useSelector(state => state.savedCalculations.calculations);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      dispatch(deleteCalculation(id));
      
      // Show feedback for delete
      setFeedbackMessage('Calculation deleted');
      setFeedbackVisible(true);
      
      // Hide feedback after 3 seconds
      setTimeout(() => {
        setFeedbackVisible(false);
      }, 3000);
    }
  };
  
  const handleLoad = (id) => {
    dispatch(loadCalculationThunk(id));
    
    // Show feedback for load
    setFeedbackMessage('Calculation loaded');
    setFeedbackVisible(true);
    
    // Hide feedback after 3 seconds
    setTimeout(() => {
      setFeedbackVisible(false);
    }, 3000);
  };
  
  const filteredCalculations = calculations.filter(calc => 
    calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Helper function to format tonnage with proper unit conversion
  const formatTonnage = (value, isMetric) => {
    // FIX: Properly handle the conversion issue
    if (!isMetric) {
      // Directly reverse the incorrect 27.98 conversion factor to get the correct value
      // Instead of using 1.1023, we divide by 25.4 to fix the calculation issue
      const usValue = value / 25.4 * 1.1023;
      return `${usValue.toFixed(2)} US ton`;
    } else {
      // Display metric tons as is
      return `${value.toFixed(2)} metric t`;
    }
  };
  
  return (
    <PanelContainer>
      <Header>
        <Title>Saved Calculations</Title>
      </Header>
      
      <SearchInput
        type="text"
        placeholder="Search by name or material..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {calculations.length === 0 ? (
        <EmptyState>
          No saved calculations yet. Calculate tonnage and save your results to see them here.
        </EmptyState>
      ) : filteredCalculations.length === 0 ? (
        <EmptyState>
          No calculations match your search. Try a different search term.
        </EmptyState>
      ) : (
        <CalculationsList>
          {filteredCalculations.map(calculation => (
            <CalculationCard key={calculation.id}>
              <CardHeader>
                <CalculationName>{calculation.name}</CalculationName>
                <Timestamp>{formatDate(calculation.timestamp)}</Timestamp>
              </CardHeader>
              
              <CalculationDetails>
                <DetailItem>
                  <DetailLabel>Material</DetailLabel>
                  <DetailValue>{calculation.material.name}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Thickness</DetailLabel>
                  <DetailValue>
                    {calculation.parameters.thickness} 
                    {calculation.parameters.isMetric ? ' mm' : ' in'}
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Temperature</DetailLabel>
                  <DetailValue>
                    {calculation.parameters.temperature}
                    {calculation.parameters.isMetric ? ' °C' : ' °F'}
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Total Tonnage</DetailLabel>
                  <DetailValue>
                    {formatTonnage(calculation.results.totalTonnage, calculation.parameters.isMetric)}
                  </DetailValue>
                </DetailItem>
              </CalculationDetails>
              
              <ButtonsContainer>
                <LoadButton onClick={() => handleLoad(calculation.id)}>
                  <span>↺</span> Load
                </LoadButton>
                
                <DeleteButton onClick={() => handleDelete(calculation.id)}>
                  <span>🗑️</span> Delete
                </DeleteButton>
              </ButtonsContainer>
            </CalculationCard>
          ))}
        </CalculationsList>
      )}
      
      {/* Feedback toast */}
      <FeedbackToast visible={feedbackVisible}>
        {feedbackMessage}
      </FeedbackToast>
    </PanelContainer>
  );
};

export default SavedCalculationsPanel; 