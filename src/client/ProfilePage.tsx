import useAuth from '@wasp/auth/useAuth'
import BorderBox from './components/BorderBox'
import { Heading, Text, Button } from '@chakra-ui/react';
import { match } from 'react-router-dom';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import logout from '@wasp/auth/logout';

export default function ProfilePage() {
  const { data: user } = useAuth();

  return (
    <BorderBox>
      <Heading>👋 Hi </Heading>
      <Text textAlign='center'>Thanks for signing up and using CoverLetterGPT. Check back here soon for more!</Text>
      <Button onClick={() => logout()}>Logout</Button>
    </BorderBox>
  );
}