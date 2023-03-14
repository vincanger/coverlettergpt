import { VStack, HStack, Button, Text, Link, Divider } from "@chakra-ui/react";
import { FaTwitter, FaCoffee , FaGithub} from "react-icons/fa";
import api from "@wasp/api"

export function CallToAction() {

    const clickHandler = async() => {
      const location = await api.get('/getLocation');
      if (location.data) {
        window.open(location.data, '_blank')
      } else {
        alert("Sorry, something went wrong. Please try again.")
      }
    }

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
