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
import { addForm } from '../../store/operationsSlice';
import FormCard from './FormCard';
import CardContainer from '../common/CardContainer';

const FormsSection = () => {
  const dispatch = useDispatch();
  const forms = useSelector(state => state.operations.forms.items);
  
  // Color mode styles
  const emptyStateBg = useColorModeValue('gray.50', 'gray.700');
  const emptyStateColor = useColorModeValue('gray.500', 'gray.300');
  
  const handleAddForm = () => {
    dispatch(addForm());
  };
  
  return (
    <CardContainer
      title="Form Features"
      action={
        <Button 
          size="sm" 
          colorScheme="blue" 
          leftIcon={<AddIcon />}
          onClick={handleAddForm}
        >
          Add Form
        </Button>
      }
    >
      <VStack spacing={3} align="stretch">
        {forms.length > 0 ? (
          forms.map(form => (
            <FormCard key={form.id} form={form} />
          ))
        ) : (
          <Box
            p={4}
            bg={emptyStateBg}
            borderRadius="md"
            textAlign="center"
          >
            <Text color={emptyStateColor} fontSize="sm">
              No forms added yet. Click "Add Form" to create a form operation.
            </Text>
          </Box>
        )}
      </VStack>
    </CardContainer>
  );
};

export default FormsSection; 