import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Button, 
  VStack, 
  Text,
  useColorModeValue 
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { addDraw } from '../../store/operationsSlice';
import DrawCard from './DrawCard';
import CardContainer from '../common/CardContainer';

const DrawsSection = () => {
  const dispatch = useDispatch();
  const draws = useSelector(state => state.operations.draws.items);
  
  // Color mode styles
  const emptyStateBg = useColorModeValue('gray.50', 'gray.700');
  const emptyStateColor = useColorModeValue('gray.500', 'gray.300');
  
  const handleAddDraw = () => {
    dispatch(addDraw());
  };
  
  return (
    <CardContainer
      title="Drawing Operations"
      action={
        <Button 
          size="sm" 
          colorScheme="blue" 
          leftIcon={<AddIcon />}
          onClick={handleAddDraw}
        >
          Add Draw
        </Button>
      }
    >
      <VStack spacing={3} align="stretch">
        {draws.length > 0 ? (
          draws.map(draw => (
            <DrawCard key={draw.id} draw={draw} />
          ))
        ) : (
          <Box
            p={4}
            bg={emptyStateBg}
            borderRadius="md"
            textAlign="center"
          >
            <Text color={emptyStateColor} fontSize="sm">
              No draws added yet. Click "Add Draw" to create a draw operation.
            </Text>
          </Box>
        )}
      </VStack>
    </CardContainer>
  );
};

export default DrawsSection; 