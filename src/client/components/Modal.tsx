import { type CoverLetter } from "wasp/entities";
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
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';

type ModalProps = {
  coverLetterData: CoverLetter[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export default function ModalElement({ coverLetterData, isOpen, onOpen, onClose }: ModalProps) {
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter>(coverLetterData[0]);

  const { hasCopied, onCopy } = useClipboard(selectedCoverLetter.content);

  const navigate = useNavigate();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const copyButtonRef = useRef(null);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCoverLetterId = e.target.value;
    const selectedCoverLetter = coverLetterData.find((coverLetter) => coverLetter.id === selectedCoverLetterId);
    if (selectedCoverLetter) {
      setSelectedCoverLetter(selectedCoverLetter);
    }
  };

  const convertDateToLocaleString = (date: Date) => {
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString().split(':').slice(0, 2).join(':');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={copyButtonRef}>
      <ModalOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px' />
      <ModalContent maxH='2xl' maxW='2xl' bgColor='bg-modal'>
        <ModalHeader>Your Cover Letter{coverLetterData.length > 1 && 's'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {coverLetterData.length > 1 && (
            <Select
              placeholder='Select Cover Letter'
              defaultValue={selectedCoverLetter.id}
              onChange={handleSelectChange}
            >
              {coverLetterData.map((coverLetter) => (
                <option key={coverLetter.id} value={coverLetter.id}>
                  {coverLetter.title} - {convertDateToLocaleString(coverLetter.createdAt)}
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
            value={selectedCoverLetter.content}
            overflow='scroll'
          />
        </ModalBody>

        <ModalFooter>
          <Tooltip
            label={hasCopied ? 'Copied!' : 'Copy Letter to Clipboard'}
            placement='top'
            hasArrow
            closeOnClick={false}
          >
            <Button ref={copyButtonRef} colorScheme='purple' size='sm' mr={3} onClick={onCopy}>
              Copy
            </Button>
          </Tooltip>
          <Button
            leftIcon={<AiOutlineEdit />}
            colorScheme='purple'
            variant='outline'
            size='sm'
            mr={3}
            onClick={() => navigate(`/cover-letter/${selectedCoverLetter.id}`)}
          >
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
