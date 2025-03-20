import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import logoSvg from '../../assets/SUTHERLAND_PRESSES_LOGO.svg';

/**
 * Logo component for Sutherland Presses
 * The logo adapts to dark/light mode automatically
 */
const Logo = ({ height = "40px", ...props }) => {
  // Background for the logo based on color mode
  const bgColor = useColorModeValue('transparent', 'rgba(255, 255, 255, 0.1)');
  const borderRadius = "md";
  
  return (
    <Box 
      height={height} 
      bgColor={bgColor}
      borderRadius={borderRadius}
      p={1}
      {...props}
    >
      <img 
        src={logoSvg} 
        alt="Sutherland Presses Logo" 
        style={{ 
          height: '100%', 
          maxWidth: '100%',
          objectFit: 'contain'
        }} 
      />
    </Box>
  );
};

export default Logo; 