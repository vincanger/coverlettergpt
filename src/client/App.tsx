import { ChakraProvider, VStack, Box } from '@chakra-ui/react';
import { theme } from './theme';
import { ReactNode, useState, useEffect, createContext } from 'react';
import NavBar from './components/NavBar';
import { CallToAction } from './components/CallToAction';
import { EditPopover } from './components/Popover'

export const TextareaContext = createContext<HTMLTextAreaElement | null>(null);

export default function App({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<{ x: string; y: string; text: string } | null>(null);

  const textarea = document.getElementById('cover-letter-textarea') as HTMLTextAreaElement;

  useEffect(() => {
    function handleMouseUp(event: any) {
      const selection = window.getSelection();

      if (selection?.toString() && window.location.pathname.includes('cover-letter')) {
        // get the x and y coordinates of the mouse position
        const x = event.clientX;
        const y = event.clientY;

        const text = selection.toString();

        setTooltip({ x, y, text });
      } else {
        setTooltip(null);
      }
    }

    document.addEventListener('mouseup', handleMouseUp);
    // document.addEventListener('mousedown', () => setTooltip(null))
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      // document.removeEventListener('mousedown', () => setTooltip(null));
    }
  }, [tooltip]);

  return (
    <ChakraProvider theme={theme}>
      <TextareaContext.Provider value={textarea}>
        <Box
          top={tooltip?.y}
          left={tooltip?.x}
          display={tooltip?.text ? 'block' : 'none'}
          position='absolute'
          zIndex={100}
        >
          <EditPopover />
        </Box>
        <VStack gap={5}>
          <NavBar />
          {children}
          <CallToAction />
        </VStack>
      </TextareaContext.Provider>
    </ChakraProvider>
  );
}
