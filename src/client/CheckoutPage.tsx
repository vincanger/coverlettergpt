import { type User } from "wasp/entities";
import { useQuery, getUserInfo } from "wasp/client/operations";
import BorderBox from './components/BorderBox';
import { Heading, Text, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.hasPaid) {
      navigate('/profile');
      return;
    }
    function delayedRedirect() {
      return setTimeout(() => {
        navigate('/profile');
      }, 4000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const cancel = urlParams.get('canceled');
    if (cancel) {
      setHasPaid('canceled');
    } else {
      navigate('/profile');
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
