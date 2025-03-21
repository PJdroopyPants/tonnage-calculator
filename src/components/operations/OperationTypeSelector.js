import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Heading, 
  Flex, 
  Checkbox, 
  Text, 
  useColorModeValue 
} from '@chakra-ui/react';
import { toggleOperationType, addHole, addBend, addForm, addDraw } from '../../store/operationsSlice';

const operationTypes = [
  { id: 'perimeter', label: 'Perimeter Cutting' },
  { id: 'holes', label: 'Hole Punching' },
  { id: 'bends', label: 'Bending' },
  { id: 'forms', label: 'Form Features' },
  { id: 'draws', label: 'Drawing' }
];

const OperationTypeSelector = () => {
  const dispatch = useDispatch();
  const operations = useSelector(state => state.operations);
  
  // Color mode dependent styles
  const containerBg = useColorModeValue('white', 'gray.700');
  const titleColor = useColorModeValue('gray.600', 'gray.200');
  const checkboxBg = useColorModeValue('gray.100', 'gray.600');
  const checkboxActiveBg = useColorModeValue('blue.50', 'blue.900');
  const checkboxHoverBg = useColorModeValue('gray.200', 'gray.500');
  const checkboxActiveHoverBg = useColorModeValue('blue.100', 'blue.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const handleToggle = (operationType) => {
    const isCurrentlyEnabled = operations[operationType].enabled;
    
    // First toggle the operation type
    dispatch(toggleOperationType(operationType));
    
    // If we're enabling (not disabling) and it's not perimeter, automatically add a default item
    if (!isCurrentlyEnabled && operationType !== 'perimeter') {
      // Check if there are no items already (first time)
      if (operations[operationType].items.length === 0) {
        // Add the appropriate default item based on the operation type
        switch (operationType) {
          case 'holes':
            dispatch(addHole());
            break;
          case 'bends':
            dispatch(addBend());
            break;
          case 'forms':
            dispatch(addForm());
            break;
          case 'draws':
            dispatch(addDraw());
            break;
          default:
            break;
        }
      }
    }
  };
  
  return (
    <Box 
      p={4} 
      bg={containerBg} 
      borderRadius="md" 
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Heading as="h3" size="sm" mb={3} color={titleColor}>
        Select Operations
      </Heading>
      
      <Flex wrap="wrap" gap={2}>
        {operationTypes.map(operation => {
          const isEnabled = operations[operation.id].enabled;
          return (
            <Box 
              key={operation.id}
              py={2}
              px={3}
              borderRadius="md"
              bg={isEnabled ? checkboxActiveBg : checkboxBg}
              _hover={{
                bg: isEnabled ? checkboxActiveHoverBg : checkboxHoverBg
              }}
              transition="background-color 0.2s"
            >
              <Checkbox 
                id={`operation-${operation.id}`}
                isChecked={isEnabled}
                onChange={() => handleToggle(operation.id)}
                colorScheme="blue"
              >
                <Text fontSize="sm">
                  {operation.label}
                </Text>
              </Checkbox>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default OperationTypeSelector; 