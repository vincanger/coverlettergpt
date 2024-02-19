import { Box, VStack, BoxProps, useColorModeValue } from '@chakra-ui/react';

interface BorderBoxProps extends BoxProps {
  children: React.ReactNode;
};

export default function BorderBox({ children, ...props }: BorderBoxProps) {
  const bgColor = useColorModeValue('bg-contrast-lg', 'bg-contrast-xl');
  return (
    <Box width={['sm', 'xl', '3xl']} borderRadius='lg' bg={bgColor} mt={7} {...props}>
      <VStack
        bgColor='bg-body'
        border='3px solid transparent'
        borderRadius='lg'
        clipPath={'inset(2px round 0.5rem)'}
        gap={3}
        p={5}
      >
        {children}
      </VStack>
    </Box>
  );
}
