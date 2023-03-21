import { VStack, HStack, Button, Text, Link, Divider } from '@chakra-ui/react';
import { FaTwitter, FaGithub } from 'react-icons/fa';

export function CallToAction() {
  return (
    <VStack width={['sm', 'lg', 'xl']} mt={10} textAlign='center' gap={4}>
      <Divider />
      <HStack>
        <Text color='text-contrast-sm' fontSize='sm' textAlign='start'>
          This Project is Open-Source! Check Out the Code on
        </Text>
        <Link
          href='https://github.com/vincanger/coverlettergpt'
          color='purple.300'
          target='_blank'
          display='grid'
          gridTemplateColumns='auto 1fr'
          gridGap={2}
          alignItems='center'
        >
          <FaGithub />
          GitHub
        </Link>
      </HStack>
      <HStack>
        <a href='https://twitter.com/hot_town' target='_blank'>
          <Button colorScheme='twitter' leftIcon={<FaTwitter />} size='sm'>
            Follow me @hot_town
          </Button>
        </a>
      </HStack>
    </VStack>
  );
}
