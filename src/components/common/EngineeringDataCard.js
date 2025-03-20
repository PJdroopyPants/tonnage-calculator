import React, { useState } from 'react';
import styled from '@emotion/styled';
import { colors, spacing, typography, shadows, borders, transitions } from '../../assets/theme';

// Main container for engineering data cards
const Card = styled.div`
  background-color: ${colors.neutral.white};
  border-radius: ${borders.radius.md};
  box-shadow: ${shadows.md};
  margin-bottom: ${spacing.lg};
  overflow: hidden;
  transition: box-shadow ${transitions.duration.normal} ${transitions.easing};
  
  &:hover {
    box-shadow: ${shadows.lg};
  }
`;

// Header with title and optional actions
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.md} ${spacing.lg};
  background-color: ${({ severity }) => 
    severity === 'warning' ? colors.status.warning.bg :
    severity === 'danger' ? colors.status.danger.bg :
    severity === 'success' ? colors.status.success.bg :
    colors.primary.lightest
  };
  border-bottom: ${borders.width.thin} solid ${colors.neutral.extraLightGrey};
`;

const Title = styled.h3`
  color: ${({ severity }) => 
    severity === 'warning' ? colors.status.warning.dark :
    severity === 'danger' ? colors.status.danger.dark :
    severity === 'success' ? colors.status.success.dark :
    colors.primary.dark
  };
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.fontWeights.semiBold};
  margin: 0;
`;

// Content section with optional padding control
const Content = styled.div`
  padding: ${({ noPadding }) => noPadding ? '0' : spacing.lg};
`;

// Collapsible section for information density management
const CollapsibleContent = styled.div`
  max-height: ${({ isExpanded }) => isExpanded ? '1500px' : '0'};
  overflow: hidden;
  transition: max-height ${transitions.duration.normal} ${transitions.easing};
`;

// Footer with additional information or actions
const Footer = styled.div`
  padding: ${spacing.md} ${spacing.lg};
  border-top: ${borders.width.thin} solid ${colors.neutral.extraLightGrey};
  background-color: ${colors.neutral.offWhite};
  font-size: ${typography.sizes.sm};
  color: ${colors.neutral.mediumGrey};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Toggle button for collapsible sections
const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary.main};
  cursor: pointer;
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.fontWeights.medium};
  padding: ${spacing.xs} ${spacing.sm};
  transition: color ${transitions.duration.fast} ${transitions.easing};
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${colors.primary.dark};
  }
`;

// Badge for status indicators
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borders.radius.sm};
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.fontWeights.medium};
  background-color: ${({ status }) => 
    status === 'warning' ? colors.status.warning.bg :
    status === 'danger' ? colors.status.danger.bg :
    status === 'success' ? colors.status.success.bg :
    status === 'info' ? colors.status.info.bg :
    colors.neutral.extraLightGrey
  };
  color: ${({ status }) => 
    status === 'warning' ? colors.status.warning.dark :
    status === 'danger' ? colors.status.danger.dark :
    status === 'success' ? colors.status.success.dark :
    status === 'info' ? colors.status.info.dark :
    colors.neutral.darkGrey
  };
`;

// Confidence level indicator
const ConfidenceIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const ConfidenceMeter = styled.div`
  height: 6px;
  width: 60px;
  background-color: ${colors.neutral.extraLightGrey};
  border-radius: ${borders.radius.sm};
  overflow: hidden;
`;

const ConfidenceLevel = styled.div`
  height: 100%;
  width: ${({ level }) => `${level}%`};
  background-color: ${({ level }) => 
    level >= 90 ? colors.status.success.main :
    level >= 70 ? colors.status.info.main :
    level >= 50 ? colors.status.warning.main :
    colors.status.danger.main
  };
`;

const ConfidenceText = styled.span`
  font-size: ${typography.sizes.xs};
  color: ${colors.neutral.mediumGrey};
`;

// Grid layout for data display
const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${spacing.md};
`;

// Individual data item
const DataItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataLabel = styled.div`
  font-size: ${typography.sizes.sm};
  color: ${colors.neutral.mediumGrey};
  margin-bottom: ${spacing.xs};
`;

const DataValue = styled.div`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.fontWeights.medium};
  color: ${({ color }) => color || colors.neutral.black};
`;

// Tab system for multiple datasets
const TabContainer = styled.div`
  display: flex;
  border-bottom: ${borders.width.thin} solid ${colors.neutral.extraLightGrey};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.neutral.lightGrey};
    border-radius: ${borders.radius.sm};
  }
`;

const Tab = styled.button`
  padding: ${spacing.sm} ${spacing.md};
  background: none;
  border: none;
  border-bottom: ${borders.width.medium} solid ${({ active }) => 
    active ? colors.primary.main : 'transparent'
  };
  color: ${({ active }) => active ? colors.primary.main : colors.neutral.mediumGrey};
  font-size: ${typography.sizes.sm};
  font-weight: ${({ active }) => active ? typography.fontWeights.medium : typography.fontWeights.regular};
  cursor: pointer;
  transition: all ${transitions.duration.fast} ${transitions.easing};
  white-space: nowrap;
  
  &:hover {
    color: ${colors.primary.main};
  }
`;

// Main component definition
const EngineeringDataCard = ({ 
  title, 
  severity,
  children, 
  collapsible = false,
  initiallyExpanded = true,
  confidenceLevel,
  footerContent,
  noPadding = false
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  
  return (
    <Card>
      <Header severity={severity}>
        <Title severity={severity}>{title}</Title>
        {collapsible && (
          <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </ToggleButton>
        )}
      </Header>
      
      {collapsible ? (
        <CollapsibleContent isExpanded={isExpanded}>
          <Content noPadding={noPadding}>
            {children}
          </Content>
        </CollapsibleContent>
      ) : (
        <Content noPadding={noPadding}>
          {children}
        </Content>
      )}
      
      {(footerContent || confidenceLevel) && (
        <Footer>
          {footerContent}
          {confidenceLevel && (
            <ConfidenceIndicator>
              <ConfidenceText>Confidence:</ConfidenceText>
              <ConfidenceMeter>
                <ConfidenceLevel level={confidenceLevel} />
              </ConfidenceMeter>
              <ConfidenceText>{confidenceLevel}%</ConfidenceText>
            </ConfidenceIndicator>
          )}
        </Footer>
      )}
    </Card>
  );
};

// Export all components for use in other files
export {
  EngineeringDataCard as default,
  Card,
  Header,
  Title,
  Content,
  CollapsibleContent,
  Footer,
  ToggleButton,
  StatusBadge,
  ConfidenceIndicator,
  ConfidenceMeter,
  ConfidenceLevel,
  ConfidenceText,
  DataGrid,
  DataItem,
  DataLabel,
  DataValue,
  TabContainer,
  Tab
}; 