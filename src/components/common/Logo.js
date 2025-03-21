import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import logoLightMode from '../../assets/SUTHERLAND_PRESSES_LOGO.svg';
import logoDarkMode from '../../assets/SUTHERLAND_PRESSES_LOGO_DARKMODE.svg';

/**
 * Logo component for Sutherland Presses
 * Uses different logo files for light and dark mode
 */
const Logo = ({ height = "40px", ...props }) => {
  // Use appropriate logo based on color mode
  const logoSrc = useColorModeValue(logoLightMode, logoDarkMode);
  
  return (
    <Box 
      height={height} 
      p={1}
      {...props}
    >
      <img 
        src={logoSrc} 
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