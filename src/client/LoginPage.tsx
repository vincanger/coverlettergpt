import useAuth from '@wasp/auth/useAuth';
import { signInUrl } from '@wasp/auth/helpers/Google';
import getLnLoginUrl from '@wasp/actions/getLnLoginUrl';
import { AiOutlineGoogle } from 'react-icons/ai';
import { BsCurrencyBitcoin } from 'react-icons/bs';
import { VStack, Button, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import BorderBox from './components/BorderBox';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import getLnUserInfo from '@wasp/queries/getLnUserInfo';
import { useQuery } from '@wasp/queries';
import LnLoginModal from './components/LnLoginModal';

export default function Login() {
  const [encodedUrl, setEncodedUrl] = useState<string | null>(null);
  const [k1Hash, setK1Hash] = useState<string>('');
  const [lnIsLoading, setLnIsLoading] = useState<boolean>(false);
  const [lnLoginStatus, setLnLoginStatus] = useState<string>('');
  const { data: lnUserInfo, refetch: fetchLnUser } = useQuery(getLnUserInfo, k1Hash, { enabled: !!k1Hash });
  const { data: user, isLoading, error, refetch: fetchUser } = useAuth();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const history = useHistory();

  useEffect(() => {
    console.log('user', user);
    if (user) {
      history.push('/');
    }
  }, [user]);

  useEffect(() => {
    const getEncodedUrl = async () => {
      const response = await getLnLoginUrl();
      console.log(response);
      return response;
    };
    getEncodedUrl().then((resp) => {
      setK1Hash(resp.k1Hash);
      setEncodedUrl(resp.encoded);
    });
  }, []);

  useEffect(() => {
    if (lnUserInfo?.token) {
      setLnLoginStatus('success');
      // this is how wasp stores the token for use with their auth api
      localStorage.setItem('wasp:authToken', JSON.stringify(lnUserInfo.token));
      window.location.reload();
    }
  }, [lnUserInfo]);

  const handleWalletClick = () => {
    onOpen();
    setLnIsLoading(true);
    let interval: any = null;
    if (interval) clearInterval(interval);
    interval = setInterval(async () => {
      fetchLnUser();
    }, 1000);

    setTimeout(() => {
      console.log('lnUserInfo: ', lnUserInfo, user);
      if (!lnUserInfo?.token || !user) {
        clearInterval(interval);
        setLnIsLoading(false);
        alert('Login timed out. Please try again.');
      }
    }, 60000);
  };

  return (
    <>
      <BorderBox>
        {error && <Text>Something went wrong :(</Text>}
        {isLoading ? (
          <Spinner />
        ) : (
          <VStack>
            <a href={signInUrl}>
              <Button leftIcon={<AiOutlineGoogle />}>Google Sign In</Button>
            </a>
            {!!encodedUrl && (
              <Button isLoading={lnIsLoading} onClick={handleWalletClick} leftIcon={<BsCurrencyBitcoin />}>
                {' '}
                Lightning Sign In
              </Button>
            )}
          </VStack>
        )}
      </BorderBox>
      <LnLoginModal
        handleWalletClick={handleWalletClick}
        status={lnLoginStatus}
        encodedUrl={encodedUrl}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
