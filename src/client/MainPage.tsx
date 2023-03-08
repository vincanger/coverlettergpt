import {
  extendTheme,
  ChakraProvider,
  HStack,
  VStack,
  Center,
  Heading,
  Text,
  useDisclosure,
  Fade,
  FormErrorMessage,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  FormHelperText,
  Code,
  Slide,
  useClipboard,
  Tooltip,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@wasp/queries';
import getJob from '@wasp/queries/getJob';
import generateCoverLetter from '@wasp/actions/generateCoverLetter';
import createJob from '@wasp/actions/createJob';
import updateCoverLetter from '@wasp/actions/updateCoverLetter';
import { useClickTracker } from './useClickTracker';
import * as pdfjsLib from 'pdfjs-dist';
import { useState, useEffect, useRef } from 'react';
import Login from './LoginPage';
import { CoverLetter, Job } from '@wasp/entities';
import ModalElement from './components/Modal';
import BorderBox from './components/BorderBox';

function App() {
  const [pdfText, setPdfText] = useState<string>();
  const [jobToFetch, setJobToFetch] = useState<number | null>(null);
  const [isCoverLetterUpdate, setIsCoverLetterUpdate] = useState<boolean>(false);
  const [isCompleteCoverLetter, setIsCompleteCoverLetter] = useState<boolean>(true);
  const [coverLetter, setCoverLetter] = useState<CoverLetter>();

  const { data: job } = useQuery<{ id: number | null}, Job>(getJob, { id: jobToFetch }, { enabled: !!jobToFetch });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  useClickTracker();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobParam = urlParams.get('job');
    if (jobParam) {
      setIsCoverLetterUpdate(true);
      setJobToFetch(parseInt(jobParam));
    }
  }, []);

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
      })
    }
  }, [job]);

  async function onFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files == null) {
      return;
    }
    const pdfFile = event.target.files[0];

    //Step 2: Read the file using file reader
    const fileReader = new FileReader();

    fileReader.onload = function () {
      //Step 4:turn array buffer into typed array
      if (this.result == null || !(this.result instanceof ArrayBuffer)) {
        return;
      }
      const typedarray = new Uint8Array(this.result);

      //Step 5:pdfjs should be able to read this
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
      const loadingTask = pdfjsLib.getDocument(typedarray);
      let textBuilder: string;
      loadingTask.promise.then(async (pdf) => {
        // Loop through each page in the PDF file
        for (let i = 1; i <= pdf.numPages; i++) {
          // Get the text content for the page
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          console.log('content >>>', content);
          const text = content.items
            .map((item: any) => {
              if (item.str) {
                return item.str;
              }
              return '';
            })
            .join(' ');
          textBuilder += text;
          // Do something with the text content, for example, log it to the console
        }
        setPdfText(textBuilder);
      });
    };
    //Step 3:Read the file as ArrayBuffer
    fileReader.readAsArrayBuffer(pdfFile);
  }

  type CoverLetterPayload = {
    jobId: number;
    title: string;
    content: string;
    description: string;
    isCompleteCoverLetter: boolean;
  };

  async function onSubmit(values: any): Promise<{ job: Job; coverLetter: CoverLetter } | undefined> {
    try {
      const job = (await createJob(values)) as Job;
      let payload: CoverLetterPayload;
      if (!pdfText) {
        alert('Please upload a pdf file');
        throw new Error('Please upload a pdf file');
      } else {
        payload = {
          jobId: job.id,
          title: job.title,
          content: pdfText,
          description: job.description,
          isCompleteCoverLetter,
        };
      }
      const coverLetter = (await generateCoverLetter(payload)) as CoverLetter;
      setCoverLetter(coverLetter);
      return {
        job,
        coverLetter,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async function onUpdate(values: any): Promise<(Job & { coverLetters: CoverLetter[] }) | undefined> {
    console.log('values >>>', values);
    try {
      if (!job) {
        throw new Error('Job not found');
      }
      const payload = {
        id: job.id,
        description: values.description,
        content: pdfText,
        isCompleteCoverLetter,
      };

      const updatedJob = (await updateCoverLetter(payload)) as Job & { coverLetters: CoverLetter[] };
      setCoverLetter(updatedJob.coverLetters[0]);
      return updatedJob;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <BorderBox>
        <form onSubmit={handleSubmit(!isCoverLetterUpdate ? onSubmit : onUpdate)} style={{ width: '100%' }}>
          <Heading size={'md'} alignSelf={'start'} mb={3}>
            Job Info {isCoverLetterUpdate && <Code ml={1}>Editing...</Code>}
          </Heading>
          <FormControl isInvalid={!!formErrors.title}>
            <Input
              id='title'
              borderRadius={0}
              borderTopRadius={7}
              placeholder='title'
              {...register('title', {
                required: 'This is required',
                minLength: { value: 4, message: 'Minimum length should be 4' },
              })}
              disabled={isCoverLetterUpdate}
            />
            <FormErrorMessage>{formErrors.title && formErrors.title.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formErrors.company}>
            <Input
              id='company'
              borderRadius={0}
              placeholder='company'
              {...register('company', {
                required: 'This is required',
                minLength: { value: 4, message: 'Minimum length should be 4' },
              })}
              disabled={isCoverLetterUpdate}
            />
            <FormErrorMessage>{formErrors.company && formErrors.company.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formErrors.location}>
            <Input
              id='location'
              borderRadius={0}
              placeholder='location'
              {...register('location', {
                required: 'This is required',
                minLength: { value: 4, message: 'Minimum length should be 4' },
              })}
              disabled={isCoverLetterUpdate}
            />
            <FormErrorMessage>{formErrors.location && formErrors.location.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formErrors.description}>
            <Textarea
              id='description'
              borderRadius={0}
              placeholder='copy & paste the job description here'
              {...register('description', {
                required: 'This is required',
              })}
            />
            <FormErrorMessage>{formErrors.description && formErrors.description.message}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              id='pdf'
              name='pdf'
              type='file'
              accept='application/pdf'
              placeholder='pdf'
              onChange={onFileUpload}
              display='none'
            />
            <VStack
              border={'sm'}
              bg='bg-contrast-sm'
              p={3}
              borderRadius={0}
              borderBottomRadius={7}
              alignItems='flex-start'
              _hover={{
                bg: 'bg-contrast-md',
                borderColor: 'border-contrast-md',
              }}
              transition={
                'transform 0.05s ease-in, transform 0.05s ease-out, background 0.3s, opacity 0.3s, border 0.3s'
              }
            >
              <HStack>
                <Button size='sm' colorScheme='contrast'>
                  <label htmlFor='pdf'>Upload CV</label>
                </Button>
                {pdfText && <Text fontSize={'sm'}>👍 uploaded</Text>}
              </HStack>
              <FormHelperText mt={0.5} fontSize={'xs'}>
                Upload a PDF only of Your CV/Resumé
              </FormHelperText>
            </VStack>
          </FormControl>

          <Button colorScheme='purple' mt={3} size='sm' isLoading={isSubmitting} type='submit'>
            {!isCoverLetterUpdate ? 'Generate Cover Letter' : 'Create New Cover Letter'}
          </Button>
        </form>
      </BorderBox>
      {coverLetter && (
        <ModalElement coverLetterData={[coverLetter]} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      )}
    </>
  );
}

export default App;
