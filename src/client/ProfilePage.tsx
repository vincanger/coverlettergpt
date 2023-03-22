import BorderBox from './components/BorderBox';
import { Heading, Text, Button, Code, Spinner, Checkbox, VStack } from '@chakra-ui/react';
import { User } from '@wasp/entities';
import { useQuery } from '@wasp/queries';
import getUserInfo from '@wasp/queries/getUserInfo';
import updateUser from '@wasp/actions/updateUser';
import { useState, useEffect } from 'react';
import stripePayment from '@wasp/actions/stripePayment';
import logout from '@wasp/auth/logout';
import { useAction } from '@wasp/actions';
 
export default function ProfilePage({ user }: { user: User }) {
  const [coverLetterAmount, setCoverLetterAmount] = useState<number | string>('_');
  const [isLoading, setIsLoading] = useState(false);

  const { data: userInfo } = useQuery<{ id: number | null }, User & { letters: [] }>(getUserInfo, { id: user.id });

  const userPaidOnDay = new Date(String(user.datePaid))
  const threeMonthsFromDatePaid = new Date(userPaidOnDay.setMonth(userPaidOnDay.getMonth() + 3));

  const updateUserOptimistically = useAction<Pick<User, 'id' | 'notifyPaymentExpires'>, User>(updateUser, {
    optimisticUpdates: [{
        getQuerySpecifier: ({ id }) => [getUserInfo, { id }],
        updateQuery: ({ notifyPaymentExpires }, oldData) => ({ ...oldData, notifyPaymentExpires })
      }]
    }
  );

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
    try {
      const response = await stripePayment();
      const url = response.sessionUrl;
      window.open(url, '_blank');
    } catch (error) {
      alert('Something went wrong. Please try again');
    }
    setIsLoading(false);
  }

  async function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    await updateUserOptimistically({ id: user.id, notifyPaymentExpires: e.target.checked });
  }

  return (
    <BorderBox>
      {!!userInfo ? (
        <>
          <Heading size='md'>👋 Hi {userInfo.email} </Heading>

          {userInfo.hasPaid ? (
            <VStack gap={3} alignItems='flex-start'>
              <Text textAlign='initial'>
                Thanks so much for your support. <br /> You have unlimited access to CoverLetterGPT until:
              </Text>
              <Code alignSelf='center' fontSize='lg'>
                {threeMonthsFromDatePaid.toUTCString().slice(0, -13)}
              </Code>
              <Checkbox
                mt={3}
                textColor={!userInfo?.notifyPaymentExpires ? 'text-contrast-sm' : 'purple.200'}
                isChecked={userInfo?.notifyPaymentExpires}
                onChange={handleCheckboxChange}
              >
                <Text fontSize='xs'>Email me when my subscription is about to expire</Text>
              </Checkbox>
            </VStack>
          ) : (
            <Text textAlign='center'>
              You have <Code>{coverLetterAmount}</Code> cover letter{coverLetterAmount === 1 ? '' : 's'} left
            </Text>
          )}
          {!userInfo.hasPaid && (
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
        </>
      ) : (
        <Spinner />
      )}
    </BorderBox>
  );
}
