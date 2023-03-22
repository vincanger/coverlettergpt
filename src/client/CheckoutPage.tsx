import BorderBox from './components/BorderBox';
import { Heading, Text, Spinner } from '@chakra-ui/react';
import { User } from '@wasp/entities';
import { useQuery } from '@wasp/queries';
import getUserInfo from '@wasp/queries/getUserInfo';
import updateUserHasPaid from '@wasp/actions/updateUserHasPaid';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

type UpdateUserResult = Pick<User, 'id' | 'email' | 'hasPaid'>;

export default function CheckoutPage({ user }: { user: User }) {
  const [hasPaid, setHasPaid] = useState('loading');

  const { data: userInfo } = useQuery<{ id: number | null }, UpdateUserResult & { letters: [] }>(getUserInfo, {
    id: user.id,
  });

  const history = useHistory();

  useEffect(() => {
    if (user?.hasPaid) {
      history.push('/profile');
      return;
    }
    function delayedRedirect() {
      return setTimeout(() => {
        history.push('/profile');
      }, 4000);
    }
    async function callUpdateUser(): Promise<void> {
      const updatedUser = await updateUserHasPaid() as UpdateUserResult;
      if (updatedUser?.hasPaid) {
        setHasPaid('paid');
      } else {
        setHasPaid('error');
        delayedRedirect();
      }
    }
    const urlParams = new URLSearchParams(window.location.search);
    const cancel = urlParams.get('canceled');
    const success = urlParams.get('success');
    if (cancel) {
      setHasPaid('canceled');
    } else if (success) {
      callUpdateUser();
    } else {
      history.push('/profile');
    }
    delayedRedirect();
    return () => {
      clearTimeout(delayedRedirect());
    };
  }, [userInfo]);

  return (
    <BorderBox>
      <Heading>
        {hasPaid === 'paid'
          ? '🥳 Payment Successful!'
          : hasPaid === 'canceled'
          ? '😢 Payment Canceled'
          : hasPaid === 'error' && '🙄 Payment Error'}
      </Heading>
      {hasPaid === 'loading' && <Spinner />}
      {hasPaid !== 'loading' && (
        <Text textAlign='center'>
          You are being redirected to your profile page... <br />
        </Text>
      )}
    </BorderBox>
  );
}
