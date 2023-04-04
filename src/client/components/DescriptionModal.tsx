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
import { useRef } from 'react';

type DescriptionModalProps = {
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export default function DescriptionModal({ description, isOpen, onClose, onOpen }: DescriptionModalProps) {

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const copyButtonRef = useRef(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={copyButtonRef}>
      <ModalOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px' />
      <ModalContent maxH='lg' maxW='lg' bgColor='bg-modal'>
        <ModalHeader>Job Description</ModalHeader>
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
