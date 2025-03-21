import React from 'react';
import { Box } from '@chakra-ui/react';
import logoLightMode from '../../assets/SUTHERLAND_PRESSES_LOGO.svg';

/**
 * Logo component for Sutherland Presses
 */
const Logo = ({ height = "40px", ...props }) => {
  return (
    <Box 
      height={height} 
      p={1}
      {...props}
    >
      <img 
        src={logoLightMode} 
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