import React from 'react';
import { useSelector } from 'react-redux';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';
import OperationTypeSelector from './OperationTypeSelector';
import PerimeterSection from './PerimeterSection';
import HolesSection from './HolesSection';
import BendsSection from './BendsSection';
import FormsSection from './FormsSection';
import DrawsSection from './DrawsSection';

const OperationsPanel = () => {
  const { selected: selectedMaterial } = useSelector(state => state.materials);
  const operations = useSelector(state => state.operations);
  
  // Color mode styles
  const noMaterialBg = useColorModeValue('gray.100', 'gray.700');
  const noMaterialColor = useColorModeValue('gray.600', 'gray.300');
  
  if (!selectedMaterial) {
    return (
      <Box
        p={5}
        bg={noMaterialBg}
        borderRadius="md"
        textAlign="center"
        color={noMaterialColor}
      >
        Please select a material to configure operations.
      </Box>
    );
  }
  
  return (
    <VStack spacing={5} align="stretch">
      <OperationTypeSelector />
      
      {operations.perimeter.enabled && (
        <PerimeterSection />
      )}
      
      {operations.holes.enabled && (
        <HolesSection />
      )}
      
      {operations.bends.enabled && (
        <BendsSection />
      )}
      
      {operations.forms.enabled && (
        <FormsSection />
      )}
      
      {operations.draws.enabled && (
        <DrawsSection />
      )}
    </VStack>
  );
};

export default OperationsPanel; 