import { Tooltip, Button, Textarea, useClipboard, Spinner, HStack } from '@chakra-ui/react';
import { match } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getCoverLetter from '@wasp/queries/getCoverLetter';
import { CoverLetter } from '@wasp/entities';
import BorderBox from './components/BorderBox';
import { useHistory } from 'react-router-dom';

export function CoverLetter({ match }: { match: match<{ id: string }> }) {
  const id = match.params.id as string;
  const { data: coverLetter, isLoading } = useQuery<{ id: string | null }, CoverLetter>(
    getCoverLetter,
    { id: id },
    { enabled: !!id }
  );
  const { hasCopied, onCopy } = useClipboard(coverLetter?.content || '');

  const history = useHistory();

  return (
    <>
      <BorderBox>
        {isLoading && <Spinner />}
        {coverLetter && (
          <Textarea
            readOnly
            height='md'
            top='50%'
            left='50%'
            transform={'translate(-50%, 0%)'}
            resize='none'
            variant='filled'
            dropShadow='lg'
            defaultValue={coverLetter.content}
            overflow='scroll'
          />
        )}

        {coverLetter && (
          <HStack>
            <Button size='sm' mr={3} onClick={() => history.push('/jobs')}>
              Manage Cover Letters
            </Button>
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
