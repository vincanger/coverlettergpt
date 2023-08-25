import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Box,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';
import { AiFillCheckCircle } from 'react-icons/ai';
import QRCode from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';

type LoginModalProps = {
  status: string;
  encodedUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
  handleWalletClick: () => void;
};

export default function LoginModal({ status, encodedUrl, isOpen, onClose, handleWalletClick }: LoginModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCopyClick = () => {
    if (encodedUrl) {
      navigator.clipboard.writeText(encodedUrl);
    }
  };

  let content = (
    <>

      {encodedUrl && (
        <div className='rounded bg-white p-2'>
          <QRCode value={encodedUrl} size={224} onClick={handleCopyClick} />
        </div>
      )}
    </>
  );

  if (status === 'success') {
    content = (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 256,
          height: 256,
        }}
      >
        <AiFillCheckCircle size={128} color='green' />
      </div>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={buttonRef} >
      <ModalOverlay backdropFilter='auto' backdropInvert='15%' backdropBlur='2px' />
      <ModalContent maxH='lg' maxW='lg' bgColor='bg-modal'>
        <ModalHeader>Lightning Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack gap={3}>
            <Box>{content}</Box>
            <HStack>
              <Button id='copy-button' onClick={handleCopyClick}>
                Copy
              </Button>
              {!!encodedUrl && (
                <a href={`lightning:${encodedUrl}`}>
                  <Button id='open-button' onClick={handleWalletClick} ref={buttonRef}>
                    Login with ⚡ Wallet
                  </Button>
                </a>
              )}
            </HStack>
          </VStack>
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
