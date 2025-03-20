import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Tooltip,
  useColorModeValue,
  Flex,
  Text,
  Badge
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { setTemperature } from '../../store/parametersSlice';
import { setTemperatureRange } from '../../store/materialsSlice';

const TemperatureInput = () => {
  const dispatch = useDispatch();
  const { temperature, isMetric } = useSelector(state => state.parameters);
  const { selected: selectedMaterial, temperatureRange } = useSelector(state => state.materials);
  
  // Style variables based on color mode
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const tooltipBg = useColorModeValue('secondary.700', 'secondary.800');
  const addonBg = useColorModeValue('gray.100', 'gray.700');
  const addonColor = useColorModeValue('gray.800', 'white');
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      dispatch(setTemperature(value));
    }
  };
  
  // Determine temperature range for indicator
  const getTemperatureRange = () => {
    const tempCelsius = isMetric ? temperature : (temperature - 32) * 5 / 9;
    
    if (tempCelsius <= 100) {
      return { range: 'room', text: 'Room Temperature (≤ 100°C)', color: 'success' };
    } else if (tempCelsius <= 300) {
      return { range: 'warm', text: 'Warm Temperature (100-300°C)', color: 'warning' };
    } else {
      return { range: 'hot', text: 'Hot Temperature (> 300°C)', color: 'danger' };
    }
  };
  
  const tempRange = getTemperatureRange();
  
  // Automatically set the temperature range when temperature changes
  useEffect(() => {
    if (selectedMaterial && tempRange.range !== temperatureRange) {
      dispatch(setTemperatureRange(tempRange.range));
    }
  }, [dispatch, temperature, isMetric, selectedMaterial, tempRange.range, temperatureRange]);
  
  // Get unit display text
  const unitText = isMetric ? '°C' : '°F';
  
  // Get tooltip text with unit-specific guidance
  const getTooltipContent = () => {
    const minTemp = isMetric ? '20°C' : '68°F';
    const maxTemp = isMetric ? '500°C' : '932°F';
    
    return (
      <Box>
        <Text>Processing temperature</Text>
        <Text fontSize="xs" mt={1}>
          Common range: {minTemp} - {maxTemp}
        </Text>
        <Text fontSize="xs" mt={1}>
          Temperature affects material properties and required force
        </Text>
      </Box>
    );
  };
  
  return (
    <Box mb={4} minW={["100%", "200px"]}>
      <FormControl>
        <Flex align="center">
          <FormLabel fontSize="sm" mb={1}>Temperature</FormLabel>
          <Tooltip 
            label={getTooltipContent()} 
            placement="top" 
            bg={tooltipBg} 
            hasArrow
          >
            <InfoIcon boxSize={3} color="gray.500" />
          </Tooltip>
        </Flex>
        
        <InputGroup>
          <Input
            value={temperature || ''}
            onChange={handleChange}
            type="number"
            min={isMetric ? "20" : "68"}
            max={isMetric ? "500" : "932"}
            placeholder="0"
            borderColor={borderColor}
            disabled={!selectedMaterial}
          />
          <InputRightAddon 
            children={unitText} 
            bg={addonBg} 
            color={addonColor}
            borderColor={borderColor}
          />
        </InputGroup>
        
        {/* Temperature range indicator */}
        {selectedMaterial && (
          <Badge 
            colorScheme={tempRange.color} 
            mt={2} 
            fontSize="xs" 
            px={2} 
            py={1} 
            borderRadius="md"
          >
            {tempRange.text}
          </Badge>
        )}
      </FormControl>
    </Box>
  );
};

export default TemperatureInput; 