import { VStack, ButtonGroup, Button, ButtonGroupProps, Text, Box, useDisclosure } from '@chakra-ui/react';
import generateEdit from '@wasp/actions/generateEdit';
import { useContext, useState } from 'react';
import { TextareaContext } from '../App';
import { LeaveATip } from './AlertDialog';
import getUserInfo from '@wasp/queries/getUserInfo';
import { useQuery } from '@wasp/queries';
import type { User } from '@wasp/entities';
import LnPaymentModal from './LnPaymentModal';
import { fetchLightningInvoice } from '../lightningUtils';
import type { LightningInvoice } from '../lightningUtils';
import lnPaymentStatus from '@wasp/actions/lnPaymentStatus';

interface EditPopoverProps extends ButtonGroupProps {
  selectedText?: string;
  setTooltip: any;
  user: Omit<User, 'password'>;
}


export function EditPopover({ setTooltip, selectedText, user, ...props }: EditPopoverProps) {
  const [lightningInvoice, setLightningInvoice] = useState<LightningInvoice | null>(null);
  const { textareaState, setTextareaState } = useContext(TextareaContext);
  
  const { data: userInfo } = useQuery(getUserInfo, { id: user.id });
  
  const { isOpen: isPayOpen, onOpen: onPayOpen, onClose: onPayClose } = useDisclosure();
  const { isOpen: lnPaymentIsOpen, onOpen: lnPaymentOnOpen, onClose: lnPaymentOnClose } = useDisclosure();
  
  async function payWithLn(user: Omit<User, 'password'>): Promise<boolean> {
    if (user.isUsingLn && user.credits === 0) {
      const invoice = await fetchLightningInvoice();
      if (invoice) {
        invoice.status = 'pending';
        await lnPaymentStatus(invoice);
        setLightningInvoice(invoice);
        lnPaymentOnOpen();
      } else {
        alert('Something went wrong, please try again');
        return false;
      }
  
      let status = invoice.status;
      while (status === 'pending') {
        status = await lnPaymentStatus(invoice);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (status !== 'success') {
        alert('Something went wrong, please try again');
        return false;
      }
      return true;
    }
    return true;
  }

  const replaceSelectedText = async ({ improvement }: { improvement: string }) => {
    const selection = window.getSelection();
    let loadingInterval;

    try {
      const value = textareaState;
      const selectString = selection!.toString();
      const index = value.indexOf(selectString);

      let loadingString = 'Loading';
      loadingInterval = setInterval(() => {
        if (loadingString.length < 'Loading...'.length) {
          loadingString += '.';
          let loading =
            value.slice(0, index + selectString.length) +
            '\n --- \n' +
            loadingString +
            '\n --- \n' +
            value.slice(index + selectString.length);
          setTextareaState(loading);

        } else {
          loadingString = 'Loading';
        }
      }, 750);

      const newValue = await generateEdit({ content: selectString, improvement });
      
      clearInterval(loadingInterval);
      setTextareaState(value);

      const newText =
        value.slice(0, index + selectString.length) +
        '\n --- Revision: \n' +
        newValue +
        '\n --- \n' +
        value.slice(index + selectString.length);

      setTextareaState(newText);
    } catch (error) {
      console.error(error);
      clearInterval(loadingInterval);
      alert('An error has occurred');
    }
  };

  const handleClick = async (value: string) => {
    if (!userInfo?.credits && !userInfo?.hasPaid && !user.isUsingLn) {
      onPayOpen();
      setTooltip(null);
      window.getSelection()?.removeAllRanges();
      return;
    }
    if (userInfo?.isUsingLn) {
      try {
        const didUserPay = await payWithLn(user)
        if (!didUserPay) return;
      } catch (error) {
        console.error('error paying with ln: ', error);
      }
    }
    replaceSelectedText({ improvement: value });
    window.getSelection()?.removeAllRanges();
  };

  return (
    <>
      <VStack {...props} gap={1} bgColor='bg-modal' borderRadius='lg' boxShadow='2xl'>
        <Box layerStyle='cardLg' p={3}>
          <Text fontSize='sm' textAlign='center'>
            🤔 Ask GPT to make this part more..
          </Text>
          <ButtonGroup size='xs' p={1} variant='solid' colorScheme='purple' isAttached>
            <Button size='xs' color='black' fontSize='xs' onClick={() => handleClick('concise')}>
              Concise
            </Button>

            <Button size='xs' color='black' fontSize='xs' onClick={() => handleClick('detailed')}>
              Detailed
            </Button>

            <Button size='xs' color='black' fontSize='xs' onClick={() => handleClick('Professional')}>
              Professional
            </Button>

            <Button size='xs' color='black' fontSize='xs' onClick={() => handleClick('informal')}>
              Informal
            </Button>
          </ButtonGroup>
        </Box>
      </VStack>
      <LeaveATip isOpen={isPayOpen} onOpen={onPayOpen} onClose={onPayClose} credits={userInfo?.credits || 0} />
      <LnPaymentModal isOpen={lnPaymentIsOpen} onClose={lnPaymentOnClose} lightningInvoice={lightningInvoice} />
    </>
  );
}
