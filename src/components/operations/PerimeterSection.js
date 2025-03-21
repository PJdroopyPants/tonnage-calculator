import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  useColorModeValue
} from '@chakra-ui/react';
import { setPerimeterLength } from '../../store/operationsSlice';
import CardContainer from '../common/CardContainer';

const PerimeterSection = () => {
  const dispatch = useDispatch();
  const { perimeter } = useSelector(state => state.operations);
  const { isMetric } = useSelector(state => state.parameters);
  
  // Style variables based on color mode
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const addonBg = useColorModeValue('gray.100', 'gray.700');
  const addonColor = useColorModeValue('gray.800', 'white');
  
  const handleLengthChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      dispatch(setPerimeterLength(value));
    }
  };
  
  return (
    <CardContainer title="Perimeter Cutting">
      <FormControl>
        <FormLabel fontSize="sm">Perimeter Length</FormLabel>
        <InputGroup>
          <Input
            type="number"
            min="0"
            step={isMetric ? "1" : "0.1"}
            value={perimeter.length}
            onChange={handleLengthChange}
            borderColor={borderColor}
          />
          <InputRightAddon 
            children={isMetric ? 'mm' : 'in'} 
            bg={addonBg} 
            color={addonColor}
            borderColor={borderColor}
          />
        </InputGroup>
      </FormControl>
    </CardContainer>
  );
};

export default PerimeterSection; 