import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ButtonGroup, 
  Button, 
  Tooltip
} from '@chakra-ui/react';
import { toggleUnits } from '../../store/parametersSlice';

const UnitToggle = () => {
  const dispatch = useDispatch();
  const isMetric = useSelector(state => state.parameters.isMetric);
  
  // Light mode colors
  const activeBg = 'primary.500';
  const activeColor = 'white';
  const inactiveBg = 'gray.100';
  const inactiveColor = 'gray.700';
  
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