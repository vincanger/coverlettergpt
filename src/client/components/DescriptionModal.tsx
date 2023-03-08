import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { useRef, useEffect } from 'react';

type DescriptionModalProps = {
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export default function DescriptionModal({ description, isOpen, onClose, onOpen }: DescriptionModalProps) {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const copyButtonRef = useRef(null);

  useEffect(() => {
    if (description) {
      onOpen();
    }
    return () => {
      onClose();
    }
  }, [description]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={copyButtonRef}>
      <ModalOverlay />
      <ModalContent maxH='lg' maxW='lg' bgColor='bg-modal'>
        <ModalHeader>Your Cover Letter</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        
          <Textarea
            readOnly
            ref={textAreaRef}
            height='100%'
            top='50%'
            left='50%'
            transform={'translate(-50%, 0%)'}
            resize='none'
            variant='filled'
            dropShadow='lg'
            value={description}
            overflow='scroll'
          />
        </ModalBody>

        <ModalFooter>
          <Button size='sm' variant='outline' onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
