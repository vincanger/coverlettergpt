import {
  HStack,
  VStack,
  Heading,
  Text,
  FormErrorMessage,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  FormHelperText,
  Code,
  Checkbox,
  Spinner,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getJob from '@wasp/queries/getJob';
import generateCoverLetter from '@wasp/actions/generateCoverLetter';
import createJob from '@wasp/actions/createJob';
import updateCoverLetter from '@wasp/actions/updateCoverLetter';
import * as pdfjsLib from 'pdfjs-dist';
import { useState, useEffect, useRef } from 'react';
// import Login from "./LoginPage";
import { CoverLetter, Job } from '@wasp/entities';
import BorderBox from './components/BorderBox';

function MainPage() {
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [jobToFetch, setJobToFetch] = useState<string | null>(null);
  const [isCoverLetterUpdate, setIsCoverLetterUpdate] = useState<boolean>(false);
  const [isCompleteCoverLetter, setIsCompleteCoverLetter] = useState<boolean>(true);

  const { data: job, isLoading: isJobLoading } = useQuery<{ id: string | null }, Job>(getJob, { id: jobToFetch }, { enabled: !!jobToFetch });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  const history = useHistory();
  const loadingTextRef = useRef<HTMLDivElement>(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const jobIdParam = urlParams.get('job');

  useEffect(() => {
    if (jobIdParam) {
      setJobToFetch(jobIdParam);
      setIsCoverLetterUpdate(true);
      resetJob();
    } else {
      setIsCoverLetterUpdate(false);
      console.log('resetting?')
      reset({
        title: '',
        company: '',
        location: '',
        description: '',
      })
    }
  }, [jobIdParam, job]);

  useEffect(() => {
    resetJob();
  }, [job]);

  function resetJob() {
    if (job) {
      reset({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
      });
    }
  }

  async function onFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files == null) {
      return;
    }
    setPdfText(null);
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
      let textBuilder: string = '';
      loadingTask.promise.then(async (pdf) => {
        // Loop through each page in the PDF file
        for (let i = 1; i <= pdf.numPages; i++) {
          // Get the text content for the page
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
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
    jobId: string;
    title: string;
    content: string;
    description: string;
    isCompleteCoverLetter: boolean;
    includeWittyRemark: boolean;
  };

  async function onSubmit(values: any): Promise<void> {
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
          includeWittyRemark: values.includeWittyRemark,
        };
      }
      setLoadingText();

      const coverLetter = (await generateCoverLetter(payload)) as CoverLetter;
      history.push(`/cover-letter/${coverLetter.id}`);

    } catch (error) {
      console.error(error);
    }
  }

  async function onUpdate(values: any): Promise<(Job & { coverLetter: CoverLetter[] }) | undefined> {
    
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

      setLoadingText();

      const updatedJob = (await updateCoverLetter(payload)) as Job & { coverLetter: CoverLetter[] };

      if (updatedJob.coverLetter.length === 0) {
        throw new Error('Cover letter not found');
      }
      history.push(`/cover-letter/${updatedJob.coverLetter[updatedJob.coverLetter.length - 1].id}`);

      return updatedJob;
    } catch (error) {
      console.error(error);
    }
  }

  async function setLoadingText() {
    console.log('loadingTextRef', loadingTextRef.current);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = 'patience, my friend...');
    }, 1000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = 'almost done...');
    }, 8000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = '🧘...');
    }, 12000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = '');
    }, 35000);
  }

  const showForm = isCoverLetterUpdate && job || !isCoverLetterUpdate;
  const showSpinner = isCoverLetterUpdate && isJobLoading;

  return (
    <>
      <BorderBox>
        <form
          onSubmit={!isCoverLetterUpdate ? handleSubmit(onSubmit) : handleSubmit(onUpdate)}
          style={{ width: '100%' }}
        >
          <Heading size={'md'} alignSelf={'start'} mb={3}>
            Job Info {isCoverLetterUpdate && <Code ml={1}>Editing...</Code>}
          </Heading>
          {showSpinner && <Spinner />}
          {showForm && (
            <>
              <FormControl isInvalid={!!formErrors.title}>
                <Input
                  id='title'
                  borderRadius={0}
                  borderTopRadius={7}
                  placeholder='job title'
                  {...register('title', {
                    required: 'This is required',
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
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
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
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
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
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
              <VStack
                border={'sm'}
                bg='bg-contrast-sm'
                px={3}
                alignItems='flex-start'
                _hover={{
                  bg: 'bg-contrast-md',
                  borderColor: 'border-contrast-md',
                }}
                transition={
                  'transform 0.05s ease-in, transform 0.05s ease-out, background 0.3s, opacity 0.3s, border 0.3s'
                }
              >
                <FormControl display='flex' alignItems='center' mt={3} mb={3}>
                  <Checkbox
                    id='includeWittyRemark'
                    defaultChecked={true}
                    {...register('includeWittyRemark')}
                  />
                  <FormLabel
                    htmlFor='includeWittyRemark'
                    mb='0'
                    ml={2}
                    color='text-contrast-md'
                    fontSize='sm'
                    _hover={{
                      color: 'text-contrast-lg',
                    }}
                  >
                    Include a witty remark at the end of the letter
                  </FormLabel>
                </FormControl>
              </VStack>
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
              <HStack alignItems='flex-end' gap={1}>
                <Button colorScheme='purple' mt={3} size='sm' isLoading={isSubmitting} type='submit'>
                  {!isCoverLetterUpdate ? 'Generate Cover Letter' : 'Create New Cover Letter'}
                </Button>
                <Text ref={loadingTextRef} fontSize='sm' fontStyle='italic' color='text-contrast-md'>
                  {' '}
                </Text>
              </HStack>
            </>
          )}
        </form>
      </BorderBox>
    </>
  );
}

export default MainPage;
