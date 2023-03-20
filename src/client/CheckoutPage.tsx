import BorderBox from './components/BorderBox';
import { Heading, Text, Button, Code, Spinner } from '@chakra-ui/react';
import { User } from '@wasp/entities';
import { useQuery } from '@wasp/queries';
import getUserInfo from '@wasp/queries/getUserInfo';
import updateUser from '@wasp/actions/updateUser';
import { useState, useEffect } from 'react';
import stripePayment from '@wasp/actions/stripePayment';

type UpdateUserResult = Pick<User, 'id' | 'email' | 'hasPaid'>;

export default function CheckoutPage({ user }: { user: User }) {
  const [coverLetterAmount, setCoverLetterAmount] = useState(0);
  const [hasPaid, setHasPaid] = useState('loading');
  const [isLoading, setIsLoading] = useState(false);

  const { data: userInfo } = useQuery<{ id: number | null }, UpdateUserResult & { letters: [] }>(getUserInfo, { id: user.id });

  useEffect(() => {
    if (userInfo?.letters.length) {
      setCoverLetterAmount(3 - userInfo.letters.length);
    }
  }, [userInfo]);

  useEffect(() => {
    async function callUpdateUser(): Promise<User> {
      return await updateUser();
    }
    const urlParams = new URLSearchParams(window.location.search);
    const cancel = urlParams.get('canceled');
    const success = urlParams.get('success');
    if (cancel) {
      setHasPaid('canceled');
    } else if (success) {
      setHasPaid('paid');
      callUpdateUser();
    } else {
      setHasPaid('default')
    }
  }, []);

  async function handleClick() {
    setIsLoading(true);
    const response = await stripePayment();
    const url = response.sessionUrl;
    window.open(url, '_blank');
    setIsLoading(false);
  }

  return (
    <BorderBox>
      <Heading> {hasPaid === 'paid' ? '🥳 Payment Successful!' : hasPaid === 'canceled' && '😢 Payment Canceled'} </Heading>
      {hasPaid === 'loading' && (
        <Spinner/>
      )}
      {hasPaid === 'paid' ? (
        <>
        <Text textAlign='center'>Thanks so much for your support. <br/>You have lifetime, unlimited access to CoverLetterGPT!</Text>
        <a href='/'><Button colorScheme='purple' size='sm'>Create a New Cover Letter</Button></a>
        </>
      ) : (
        <Text textAlign='center'>
          You have <Code>{coverLetterAmount}</Code> cover letter{coverLetterAmount === 1 ? '' : 's'} left
        </Text>
      )}
      {hasPaid !== 'paid' && (
        <>
          <Text textAlign='center'>
            Generate unlimited cover letters for life for just <Code>$4.95</Code> !
          </Text>
          <Button colorScheme='purple' mr={3} isLoading={isLoading} onClick={handleClick}>
            💰 Buy Now!
          </Button>
        </>
      )}
    </BorderBox>
  );
}
