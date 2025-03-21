import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Heading, 
  Button, 
  VStack, 
  Flex, 
  Text,
  useColorModeValue 
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { addBend } from '../../store/operationsSlice';
import BendCard from './BendCard';
import CardContainer from '../common/CardContainer';

const BendsSection = () => {
  const dispatch = useDispatch();
  const { bends } = useSelector(state => state.operations);
  
  // Color mode styles
  const emptyStateBg = useColorModeValue('gray.50', 'gray.700');
  const emptyStateColor = useColorModeValue('gray.500', 'gray.300');
  
  const handleAddBend = () => {
    dispatch(addBend());
  };
  
  return (
    <CardContainer
      title="Bending"
      action={
        <Button 
          size="sm" 
          colorScheme="blue" 
          leftIcon={<AddIcon />}
          onClick={handleAddBend}
        >
          Add Bend
        </Button>
      }
    >
      <VStack spacing={3} align="stretch">
        {bends.items.length > 0 ? (
          bends.items.map(bend => (
            <BendCard key={bend.id} bend={bend} />
          ))
        ) : (
          <Box
            p={4}
            bg={emptyStateBg}
            borderRadius="md"
            textAlign="center"
          >
            <Text color={emptyStateColor} fontSize="sm">
              No bends added yet. Click "Add Bend" to create a bend operation.
            </Text>
          </Box>
        )}
      </VStack>
    </CardContainer>
  );
};

export default BendsSection; 