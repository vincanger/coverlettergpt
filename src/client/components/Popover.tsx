import { VStack, ButtonGroup, Button, ButtonGroupProps, Text, Box, useDisclosure } from '@chakra-ui/react';
import generateEdit from '@wasp/actions/generateEdit';
import { useContext, useState, useEffect } from 'react';
import { TextareaContext } from '../App';
import useAuth from '@wasp/auth/useAuth';
import { LeaveATip } from './AlertDialog';

interface EditPopoverProps extends ButtonGroupProps {
  selectedText?: string;
  setTooltip: any;
}

export function EditPopover({ setTooltip, selectedText, ...props}: EditPopoverProps) {
  const [updatedText, setUpdatedText] = useState('');
  const textarea = useContext(TextareaContext);

  const { data: user } = useAuth()

  const { isOpen: isPayOpen, onOpen: onPayOpen, onClose: onPayClose } = useDisclosure();

  useEffect(() => {
    if (textarea) {
      setUpdatedText(textarea.value);
    }
  }, [textarea?.value]);

  const replaceSelectedText = async ({ improvement }: { improvement: string }) => {
    const selection = window.getSelection();
    let loadingInterval;
    if (textarea) {
      try {
        const value = updatedText ?? textarea.innerHTML;
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
            textarea.value = loading;
            setUpdatedText(loading);
          } else {
            loadingString = 'Loading';
          }
        }, 750);

        const newValue = await generateEdit({ content: selectString, improvement });
        clearInterval(loadingInterval);
        textarea.value = value

        const newText =
          value.slice(0, index + selectString.length) +
          '\n --- Revision: \n' +
          newValue +
          '\n --- \n' +
          value.slice(index + selectString.length);

        setUpdatedText(newText);
        textarea.value = newText;
      } catch (error) {
        console.error(error);
        clearInterval(loadingInterval);
        alert('An error has occurred');
      }
    }
  };

  const handleClick = (value: string) => {
    if (!user.credits && !user.hasPaid) {
      onPayOpen()
      setTooltip(null);
      return
    }
    replaceSelectedText({ improvement: value });
  };

  return (
    <>
      <VStack {...props} gap={1} bgColor='#0d0f10' borderRadius='lg'>
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
      <LeaveATip isOpen={isPayOpen} onOpen={onPayOpen} onClose={onPayClose} credits={user?.credits || 0} />
    </>
  );
}
