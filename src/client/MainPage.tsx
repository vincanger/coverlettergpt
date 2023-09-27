import {
  Box,
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  RadioGroup,
  Radio,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import BorderBox from './components/BorderBox';
import { LeaveATip, LoginToBegin } from './components/AlertDialog';
import { convertToSliderValue, convertToSliderLabel } from './components/CreativitySlider';
import * as pdfjsLib from 'pdfjs-dist';
import { useState, useEffect, useRef } from 'react';
import { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@wasp/queries';
import { useHistory } from 'react-router-dom';
import type { CoverLetterPayload } from './types';
import getJob from '@wasp/queries/getJob';
import getCoverLetterCount from '@wasp/queries/getCoverLetterCount';
import generateCoverLetter from '@wasp/actions/generateCoverLetter';
import createJob from '@wasp/actions/createJob';
import updateCoverLetter from '@wasp/actions/updateCoverLetter';
import useAuth from '@wasp/auth/useAuth';
import ThemeSwitch from './components/ThemeSwitch';
import LnPaymentModal from './components/LnPaymentModal';
import { fetchLightningInvoice } from './lightningUtils';
import type { LightningInvoice } from './lightningUtils';
import lnPaymentStatus from '@wasp/actions/lnPaymentStatus';
import { User } from '@wasp/entities';

function MainPage() {
  const [isPdfReady, setIsPdfReady] = useState<boolean>(false);
  const [jobToFetch, setJobToFetch] = useState<string>('');
  const [isCoverLetterUpdate, setIsCoverLetterUpdate] = useState<boolean>(false);
  const [isCompleteCoverLetter, setIsCompleteCoverLetter] = useState<boolean>(true);
  const [sliderValue, setSliderValue] = useState(30);
  const [showTooltip, setShowTooltip] = useState(false);
  const [lightningInvoice, setLightningInvoice] = useState<LightningInvoice | null>(null);

  const { data: user, isLoading: isUserLoading } = useAuth();

  const history = useHistory();
  const urlParams = new URLSearchParams(window.location.search);
  const jobIdParam = urlParams.get('job');

  const {
    data: job,
    isLoading: isJobLoading,
    error: getJobError,
  } = useQuery(getJob, { id: jobToFetch }, { enabled: jobToFetch.length > 0 });

  const { data: coverLetterCount } = useQuery(getCoverLetterCount);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    clearErrors,
    formState: { errors: formErrors, isSubmitting },
  } = useForm();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: loginIsOpen, onOpen: loginOnOpen, onClose: loginOnClose } = useDisclosure();
  const { isOpen: lnPaymentIsOpen, onOpen: lnPaymentOnOpen, onClose: lnPaymentOnClose } = useDisclosure();

  const loadingTextRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('job id param', jobIdParam);
    console.log('job error', getJobError);
    if (jobIdParam) {
      setJobToFetch(jobIdParam);
      setIsCoverLetterUpdate(true);
      resetJob();
    } else {
      setIsCoverLetterUpdate(false);
      reset({
        title: '',
        company: '',
        location: '',
        description: '',
      });
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

  // pdf to text parser
  async function onFileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files == null) return;
    if (event.target.files.length == 0) return;

    setValue('pdf', null);
    setIsPdfReady(false);
    const pdfFile = event.target.files[0];

    // Read the file using file reader
    const fileReader = new FileReader();

    fileReader.onload = function () {
      // turn array buffer into typed array
      if (this.result == null || !(this.result instanceof ArrayBuffer)) {
        return;
      }
      const typedarray = new Uint8Array(this.result);

      // pdfjs should be able to read this
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
      const loadingTask = pdfjsLib.getDocument(typedarray);
      let textBuilder: string = '';
      loadingTask.promise
        .then(async (pdf) => {
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
          }
          setIsPdfReady(true);
          setValue('pdf', textBuilder);
          clearErrors('pdf');
        })
        .catch((err) => {
          alert('An Error occured uploading your PDF. Please try again.');
          console.error(err);
        });
    };
    // Read the file as ArrayBuffer
    try {
      fileReader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      alert('An Error occured uploading your PDF. Please try again.');
    }
  }

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

  async function onSubmit(values: any): Promise<void> {
    let canUserContinue = checkUsageNumbers();
    if (!user) {
      history.push('/login');
      return;
    }
    if (!canUserContinue) {
      history.push('/profile');
      return;
    }

    try {
      const didUserPay = await payWithLn(user);
      if (!didUserPay) return;

      const job = await createJob(values);

      const creativityValue = convertToSliderValue(sliderValue);

      const payload: CoverLetterPayload = {
        jobId: job.id,
        title: job.title,
        content: values.pdf,
        description: job.description,
        isCompleteCoverLetter,
        includeWittyRemark: values.includeWittyRemark,
        temperature: creativityValue,
        gptModel: values.gptModel || 'gpt-3.5',
      };

      setLoadingText();

      const coverLetter = await generateCoverLetter(payload);

      history.push(`/cover-letter/${coverLetter.id}`);
    } catch (error: any) {
      alert(`${error?.message ?? 'Something went wrong, please try again'}`);
      console.error(error);
    }
  }

  async function onUpdate(values: any): Promise<void> {
    const canUserContinue = checkUsageNumbers();
    if (!user) {
      history.push('/login');
      return;
    }
    if (!canUserContinue) {
      history.push('/profile');
      return;
    }

    try {
      const didUserPay = await payWithLn(user);
      if (!didUserPay) return;

      if (!job) {
        throw new Error('Job not found');
      }

      const creativityValue = convertToSliderValue(sliderValue);
      let payload;

      payload = {
        id: job.id,
        description: values.description,
        content: values.pdf,
        isCompleteCoverLetter,
        temperature: creativityValue,
        includeWittyRemark: values.includeWittyRemark,
        gptModel: values.gptModel || 'gpt-3.5',
      };

      setLoadingText();

      const coverLetterId = await updateCoverLetter(payload);

      history.push(`/cover-letter/${coverLetterId}`);
    } catch (error: any) {
      alert(`${error?.message ?? 'Something went wrong, please try again'}`);
      console.error(error);
    }
  }

  function handleFileButtonClick() {
    if (!fileInputRef.current) {
      return;
    } else {
      fileInputRef.current.click();
    }
  }

  async function setLoadingText() {
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = 'patience, my friend...');
    }, 1000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = 'almost done...');
    }, 8000);
    setTimeout(() => {
      loadingTextRef.current && (loadingTextRef.current.innerText = '🧘...');
    }, 12000);
  }

  function checkUsageNumbers(): Boolean {
    if (user) {
      if (user.isUsingLn) {
        if (user.credits < 3 && user.credits > 0) {
          onOpen();
        }
        return true;
      }
      if (!user.hasPaid && !user.isUsingLn && user.credits > 0) {
        if (user.credits < 3) {
          onOpen();
        }
        return user.credits > 0;
      }
      if (user.hasPaid) {
        return true;
      } else if (!user.hasPaid) {
        return false;
      }
    }
    return false;
  }

  const showForm = (isCoverLetterUpdate && job) || !isCoverLetterUpdate;
  const showSpinner = isCoverLetterUpdate && isJobLoading;
  const showJobNotFound = isCoverLetterUpdate && !job && !isJobLoading;

  return (
    <>
      <Box
        layerStyle='card'
        px={4}
        py={2}
        mt={3}
        mb={-3}
        visibility={!coverLetterCount ? 'hidden' : 'visible'}
        _hover={{ bgColor: 'bg-contrast-md' }}
        transition='0.1s ease-in-out'
      >
        <Text fontSize='md'>{coverLetterCount} Cover Letters Generated! 🎉</Text>
      </Box>
      <BorderBox>
        <form
          onSubmit={!isCoverLetterUpdate ? handleSubmit(onSubmit) : handleSubmit(onUpdate)}
          style={{ width: '100%' }}
        >
          <HStack w='full' justifyContent='space-between' align='flex-start'>
            <Heading size={'md'} alignSelf={'start'} mb={3}>
              Job Info {isCoverLetterUpdate && <Code ml={1}>Editing...</Code>}
            </Heading>
            <Button variant='link' border='0px'>
              <ThemeSwitch />
            </Button>
          </HStack>
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
                      value: 2,
                      message: 'Minimum length should be 2',
                    },
                  })}
                  onFocus={(e: any) => {
                    if (user === null) {
                      loginOnOpen();
                      e.target.blur();
                    }
                  }}
                  disabled={isCoverLetterUpdate}
                />
                <FormErrorMessage>{!!formErrors.title && formErrors.title.message?.toString()}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formErrors.company}>
                <Input
                  id='company'
                  borderRadius={0}
                  placeholder='company'
                  {...register('company', {
                    required: 'This is required',
                    minLength: {
                      value: 1,
                      message: 'Minimum length should be 1',
                    },
                  })}
                  disabled={isCoverLetterUpdate}
                />
                <FormErrorMessage>{!!formErrors.company && formErrors.company.message?.toString()}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formErrors.location}>
                <Input
                  id='location'
                  borderRadius={0}
                  placeholder='location'
                  {...register('location', {
                    required: 'This is required',
                    minLength: {
                      value: 2,
                      message: 'Minimum length should be 2',
                    },
                  })}
                  disabled={isCoverLetterUpdate}
                />
                <FormErrorMessage>{!!formErrors.location && formErrors.location.message?.toString()}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formErrors.description}>
                <Textarea
                  id='description'
                  borderRadius={0}
                  placeholder='copy & paste the job description in any language'
                  {...register('description', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>
                  {!!formErrors.description && formErrors.description.message?.toString()}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formErrors.pdf}>
                <Input
                  id='pdf'
                  type='file'
                  accept='application/pdf'
                  placeholder='pdf'
                  {...register('pdf', {
                    required: 'Please upload a CV/Resume',
                  })}
                  onChange={(e) => {
                    onFileUpload(e);
                  }}
                  display='none'
                  ref={fileInputRef}
                />
                <VStack
                  border={!!formErrors.pdf ? '1px solid #FC8181' : 'sm'}
                  boxShadow={!!formErrors.pdf ? '0 0 0 1px #FC8181' : 'none'}
                  bg='bg-contrast-sm'
                  p={3}
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
                    <FormLabel textAlign='center' htmlFor='pdf'>
                      <Button size='sm' colorScheme='contrast' onClick={handleFileButtonClick}>
                        Upload CV
                      </Button>
                    </FormLabel>
                    {isPdfReady && <Text fontSize={'sm'}>👍 uploaded</Text>}
                    <FormErrorMessage>{!!formErrors.pdf && formErrors.pdf.message?.toString()}</FormErrorMessage>
                  </HStack>
                  <FormHelperText mt={0.5} fontSize={'xs'}>
                    Upload a PDF only of Your CV/Resumé
                  </FormHelperText>
                </VStack>
              </FormControl>
              {user?.gptModel === 'gpt-4' && (
                <FormControl>
                  <VStack
                    border={'sm'}
                    bg='bg-contrast-sm'
                    p={3}
                    alignItems='flex-start'
                    _hover={{
                      bg: 'bg-contrast-md',
                      borderColor: 'border-contrast-md',
                    }}
                    transition={
                      'transform 0.05s ease-in, transform 0.05s ease-out, background 0.3s, opacity 0.3s, border 0.3s'
                    }
                  >
                    <RadioGroup
                      id='gptModel'
                      defaultValue='gpt-4'
                      color='text-contrast-lg'
                      fontWeight='semibold'
                      size='md'
                    >
                      <HStack spacing={5}>
                        <Radio {...register('gptModel')} value='gpt-3.5'>
                          GPT 3.5
                        </Radio>
                        <Radio {...register('gptModel')} value='gpt-4'>
                          GPT 4
                        </Radio>
                      </HStack>
                    </RadioGroup>

                    <FormHelperText>
                      <Text fontSize='xs' color='text-contrast-md'>
                        If you are getting a token limit error, try using GPT 3.5.
                      </Text>
                    </FormHelperText>
                  </VStack>
                </FormControl>
              )}
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
                <FormControl my={2}>
                  <Slider
                    id='temperature'
                    defaultValue={30}
                    min={0}
                    max={68}
                    colorScheme='purple'
                    onChange={(v) => setSliderValue(v)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <Tooltip
                      hasArrow
                      bg='purple.300'
                      color='white'
                      placement='top'
                      isOpen={showTooltip}
                      label={`${convertToSliderLabel(sliderValue)}`}
                    >
                      <SliderThumb />
                    </Tooltip>
                  </Slider>
                  <FormLabel
                    htmlFor='temperature'
                    color='text-contrast-md'
                    fontSize='sm'
                    _hover={{
                      color: 'text-contrast-lg',
                    }}
                  >
                    cover letter creativity level
                  </FormLabel>
                </FormControl>
              </VStack>
              <VStack
                border={'sm'}
                bg='bg-contrast-sm'
                px={3}
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
                <FormControl display='flex' alignItems='center' mt={3} mb={3}>
                  <Checkbox id='includeWittyRemark' defaultChecked={true} {...register('includeWittyRemark')} />
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
                    include a witty remark at the end of the letter
                  </FormLabel>
                </FormControl>
              </VStack>
              <HStack alignItems='flex-end' gap={1}>
                <Button
                  colorScheme='purple'
                  mt={3}
                  size='sm'
                  isLoading={isSubmitting}
                  disabled={user === null}
                  type='submit'
                >
                  {!isCoverLetterUpdate ? 'Generate Cover Letter' : 'Create New Cover Letter'}
                </Button>
                <Text ref={loadingTextRef} fontSize='sm' fontStyle='italic' color='text-contrast-md'>
                  {' '}
                </Text>
              </HStack>
            </>
          )}
          {showJobNotFound && (
            <>
              <Text fontSize='sm' color='text-contrast-md'>
                Can't find that job...
              </Text>
            </>
          )}
        </form>
      </BorderBox>
      <LeaveATip
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        credits={user?.credits || 0}
        isUsingLn={user?.isUsingLn || false}
      />
      <LoginToBegin isOpen={loginIsOpen} onOpen={loginOnOpen} onClose={loginOnClose} />
      <LnPaymentModal isOpen={lnPaymentIsOpen} onClose={lnPaymentOnClose} lightningInvoice={lightningInvoice} />
    </>
  );
}

export default MainPage;
