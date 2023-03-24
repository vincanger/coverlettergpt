import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Code,
  Text,
  Spacer,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { signInUrl } from '@wasp/auth/helpers/Google';
import { AiOutlineGoogle } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import deleteJob from '@wasp/actions/deleteJob';

export function LeaveATip({
  isOpen,
  onClose,
  credits,
}: {
  credits: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const tipRef = useRef(null);

  const history = useHistory();
  const handleClick = async () => {
    history.push('/profile');
    onClose();
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={tipRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bgColor='gray.900'>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              👋 Thanks for trying CoverLetterGPT.
            </AlertDialogHeader>

            <AlertDialogBody textAlign='center'>
              <Text>You have <Code>{credits}</Code> cover letter
              {credits === 1 ? '' : 's'} left</Text>
              <Text>Purchase more or get unlimited access for 3 months for only <Code>$4.95</Code> !</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button isLoading={isLoading} ref={tipRef} colorScheme='purple' onClick={handleClick}>
                💰 Buy More
              </Button>
              <Spacer />
              <Button alignSelf='flex-end' fontSize='sm' variant='solid' size='sm' onClick={onClose}>
                No, Thanks
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export function LoginToBegin({ isOpen, onClose }: { isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  const loginRef = useRef(null);

  const handleClick = async () => {
    window.open(signInUrl, '_self');
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={loginRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent bgColor='gray.900'>
          <AlertDialogHeader textAlign='center' fontSize='md' mt={3} fontWeight='bold'>
            ✋
          </AlertDialogHeader>

          <AlertDialogBody textAlign='center'>Please Login with Google to Begin!</AlertDialogBody>

          <AlertDialogFooter justifyContent='center'>
            <Button ref={loginRef} leftIcon={<AiOutlineGoogle />} colorScheme='purple' onClick={handleClick}>
              Login
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export function DeleteJob({
  isOpen,
  onClose,
  jobId,
}: {
  jobId: string | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const cancelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent bgColor='gray.900'>
          <AlertDialogHeader fontSize='md' mt={3} fontWeight='bold'>
            ⛔️ Delete Job
          </AlertDialogHeader>

          <AlertDialogBody >
            Delete the job and all its cover letters?
            <br />
            This action cannot be undone.
          </AlertDialogBody>

          <AlertDialogFooter display='grid' gridTemplateColumns='1fr 1fr 1fr'>
            <Button leftIcon={<BiTrash />} size='sm' isLoading={isLoading} onClick={async() => {
              setIsLoading(true)
              await deleteJob({ jobId })
              setIsLoading(false)
              onClose()
            }
            }>
              Delete
            </Button>
            <Spacer />
            <Button ref={cancelRef} size='sm' colorScheme='purple' onClick={onClose}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
