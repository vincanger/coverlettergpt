import { useState } from 'react';
import {
  Heading,
  Spacer,
  VStack,
  HStack,
  Button,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useDisclosure,
  Divider,
  Checkbox,
  Spinner,
  Tooltip
} from '@chakra-ui/react';
import { useQuery } from '@wasp/queries';
import { OptimisticUpdateDefinition, useAction } from '@wasp/actions';
import getJobs from '@wasp/queries/getJobs';
import getCoverLetters from '@wasp/queries/getCoverLetters';
import updateJob from '@wasp/actions/updateJob';
import { CoverLetter, Job } from '@wasp/entities';
import ModalElement from './components/Modal';
import DescriptionModal from './components/DescriptionModal';
import BorderBox from './components/BorderBox';
import { useHistory } from 'react-router-dom';

function JobsPage() {
  const [JobId, setJobId] = useState<string | null>(null);
  const [descriptionText, setDescriptionText] = useState<string | null>(null);

  const history = useHistory();

  const { data: jobs, isLoading } = useQuery<unknown, Job[]>(getJobs);
  const { data: coverLetter } = useQuery<{ id: string | null }, CoverLetter[]>(
    getCoverLetters,
    { id: JobId },
    { enabled: !!JobId }
  );

  const updateJobOptimistically = useAction<Pick<Job, 'id' | 'isCompleted'>, Job[]>(updateJob, {
    optimisticUpdates: [
      {
        getQuerySpecifier: () => [getJobs],
        updateQuery: ({ isCompleted, id }, oldData) => {
          return oldData && oldData.map((job) => (job.id === id ? { ...job, isCompleted } : job));
        },
      } as OptimisticUpdateDefinition<Pick<Job, 'id' | 'isCompleted'>, Job[]>,
    ],
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: desIsOpen, onOpen: desOnOpen, onClose: desOnClose } = useDisclosure();

  const coverLetterHandler = (job: Job) => {
    if (job) {
      setJobId(job.id);
      onOpen();
    }
  };

  const checkboxHandler = async (e: any, job: Job) => {
    try {
      const payload = {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        isCompleted: e.target.checked,
      };
      updateJobOptimistically(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const updateCoverLetterHandler = async (jobId: string) => {
    history.push(`/?job=${jobId}`);
  };

  return (
    <VStack gap={1}>
      <BorderBox>
        <Heading size='md'>Your Jobs</Heading>
        {isLoading && <Spinner />}
        <Accordion width='100%'>
          {jobs &&
            !isLoading &&
            jobs.map((job: Job) => (
              <AccordionItem key={job.id}>
                <h2>
                  <HStack flex='1' justifyContent='space-between'>
                    <AccordionButton _focus={{ boxShadow: '0px -1px 0px 0px var(--chakra-colors-active)' }}>
                      <Text textDecoration={job.isCompleted ? 'line-through' : ''}>
                        <b>{job.title}</b> @ {job.company}
                      </Text>
                      <Spacer />
                      <Text fontSize='sm' color={!job.isCompleted ? 'text-contrast-xs' : 'text-contrast-lg'}>
                        Applied
                      </Text>
                      <Checkbox mx={1} isChecked={job.isCompleted} onChange={(e) => checkboxHandler(e, job)} />
                      <AccordionIcon />
                    </AccordionButton>
                  </HStack>
                </h2>
                <AccordionPanel pb={4} pt={2}>
                  <Divider maxW='40%' variant='dashed' />
                  <VStack alignItems={'stretch'} my={1}>
                    <Text>
                      <b>Location:</b> {job.location}
                    </Text>
                    <HStack pb={1}>
                      <Text>
                        <b>Description:</b>
                      </Text>
                      <Button
                        size='xs'
                        fontSize='sm'
                        onClick={() => {
                          setDescriptionText(job.description);
                          desOnOpen();
                        }}
                      >
                        Display
                      </Button>
                    </HStack>
                    <HStack py={1} justify='space-between'>
                      <Button onClick={() => coverLetterHandler(job)} size='sm'>
                        Display Cover Letter(s)
                      </Button>
                      <Button onClick={() => updateCoverLetterHandler(job.id)} size='sm'>
                        Create Additional Cover Letter
                      </Button>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      </BorderBox>
      <Button size='sm' colorScheme='purple' alignSelf='flex-end' onClick={() => history.push('/')}>
        Create New Job
      </Button>
      {coverLetter && coverLetter.length > 0 && (
        <ModalElement coverLetterData={coverLetter} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      )}
      {descriptionText && (
        <DescriptionModal description={descriptionText} isOpen={desIsOpen} onOpen={desOnOpen} onClose={desOnClose} />
      )}
    </VStack>
  );
}

export default JobsPage;
