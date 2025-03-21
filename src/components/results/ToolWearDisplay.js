import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Text,
  Select,
  Input,
  InputGroup,
  InputRightAddon,
  FormControl,
  FormLabel,
  Grid,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { calculateToolWear } from '../../services/ToolWearService';
import { colors, spacing, typography, borders, shadows } from '../../assets/theme';
import { ToolWearComparisonChart, DataCorrelationChart } from '../common/EngineeringCharts';
import { LinearGauge, CircularGauge, SafetyFactorIndicator, MaterialLimitWarning } from '../common/EngineeringStatusIndicators';
import EngineeringDataCard, { TabContainer, Tab } from '../common/EngineeringDataCard';
import CardContainer from '../common/CardContainer';

const ToolWearDisplay = () => {
  const { selected: material } = useSelector(state => state.materials);
  const operations = useSelector(state => state.operations);
  
  const [selectedOperation, setSelectedOperation] = useState('bends'); 
  const [toolMaterial, setToolMaterial] = useState('d2');
  const [productionRate, setProductionRate] = useState(1000);
  const [batchQuantity, setBatchQuantity] = useState(5000);
  
  // Color mode styles
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  
  if (!material) {
    return null;
  }
  
  const handleOperationChange = (e) => {
    setSelectedOperation(e.target.value);
  };
  
  const handleToolMaterialChange = (e) => {
    setToolMaterial(e.target.value);
  };
  
  const handleProductionRateChange = (e) => {
    setProductionRate(parseInt(e.target.value, 10));
  };
  
  const handleBatchQuantityChange = (e) => {
    setBatchQuantity(parseInt(e.target.value, 10));
  };

  // This would be the result of calling the calculateToolWear function
  const wearData = calculateToolWear(material, selectedOperation, toolMaterial) || {
    wearRate: 0,
    benchmarkWearRate: 0,
    relativeToBenchmark: 1,
    wearSeverity: 'Medium',
    primaryWearCause: 'No data available',
    maxWearAllowed: 100,
    hitsPerPart: 1,
    recommendations: []
  };
  
  // Format for wear rate display
  const formatWearRate = (rate) => {
    if (!rate || rate < 0.01) return '<0.01 μm/stroke';
    return `${rate.toFixed(2)} μm/stroke`;
  };
  
  // Calculate tool life in strokes and parts
  const toolLife = {
    strokes: Math.round((wearData.maxWearAllowed || 100) / (wearData.wearRate || 1)),
    parts: Math.round(((wearData.maxWearAllowed || 100) / (wearData.wearRate || 1)) / (wearData.hitsPerPart || 1))
  };
  
  // Parts per resharpening calculation
  const partsPerResharpening = Math.round(toolLife.parts || 0);
  
  // Calculate maintenance cycle based on production rate
  const maintenanceCycle = {
    days: Math.round(((partsPerResharpening || 0) / (productionRate || 1000)) * 10) / 10,
    hours: Math.round(((partsPerResharpening || 0) / ((productionRate || 1000) / 8)) * 10) / 10
  };

  return (
    <CardContainer title="Tool Wear Analysis & Prediction">
      <Text fontSize="sm" color={labelColor} mb={4}>
        Analyze tool wear rates and predict maintenance intervals based on material properties and production parameters.
      </Text>
      
      <Grid templateColumns={["1fr", null, "repeat(2, 1fr)", "repeat(4, 1fr)"]} gap={4} mb={6}>
        <FormControl size="sm">
          <FormLabel fontSize="xs" color={labelColor} mb={1}>
            Operation Type
          </FormLabel>
          <Select 
            size="sm"
            value={selectedOperation}
            onChange={handleOperationChange}
          >
            <option value="bends">Bending</option>
            <option value="holes">Hole Punching</option>
            <option value="perimeter">Cutting</option>
            <option value="forms">Forming</option>
            <option value="draws">Drawing</option>
          </Select>
        </FormControl>
        
        <FormControl size="sm">
          <FormLabel fontSize="xs" color={labelColor} mb={1}>
            Tool Material
          </FormLabel>
          <Select 
            size="sm"
            value={toolMaterial}
            onChange={handleToolMaterialChange}
          >
            <option value="d2">D2 Tool Steel</option>
            <option value="a2">A2 Tool Steel</option>
            <option value="m2">M2 HSS</option>
            <option value="carbide">Carbide</option>
            <option value="pcd">Polycrystalline Diamond</option>
          </Select>
        </FormControl>
        
        <FormControl size="sm">
          <FormLabel fontSize="xs" color={labelColor} mb={1}>
            Production Rate
          </FormLabel>
          <InputGroup size="sm">
            <Input
              type="number"
              min="100"
              max="100000"
              step="100"
              value={productionRate}
              onChange={handleProductionRateChange}
            />
            <InputRightAddon children="parts/day" />
          </InputGroup>
        </FormControl>
        
        <FormControl size="sm">
          <FormLabel fontSize="xs" color={labelColor} mb={1}>
            Batch Quantity
          </FormLabel>
          <InputGroup size="sm">
            <Input
              type="number"
              min="100"
              max="1000000"
              step="1000"
              value={batchQuantity}
              onChange={handleBatchQuantityChange}
            />
            <InputRightAddon children="parts" />
          </InputGroup>
        </FormControl>
      </Grid>
      
      <VStack spacing={6} align="stretch">
        {/* Tool Wear Summary Box */}
        <Box p={4} bg={cardBg} borderRadius="md" borderLeftWidth="3px" borderColor={(wearData.wearSeverity || '') === 'Low' ? 'green.500' : (wearData.wearSeverity || '') === 'Medium' ? 'yellow.500' : 'red.500'}>
          <Text fontSize="sm" fontWeight="medium" mb={3}>
            Tool Wear Summary
          </Text>
          
          <Grid templateColumns={["1fr", null, "repeat(2, 1fr)", "repeat(4, 1fr)"]} gap={3}>
            <Box>
              <Text fontSize="xs" color={labelColor} mb={1}>Wear Rate:</Text>
              <Text fontSize="sm" fontWeight="medium">{formatWearRate(wearData.wearRate || 0)}</Text>
            </Box>
            
            <Box>
              <Text fontSize="xs" color={labelColor} mb={1}>vs. Benchmark:</Text>
              <Text 
                fontSize="sm" 
                fontWeight="medium" 
                color={(wearData.relativeToBenchmark || 1) < 1 ? "green.500" : "red.500"}
              >
                {(wearData.relativeToBenchmark || 1) < 1 
                  ? `${Math.round((1 - (wearData.relativeToBenchmark || 1)) * 100)}% Better` 
                  : `${Math.round(((wearData.relativeToBenchmark || 1) - 1) * 100)}% Worse`}
              </Text>
            </Box>
            
            <Box>
              <Text fontSize="xs" color={labelColor} mb={1}>Severity:</Text>
              <Text 
                fontSize="sm" 
                fontWeight="medium" 
                color={(wearData.wearSeverity || '') === 'Low' ? "green.500" : 
                       (wearData.wearSeverity || '') === 'Medium' ? "yellow.500" : "red.500"}
              >
                {wearData.wearSeverity || 'Medium'}
              </Text>
            </Box>
            
            <Box>
              <Text fontSize="xs" color={labelColor} mb={1}>Primary Cause:</Text>
              <Text fontSize="sm" fontWeight="medium">{wearData.primaryWearCause || 'Unknown'}</Text>
            </Box>
          </Grid>
        </Box>
        
        {/* Tool Life Prediction */}
        <Box p={4} bg={cardBg} borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" mb={3}>
            Tool Life Prediction
          </Text>
          
          <Grid templateColumns={["1fr", null, "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={4}>
            <Box>
              <Text fontSize="xs" color={labelColor} mb={1}>Resharpening Interval:</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.500">
                {(partsPerResharpening || 0).toLocaleString()} parts
              </Text>
              <Text fontSize="xs" color={labelColor} mt={1}>
                Approx. {(toolLife.strokes || 0).toLocaleString()} strokes
              </Text>
            </Box>
            
            <Box>
              <Text fontSize="xs" color={labelColor} mb={1}>Maintenance Cycle:</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.500">
                {maintenanceCycle.days} days
              </Text>
              <Text fontSize="xs" color={labelColor} mt={1}>
                Approx. {maintenanceCycle.hours} production hours
              </Text>
            </Box>
            
            <Box>
              <Text fontSize="xs" color={labelColor} mb={1}>Batch Coverage:</Text>
              <Text 
                fontSize="lg" 
                fontWeight="bold" 
                color={(partsPerResharpening || 0) >= batchQuantity ? "green.500" : "red.500"}
              >
                {(partsPerResharpening || 0) >= batchQuantity 
                  ? Math.floor((partsPerResharpening || 0) / batchQuantity) 
                  : Math.round(((partsPerResharpening || 0) / batchQuantity) * 100) / 100}
                {(partsPerResharpening || 0) >= batchQuantity ? ' batches' : ' batch'}
              </Text>
              <Text fontSize="xs" color={labelColor} mt={1}>
                {(partsPerResharpening || 0) >= batchQuantity 
                  ? 'Complete batches without interruption' 
                  : 'Tool change required during batch'}
              </Text>
            </Box>
          </Grid>
        </Box>
        
        {/* Recommendations */}
        <Box p={4} bg={cardBg} borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" mb={3}>
            Improvement Recommendations
          </Text>
          
          <VStack align="stretch" spacing={2}>
            {wearData.recommendations && wearData.recommendations.length > 0 ? (
              wearData.recommendations.map((rec, idx) => (
                <Text key={idx} fontSize="xs">• {rec}</Text>
              ))
            ) : (
              <Text fontSize="xs">• No specific recommendations available</Text>
            )}
            
            {(wearData.relativeToBenchmark || 1) > 1.3 && (
              <Text fontSize="xs" color="red.500" fontWeight="medium" mt={2}>
                Tool wear rate is significantly higher than industry average. Consider alternate tool materials or improved cooling methods.
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </CardContainer>
  );
};

export default ToolWearDisplay; 