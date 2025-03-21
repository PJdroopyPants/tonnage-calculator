import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  VStack,
  Grid,
  Flex,
  Box,
  Text,
  Button,
  Badge,
  useToast
} from '@chakra-ui/react';
import { saveCalculation } from '../../store/savedCalculationsSlice';
import { formatWithUnit, metricToUsTons } from '../../services/UnitConversionService';
import SpringbackDisplay from './SpringbackDisplay';
import ProcessRecommendationsDisplay from './ProcessRecommendationsDisplay';
import ToolWearDisplay from './ToolWearDisplay';
import SurfaceFinishDisplay from './SurfaceFinishDisplay';
import CardContainer from '../common/CardContainer';

const ResultsPanel = () => {
  const dispatch = useDispatch();
  const results = useSelector(state => state.results);
  const material = useSelector(state => state.materials.selected);
  const parameters = useSelector(state => state.parameters);
  const operations = useSelector(state => state.operations);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const toast = useToast();
  
  // Light mode styles
  const batchInfoBg = 'blue.50';
  const batchLabelColor = 'gray.600';
  const resultLabelColor = 'gray.600';
  const propertyLabelColor = 'gray.600';
  const borderColor = 'gray.200';
  const noResultsBg = 'gray.100';
  const noResultsColor = 'gray.600';
  
  // Helper function to calculate the properly converted total tonnage in imperial units
  const calculateConvertedTotalTonnage = () => {
    if (parameters.isMetric) {
      return results.totalTonnage;
    }
    
    // In imperial mode, we need to recalculate the total
    let convertedTotal = 0;
    
    // Add each component with the correct conversion
    if (operations.perimeter.enabled) {
      convertedTotal += results.perimeterTonnage / 25.4 * 1.1023;
    }
    
    if (operations.holes.enabled) {
      convertedTotal += results.holesTonnage / 25.4 * 1.1023;
    }
    
    if (operations.bends.enabled) {
      convertedTotal += results.bendTonnage / 25.4 * 1.1023;
    }
    
    if (operations.forms.enabled) {
      convertedTotal += results.formTonnage / (25.4 * 25.4) * 1.1023;
    }
    
    if (operations.draws.enabled) {
      convertedTotal += results.drawTonnage / (25.4 * 25.4) * 1.1023;
    }
    
    return convertedTotal;
  };

  // Helper function to format tonnage with proper unit conversion
  const formatTonnage = (value, operationType) => {
    // FIX: Properly handle the conversion issue with a specific check for form and draw operations
    if (!parameters.isMetric) {
      // Use special case for the total tonnage
      if (operationType === 'total') {
        // Use pre-calculated total
        const total = calculateConvertedTotalTonnage();
        return `${total.toFixed(2)} US ton`;
      }
      
      // Special case for reverse tonnage which is calculated as a percentage of total
      if (operationType === 'reverse') {
        // Calculate reverse tonnage based on the corrected total
        const total = calculateConvertedTotalTonnage();
        const reverseFactor = material.reverseTonnageFactor || 0.7;
        const reverseValue = total * reverseFactor;
        return `${reverseValue.toFixed(2)} US ton`;
      }
      
      // Different handling based on operation type
      let usValue;
      
      if (operationType === 'form' || operationType === 'draw') {
        // For form and draw operations, use a different correction factor
        // The 25.4 factor is getting applied twice for these operations
        usValue = value / (25.4 * 25.4) * 1.1023;
      } else {
        // For other operations, use the standard correction
        usValue = value / 25.4 * 1.1023;
      }
      
      return `${usValue.toFixed(2)} US ton`;
    } else {
      // Display metric tons as is
      return `${value.toFixed(2)} metric t`;
    }
  };

  // Helper function to convert tensile strength between MPa and ksi
  const formatTensileStrength = (valueMPa) => {
    if (!parameters.isMetric) {
      // Convert MPa to ksi (1 MPa = 0.145038 ksi)
      const valueKsi = valueMPa * 0.145038;
      return `${valueKsi.toFixed(0)} ksi`;
    } else {
      return `${valueMPa} MPa`;
    }
  };

  const handleSaveCalculation = () => {
    if (!material) return;
    
    // Create a name for the saved calculation 
    const materialName = material.name;
    const thickness = parameters.thickness;
    const unit = parameters.isMetric ? 'mm' : 'in';
    const name = `${materialName} (${thickness}${unit})`;
    
    // Create the calculation object
    const calculation = {
      id: Date.now().toString(),
      name,
      timestamp: new Date().toISOString(),
      material: material.name,
      thickness: parameters.thickness,
      isMetric: parameters.isMetric,
      batchQuantity: parameters.batchQuantity,
      totalTonnage: results.totalTonnage,
      operations
    };
    
    // Save to Redux store
    dispatch(saveCalculation(calculation));
    
    // Show toast notification
    toast({
      title: "Calculation Saved",
      description: `Saved as "${name}"`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom-right"
    });
  };
  
  if (!material || !results.totalTonnage) {
    return (
      <Box
        p={5}
        bg={noResultsBg}
        borderRadius="md"
        textAlign="center"
        color={noResultsColor}
      >
        Configure material and operations to see results.
      </Box>
    );
  }
  
  return (
    <VStack spacing={5} align="stretch">
      <CardContainer title="Calculation Results">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="primary.500" textAlign="center" mb={4}>
            Total Required Force: {formatTonnage(results.totalTonnage, 'total')}
          </Text>
          
          <Flex 
            p={3}
            bg={batchInfoBg}
            borderRadius="md"
            justifyContent="space-between"
            borderLeftWidth="3px"
            borderLeftColor="primary.500"
            mb={4}
          >
            <Box>
              <Text fontSize="xs" color={batchLabelColor}>Material</Text>
              <Text fontWeight="medium">{material.name}</Text>
            </Box>
            
            <Box>
              <Text fontSize="xs" color={batchLabelColor}>Thickness</Text>
              <Text fontWeight="medium">
                {parameters.thickness} {parameters.isMetric ? 'mm' : 'in'}
              </Text>
            </Box>
            
            <Box>
              <Text fontSize="xs" color={batchLabelColor}>Batch Size</Text>
              <Text fontWeight="medium">{parameters.batchQuantity} pcs</Text>
            </Box>
            
            <Box>
              <Text fontSize="xs" color={batchLabelColor}>Reverse Tonnage</Text>
              <Text fontWeight="medium">{formatTonnage(results.totalTonnage * (material.reverseTonnageFactor || 0.7), 'reverse')}</Text>
            </Box>
          </Flex>
          
          <Grid templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={4} mb={5}>
            {operations.perimeter.enabled && (
              <Box>
                <Text fontSize="sm" color={resultLabelColor}>Perimeter Cutting</Text>
                <Text fontWeight="medium" fontSize="lg">{formatTonnage(results.perimeterTonnage, 'perimeter')}</Text>
              </Box>
            )}
            
            {operations.holes.enabled && (
              <Box>
                <Text fontSize="sm" color={resultLabelColor}>Hole Punching</Text>
                <Text fontWeight="medium" fontSize="lg">{formatTonnage(results.holesTonnage, 'holes')}</Text>
              </Box>
            )}
            
            {operations.bends.enabled && (
              <Box>
                <Text fontSize="sm" color={resultLabelColor}>Bending</Text>
                <Text fontWeight="medium" fontSize="lg">{formatTonnage(results.bendTonnage, 'bend')}</Text>
              </Box>
            )}
            
            {operations.forms.enabled && (
              <Box>
                <Text fontSize="sm" color={resultLabelColor}>Form Features</Text>
                <Text fontWeight="medium" fontSize="lg">{formatTonnage(results.formTonnage, 'form')}</Text>
              </Box>
            )}
            
            {operations.draws.enabled && (
              <Box>
                <Text fontSize="sm" color={resultLabelColor}>Drawing</Text>
                <Text fontWeight="medium" fontSize="lg">{formatTonnage(results.drawTonnage, 'draw')}</Text>
              </Box>
            )}
          </Grid>
          
          <Box 
            mt={4} 
            pt={4} 
            borderTopWidth="1px" 
            borderColor={borderColor}
          >
            <Text fontSize="sm" fontWeight="medium" mb={2}>Material Properties</Text>
            
            <Grid templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={3}>
              <Box>
                <Text fontSize="xs" color={propertyLabelColor}>Tensile Strength</Text>
                <Text fontSize="sm">{formatTensileStrength(material.tensileStrength)}</Text>
              </Box>
              
              <Box>
                <Text fontSize="xs" color={propertyLabelColor}>Yield Strength</Text>
                <Text fontSize="sm">{formatTensileStrength(material.yieldStrength)}</Text>
              </Box>
              
              <Box>
                <Text fontSize="xs" color={propertyLabelColor}>Shear Strength</Text>
                <Text fontSize="sm">{formatTensileStrength(material.shearStrength)}</Text>
              </Box>
            </Grid>
          </Box>
          
          <Flex mt={5}>
            <Button 
              colorScheme="blue" 
              size="sm" 
              onClick={handleSaveCalculation}
            >
              Save Calculation
            </Button>
          </Flex>
        </Box>
      </CardContainer>
      
      {/* Rest of the component remains the same */}
      <SpringbackDisplay />
      <ProcessRecommendationsDisplay />
      <ToolWearDisplay />
      <SurfaceFinishDisplay />
    </VStack>
  );
};

export default ResultsPanel; 