import useAuth from '@wasp/auth/useAuth'
import BorderBox from './components/BorderBox'
import { Heading, Text, Button } from '@chakra-ui/react';
import { match } from 'react-router-dom';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import logout from '@wasp/auth/logout';

export default function ProfilePage({ match }: { match: match<{ id: string }> }) {
  const { data: user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (user.id !== parseInt(match.params.id)) {
      history.push('/');
    }
  }, [user, match, history]);

  return (
    <BorderBox>
      <Heading>👋 Hi {user.username}</Heading>
      <Text>...check back here soon for more</Text>
      <Button onClick={() => logout()}>Logout</Button>
    </BorderBox>
  );
}