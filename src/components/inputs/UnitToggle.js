import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ButtonGroup, 
  Button, 
  Tooltip, 
  useColorModeValue
} from '@chakra-ui/react';
import { toggleUnits } from '../../store/parametersSlice';

const UnitToggle = () => {
  const dispatch = useDispatch();
  const isMetric = useSelector(state => state.parameters.isMetric);
  
  // Custom colors based on color mode
  const activeBg = useColorModeValue('primary.500', 'primary.400');
  const activeColor = useColorModeValue('white', 'white');
  const inactiveBg = useColorModeValue('gray.100', 'gray.700');
  const inactiveColor = useColorModeValue('gray.700', 'gray.200');
  
  const handleToggle = () => {
    dispatch(toggleUnits());
  };

  return (
    <Tooltip label={`Switch to ${isMetric ? 'US' : 'Metric'} units`} placement="bottom">
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          onClick={handleToggle}
          bg={isMetric ? activeBg : inactiveBg}
          color={isMetric ? activeColor : inactiveColor}
          borderWidth="1px"
          _hover={{ 
            bg: isMetric ? 'primary.600' : 'gray.200',
          }}
        >
          Metric
        </Button>
        <Button
          onClick={handleToggle}
          bg={!isMetric ? activeBg : inactiveBg}
          color={!isMetric ? activeColor : inactiveColor}
          borderWidth="1px"
          _hover={{ 
            bg: !isMetric ? 'primary.600' : 'gray.200',
          }}
        >
          US
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
};

export default UnitToggle; 