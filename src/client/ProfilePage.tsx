import BorderBox from './components/BorderBox';
import { Heading, Text, Button, Code } from '@chakra-ui/react';
import { User } from '@wasp/entities';
import { useQuery } from '@wasp/queries';
import getUserInfo from '@wasp/queries/getUserInfo';
import { useState, useEffect } from 'react';
import stripePayment from '@wasp/actions/stripePayment';
import logout from '@wasp/auth/logout';

export default function ProfilePage({ user }: { user: User }) {
  const [coverLetterAmount, setCoverLetterAmount] = useState<number | string>('_');
  const [isLoading, setIsLoading] = useState(false);

  const { data: userInfo } = useQuery<{ id: number | null }, User & { letters: [] }>(getUserInfo, { id: user.id });

  useEffect(() => {
    if (userInfo && userInfo.letters.length) {
      const amount = 3 - userInfo.letters.length < 0 ? 0 : 3 - userInfo.letters.length;
      setCoverLetterAmount(amount);
    } else if (userInfo && !userInfo.letters.length) {
      setCoverLetterAmount(3);
    } 
  }, [userInfo]);

  async function handleClick() {
    setIsLoading(true);
    const response = await stripePayment();
    const url = response.sessionUrl;
    window.open(url, '_blank');
    setIsLoading(false);
  }

  return (
    <BorderBox>
      <Heading size='md'>👋 Hi {user.email} </Heading>

      {user.hasPaid ? (
        <Text textAlign='center'>Thanks so much for your support. You have unlimited access to CoverLetterGPT for 3 months!</Text>
      ) : (
        <Text textAlign='center'>
          You have <Code>{coverLetterAmount}</Code> cover letter{coverLetterAmount === 1 ? '' : 's'} left
        </Text>
      )}
      {!user.hasPaid && (
        <>
          <Text textAlign='center'>
            Generate unlimited cover letters for 3 months for just <Code>$4.95</Code> !
          </Text>
          <Button colorScheme='purple' mr={3} isLoading={isLoading} onClick={handleClick}>
            💰 Buy Now!
          </Button>
        </>
      )}
      <Button alignSelf='flex-end' size='sm' onClick={() => logout()}>
        Logout
      </Button>
    </BorderBox>
  );
}
