import { deleteJob, milliSatsToCents } from "wasp/client/operations";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Checkbox,
  Code,
  Text,
  Spacer,
  VStack,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';

export function LeaveATip({
  isOpen,
  onClose,
  credits,
  isUsingLn,
}: {
  isUsingLn: boolean;
  credits: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const tipRef = useRef(null);

  const navigate = useNavigate();
  const handleClick = async () => {
    navigate('/profile');
    onClose();
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={tipRef} onClose={onClose}>
        <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
          <AlertDialogContent bgColor='bg-modal'>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              👋 Thanks for trying CoverLetterGPT.
            </AlertDialogHeader>

            <AlertDialogBody textAlign='center'>
              <Text>
                You have <Code>{credits}</Code> free cover letter {credits === 1 ? 'credit' : 'credits'} left.
              </Text>
              <Text mt={4}>
                {!isUsingLn ? (
                  <>
                    Purchase unlimited access for only <Code>$2.95</Code> per month!
                  </>
                ) : (
                  <>After, just pay a small fee per cover letter with your lightning ⚡️ wallet. </>
                )}
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              {!isUsingLn ? (
                <>
                  <Button isLoading={isLoading} ref={tipRef} colorScheme='purple' onClick={handleClick}>
                    💰 Buy More
                  </Button>
                  <Spacer />
                  <Button alignSelf='flex-end' fontSize='sm' variant='solid' size='sm' onClick={onClose}>
                    No, Thanks
                  </Button>
                </>
              ) : (
                <Button alignSelf='flex-end' fontSize='sm' variant='solid' size='sm' onClick={onClose}>
                  OK
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export function LoginToBegin({ isOpen, onClose }: { isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  const navigate = useNavigate();
  const loginRef = useRef(null);

  const handleClick = async () => {
    navigate('/login');
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={loginRef} onClose={onClose}>
      <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
        <AlertDialogContent bgColor='bg-modal'>
          <AlertDialogHeader textAlign='center' fontSize='md' mt={3} fontWeight='bold'>
            ✋
          </AlertDialogHeader>

          <AlertDialogBody textAlign='center'>Please Login to Begin!</AlertDialogBody>

          <AlertDialogFooter justifyContent='center'>
            <Button ref={loginRef} leftIcon={<AiOutlineLogin />} colorScheme='purple' onClick={handleClick}>
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
      <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
        <AlertDialogContent bgColor='bg-modal'>
          <AlertDialogHeader fontSize='md' mt={3} fontWeight='bold'>
            ⛔️ Delete Job
          </AlertDialogHeader>

          <AlertDialogBody>
            Delete the job and all its cover letters?
            <br />
            This action cannot be undone.
          </AlertDialogBody>

          <AlertDialogFooter display='grid' gridTemplateColumns='1fr 1fr 1fr'>
            <Button
              leftIcon={<BiTrash />}
              size='sm'
              isLoading={isLoading}
              onClick={async () => {
                if (!jobId) return;
                setIsLoading(true);
                await deleteJob({ jobId });
                setIsLoading(false);
                onClose();
              }}
            >
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

export function EditAlert({ coverLetter }: { coverLetter: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (coverLetter && localStorage.getItem('edit-alert') !== 'do not show') {
      onOpen();
    }
  }, [coverLetter]);

  const cancelRef = useRef(null);
  function handleCheckboxChange(e: any) {
    if (e.target.checked) {
      localStorage.setItem('edit-alert', 'do not show');
    } else {
      localStorage.removeItem('edit-alert');
    }
  }

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px'>
        <AlertDialogContent bgColor='bg-modal'>
          <AlertDialogHeader fontSize='md' mt={3} fontWeight='bold'>
            📝 Your cover letter is ready!
          </AlertDialogHeader>

          <AlertDialogBody gap={5} pointerEvents='none'>
            <Text pb={3}>
              If you want to make finer edits, highlight the text you'd like to change to access the pop-up below:
            </Text>
            <VStack m={3} gap={1} borderRadius='lg'>
              <Box layerStyle='cardLg' p={3}>
                <Text fontSize='sm' textAlign='center'>
                  🤔 Ask GPT to make this part more..
                </Text>
                <ButtonGroup size='xs' p={1} variant='solid' colorScheme='purple' isAttached>
                  <Button size='xs' color='black' fontSize='xs'>
                    Concise
                  </Button>

                  <Button size='xs' color='black' fontSize='xs'>
                    Detailed
                  </Button>

                  <Button size='xs' color='black' fontSize='xs'>
                    Professional
                  </Button>

                  <Button size='xs' color='black' fontSize='xs'>
                    Informal
                  </Button>
                </ButtonGroup>
              </Box>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter justifyContent='space-between'>
            <Checkbox onChange={handleCheckboxChange} size='sm' color='text-contrast-md'>
              Don't show me this again
            </Checkbox>
            <Button ref={cancelRef} size='sm' colorScheme='purple' onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
