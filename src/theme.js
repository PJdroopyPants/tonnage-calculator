import { extendTheme } from '@chakra-ui/react';
import { colors, typography, spacing, shadows, borders } from './assets/theme';

// Convert our existing theme to Chakra UI format
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    primary: {
      50: colors.primary.lightest,
      100: colors.primary.lightest,
      200: colors.primary.light,
      300: colors.primary.light,
      400: colors.primary.light,
      500: colors.primary.main,
      600: colors.primary.main,
      700: colors.primary.dark,
      800: colors.primary.dark,
      900: colors.primary.dark,
    },
    secondary: {
      50: colors.secondary.lightest,
      100: colors.secondary.lightest,
      200: colors.secondary.light,
      300: colors.secondary.light,
      400: colors.secondary.light,
      500: colors.secondary.main,
      600: colors.secondary.main,
      700: colors.secondary.dark,
      800: colors.secondary.dark,
      900: colors.secondary.dark,
    },
    success: {
      50: colors.status.success.bg,
      100: colors.status.success.bg,
      500: colors.status.success.main,
      600: colors.status.success.main,
      700: colors.status.success.dark,
      800: colors.status.success.dark,
    },
    warning: {
      50: colors.status.warning.bg,
      100: colors.status.warning.bg,
      500: colors.status.warning.main,
      600: colors.status.warning.main,
      700: colors.status.warning.dark,
      800: colors.status.warning.dark,
    },
    danger: {
      50: colors.status.danger.bg,
      100: colors.status.danger.bg,
      500: colors.status.danger.main,
      600: colors.status.danger.main,
      700: colors.status.danger.dark,
      800: colors.status.danger.dark,
    },
    info: {
      50: colors.status.info.bg,
      100: colors.status.info.bg,
      500: colors.status.info.main,
      600: colors.status.info.main,
      700: colors.status.info.dark,
      800: colors.status.info.dark,
    },
  },
  fonts: {
    body: typography.fontFamily,
    heading: typography.fontFamily,
  },
  fontWeights: {
    normal: typography.fontWeights.regular,
    medium: typography.fontWeights.medium,
    semibold: typography.fontWeights.semiBold,
    bold: typography.fontWeights.bold,
  },
  space: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
    xxl: spacing.xxl,
  },
  radii: {
    sm: borders.radius.sm,
    md: borders.radius.md,
    lg: borders.radius.lg,
    xl: borders.radius.xl,
  },
  shadows: {
    sm: shadows.sm,
    md: shadows.md,
    lg: shadows.lg,
    xl: shadows.xl,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
          },
          _active: {
            bg: 'primary.700',
          },
        },
        outline: {
          border: '1px solid',
          borderColor: 'primary.500',
          color: 'primary.500',
        },
        ghost: {
          color: 'primary.500',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'md',
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 'md',
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: 'secondary.700',
        color: 'white',
        borderRadius: 'md',
        px: '2',
        py: '1',
      },
    },
  },
  // Light mode styles only
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

export default theme; 