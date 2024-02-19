import { VStack, HStack, Text, Link, Divider } from '@chakra-ui/react';
import { FaTwitter, FaGithub } from 'react-icons/fa';

export function Footer() {
  return (
    <VStack width='full' py={5} textAlign='center' gap={4}>
      <Divider />
      <HStack gap={3}>
        <Link href='https://github.com/vincanger/coverlettergpt' color='purple.300' target='_blank'>
          <FaGithub />
        </Link>

        <Link href='https://twitter.com/hot_town' target='_blank' color='purple.300'>
          <FaTwitter />
        </Link>
      </HStack>
    </VStack>
  );
}
