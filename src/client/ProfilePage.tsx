import BorderBox from './components/BorderBox'
import { Heading, Text, Button } from '@chakra-ui/react';
import logout from '@wasp/auth/logout';

export default function ProfilePage() {

  return (
    <BorderBox>
      <Heading>👋 Hi </Heading>
      <Text textAlign='center'>Thanks for signing up and using CoverLetterGPT. Check back here soon for more!</Text>
      <Button onClick={() => logout()}>Logout</Button>
    </BorderBox>
  );
}