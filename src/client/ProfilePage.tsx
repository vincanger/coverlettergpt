import { type CoverLetter, type User } from "wasp/entities";
import { logout } from "wasp/client/auth";

import {
  useAction,
  type OptimisticUpdateDefinition,
  updateUser,
  stripePayment,
  stripeGpt4Payment,
  useQuery,
  getUserInfo,
} from "wasp/client/operations";

import BorderBox from './components/BorderBox';
import { Box, Heading, Text, Button, Code, Spinner, Checkbox, VStack, HStack, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

export default function ProfilePage({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGpt4loading, setIsGpt4Loading] = useState(false);

  const { data: userInfo } = useQuery(getUserInfo, { id: user.id });

  const userPaidOnDay = new Date(String(user.datePaid));
  const oneMonthFromDatePaid = new Date(userPaidOnDay.setMonth(userPaidOnDay.getMonth() + 1));

  const updateUserOptimistically = useAction(updateUser, {
    optimisticUpdates: [
      {
        getQuerySpecifier: ({ id }) => [getUserInfo, { id }],
        updateQuery: ({ notifyPaymentExpires }, oldData) => ({ ...oldData, notifyPaymentExpires }),
      } as OptimisticUpdateDefinition<
        Partial<Pick<User, 'id' | 'notifyPaymentExpires'>>,
        Pick<User, 'id' | 'email' | 'hasPaid' | 'notifyPaymentExpires' | 'credits'> & { letters: CoverLetter[] }
      >,
    ],
  });

  async function handleGpt3Click() {
    setIsLoading(true);
    try {
      const response = await stripePayment();
      const url = response.sessionUrl;
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Something went wrong. Please try again');
    }
    setIsLoading(false);
  }

  async function handleGpt4Click() {
    setIsGpt4Loading(true);
    try {
      const response = await stripeGpt4Payment();
      const url = response.sessionUrl;
      if (url) window.open(url, '_self');
    } catch (error) {
      alert('Something went wrong. Please try again');
    }
    setIsGpt4Loading(false);
  }

  async function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    await updateUserOptimistically({ id: user.id, notifyPaymentExpires: e.target.checked });
  }

  return (
    <BorderBox>
      {!!userInfo ? (
        <>
          <Heading size='md'>👋 Hi {userInfo.email || 'There'} </Heading>
          {userInfo.subscriptionStatus === 'past_due' ? (
            <VStack gap={3} py={5} alignItems='center'>
              <Box color='purple.400'>
                <IoWarningOutline size={30} color='inherit' />
              </Box>
              <Text textAlign='center' fontSize='sm' textColor='text-contrast-lg'>
                Your subscription is past due. <br/> Please update your payment method{' '}
                <Link textColor='purple.400' href='https://billing.stripe.com/p/login/5kA7sS0Wc3gD2QM6oo'>
                  by clicking here
                </Link>
              </Text>
            </VStack>
          ) : userInfo.hasPaid && !userInfo.isUsingLn ? (
            <VStack gap={3} pt={5} alignItems='flex-start'>
              <Text textAlign='initial'>Thanks so much for your support!</Text>

              <Text textAlign='initial'>
                You have unlimited access to CoverLetterGPT using {user.gptModel === 'gpt-4' ? 'GPT-4' : 'GPT-3.5'}{' '}
                until:
              </Text>

              <Code alignSelf='center' fontSize='lg'>
                {oneMonthFromDatePaid.toUTCString().slice(0, -13)}
              </Code>
              <Text alignSelf='center' fontSize='xs' fontStyle='italic' textColor='text-contrast-sm'>
                * Manage your{' '}
                <Link textColor='purple.600' href='https://billing.stripe.com/p/login/5kA7sS0Wc3gD2QM6oo'>
                  subscription here
                </Link>
              </Text>
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
            !userInfo.isUsingLn && (
              <HStack pt={3} textAlign='center'>
                <Heading size='sm'>You have </Heading>
                <Code>{userInfo?.credits ? userInfo.credits : '0'}</Code>
                <Heading size='sm'>cover letter{userInfo?.credits === 1 ? '' : 's'} left</Heading>
              </HStack>
            )
          )}
          {!userInfo.hasPaid && !userInfo.isUsingLn && (
            <VStack py={3} gap={5}>
              <VStack py={3} gap={2}>
                <HStack gap={5} display='grid' gridTemplateColumns='1fr 1fr'>
                  {/* <VStack
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
                  </VStack> */}
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
                        Unlimited
                        <br />
                        monthly subscription
                      </Text>
                      <Heading size='md'>Using GPT-3 🦾</Heading>
                    </VStack>
                    <Button mr={3} isLoading={isLoading} onClick={handleGpt3Click}>
                      Buy Now!
                    </Button>
                  </VStack>
                  <VStack
                    layerStyle='cardMd'
                    borderColor={'purple.200'}
                    borderWidth={3}
                    py={5}
                    px={7}
                    gap={3}
                    height='100%'
                    width='100%'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <VStack gap={3} alignItems='start'>
                      <Heading size='xl'>$5.95</Heading>

                      <Text textAlign='start' fontSize='md'>
                        Unlimited <br /> monthly subscription
                      </Text>
                      <Heading size='md'>Using GPT-4 🤖</Heading>
                    </VStack>
                    <Button colorScheme='purple' mr={3} isLoading={isGpt4loading} onClick={handleGpt4Click}>
                      💰 Buy Now!
                    </Button>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          )}
          {userInfo.isUsingLn && (
            <VStack py={3} gap={5}>
              <VStack py={3} gap={2}>
                <HStack gap={5} display='grid' gridTemplateColumns='1fr'>
                  <VStack
                    layerStyle='card'
                    py={5}
                    px={7}
                    gap={3}
                    height='100%'
                    width='100%'
                    justifyContent='center'
                    alignItems='center'
                  >
                    <VStack gap={3} alignItems='center'>
                      <Heading size='xl'>⚡️</Heading>
                      <Text textAlign='start' fontSize='md'>
                        You have affordable, pay-per-use access to CoverLetterGPT with GPT-4 via the Lightning Network
                      </Text>
                      <Text textAlign='start' fontSize='sm'>
                        Note: if you prefer a montly subscription, please logout and sign in with Google.
                      </Text>
                    </VStack>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
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
