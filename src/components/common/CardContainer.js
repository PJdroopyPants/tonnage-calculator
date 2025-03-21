import React from 'react';
import { 
  Box, 
  Heading, 
  Flex 
} from '@chakra-ui/react';

/**
 * Reusable card container component
 */
const CardContainer = ({ 
  title, 
  children, 
  action,
  ...props 
}) => {
  // Light mode styles
  const bgColor = 'white';
  const titleColor = 'blue.600';
  const borderColor = 'gray.200';
  
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