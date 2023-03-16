import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { tipLink } from './CallToAction';

export default function LeaveATip({ isOpen, onClose }: { isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  const tipRef = useRef(null);

  const handleClick = async () => {
    await tipLink();
    onClose();
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={tipRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bgColor='gray.900'>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Hey there 👋
            </AlertDialogHeader>

            <AlertDialogBody>You seem like you're enjoying CoverLetterGPT. Consider leaving a tip</AlertDialogBody>

            <AlertDialogFooter>
              <Button variant='solid' onClick={onClose}>
                Nah
              </Button>
              <Button ref={tipRef} colorScheme='purple' onClick={handleClick} ml={3}>
                Sure! 🙏
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
