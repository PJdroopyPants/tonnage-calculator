import React from 'react';
import { IconButton, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
  const tooltipLabel = useColorModeValue('Dark mode', 'Light mode');

  return (
    <Tooltip label={tooltipLabel} placement="bottom">
      <IconButton
        size="md"
        fontSize="lg"
        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
        variant="ghost"
        color="current"
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
        _hover={{
          bg: useColorModeValue('gray.100', 'gray.700')
        }}
      />
    </Tooltip>
  );
};

export default ColorModeToggle; 