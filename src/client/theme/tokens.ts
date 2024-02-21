export const semanticTokens = {
  colors: {
    'bg-body': {
      default: 'gray.100',
      _dark: 'rgba(0, 0, 0, 0.50)', //'#0d0f10',
    },
    'bg-body-inverse': {
      default: 'rgba(0, 0, 0, 0.90)',
      _dark: 'gray.50',
    },
    'bg-contrast-xs': {
      default: 'rgba(0, 30, 50, 0.0125)',
      _dark: 'rgba(255, 255, 255, 0.0125)',
    },
    'bg-contrast-sm': {
      default: 'rgba(0, 30, 50, 0.025)',
      _dark: 'rgba(255, 255, 255, 0.025)',
    },
    'bg-contrast-md': {
      default: 'rgba(0, 30, 50, 0.05)',
      _dark: 'rgba(255, 255, 255, 0.05)',
    },
    'bg-contrast-lg': {
      default: 'rgba(0, 30, 50, 0.075)',
      _dark: 'rgba(255, 255, 255, 0.075)',
    },
    'bg-contrast-xl': {
      default: 'rgba(0, 30, 50, 0.1)',
      _dark: 'rgba(255, 255, 255, 0.1)',
    },
    'bg-contrast-overlay': {
      default: 'rgba(255, 255, 255, 0.82)',
      _dark: 'rgba(0, 0, 0, 0.87)',
    },
    'bg-overlay': {
      default: 'rgba(237, 242, 247, .98)',
      _dark: 'rgba(0, 0, 0, 0.87)',
    },
    'bg-modal': {
      default: 'rgb(255, 255, 255)',
      _dark: '#1f1f1f',
    },
    'text-contrast-xs': {
      default: 'blackAlpha.500',
      _dark: 'whiteAlpha.500',
    },
    'text-contrast-sm': {
      default: 'blackAlpha.600',
      _dark: 'whiteAlpha.600',
    },
    'text-contrast-md': {
      default: 'blackAlpha.700',
      _dark: 'whiteAlpha.700',
    },
    'text-contrast-lg': {
      default: 'blackAlpha.800',
      _dark: 'whiteAlpha.800',
    },
    'text-contrast-xl': {
      default: 'blackAlpha.900',
      _dark: 'whiteAlpha.900',
    },
    'border-contrast-xs': {
      default: 'rgba(0, 0, 0, 0.1)',
      _dark: 'rgba(255, 255, 255, 0.1)',
    },
    'border-contrast-sm': {
      default: 'rgba(0, 0, 0, 0.2)',
      _dark: 'rgba(255, 255, 255, 0.2)',
    },
    'border-contrast-md': {
      default: 'rgba(0, 0, 0, 0.3)',
      _dark: 'rgba(255, 255, 255, 0.3)',
    },
    'border-contrast-lg': {
      default: 'rgba(0, 0, 0, 0.4)',
      _dark: 'rgba(255, 255, 255, 0.4)',
    },
    'border-contrast-xl': {
      default: 'rgba(0, 0, 0, 0.5)',
      _dark: 'rgba(255, 255, 255, 0.5)',
    },
    active: {
      default: 'purple.300',
      _dark: 'purple.300',
    },
  },
  borders: {
    sm: `1px solid var(--chakra-colors-border-contrast-xs)`,
    md: `2px solid var(--chakra-colors-border-contrast-xs)`,
    lg: `3px solid var(--chakra-colors-border-contrast-xs)`,
    error: `1px solid var(--chakra-colors-red-500)`,
  },
};

if (typeof window !== 'undefined') {
  const updateViewportUnits = () => {
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  };
  updateViewportUnits();
  window.addEventListener('resize', updateViewportUnits);
}
