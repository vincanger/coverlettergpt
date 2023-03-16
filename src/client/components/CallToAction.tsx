import { VStack, HStack, Button, Text, Link, Divider } from '@chakra-ui/react';
import { FaTwitter, FaCoffee, FaGithub } from 'react-icons/fa';
import api from '@wasp/api';

export async function tipLink() {
  const URL = `https://extreme-ip-lookup.com/json/?key=omVMQsY6rLlrdpEYadxg`;
  const data = await fetch(URL);
  const json = await data.json();

  const EU_PAY_LINK = 'https://donate.stripe.com/dR67wjb7A92da6QaEF';
  const US_PAY_LINK = 'https://donate.stripe.com/6oEcQD8Zs92d5QA7ss';

  if (json?.continent != 'Europe') {
    window.open(US_PAY_LINK, '_blank');
  } else {
    window.open(EU_PAY_LINK, '_blank');
  }
}

export function CallToAction() {
  const clickHandler = async () => {
    try {
      await tipLink()
    } catch (error) {
      alert('Something went wrong. Please try again later.');
      console.error(error);
    }
  };

  return (
    <VStack width={['sm', 'lg', 'xl']} mt={10} textAlign='center' gap={4}>
      <Divider />
      <HStack>
        <Text color='text-contrast-sm' fontSize='sm'>
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
        <Button onClick={clickHandler} leftIcon={<FaCoffee />} size='sm'>
          Buy Me a Coffee
        </Button>
        <a href='https://twitter.com/hot_town' target='_blank'>
          <Button colorScheme='twitter' leftIcon={<FaTwitter />} size='sm'>
            Follow me @hot_town
          </Button>
        </a>
      </HStack>
    </VStack>
  );
}
