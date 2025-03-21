import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Flex, 
  Grid, 
  Text, 
  Button, 
  Input, 
  Select, 
  FormLabel, 
  FormControl,
  InputGroup,
  InputRightAddon,
  useColorModeValue
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { updateHole, removeHole } from '../../store/operationsSlice';

const HoleCard = ({ hole }) => {
  const dispatch = useDispatch();
  const { isMetric } = useSelector(state => state.parameters);
  
  // Color mode styles
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const titleColor = useColorModeValue('blue.600', 'blue.200');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  
  const handleChange = (field, value) => {
    dispatch(updateHole({
      id: hole.id,
      [field]: value
    }));
  };
  
  const handleDelete = () => {
    dispatch(removeHole(hole.id));
  };
  
  return (
    <Box
      p={3}
      bg={cardBg}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="medium" fontSize="sm" color={titleColor}>
          Hole #{hole.id.slice(-4)}
        </Text>
        <Button 
          size="xs" 
          variant="ghost" 
          colorScheme="red" 
          onClick={handleDelete}
          p={1}
          minW="auto"
          height="auto"
        >
          <CloseIcon boxSize={3} />
        </Button>
      </Flex>
      
      <Grid 
        templateColumns={["1fr", null, "1fr 1fr"]} 
        gap={3}
      >
        <FormControl size="sm">
          <FormLabel 
            htmlFor={`hole-shape-${hole.id}`}
            fontSize="xs"
            color={labelColor}
            mb={1}
          >
            Shape
          </FormLabel>
          <Select
            id={`hole-shape-${hole.id}`}
            value={hole.shape}
            onChange={(e) => handleChange('shape', e.target.value)}
            size="sm"
          >
            <option value="circular">Circular</option>
            <option value="square">Square</option>
            <option value="rectangular">Rectangular</option>
          </Select>
        </FormControl>
        
        <FormControl size="sm">
          <FormLabel 
            htmlFor={`hole-diameter-${hole.id}`}
            fontSize="xs"
            color={labelColor}
            mb={1}
          >
            {hole.shape === 'circular' ? 'Diameter' : 
             hole.shape === 'square' ? 'Side Length' : 
             'Length'}
          </FormLabel>
          <InputGroup size="sm">
            <Input
              id={`hole-diameter-${hole.id}`}
              type="number"
              min="0.1"
              step={isMetric ? "0.1" : "0.01"}
              value={hole.diameter}
              onChange={(e) => handleChange('diameter', parseFloat(e.target.value))}
            />
            <InputRightAddon children={isMetric ? 'mm' : 'in'} />
          </InputGroup>
        </FormControl>
        
        {hole.shape === 'rectangular' && (
          <FormControl size="sm">
            <FormLabel 
              htmlFor={`hole-width-${hole.id}`}
              fontSize="xs"
              color={labelColor}
              mb={1}
            >
              Width
            </FormLabel>
            <InputGroup size="sm">
              <Input
                id={`hole-width-${hole.id}`}
                type="number"
                min="0.1"
                step={isMetric ? "0.1" : "0.01"}
                value={hole.width || hole.diameter / 2}
                onChange={(e) => handleChange('width', parseFloat(e.target.value))}
              />
              <InputRightAddon children={isMetric ? 'mm' : 'in'} />
            </InputGroup>
          </FormControl>
        )}
        
        <FormControl size="sm">
          <FormLabel 
            htmlFor={`hole-quantity-${hole.id}`}
            fontSize="xs"
            color={labelColor}
            mb={1}
          >
            Quantity
          </FormLabel>
          <Input
            id={`hole-quantity-${hole.id}`}
            type="number"
            min="1"
            step="1"
            value={hole.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value, 10))}
            size="sm"
          />
        </FormControl>
      </Grid>
    </Box>
  );
};

export default HoleCard; 