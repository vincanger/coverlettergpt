import { Box, VStack, BoxProps, useColorModeValue } from '@chakra-ui/react';

interface BorderBoxProps extends BoxProps {
  children: React.ReactNode;
}

export default function BorderBox({ children, ...props }: BorderBoxProps) {
  const bgColor = useColorModeValue('purple.300', 'purple.100');

  return (
    <Box
      width={['sm', 'xl', '3xl']}
      borderRadius='lg'
      bgColor={bgColor}
      mt={7}
      {...props}
    >
      <VStack
        bgColor='bg-overlay'
        border='3px solid transparent'
        borderRadius='lg'
        clipPath={'inset(2px round 0.5rem)'}
        gap={3}
        py={7}
        px={10}
      >
        {children}
      </VStack>
    </Box>
  );
}
