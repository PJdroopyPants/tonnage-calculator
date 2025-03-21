import React from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  useColorModeValue 
} from '@chakra-ui/react';

/**
 * Reusable card container component that automatically adapts to color mode
 */
const CardContainer = ({ 
  title, 
  children, 
  action,
  ...props 
}) => {
  // Color mode dependent styles
  const bgColor = useColorModeValue('white', 'gray.700');
  const titleColor = useColorModeValue('blue.600', 'blue.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      {...props}
    >
      {title && (
        <Flex 
          justify="space-between" 
          align="center" 
          mb={4}
          pb={2}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <Heading 
            as="h3" 
            size="sm"
            color={titleColor}
            fontWeight="medium"
          >
            {title}
          </Heading>
          
          {action && (
            <Box ml={2}>
              {action}
            </Box>
          )}
        </Flex>
      )}
      
      {children}
    </Box>
  );
};

export default CardContainer; 