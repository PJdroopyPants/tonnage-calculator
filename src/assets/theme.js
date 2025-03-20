// Enhanced theme file for engineering data visualization

export const colors = {
  // Primary palette
  primary: {
    main: '#1976d2',
    dark: '#0d47a1',
    light: '#4791db',
    lightest: '#e3f2fd',
  },
  // Secondary palette
  secondary: {
    main: '#455a64',
    dark: '#263238',
    light: '#78909c',
    lightest: '#eceff1',
  },
  // Status indicators
  status: {
    success: {
      main: '#388e3c',
      light: '#4caf50',
      dark: '#2e7d32',
      bg: '#e8f5e9',
    },
    warning: {
      main: '#f57c00',
      light: '#ff9800',
      dark: '#e65100',
      bg: '#fff3e0',
    },
    danger: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#b71c1c',
      bg: '#ffebee',
    },
    info: {
      main: '#0288d1',
      light: '#29b6f6',
      dark: '#01579b',
      bg: '#e1f5fe',
    },
  },
  // Neutral colors
  neutral: {
    black: '#212121',
    darkGrey: '#424242',
    mediumGrey: '#757575',
    lightGrey: '#bdbdbd',
    extraLightGrey: '#e0e0e0',
    white: '#ffffff',
    offWhite: '#f5f5f5',
  },
  // Material properties colors
  materials: {
    steel: '#5D6970',
    aluminum: '#A5BFDE',
    copper: '#CD7F32',
    titanium: '#7C878E',
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    md: '1.125rem',   // 18px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    xxl: '1.875rem',  // 30px
    xxxl: '2.25rem',  // 36px
  },
  lineHeights: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  xl: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

export const borders = {
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
    round: '50%',
  },
  width: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },
};

export const transitions = {
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '450ms',
  },
};

// Common styled components for engineering data
export const engineeringDataStyles = {
  // Status indicator styles for values approaching limits
  getStatusColor: (currentValue, warningThreshold, dangerThreshold) => {
    if (currentValue >= dangerThreshold) return colors.status.danger.main;
    if (currentValue >= warningThreshold) return colors.status.warning.main;
    return colors.status.success.main;
  },
  
  // Helper for confidence levels
  getConfidenceColor: (confidenceLevel) => {
    if (confidenceLevel >= 90) return colors.status.success.main;
    if (confidenceLevel >= 70) return colors.status.info.main;
    if (confidenceLevel >= 50) return colors.status.warning.main;
    return colors.status.danger.main;
  }
};

export default {
  colors,
  spacing,
  typography,
  shadows,
  borders,
  transitions,
  engineeringDataStyles
}; 