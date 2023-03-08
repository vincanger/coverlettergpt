import { extendTheme } from '@chakra-ui/react';
// import { styles } from './styles';
// import { colors } from './colors';
// import { components } from './components';

import { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { textStyles, fonts } from './text';
import { semanticTokens } from './tokens';
import { Input as ChakraInput, Button as ChakraButton, Textarea as ChakraTextarea } from '@chakra-ui/react';
import {} from '@chakra-ui/react';

const variantSolid = (props: any) => {
  const { colorScheme: c } = props;

  let bg = `${c}.400`;
  let color = `${c}.50`;
  let hoverBg = `${c}.500`;
  let activeBg = `${c}.600`;
  let disabledBg = `${c}.300`;

  if (c === 'contrast') {
    bg = 'bg-contrast-sm';
    color = 'text-contrast-lg';
    hoverBg = 'bg-contrast-md';
    activeBg = 'bg-contrast-lg';
    disabledBg = 'bg-contrast-sm';
  }

  return {
    border: 'sm',
    bgColor: bg,
    color: color,
    _hover: {
      bg: hoverBg,
    },
    _focus: {
      boxShadow: 'none',
      borderColor: 'active',
    },
    _disabled: {
      bg: disabledBg,
      pointerEvents: 'none',
      opacity: 0.66,
    },
    _active: { bg: activeBg },
  };
};

export const Button = {
  defaultProps: {
    colorScheme: 'contrast',
  },
  baseStyle: {
    border: 'sm',
    transition: 'transform 0.05s ease-out, background 0.3s, opacity 0.3s',
  },
  variants: {
    solid: variantSolid,
  },
};

ChakraButton.defaultProps = {
  ...ChakraButton.defaultProps,
  fontSize: 'md',
  variant: 'solid',
  backdropFilter: 'blur(4px)',
};

ChakraInput.defaultProps = {
  ...ChakraInput.defaultProps,
  focusBorderColor: 'white',
  variant: 'outline',
};

export const Input = {
  variants: {
    outline: {
      field: {
        border: 'sm',
        borderColor: 'border-contrast-xs',
        bg: 'bg-contrast-sm',
        color: 'text-contrast-lg',
        _hover: {
          bg: 'bg-contrast-md',
          borderColor: 'border-contrast-md',
        },
        _focus: {
          boxShadow: 'none',
          borderColor: 'active',
        },
        _disabled: {
          bg: 'bg-contrast-xs',
        },
        _placeholder: {
          color: 'text-contrast-sm',
          fontSize: 'sm',
        },
      }
    },
  },
};

ChakraTextarea.defaultProps = {
  ...ChakraTextarea.defaultProps,
  focusBorderColor: 'white',
  variant: 'outline',
};

export const Textarea = {
  variants: {
    outline: {
      border: 'sm',
      borderColor: 'border-contrast-xs',
      bg: 'bg-contrast-sm',
      color: 'text-contrast-lg',
      _hover: {
        bg: 'bg-contrast-md',
        borderColor: 'border-contrast-md',
      },
      _focus: {
        boxShadow: 'none',
        borderColor: 'active',
      },
      _disabled: {
        bg: 'bg-contrast-xs',
      },
      _placeholder: {
        color: 'text-contrast-sm',
        fontSize: 'sm',
      },
    },
  },
};

export const Link = {
  baseStyle: {
    transition: 'all 0.1s ease-in-out',
    _hover: {
      textDecoration: 'none',
      boxShadow: '0px 1px 0px 0px var(--chakra-colors-active)',
    },
    _focus: {
      boxShadow: '0px 1px 0px 0px var(--chakra-colors-active)',
    },
    _active: { opacity: '0.5' },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const styles = {
  global: (props: StyleFunctionProps) => ({
    html: {
      fontSize: {
        base: '90%',
        md: '100%',
      },
    },
    body: {
      bgColor: 'bg-body',
    },
  }),
};



export const theme = extendTheme({
  components: {
    Input,
    Textarea,
    Button,
    Link,
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
      },
    },
  },
  config,
  textStyles,
  fonts,
  semanticTokens,
  styles,
  layerStyles: {
    card: {
      bgColor: 'bg-contrast-xs',
      border: 'sm',
      rounded: 'lg',
    },
  },
  // shadows: { outline: '0 0 0 1px var(--chakra-colors-active)' },
});
