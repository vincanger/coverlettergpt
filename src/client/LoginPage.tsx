import useAuth from '@wasp/auth/useAuth';
import { signInUrl } from '@wasp/auth/helpers/Google';
import { AiOutlineGoogle } from 'react-icons/ai';
import { VStack, Button, Spinner, Text } from '@chakra-ui/react';
import BorderBox from './components/BorderBox';

export default function Login() {
  const { data: user, isLoading, error } = useAuth();

  return (
    <BorderBox>
      {isLoading && <Spinner />}
      {error && <Text>Something went wrong :(</Text>}
      {!user && (
        <VStack>
          <a href={signInUrl}>
            <Button leftIcon={<AiOutlineGoogle />}>Sign In</Button>
          </a>
        </VStack>
      )}
    </BorderBox>
  );
}
