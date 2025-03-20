import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useColorModeValue,
  Flex,
  Text
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { setBatchQuantity } from '../../store/parametersSlice';

const BatchQuantityInput = () => {
  const dispatch = useDispatch();
  const batchQuantity = useSelector(state => state.parameters.batchQuantity);
  
  // Style variables based on color mode
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const tooltipBg = useColorModeValue('secondary.700', 'secondary.800');
  const unitColor = useColorModeValue('gray.600', 'gray.300');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value > 0) {
      dispatch(setBatchQuantity(value));
    }
  };
  
  // Tooltip content
  const getTooltipContent = () => {
    return (
      <Box>
        <Text>Production batch size</Text>
        <Text fontSize="xs" mt={1}>
          Number of identical parts to produce
        </Text>
        <Text fontSize="xs" mt={1}>
          Affects total force requirements and tool wear calculations
        </Text>
      </Box>
    );
  };
  
  return (
    <Box mb={4} minW={["100%", "200px"]}>
      <FormControl>
        <Flex align="center">
          <FormLabel fontSize="sm" mb={1}>Batch Quantity</FormLabel>
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
            value={batchQuantity || 1}
            onChange={handleChange}
            type="number"
            min="1"
            borderColor={borderColor}
          />
          <InputRightElement width="3rem" pointerEvents="none">
            <Text fontSize="sm" color={unitColor} fontWeight="medium">pcs</Text>
          </InputRightElement>
        </InputGroup>
        
        <Text fontSize="xs" color={textColor} mt={1}>
          Number of identical parts to produce
        </Text>
      </FormControl>
    </Box>
  );
};

export default BatchQuantityInput; 