import BorderBox from '../components/BorderBox';
import { useEffect } from 'react';
import LegalSection from './components/legalSection';
import { 
  Heading, 
  Text, 
  VStack, 
  UnorderedList, 
  ListItem, 
  Link,
  Box
} from '@chakra-ui/react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BorderBox>
      <VStack maxW='4xl' mx='auto' p={6} spacing={6} align='flex-start'>
        <Heading as='h1' size='xl' mb={6}>Terms of Service</Heading>
        <Text fontSize='sm' color='gray.600' mb={6}>Last updated: {new Date().toLocaleDateString()}</Text>

        <LegalSection title='1. Company Information (Impressum)'>
          <Text>
            Canger & Shahab Crimpin GbR
            <br />
            Zum Steinberg 12, 69121 Heidelberg, Germany
            <br />
            Email: info.crimpin@gmail@.com
            <br />
            Partners: Canger & Shahab Crimpin GbR
          </Text>
        </LegalSection>

        <LegalSection title='2. Description of Service'>
          <Text>
            CoverLetterGPT is a SaaS application that uses AI technology to assist users in creating personalized cover letter examples based on their curriculum vitae (CV) and job descriptions. The service is provided from
            Germany and is subject to German law.
          </Text>
        </LegalSection>

        <LegalSection title='3. Contract Formation'>
          <Text>By registering for our service, you enter into a legally binding contract with Canger & Shahab Crimpin GbR under German law. The contract is formed when we confirm your registration via email.</Text>
        </LegalSection>

        <LegalSection title='4. User Account and Data Protection'>
          <Text>To use CoverLetterGPT, you must register for an account and provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password.</Text>
        </LegalSection>

        <LegalSection title='5. Prices and Payment Terms'>
          <Text>
            Prices are displayed in your local currency where available, with EUR being our base currency. 
            All prices include applicable taxes (such as VAT for EU customers). Charges for our services 
            are billed monthly. Your subscription will automatically renew each month unless cancelled 
            at least one day before the renewal date.
          </Text>
          <UnorderedList mt={2} spacing={2} pl={5}>
            <ListItem>
              Prices shown are converted to your local currency based on current exchange rates
            </ListItem>
            <ListItem>
              The final charge may vary slightly due to exchange rate fluctuations and conversion fees
            </ListItem>
            <ListItem>
              For EU customers, prices include applicable Value Added Tax (VAT)
            </ListItem>
            <ListItem>
              For non-EU customers, additional taxes may apply according to local regulations
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='6. Right of Withdrawal and Withdrawal Form'>
          <VStack spacing={6} align='stretch'>
            <Box>
              <Text>
                As a consumer within the EU, you have the right to withdraw from this contract 
                within 14 days without giving any reason. The withdrawal period expires after 
                14 days from the day of contract conclusion.
              </Text>
              
              <Text mt={4}>
                To exercise your right of withdrawal, you must inform us of your decision to 
                withdraw from this contract by an unequivocal statement (e.g., a letter sent 
                by post or email). You may use the model withdrawal form provided below, 
                but it is not obligatory.
              </Text>

              <Text mt={4}>
                To meet the withdrawal deadline, it is sufficient for you to send your 
                communication concerning your exercise of the right of withdrawal before the 
                withdrawal period has expired.
              </Text>

              <Text mt={4}>
                Effects of withdrawal: If you withdraw from this contract, we shall reimburse 
                to you all payments received from you, including the costs of delivery (with 
                the exception of the supplementary costs resulting from your choice of a type 
                of delivery other than the least expensive type of standard delivery offered 
                by us), without undue delay and in any event not later than 14 days from the 
                day on which we are informed about your decision to withdraw from this contract.
              </Text>
            </Box>

            <Box p={4} borderWidth={1} borderRadius='lg' bg='bg-contrast-sm'>
              <Text fontWeight='semibold' mb={4}>
                Model Withdrawal Form
              </Text>
              <Text mb={4}>
                (Complete and return this form only if you wish to withdraw from the contract)
              </Text>
              <VStack align='stretch' spacing={4} color='text-contrast-lg'>
                <Box>
                  <Text fontWeight='medium'>To:</Text>
                  <Text>Canger & Shahab Crimpin GbR</Text>
                  <Text>Zum Steinberg 12, 69121 Heidelberg, Germany</Text>
                  <Text>Email: info.crimpin@gmail.com</Text>
                </Box>

                <Text>
                  I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract 
                  for the provision of the following service: CoverLetterGPT subscription.
                </Text>

                <UnorderedList spacing={2} pl={4}>
                  <ListItem>Ordered on (*)/received on (*)</ListItem>
                  <ListItem>Name of consumer(s)</ListItem>
                  <ListItem>Address of consumer(s)</ListItem>
                  <ListItem>Signature of consumer(s) (only if this form is notified on paper)</ListItem>
                  <ListItem>Date</ListItem>
                </UnorderedList>

                <Text fontSize='sm' fontStyle='italic'>
                  (*) Delete as appropriate
                </Text>
              </VStack>
            </Box>

            <Text fontSize='sm' color='gray.600'>
              To exercise your right of withdrawal, you may use the above model form, but 
              it is not obligatory. You may also submit any other clear statement of your 
              decision to withdraw from the contract via email or our contact form.
            </Text>
          </VStack>
        </LegalSection>

        <LegalSection title='7. Dispute Resolution'>
          <Text>
            The European Commission provides a platform for online dispute resolution (OS) which is available at https://ec.europa.eu/consumers/odr/. We are neither obligated nor willing to participate in dispute
            resolution proceedings before a consumer arbitration board.
          </Text>
        </LegalSection>

        <LegalSection title='8. Governing Law'>
          <Text>These Terms are governed by German law. The application of the UN Convention on Contracts for the International Sale of Goods is excluded.</Text>
        </LegalSection>

        <LegalSection title='9. Service Usage and Limitations'>
          <Text>
            CoverLetterGPT provides AI-assisted cover letter generation services. Users 
            acknowledge and agree to the following terms of use:
          </Text>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              The service is provided for example and learning purposes only. Cover letters 
              generated through our service are meant to serve as templates and examples.
            </ListItem>
            <ListItem>
              Users are strongly advised NOT to use AI-generated cover letters directly 
              for job applications without substantial personal modification and review.
            </ListItem>
            <ListItem>
              We reserve the right to limit, suspend, or terminate access to the service 
              at our discretion if we detect abuse or violation of these terms.
            </ListItem>
            <ListItem>
              Users are responsible for maintaining the confidentiality of their account 
              credentials and may not share their account with others.
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title='10. Disclaimer of Liability'>
          <Text>
            To the maximum extent permitted by applicable law:
          </Text>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              The cover letters generated through our service are provided "AS IS" and 
              "AS AVAILABLE" without any warranties, express or implied.
            </ListItem>
            <ListItem>
              We explicitly disclaim any liability for the content, accuracy, or 
              appropriateness of the generated cover letters for any specific purpose, 
              including but not limited to job applications.
            </ListItem>
            <ListItem>
              Users assume full responsibility for any use, modification, or submission 
              of the generated cover letters in job applications or other professional 
              contexts.
            </ListItem>
            <ListItem>
              We are not liable for any consequences, direct or indirect, arising from 
              the use of our service, including but not limited to:
              <UnorderedList mt={2} pl={5}>
                <ListItem>Missed job opportunities</ListItem>
                <ListItem>Rejected applications</ListItem>
                <ListItem>Professional reputation impact</ListItem>
                <ListItem>Loss of potential income</ListItem>
                <ListItem>Any misrepresentation in generated content</ListItem>
                <ListItem>Technical errors or service interruptions</ListItem>
                <ListItem>Data loss or security breaches</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              While we strive to maintain high accuracy and quality, AI-generated content may 
              contain errors, inconsistencies, or inappropriate content. Users are strongly 
              advised to thoroughly review and modify all generated content before use.
            </ListItem>
            <ListItem>
              We do not guarantee that our service will meet your specific requirements or 
              expectations, or that it will be compatible with your particular job application 
              needs.
            </ListItem>
            <ListItem>
              Our total liability, if any, shall not exceed the amount paid by you 
              for the service in the month preceding the incident.
            </ListItem>
            <ListItem>
              Some jurisdictions do not allow the exclusion of certain warranties or 
              limitations on applicable statutory rights of a consumer, so some or all 
              of the above exclusions and limitations may not apply to you.
            </ListItem>
          </UnorderedList>
          <Text mt={4} fontWeight='semibold'>
            By using our service, you explicitly acknowledge and accept these limitations 
            and disclaimers.
          </Text>
        </LegalSection>

        <LegalSection title='11. Intellectual Property'>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              The service, including all software, algorithms, and interface designs, 
              remains the exclusive property of Canger & Shahab Crimpin GbR.
            </ListItem>
            <ListItem>
              While users retain rights to their personal information and modified cover 
              letters, the AI-generated content templates are provided under a limited, 
              non-exclusive license for personal use only.
            </ListItem>
            <ListItem>
              Users may not reproduce, distribute, or commercialize the service or its 
              outputs without explicit written permission.
            </ListItem>
          </UnorderedList>
        </LegalSection>

        <LegalSection title="12. Security">
          <Text>
            CoverLetterGPT does not process any order payments directly through the website. 
            All payments are processed securely through Stripe, a third party online 
            payment provider. When processing payments:
          </Text>
          <UnorderedList spacing={2} pl={5}>
            <ListItem>
              Your payment information is never stored on our servers
            </ListItem>
            <ListItem>
              All payment transactions are encrypted and processed securely by Stripe
            </ListItem>
            <ListItem>
              Stripe is a PCI Service Provider Level 1, which is the highest grade of 
              payment processing security
            </ListItem>
            <ListItem>
              For more information about Stripe's security measures, please visit 
              <Link 
                href="https://stripe.com/docs/security" 
                target="_blank" 
                rel="noopener noreferrer"
                color="purple.600"
                _hover={{ color: 'purple.800' }}
                ml={1}
              >
                Stripe's Security Documentation
              </Link>
            </ListItem>
          </UnorderedList>
        </LegalSection>
      </VStack>
    </BorderBox>
  );
};

export default TermsOfService;
