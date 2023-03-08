import {
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Tooltip,
  Textarea,
  Button,
  useClipboard,
} from '@chakra-ui/react';
import { useRef, useEffect, useState } from 'react';
import { CoverLetter } from '@wasp/entities';

type ModalProps = {
  coverLetterData: CoverLetter[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export default function ModalElement({ coverLetterData, isOpen, onOpen, onClose }: ModalProps) {
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string>(coverLetterData[0].content);

  const { hasCopied, onCopy } = useClipboard(selectedCoverLetter);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const copyButtonRef = useRef(null);

  useEffect(() => {
    if (coverLetterData) {
      onOpen();
    }
    return () => {
      onClose();
    }
  }, [coverLetterData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={copyButtonRef}>
      <ModalOverlay />
      <ModalContent maxH='2xl' maxW='2xl' bgColor='bg-modal'>
        <ModalHeader>Your Cover Letter</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {coverLetterData.length > 1 && (
            <Select
              // placeholder='Select option'
              onChange={(coverLetter) => setSelectedCoverLetter(coverLetter.target.value)}
            >
              {coverLetterData.map((coverLetter) => (
                <option key={coverLetter.id} value={coverLetter.content}>
                  {coverLetter.title} - {coverLetter.id}
                </option>
              ))}
            </Select>
          )}
          <Textarea
            readOnly
            ref={textAreaRef}
            height='md'
            top='50%'
            left='50%'
            transform={'translate(-50%, 0%)'}
            resize='none'
            variant='filled'
            dropShadow='lg'
            value={selectedCoverLetter}
            overflow='scroll'
          />
        </ModalBody>

        <ModalFooter>
          <Button ref={copyButtonRef} colorScheme='purple' size='sm' mr={3} onClick={onCopy}>
            <Tooltip
              label={hasCopied ? 'Copied!' : 'Copy Letter to Clipboard'}
              placement='top'
              hasArrow
              closeOnClick={false}
            >
              Copy
            </Tooltip>
          </Button>
          <Button size='sm' variant='outline' onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
