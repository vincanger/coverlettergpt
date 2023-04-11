import useAuth from '@wasp/auth/useAuth';
import { signInUrl } from '@wasp/auth/helpers/Google';

import { AiOutlineGoogle } from 'react-icons/ai';
import { VStack, Button, Spinner, Text } from '@chakra-ui/react';
import BorderBox from './components/BorderBox';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Login() {
  const { data: user, isLoading, error } = useAuth();

  const history = useHistory();
  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [user, history]);

  return (
    <BorderBox>
      {error && <Text>Something went wrong :(</Text>}
      {isLoading ? <Spinner /> 
      : <VStack>
          <a href={signInUrl}>
            <Button leftIcon={<AiOutlineGoogle />}>Sign In</Button>
          </a>
        </VStack>
      }
    </BorderBox>
  );
}
