import { Box, VStack } from '@chakra-ui/react';

export default function BorderBox({ children }: { children: React.ReactNode }) {
  return (
    <Box width={['sm', 'lg', 'xl']} borderRadius='lg' bgGradient='linear(to-b, orange.100, purple.300)' mt={7}>
      <VStack
        bgColor='bg-contrast-overlay'
        border='3px solid transparent'
        borderRadius='lg'
        clipPath={'inset(4px round 0.5rem)'}
        gap={3}
        p={5}
      >
        {children}
      </VStack>
    </Box>
  );
}
