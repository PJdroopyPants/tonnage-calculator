import React from 'react';
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
  Icon,
  Text
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { setThickness } from '../../store/parametersSlice';

const ThicknessInput = () => {
  const dispatch = useDispatch();
  const { thickness, isMetric } = useSelector(state => state.parameters);
  const { selected: selectedMaterial } = useSelector(state => state.materials);
  
  // Style variables based on color mode
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const tooltipBg = useColorModeValue('secondary.700', 'secondary.800');
  
  const handleChange = (e) => {
    // Get value and ensure it's a number
    let value = e.target.value;
    
    // Remove non-numeric characters except for decimal point
    value = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const countDecimalPoints = (value.match(/\./g) || []).length;
    if (countDecimalPoints > 1) {
      value = value.substr(0, value.lastIndexOf('.'));
    }
    
    // Convert to number
    const numValue = parseFloat(value) || 0;
    
    // Update the state
    dispatch(setThickness(numValue));
  };
  
  // Get unit display text
  const unitText = isMetric ? 'mm' : 'in';
  
  // Get tooltip text with unit-specific guidance
  const getTooltipContent = () => {
    const minThickness = isMetric ? '0.5mm' : '0.02in';
    const maxThickness = isMetric ? '25mm' : '1.0in';
    
    return (
      <Box>
        <Text>Enter material thickness</Text>
        <Text fontSize="xs" mt={1}>
          Recommended range: {minThickness} - {maxThickness}
        </Text>
        {selectedMaterial && (
          <Text fontSize="xs" mt={1}>
            Typical {selectedMaterial.category} range: 
            {isMetric ? ' 0.8mm - 6mm' : ' 0.03in - 0.25in'}
          </Text>
        )}
      </Box>
    );
  };
  
  return (
    <Box mb={4} minW={["100%", "200px"]}>
      <FormControl>
        <Flex align="center">
          <FormLabel fontSize="sm" mb={1}>Thickness</FormLabel>
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
            value={thickness || ''}
            onChange={handleChange}
            type="text"
            placeholder="0"
            borderColor={borderColor}
          />
          <InputRightAddon children={unitText} bg="gray.100" />
        </InputGroup>
        
        {/* Validation feedback */}
        {thickness <= 0 && (
          <Text fontSize="xs" color="danger.500" mt={1}>
            Please enter a valid thickness
          </Text>
        )}
        
        {thickness > 0 && thickness < (isMetric ? 0.5 : 0.02) && (
          <Text fontSize="xs" color="warning.500" mt={1}>
            Thickness is below recommended minimum
          </Text>
        )}
        
        {thickness > (isMetric ? 25 : 1.0) && (
          <Text fontSize="xs" color="warning.500" mt={1}>
            Thickness exceeds recommended maximum
          </Text>
        )}
      </FormControl>
    </Box>
  );
};

export default ThicknessInput; 