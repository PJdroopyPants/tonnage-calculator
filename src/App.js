import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { fetchMaterials } from './store/materialsSlice';
import { calculateTonnage } from './store/resultsSlice';
import MaterialSelector from './components/inputs/MaterialSelector';
import ThicknessInput from './components/inputs/ThicknessInput';
import TemperatureInput from './components/inputs/TemperatureInput';
import UnitToggle from './components/inputs/UnitToggle';
import OperationsPanel from './components/operations/OperationsPanel';
import ResultsPanel from './components/results/ResultsPanel';
import SavedCalculationsPanel from './components/saved/SavedCalculationsPanel';
import BatchQuantityInput from './components/inputs/BatchQuantityInput';
import { colors, typography, spacing, shadows, borders } from './assets/theme';

const globalStyles = css`
  :root {
    /* Import colors from theme */
    --primary-color: ${colors.primary.main};
    --primary-dark: ${colors.primary.dark};
    --secondary-color: ${colors.secondary.main};
    --text-color: ${colors.neutral.black};
    --text-light: ${colors.neutral.mediumGrey};
    --border-color: ${colors.neutral.extraLightGrey};
    --background-color: ${colors.neutral.offWhite};
    --error-color: ${colors.status.danger.main};
    --success-color: ${colors.status.success.main};
    --warning-color: ${colors.status.warning.main};
    --success-color-light: ${colors.status.success.bg};
    --error-color-light: ${colors.status.danger.bg};
    --warning-color-light: ${colors.status.warning.bg};
    --success-color-dark: ${colors.status.success.dark};
    --error-color-dark: ${colors.status.danger.dark};
    --warning-color-dark: ${colors.status.warning.dark};
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 16px;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: ${typography.fontFamily};
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: ${typography.lineHeights.base};
  }
  
  /* Typography Scale */
  h1 {
    font-size: ${typography.sizes.xxxl};
    font-weight: ${typography.fontWeights.bold};
    margin-bottom: ${spacing.md};
    color: ${colors.primary.dark};
  }
  
  h2 {
    font-size: ${typography.sizes.xxl};
    font-weight: ${typography.fontWeights.semiBold};
    margin-bottom: ${spacing.md};
    color: ${colors.primary.main};
  }
  
  h3 {
    font-size: ${typography.sizes.xl};
    font-weight: ${typography.fontWeights.semiBold};
    margin-bottom: ${spacing.sm};
    color: ${colors.primary.main};
  }
  
  h4 {
    font-size: ${typography.sizes.lg};
    font-weight: ${typography.fontWeights.medium};
    margin-bottom: ${spacing.sm};
    color: ${colors.primary.main};
  }
  
  h5 {
    font-size: ${typography.sizes.md};
    font-weight: ${typography.fontWeights.medium};
    margin-bottom: ${spacing.sm};
    color: ${colors.secondary.main};
  }
  
  p {
    margin-bottom: ${spacing.md};
  }
  
  /* Basic Button Styles */
  button {
    font-family: ${typography.fontFamily};
    font-size: ${typography.sizes.base};
    cursor: pointer;
  }
  
  /* Form Elements */
  input, select, textarea {
    font-family: ${typography.fontFamily};
    font-size: ${typography.sizes.base};
    color: ${colors.neutral.darkGrey};
  }
  
  /* Links */
  a {
    color: ${colors.primary.main};
    text-decoration: none;
    
    &:hover {
      color: ${colors.primary.dark};
      text-decoration: underline;
    }
  }
`;

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.md} ${spacing.lg};

  @media (max-width: 768px) {
    padding: ${spacing.sm};
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg};
  padding-bottom: ${spacing.md};
  border-bottom: ${borders.width.thin} solid ${colors.neutral.extraLightGrey};
`;

const Logo = styled.h1`
  font-size: ${typography.sizes.xl};
  margin: 0;
  color: ${colors.primary.main};
  font-weight: ${typography.fontWeights.bold};
`;

const ParametersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
  background-color: ${colors.neutral.white};
  padding: ${spacing.md};
  border-radius: ${borders.radius.md};
  box-shadow: ${shadows.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: ${spacing.md};
  border-bottom: ${borders.width.thin} solid ${colors.neutral.extraLightGrey};
`;

const Tab = styled.button`
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${props => props.active ? colors.neutral.white : 'transparent'};
  color: ${props => props.active ? colors.primary.main : colors.neutral.mediumGrey};
  border: none;
  border-bottom: ${props => props.active ? `${borders.width.medium} solid ${colors.primary.main}` : `${borders.width.medium} solid transparent`};
  font-size: ${typography.sizes.base};
  font-weight: ${props => props.active ? typography.fontWeights.medium : typography.fontWeights.regular};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${colors.primary.main};
  }
`;

const ContentContainer = styled.div`
  background-color: ${colors.neutral.white};
  border-radius: ${borders.radius.md};
  box-shadow: ${shadows.md};
  padding: ${spacing.lg};
`;

const Footer = styled.footer`
  margin-top: ${spacing.xxl};
  padding-top: ${spacing.md};
  border-top: ${borders.width.thin} solid ${colors.neutral.extraLightGrey};
  text-align: center;
  color: ${colors.neutral.mediumGrey};
  font-size: ${typography.sizes.sm};
`;

const App = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(state => state.ui.activeTab);
  const { selected: selectedMaterial } = useSelector(state => state.materials);
  const parameters = useSelector(state => state.parameters);
  const operations = useSelector(state => state.operations);
  
  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);
  
  useEffect(() => {
    if (selectedMaterial && 
        parameters.thickness > 0 && 
        (operations.perimeter.enabled || 
         operations.holes.enabled || 
         operations.bends.enabled || 
         operations.forms.enabled || 
         operations.draws.enabled)) {
      dispatch(calculateTonnage());
    }
  }, [dispatch, selectedMaterial, parameters, operations]);
  
  const handleTabChange = (tab) => {
    dispatch({ type: 'ui/setActiveTab', payload: tab });
  };
  
  return (
    <>
      <Global styles={globalStyles} />
      <AppContainer>
        <Header>
          <Logo>Sutherland Presses Tonnage Calculator</Logo>
          <UnitToggle />
        </Header>
        
        <ParametersContainer>
          <MaterialSelector />
          <ThicknessInput />
          <TemperatureInput />
          <BatchQuantityInput />
        </ParametersContainer>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'operations'} 
            onClick={() => handleTabChange('operations')}
          >
            Operations
          </Tab>
          <Tab 
            active={activeTab === 'results'} 
            onClick={() => handleTabChange('results')}
          >
            Results
          </Tab>
          <Tab 
            active={activeTab === 'saved'} 
            onClick={() => handleTabChange('saved')}
          >
            Saved Calculations
          </Tab>
        </TabsContainer>
        
        <ContentContainer>
          {activeTab === 'operations' && <OperationsPanel />}
          {activeTab === 'results' && <ResultsPanel />}
          {activeTab === 'saved' && <SavedCalculationsPanel />}
        </ContentContainer>
        
        <Footer>
          &copy; {new Date().getFullYear()} Sutherland Presses Inc. All rights reserved.
        </Footer>
      </AppContainer>
    </>
  );
};

export default App; 