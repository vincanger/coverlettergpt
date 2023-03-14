import { VStack, HStack, Button, Text, Link } from "@chakra-ui/react";
import { FaTwitter, FaCoffee } from "react-icons/fa";
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
        <Text color='text-contrast-sm' fontSize='sm'>
          This is a work in progress, but I'm planning to add lots more features and open source this project soon! If
          you're interested in how I built the app,{' '}
          <Link
            href='https://wasp-lang.notion.site/How-I-Built-CoverLetterGPT-67df0ca8c03e48b3a6247d600a38311d'
            color='purple.300'
            target='_blank'
            textDecoration='underline'
          >
            go here
          </Link>
          . If you're interested in keeping up to date...
        </Text>
        <HStack>
            <Button onClick={clickHandler} leftIcon={<FaCoffee/>} size='sm'>Buy Me a Coffee</Button>
          <a href='https://twitter.com/hot_town' target='_blank'>
            <Button colorScheme='twitter' leftIcon={<FaTwitter />} size='sm'>
              Follow me @hot_town
            </Button>
          </a>
        </HStack>
      </VStack>
    );
}
