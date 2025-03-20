import React, { useState } from 'react';
import styled from '@emotion/styled';
import OperationsPanel from '../operations/OperationsPanel';
import ResultsPanel from '../results/ResultsPanel';

const MainContentContainer = styled.main`
  grid-area: main;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--background-color);
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background-color: white;
`;

const Tab = styled.button`
  padding: 12px 20px;
  font-size: 1rem;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--secondary-color)'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : '#f5f5f5'};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('operations');
  
  return (
    <MainContentContainer>
      <TabBar>
        <Tab 
          active={activeTab === 'operations'} 
          onClick={() => setActiveTab('operations')}
        >
          Operations
        </Tab>
        <Tab 
          active={activeTab === 'results'} 
          onClick={() => setActiveTab('results')}
        >
          Results
        </Tab>
      </TabBar>
      
      <ContentArea>
        {activeTab === 'operations' ? (
          <OperationsPanel />
        ) : (
          <ResultsPanel />
        )}
      </ContentArea>
    </MainContentContainer>
  );
};

export default MainContent; 