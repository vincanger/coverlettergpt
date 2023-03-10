import SignUpForm from '@wasp/auth/forms/Signup';
import LoginForm from '@wasp/auth/forms/Login';
import useAuth from '@wasp/auth/useAuth.js';
import logout from '@wasp/auth/logout.js';
import { useState, useEffect } from 'react';
import { Heading, VStack, Button } from '@chakra-ui/react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { data: user } = useAuth();

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  return (
    <VStack>
      {!user ? (
        <VStack>
          <Button onClick={() => setIsSignUp(!isSignUp)}>{!isSignUp ? 'Sign Up' : 'Login'}</Button>
          {isSignUp ? <SignUpForm /> : <LoginForm />}
        </VStack>
      ) : (
        <VStack>
          <p>Logged in as {user.username}</p>
          <Button onClick={logout}>Logout</Button>
        </VStack>
      )}
    </VStack>
  );
}
