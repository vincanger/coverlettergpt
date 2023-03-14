import useAuth from '@wasp/auth/useAuth';
import { signInUrl } from '@wasp/auth/helpers/Google';
import { VStack, Button, Spinner, Text } from '@chakra-ui/react';
import { AiOutlineGoogle } from 'react-icons/ai';
import BorderBox from './components/BorderBox';

export default function Login() {
  const { data: user, isLoading, error } = useAuth();

  return (
    <BorderBox>
      {isLoading && <Spinner />}
      {error && <Text>Something went wrong :(</Text>}
      {!user && (
        <VStack>
          <Button leftIcon={<AiOutlineGoogle />}>
            <a href={signInUrl}>Sign In</a>
          </Button>
        </VStack>
      )}
    </BorderBox>
  );
}
