import useAuth from "@wasp/auth/useAuth";
import { signInUrl } from "@wasp/auth/helpers/Google";
import getLnLoginUrl from "@wasp/actions/getLnLoginUrl";
import { AiOutlineGoogle } from "react-icons/ai";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { VStack, HStack, Button, Spinner, Text, useDisclosure, Heading, FormLabel, Box } from "@chakra-ui/react";
import BorderBox from "./components/BorderBox";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import getLnUserInfo from "@wasp/queries/getLnUserInfo";
import { useQuery } from "@wasp/queries";
import LnLoginModal from "./components/LnLoginModal";
import { EmailLoginForm } from "./Auth";
import { Link } from "@wasp/router";

export default function Login() {
  const [encodedUrl, setEncodedUrl] = useState<string | null>(null);
  const [k1Hash, setK1Hash] = useState<string>("");
  const [lnIsLoading, setLnIsLoading] = useState<boolean>(false);
  const [lnLoginStatus, setLnLoginStatus] = useState<string>("");
  const { data: lnUserInfo, refetch: fetchLnUser } = useQuery(getLnUserInfo, k1Hash, { enabled: !!k1Hash });
  const { data: user, isLoading, error, refetch: fetchUser } = useAuth();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user]);

  useEffect(() => {
    try {
      const getEncodedUrl = async () => {
        const response = await getLnLoginUrl();
        return response;
      };
      getEncodedUrl().then((resp) => {
        setK1Hash(resp.k1Hash);
        setEncodedUrl(resp.encoded);
      });
    } catch (error) {
      console.error("error fetching LN url: ", error);
      setEncodedUrl("error");
    }
  }, []);

  useEffect(() => {
    if (lnUserInfo?.token) {
      setLnLoginStatus("success");
      // this is how wasp stores the token for use with their auth api
      localStorage.setItem("wasp:authToken", JSON.stringify(lnUserInfo.token));
      window.location.reload();
    }
  }, [lnUserInfo]);

  const handleWalletClick = () => {
    if (!encodedUrl) return;
    onOpen();
    setLnIsLoading(true);
    let interval: any = null;
    if (interval) clearInterval(interval);
    interval = setInterval(async () => {
      fetchLnUser();
    }, 1000);

    setTimeout(() => {
      if (!lnUserInfo?.token || !user) {
        clearInterval(interval);
        setLnIsLoading(false);
        alert("Login timed out. Please try again.");
      }
    }, 60000);
  };

  return (
    <>
      <BorderBox>
        {error && <Text>Something went wrong :(</Text>}
        {isLoading || !encodedUrl ? (
          <Spinner />
        ) : (
          <VStack spacing={6} w='70%'>
            <Heading size="xl">Log in</Heading>
            <VStack spacing={0} my={2}>
              <FormLabel alignSelf="start" fontSize="sm">
                Log in with
              </FormLabel>
              <HStack w='full'>
                <a href={signInUrl}>
                  <Button leftIcon={<AiOutlineGoogle />}>Google Sign In</Button>
                </a>
                <Button isLoading={lnIsLoading} onClick={handleWalletClick} leftIcon={<BsCurrencyBitcoin />}>
                  {" "}
                  Lightning Sign In
                </Button>
              </HStack>
            </VStack>
            <HStack w='full' justify='center' align='center'>
              <Box borderBottom="1px" borderColor="purple.300" w='full'/>
              <Text fontSize='sm' whiteSpace='nowrap' >or continue with</Text>
              <Box borderBottom="1px" borderColor="purple.300" w='full'/>
            </HStack>

            <EmailLoginForm />

            <Text fontSize="xs" color="text-contrast-sm" mt={4}>
              By logging in, you agree to our{" "}
              <Link to="/tos">
                <Text as="u">terms of service</Text>
              </Link>
            </Text>
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
