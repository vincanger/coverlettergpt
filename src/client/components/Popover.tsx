import { VStack, ButtonGroup, Button, ButtonGroupProps, Text, Box } from '@chakra-ui/react';
import generateEdit from '@wasp/actions/generateEdit';
import { useContext, useState, useEffect } from 'react';
import { TextareaContext } from '../App';

interface EditPopoverProps extends ButtonGroupProps {
  selectedText?: string;
}

export function EditPopover(props: EditPopoverProps) {
  const [updatedText, setUpdatedText] = useState('')
  const textarea = useContext(TextareaContext);

  useEffect(() => {
    console.log('textarea changed')
    if (textarea) {
      setUpdatedText(textarea.value)
    }
  }, [textarea?.value])

  const replaceSelectedText = () => {
    const selection = window.getSelection();
    const id = window.location.pathname.split('/').pop();
    console.log(textarea);
    if (textarea) {

      const value = updatedText ?? textarea.innerHTML;
      const selectString = selection!.toString();
      const newValue = ' hey BRO ';

      const index = value.indexOf(selectString);

      console.log(selection?.anchorNode?.firstChild);

      const newText =
        value.slice(0, index + selectString.length) +
        '\n --- \n' +
        newValue +
        '\n --- \n' +
        value.slice(index + selectString.length);

      setUpdatedText(newText)
      textarea.value = newText;
    }
  };


  const handleClick = (value: string) => {
    console.log(value);
    replaceSelectedText();
  };

  return (
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
  );
}
