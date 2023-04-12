import { ChakraProvider, VStack, Box } from '@chakra-ui/react';
import { theme } from './theme';
import { ReactNode, useState, useEffect, useRef, createContext } from 'react';
import NavBar from './components/NavBar';
import { CallToAction } from './components/CallToAction';
import { EditPopover } from './components/Popover';
import { useLocation } from 'react-router-dom';
import useAuth from '@wasp/auth/useAuth';

export const TextareaContext = createContext({ textareaState: '', setTextareaState: (value: string) => { } });

export default function App({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<{ x: string; y: string; text: string } | null>(null);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [textareaState, setTextareaState] = useState<string>('');

  const location = useLocation();

  const { data: user } = useAuth();

  useEffect(() => {
    if (!location.pathname.includes('cover-letter')) {
      setTooltip(null);
    }

    function handleMouseUp(event: any) {
      const selection = window.getSelection();

      if (selection?.toString() && location.pathname.includes('cover-letter')) {
        // closes the tooltip when the user clicks a tooltip button
        if (selection.toString() === currentText) {
          setTooltip(null);
          return;
        }
        setCurrentText(selection.toString());
        // get the x and y coordinates of the mouse position
        const x = event.clientX;
        const y = event.clientY;

        const text = selection.toString();

        setTooltip({ x, y, text });
      } else {
        setTooltip(null);
      }
    }
    function handleMouseDown() {
      if (location.pathname.includes('cover-letter')) {
        setCurrentText(null);
      }
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [tooltip, location]);

  return (
    <ChakraProvider theme={theme}>
      <TextareaContext.Provider value={{
        textareaState,
        setTextareaState
      }}>
        <Box
          top={tooltip?.y}
          left={tooltip?.x}
          display={tooltip?.text ? 'block' : 'none'}
          position='absolute'
          zIndex={100}
        >
          {!!user && <EditPopover setTooltip={setTooltip} user={user} />}
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
