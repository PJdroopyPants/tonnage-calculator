import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  VStack, 
  Button, 
  Flex, 
  Box, 
  Text, 
  useColorModeValue 
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { addHole } from '../../store/operationsSlice';
import HoleCard from './HoleCard';
import CardContainer from '../common/CardContainer';

const HolesSection = () => {
  const dispatch = useDispatch();
  const { holes } = useSelector(state => state.operations);
  
  // Color mode styles
  const emptyStateBg = useColorModeValue('gray.50', 'gray.700');
  const emptyStateColor = useColorModeValue('gray.500', 'gray.300');
  
  const handleAddHole = () => {
    dispatch(addHole());
  };
  
  return (
    <CardContainer
      title="Hole Punching"
      action={
        <Button 
          size="sm" 
          colorScheme="blue" 
          leftIcon={<AddIcon />}
          onClick={handleAddHole}
        >
          Add Hole
        </Button>
      }
    >
      <VStack spacing={3} align="stretch">
        {holes.items.length > 0 ? (
          holes.items.map(hole => (
            <HoleCard key={hole.id} hole={hole} />
          ))
        ) : (
          <Box
            p={4}
            bg={emptyStateBg}
            borderRadius="md"
            textAlign="center"
          >
            <Text color={emptyStateColor} fontSize="sm">
              No holes added yet. Click "Add Hole" to create a hole operation.
            </Text>
          </Box>
        )}
      </VStack>
    </CardContainer>
  );
};

export default HolesSection; 