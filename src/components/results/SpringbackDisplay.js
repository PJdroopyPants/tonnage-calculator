import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Select,
  Text,
  Badge,
  Button,
  Flex,
  Grid,
  List,
  ListItem,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  calculateSpringbackAngle, 
  calculateCompensationAngle, 
  calculateSpringbackPercentage,
  getSpringbackSuggestions
} from '../../services/SpringbackService';
import CardContainer from '../common/CardContainer';

const SpringbackDisplay = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMaterialFactors, setShowMaterialFactors] = useState(false);
  const [selectedBendIndex, setSelectedBendIndex] = useState(0);
  
  const { selected: material, temperatureRange } = useSelector(state => state.materials);
  const { thickness, isMetric } = useSelector(state => state.parameters);
  const { bends } = useSelector(state => state.operations);
  
  // Color mode styles
  const bendInfoBg = useColorModeValue('blue.50', 'blue.900');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const materialFactorsBg = useColorModeValue('gray.100', 'gray.700');
  const materialFactorsTitleColor = useColorModeValue('gray.700', 'gray.200');
  const resultsBoxBg = useColorModeValue('gray.50', 'gray.800');
  const primaryTextColor = useColorModeValue('blue.600', 'blue.300');
  const severityColors = {
    Low: useColorModeValue('green.100', 'green.900'),
    Medium: useColorModeValue('yellow.100', 'yellow.900'),
    High: useColorModeValue('red.100', 'red.900'),
  };
  const severityTextColors = {
    Low: useColorModeValue('green.800', 'green.200'),
    Medium: useColorModeValue('yellow.800', 'yellow.200'),
    High: useColorModeValue('red.800', 'red.200'),
  };
  
  if (!material || !bends.items || bends.items.length === 0) {
    return null;
  }
  
  const handleBendChange = (e) => {
    setSelectedBendIndex(parseInt(e.target.value, 10));
  };
  
  const selectedBend = bends.items[selectedBendIndex];
  const bendAngle = selectedBend.angle;
  
  // Convert radius-to-thickness to actual radius
  const thicknessInMm = isMetric ? thickness : thickness * 25.4;
  const bendRadiusInMm = selectedBend.radiusToThickness * thicknessInMm;
  
  // Calculate springback
  const springbackAngle = calculateSpringbackAngle(bendAngle, thicknessInMm, bendRadiusInMm, material);
  const compensationAngle = calculateCompensationAngle(bendAngle, thicknessInMm, bendRadiusInMm, material);
  const springbackPercentage = calculateSpringbackPercentage(bendAngle, thicknessInMm, bendRadiusInMm, material);
  
  // Get suggestions
  const suggestions = getSpringbackSuggestions(material);
  
  // Convert bend radius to display units
  const displayBendRadius = isMetric
    ? bendRadiusInMm
    : bendRadiusInMm / 25.4; // Convert mm to inches
    
  // Get material properties from the current temperature range
  const materialProperties = material.properties?.[temperatureRange] || material.properties?.room || {};
  
  // Get modulus and other properties
  const modulus = materialProperties.modulus;
  
  // Check if formingCharacteristics exists and get grain direction effect
  const formingCharacteristics = material.formingCharacteristics || {};
  const grainDirectionEffect = formingCharacteristics.grainDirectionEffect || 'Not specified';
  
  return (
    <CardContainer 
      title="Springback Prediction"
      action={
        suggestions && (
          <Badge 
            px={2} 
            py={1} 
            borderRadius="full" 
            bg={severityColors[suggestions.severity]} 
            color={severityTextColors[suggestions.severity]}
          >
            {suggestions.severity} Springback
          </Badge>
        )
      }
    >
      {bends.items.length > 1 && (
        <Box mb={4}>
          <Text fontSize="sm" color={labelColor} mb={1}>Select Bend:</Text>
          <Select
            value={selectedBendIndex}
            onChange={handleBendChange}
            size="sm"
            maxWidth="300px"
          >
            {bends.items.map((bend, index) => (
              <option key={bend.id} value={index}>
                Bend #{index + 1} - {bend.type}, {bend.angle}°
              </option>
            ))}
          </Select>
        </Box>
      )}
      
      <Box 
        p={3} 
        bg={bendInfoBg} 
        borderRadius="md" 
        mb={4}
        borderLeftWidth="3px"
        borderLeftColor="primary.500"
      >
        <Flex justify="space-between" mb={2}>
          <Text fontSize="sm" color={labelColor}>Bend Type:</Text>
          <Text fontSize="sm" fontWeight="medium">
            {selectedBend.type === 'v-bend' ? 'V-Bend' : 'U-Bend'}
          </Text>
        </Flex>
        <Flex justify="space-between" mb={2}>
          <Text fontSize="sm" color={labelColor}>Bend Angle:</Text>
          <Text fontSize="sm" fontWeight="medium">{bendAngle}°</Text>
        </Flex>
        <Flex justify="space-between" mb={2}>
          <Text fontSize="sm" color={labelColor}>Material Thickness:</Text>
          <Text fontSize="sm" fontWeight="medium">
            {thickness} {isMetric ? 'mm' : 'in'}
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="sm" color={labelColor}>Inside Bend Radius:</Text>
          <Text fontSize="sm" fontWeight="medium">
            {displayBendRadius.toFixed(2)} {isMetric ? 'mm' : 'in'}
          </Text>
        </Flex>
      </Box>
      
      <Box p={4} bg={resultsBoxBg} borderRadius="md" mb={4}>
        <Flex justify="space-between" mb={2}>
          <Text fontSize="sm" color={labelColor}>Springback Angle:</Text>
          <Text fontSize="sm" fontWeight="medium" color={primaryTextColor}>
            {springbackAngle.toFixed(2)}°
          </Text>
        </Flex>
        <Flex justify="space-between" mb={2}>
          <Text fontSize="sm" color={labelColor}>Compensation Angle:</Text>
          <Text fontSize="sm" fontWeight="medium" color={primaryTextColor}>
            {compensationAngle.toFixed(2)}°
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="sm" color={labelColor}>Springback Percentage:</Text>
          <Text fontSize="sm" fontWeight="medium" color={primaryTextColor}>
            {springbackPercentage.toFixed(2)}%
          </Text>
        </Flex>
      </Box>
      
      <Flex direction="column" gap={2}>
        {suggestions && (
          <Box>
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setShowSuggestions(!showSuggestions)}
              colorScheme="blue"
            >
              {showSuggestions ? 'Hide Recommendations' : 'Show Recommendations'}
            </Button>
            
            {showSuggestions && (
              <List ml={4} mt={2} spacing={1}>
                {suggestions.tips.map((tip, index) => (
                  <ListItem key={index} fontSize="sm">
                    {tip}
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
        
        <Box>
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => setShowMaterialFactors(!showMaterialFactors)}
            colorScheme="blue"
          >
            {showMaterialFactors ? 'Hide Material Factors' : 'Show Material Factors'}
          </Button>
          
          {showMaterialFactors && (
            <Box 
              p={4} 
              bg={materialFactorsBg} 
              borderRadius="md" 
              mt={2}
              borderLeftWidth="3px"
              borderLeftColor="purple.500"
            >
              <Text fontSize="md" fontWeight="medium" color={materialFactorsTitleColor} mb={3}>
                Material Properties Affecting Springback
              </Text>
              
              <Grid templateColumns={["1fr", "1fr 1fr"]} gap={3}>
                <Flex justify="space-between">
                  <Text fontSize="sm" color={labelColor}>Young's Modulus:</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {modulus ? `${modulus.toLocaleString()} MPa` : 'N/A'}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="sm" color={labelColor}>Grain Direction Effect:</Text>
                  <Text fontSize="sm" fontWeight="medium">{grainDirectionEffect}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="sm" color={labelColor}>Material Category:</Text>
                  <Text fontSize="sm" fontWeight="medium">{material.category}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="sm" color={labelColor}>Hardness Impact:</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {formingCharacteristics.hardnessImpact || 'Medium'}
                  </Text>
                </Flex>
              </Grid>
            </Box>
          )}
        </Box>
      </Flex>
    </CardContainer>
  );
};

export default SpringbackDisplay; 