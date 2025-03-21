import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Heading,
  Text,
  Select,
  Grid,
  VStack,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { generateProcessRecommendations } from '../../services/ProcessRecommendationsService';
import CardContainer from '../common/CardContainer';

const ProcessRecommendationsDisplay = () => {
  const [selectedOperation, setSelectedOperation] = useState('general');
  const { selected: material } = useSelector(state => state.materials);
  const operations = useSelector(state => state.operations);
  
  // Color mode styles
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const primaryColor = useColorModeValue('blue.600', 'blue.200');
  const infoBg = useColorModeValue('blue.50', 'blue.900');
  
  if (!material) {
    return null;
  }
  
  const handleOperationChange = (e) => {
    setSelectedOperation(e.target.value);
  };
  
  // Generate recommendations based on selected operation type
  const recommendations = generateProcessRecommendations(material, selectedOperation);
  
  if (!recommendations) {
    return null;
  }
  
  // Get enabled operations for the selector
  const enabledOperations = [];
  if (operations.perimeter?.enabled) enabledOperations.push({ id: 'perimeter', name: 'Cutting' });
  if (operations.holes?.enabled) enabledOperations.push({ id: 'hole', name: 'Punching' });
  if (operations.bends?.enabled) enabledOperations.push({ id: 'bend', name: 'Bending' });
  if (operations.forms?.enabled) enabledOperations.push({ id: 'form', name: 'Forming' });
  if (operations.draws?.enabled) enabledOperations.push({ id: 'draw', name: 'Drawing' });
  
  return (
    <CardContainer title={recommendations.title || 'Process Recommendations'}>
      <Text fontSize="sm" color={labelColor} mb={4}>
        {recommendations.description}
      </Text>
      
      <Box mb={4}>
        <Select 
          value={selectedOperation}
          onChange={handleOperationChange}
          size="md"
        >
          <option value="general">General Parameters</option>
          {enabledOperations.map(op => (
            <option key={op.id} value={op.id}>{op.name} Parameters</option>
          ))}
        </Select>
      </Box>
      
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h4" size="sm" color={primaryColor} mb={3} pb={2} borderBottomWidth="1px" borderColor={borderColor}>
            Key Process Parameters
          </Heading>
          
          <Grid templateColumns={["1fr", null, "1fr 1fr", "repeat(3, 1fr)"]} gap={3} mb={3}>
            <Box p={3} bg={cardBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
              <Text fontSize="xs" color={labelColor} mb={1}>Die Clearance</Text>
              <Text fontSize="sm" fontWeight="medium">{recommendations.dieClearance}</Text>
            </Box>
            
            <Box p={3} bg={cardBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
              <Text fontSize="xs" color={labelColor} mb={1}>Punch Speed</Text>
              <Text fontSize="sm" fontWeight="medium">{recommendations.punchSpeed}</Text>
            </Box>
            
            <Box p={3} bg={cardBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
              <Text fontSize="xs" color={labelColor} mb={1}>Blank Holding Force</Text>
              <Text fontSize="sm" fontWeight="medium">{recommendations.blankHoldingForce}</Text>
            </Box>
            
            <Box p={3} bg={cardBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
              <Text fontSize="xs" color={labelColor} mb={1}>Lubricant Type</Text>
              <Text fontSize="sm" fontWeight="medium">{recommendations.lubricantType}</Text>
            </Box>
            
            <Box p={3} bg={cardBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
              <Text fontSize="xs" color={labelColor} mb={1}>Temperature Range</Text>
              <Text fontSize="sm" fontWeight="medium">{recommendations.temperatureRange}</Text>
            </Box>
            
            <Box p={3} bg={cardBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
              <Text fontSize="xs" color={labelColor} mb={1}>Maximum Forming Depth</Text>
              <Text fontSize="sm" fontWeight="medium">{recommendations.maxFormingDepth}</Text>
            </Box>
          </Grid>
          
          <Box p={3} bg={infoBg} borderRadius="md" fontSize="xs" color={labelColor}>
            These parameters are optimized for the selected material and operation. 
            Proper die clearance, punch speed, and blank holding force are critical for reducing tonnage requirements 
            and improving part quality.
          </Box>
        </Box>
        
        <Box>
          <Heading as="h4" size="sm" color={primaryColor} mb={3} pb={2} borderBottomWidth="1px" borderColor={borderColor}>
            Material-Specific Process Factors
          </Heading>
          
          <Grid templateColumns={["1fr", null, "1fr 1fr", "repeat(3, 1fr)"]} gap={3}>
            <Box p={3} bg={cardBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
              <Text fontSize="xs" color={labelColor} mb={1}>Grain Direction Effect</Text>
              <Text fontSize="sm" fontWeight="medium">{recommendations.grainDirectionEffect}</Text>
            </Box>
            
            {recommendations.specific && Object.entries(recommendations.specific)
              .filter(([key]) => !['blankHolderPressure'].includes(key))
              .slice(0, 5)
              .map(([key, value]) => (
                <Box key={key} p={3} bg={cardBg} borderRadius="md" borderLeftWidth="3px" borderLeftColor="blue.500">
                  <Text fontSize="xs" color={labelColor} mb={1}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">{value}</Text>
                </Box>
              ))
            }
          </Grid>
        </Box>
        
        {recommendations.specific && recommendations.specific.blankHolderPressure && (
          <Box p={4} bg={cardBg} borderRadius="md" mt={2} borderLeftWidth="3px" borderLeftColor="purple.500">
            <Text fontSize="md" fontWeight="medium" color={primaryColor} mb={3}>
              Advanced Process Settings
            </Text>
            
            <Box mb={3}>
              <Text fontSize="xs" color={labelColor} mb={1}>Blank Holder Pressure</Text>
              <Text fontSize="sm">{recommendations.specific.blankHolderPressure}</Text>
            </Box>
          </Box>
        )}
        
        <Text fontSize="sm" fontStyle="italic" color={labelColor} mt={2}>
          Efficiency Note: Using recommended settings can improve process efficiency by up to {recommendations.efficiencyImprovement || '20-30%'}.
        </Text>
      </VStack>
    </CardContainer>
  );
};

export default ProcessRecommendationsDisplay; 