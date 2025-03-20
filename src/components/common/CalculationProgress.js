import React from 'react';
import {
  Box,
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react';

const steps = [
  { title: 'Material', description: 'Select material' },
  { title: 'Thickness', description: 'Enter dimensions' },
  { title: 'Operations', description: 'Define operations' },
  { title: 'Results', description: 'View calculations' }
];

const CalculationProgress = ({ currentStep }) => {
  // Responsive adjustments
  const isMobile = useBreakpointValue({ base: true, md: false });
  const stepTextDisplay = useBreakpointValue({ base: 'none', md: 'block' });

  // Color mode based adjustments
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.100', 'blue.700');
  
  // If on mobile, just show a simplified progress bar
  if (isMobile) {
    return (
      <Box 
        mb={6}
        p={2}
        bg={bgColor}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" fontWeight="medium">Progress:</Text>
          <Text fontSize="sm" fontWeight="bold">Step {currentStep} of 4</Text>
        </Flex>
        <Box 
          mt={2}
          w="100%" 
          h="4px" 
          bg="gray.200" 
          borderRadius="full"
        >
          <Box 
            h="100%" 
            bg="primary.500" 
            borderRadius="full"
            width={`${(currentStep / 4) * 100}%`}
          />
        </Box>
      </Box>
    );
  }
  
  return (
    <Box 
      mb={6}
      p={4}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Stepper size='sm' colorScheme="primary" index={currentStep - 1}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box display={stepTextDisplay}>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      
      {/* Information about current step */}
      <Text mt={4} fontSize="sm" fontWeight="medium" color="primary.600">
        {currentStep < 4 ? `Next: ${steps[currentStep].description}` : 'Calculation complete! View or save your results.'}
      </Text>
    </Box>
  );
};

export default CalculationProgress; 