import { Tooltip, Button, Textarea, useClipboard, Spinner, HStack } from '@chakra-ui/react';
import { match } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getCoverLetter from '@wasp/queries/getCoverLetter';
import { CoverLetter } from '@wasp/entities';
import BorderBox from './components/BorderBox';
import { useContext } from 'react';
import { TextareaContext } from './App';
import editCoverLetter from '@wasp/actions/editCoverLetter'
import { useEffect, useState } from 'react'

export function CoverLetter({ match }: { match: match<{ id: string }> }) {
  const [textareaValue , setTextareaValue] = useState<string | undefined>(undefined)
  const [editIsLoading , setEditIsLoading] = useState<boolean>(false)
  const [isEdited , setIsEdited] = useState<boolean>(false)

  const id = match.params.id as string;
  const { data: coverLetter, isLoading } = useQuery<{ id: string | null }, CoverLetter>(
    getCoverLetter,
    { id: id },
    { enabled: !!id }
  );
  const { hasCopied, onCopy } = useClipboard(coverLetter?.content || '');

  const textarea = useContext(TextareaContext);

  useEffect(() => {
    if (textarea?.value) {
      setTextareaValue(textarea.value)
    }
  },[textarea])

  const handleClick = async () => {
    if (id && textareaValue) {
      try {
        setEditIsLoading(true)
        const editedCoverLetter = await editCoverLetter({ coverLetterId: id, content: textareaValue })
        console.log('edited cover letter --->', editedCoverLetter)
        if (!!editedCoverLetter) {
          setIsEdited(true)
          setTimeout(() => {
            setIsEdited(false)
          }, 2500)
        }

      } catch (error) {
        console.error(error)
        alert('An error occured. Please try again.')
      }
      setEditIsLoading(false)
    }
  }

  return (
    <>
      <BorderBox>
        {isLoading && <Spinner />}
        {coverLetter && (
          <Textarea
            // readOnly
            onChange={(e) => {
              setTextareaValue(e.target.value);
              if (textarea) {
                textarea.value = e.target.value;
              }
            }}
            value={textareaValue}
            // value={textarea?.value}
            id='cover-letter-textarea'
            height='md'
            top='50%'
            left='50%'
            transform={'translate(-50%, 0%)'}
            resize='none'
            variant='filled'
            dropShadow='lg'
            defaultValue={coverLetter.content}
            overflow='none'
          />
        )}

        {coverLetter && (
          <HStack>
            <Tooltip
              label={isEdited && 'Changes Saved!'}
              placement='top'
              hasArrow
              isOpen={isEdited}
              closeDelay={2500}
              closeOnClick={true}
            >
              <Button
                size='sm'
                mr={3}
                onClick={handleClick}
                isDisabled={!(id && !!textareaValue)}
                isLoading={editIsLoading}
              >
                Save Changes
              </Button>
            </Tooltip>
            <Tooltip
              label={hasCopied ? 'Copied!' : 'Copy Letter to Clipboard'}
              placement='top'
              hasArrow
              closeOnClick={false}
            >
              <Button colorScheme='purple' size='sm' mr={3} onClick={onCopy}>
                Copy
              </Button>
            </Tooltip>
          </HStack>
        )}
      </BorderBox>
    </>
  );
}
