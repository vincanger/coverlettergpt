import BorderBox from './components/BorderBox';
import { Heading, Text, Spinner } from '@chakra-ui/react';
import { User } from '@wasp/entities';
import { useQuery } from '@wasp/queries';
import getUserInfo from '@wasp/queries/getUserInfo';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

type UpdateUserResult = Pick<User, 'id' | 'email' | 'hasPaid'>;
type PaymentStatus = 'paid' | 'canceled' | 'error' | 'loading';
const getHeadingText = (status: PaymentStatus): string => {
  switch (status) {
    case 'paid':
      return 'Payment Successful!';
    case 'canceled':
      return 'Payment Canceled';
    case 'error':
      return 'Payment Error';
    default:
      return 'loading';
  }
};

export default function CheckoutPage({ user }: { user: User }) {
  const [hasPaid, setHasPaid] = useState<PaymentStatus>('loading');

  const { data: userInfo } = useQuery(getUserInfo, {
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

    const urlParams = new URLSearchParams(window.location.search);
    const cancel = urlParams.get('canceled');
    if (cancel) {
      setHasPaid('canceled');
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
      <Heading>{getHeadingText(hasPaid)}</Heading>

      <Text textAlign='center'>
        You are being redirected to your profile page... <br />
      </Text>
    </BorderBox>
  );
}
