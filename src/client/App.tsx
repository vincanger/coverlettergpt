import { ChakraProvider, VStack, HStack, Button } from '@chakra-ui/react';
import { theme } from './theme';
import { ReactNode, useState } from 'react';
import NavBar from './components/NavBar';
import { CallToAction } from './components/CallToAction';

export default function App({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<{ x: string; y: string; text: string } | null>(null);

  // useEffect(() => {
  //   function handleMouseUp(event: any) {
  //     const selection = window.getSelection();
  //     if (selection?.toString() && window.location.pathname.includes('cover-letter')) {
  //       // get the x and y coordinates of the mouse position
  //       const x = event.clientX
  //       const y = event.clientY

  //       const text = selection.toString();
  //       setTooltip({ x, y, text });
  //     }
  //   }

  //   document.addEventListener('mouseup', handleMouseUp);
  //   return () => document.removeEventListener('mouseup', handleMouseUp);
  // }, [tooltip]);

  return (
    <ChakraProvider theme={theme}>
      <HStack
        display={tooltip ? 'block' : 'none'}
        position='absolute'
        top={tooltip?.y}
        left={tooltip?.x}
        zIndex={100}
        gap={3}
        px={3}
      >
        <Button colorScheme='purple' onClick={() => setTooltip(null)}>
          OK
        </Button>
      </HStack>
      <VStack gap={5}>
        <NavBar />
        {children}
        <CallToAction />
      </VStack>
    </ChakraProvider>
  );
}
