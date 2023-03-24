import BorderBox from './components/BorderBox';
import { Heading, Box, Text, Button, Code, Spinner, Checkbox, VStack, HStack } from '@chakra-ui/react';
import { User } from '@wasp/entities';
import { useQuery } from '@wasp/queries';
import getUserInfo from '@wasp/queries/getUserInfo';
import updateUser from '@wasp/actions/updateUser';
import { useState, useEffect } from 'react';
import stripePayment from '@wasp/actions/stripePayment';
import stripeCreditsPayment from '@wasp/actions/stripeCreditsPayment';
import logout from '@wasp/auth/logout';
import { useAction } from '@wasp/actions';

export default function ProfilePage({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreditsLoading, setIsCreditsLoading] = useState(false);

  const { data: userInfo } = useQuery<{ id: number | null }, User & { letters: [] }>(getUserInfo, { id: user.id });

  const userPaidOnDay = new Date(String(user.datePaid));
  const threeMonthsFromDatePaid = new Date(userPaidOnDay.setMonth(userPaidOnDay.getMonth() + 3));

  const updateUserOptimistically = useAction<Pick<User, 'id' | 'notifyPaymentExpires'>, User>(updateUser, {
    optimisticUpdates: [
      {
        getQuerySpecifier: ({ id }) => [getUserInfo, { id }],
        updateQuery: ({ notifyPaymentExpires }, oldData) => ({ ...oldData, notifyPaymentExpires }),
      },
    ],
  });

  async function handleClick() {
    setIsLoading(true);
    try {
      const response = await stripePayment();
      const url = response.sessionUrl;
      window.open(url, '_self');
    } catch (error) {
      alert('Something went wrong. Please try again');
    }
    setIsLoading(false);
  }

  async function handleCreditsClick() {
    setIsCreditsLoading(true);
    try {
      const response = await stripeCreditsPayment();
      const url = response.sessionUrl;
      window.open(url, '_self');
    } catch (error) {
      alert('Something went wrong. Please try again');
    }
    setIsCreditsLoading(false);
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
            <VStack gap={3} pt={5} alignItems='flex-start'>
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
            <HStack pt={3} textAlign='center'>
              <Heading size='sm'>You have </Heading>
              <Code>{userInfo?.credits ? userInfo.credits : '0'}</Code>
              <Heading size='sm'>cover letter{userInfo?.credits === 1 ? '' : 's'} left</Heading>
            </HStack>
          )}
          {!userInfo.hasPaid && (
            <HStack py={5} gap={5} display='grid' gridTemplateColumns='1fr 1fr'>
              <VStack
                layerStyle='card'
                py={5}
                px={7}
                gap={3}
                height='100%'
                width='100%'
                justifyContent='space-between'
                alignItems='center'
              >
                <VStack gap={3} alignItems='start'>
                  <Heading size='xl'>$2.95</Heading>
                  <Text textAlign='start' fontSize='md'>
                    10 Cover <br />
                    Letters
                  </Text>
                </VStack>
                <Button mr={3} isLoading={isCreditsLoading} onClick={handleCreditsClick}>
                  Buy Now
                </Button>
              </VStack>
              <VStack
                layerStyle='cardMd'
                py={5}
                px={7}
                gap={3}
                height='100%'
                width='100%'
                justifyContent='space-between'
                alignItems='center'
              >
                <VStack gap={3} alignItems='start'>
                  <Heading size='xl'>$4.95</Heading>
                  <Text textAlign='start' fontSize='md'>
                    Unlimited <br />
                    for 3 months
                  </Text>
                </VStack>
                <Button colorScheme='purple' mr={3} isLoading={isLoading} onClick={handleClick}>
                  💰 Buy Now!
                </Button>
              </VStack>
            </HStack>
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
