import { extendTheme } from '@chakra-ui/react';
import { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { textStyles, fonts } from './text';
import { semanticTokens } from './tokens';
import {
  Input as ChakraInput,
  Button as ChakraButton,
  Textarea as ChakraTextarea,
  Checkbox as ChakraCheckbox,
  AlertDialog as ChakraAlertDialog,
  Select as ChakraSelect,
  Radio as ChakraRadio,
} from '@chakra-ui/react';

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

ChakraCheckbox.defaultProps = {
  ...ChakraCheckbox.defaultProps,
  colorScheme: 'purple',
};

export const Checkbox = {
  baseStyle: {
    control: {
      border: 'md',
      borderColor: 'border-contrast-md',
      bg: 'bg-contrast-sm',
      _hover: {
        bg: 'bg-contrast-md',
        borderColor: 'border-contrast-md',
      },
      _focus: {
        boxShadow: '0px 0px 0px 2px var(--chakra-colors-active)',
        borderColor: 'active',
      },
      _disabled: {
        bg: 'bg-contrast-xs',
      },
    },
  },
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
        bg: 'bg-contrast-xs',
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
  },
};

ChakraTextarea.defaultProps = {
  ...ChakraTextarea.defaultProps,
  focusBorderColor: 'purple.300',
  variant: 'outline',
  sx: {
    '&::-webkit-scrollbar': {
      width: '12px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'purple.100',
      borderRadius: '20px',
      border: '3px solid transparent',
      backgroundClip: 'content-box',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'purple.200',
    },
  },
};

export const Textarea = {
  variants: {
    outline: {
      border: 'sm',
      borderColor: 'border-contrast-xs',
      bg: 'bg-contrast-sm',
      color: 'text-contrast-lg',
      _hover: {
        borderColor: 'border-contrast-md',
      },
      _focus: {
        boxShadow: 'none',
        bgColor: 'bg-contrast-xs',
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

ChakraSelect.defaultProps = {
  ...ChakraSelect.defaultProps,
  variant: 'outline',
  border: 'sm',
  borderColor: 'border-contrast-xs',
  bg: 'bg-contrast-sm',

  _hover: {
    bg: 'bg-contrast-md',
    borderColor: 'border-contrast-sm',
  },
  _focus: {
    boxShadow: 'none',
    borderColor: 'active',
  },
  // _disabled: {
  //   bg: 'bg-contrast-xs',
  // },
  _placeholder: {
    // color: 'white',
    fontSize: 'sm',
    color: 'text-contrast-sm',
  },
};

ChakraRadio.defaultProps = {
  ...ChakraRadio.defaultProps,
  colorScheme: 'purple',
  border: 'md',
  borderColor: 'border-contrast-sm',
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
  initialColorMode: 'light',
  useSystemColorMode: true,
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
    Checkbox,
    // AlertDialog: {
    //   baseStyle: {
    //     body: {
    //       bgColor: 'bg-body',
    //     },
    //     dialog: {
    //       bg: 'bg-contrast-sm',
    //       color: 'text-contrast-lg',
    //       border: 'sm',
    //       borderColor: 'border-contrast-md',
    //       boxShadow: '0px 0px 0px 1px var(--chakra-colors-active)',
    //     },
    //     header: {
    //       color: 'text-contrast-lg',
    //     },
    //     footer: {
    //       color: 'text-contrast-md',
    //     },
    //   },
    // },
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
    cardMd: {
      bgColor: 'bg-contrast-md',
      border: 'sm',
      rounded: 'lg',
    },
    cardLg: {
      bgColor: 'bg-contrast-lg',
      border: 'sm',
      rounded: 'lg',
      // boxShadow: '0px 0px 0px 1px var(--chakra-colors-active)',
    },
  },
  // shadows: { outline: '0 0 0 1px var(--chakra-colors-active)' },
});
