import { Box, VStack, BoxProps } from '@chakra-ui/react';

interface BorderBoxProps extends BoxProps {
  children: React.ReactNode;
};

export default function BorderBox({ children, ...props }: BorderBoxProps) {
  return (
    <Box width={['sm', 'lg', 'xl']} borderRadius='lg' bgGradient='linear(to-b, orange.100, purple.300)' mt={7} {...props}>
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
