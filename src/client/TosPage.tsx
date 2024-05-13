import BorderBox from './components/BorderBox';
import { Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function TermsOfService() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!!hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [hash]);

  return (
    <BorderBox id='terms'>
      <Text as='u'>**Terms of Service**</Text>
      <Text>
        Welcome to CoverLetterGPT ("we," "us," "our"). By accessing or using our website and services, you ("User,"
        "you," "your") agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms,
        please do not use the services provided by CoverLetterGPT. <br /> **1. Description of Service** CoverLetterGPT
        is a SaaS application that uses AI technology to assist users in creating personalized cover letters based on
        their curriculum vitae (CV) and job descriptions. <br /> **2. User Account** To use CoverLetterGPT, you must
        register for an account and provide accurate and complete information. You are responsible for maintaining the
        confidentiality of your account and password, and you must notify us immediately of any unauthorized use of your
        account. <br /> **3. Privacy** We respect your privacy and assure you that none of your personal data, including
        your CV, cover letter content, or job descriptions, will be used for purposes other than the service provided.
        For more information, please refer to our <br />. **4. Payments and Billing** a. Charges for our services are
        billed on a monthly basis. b. Your subscription will automatically renew each month unless you cancel it at
        least one day before the end of the current billing period. c. All charges are non-refundable, except at our
        sole discretion and in accordance with the rules governing each specific service. We may change the subscription
        fees upon reasonable advance notice communicated to you through a posting on CoverLetterGPT or such other means
        as we may deem appropriate, such as email. <br /> **5. Use of Services** You agree to use CoverLetterGPT in
        compliance with all applicable laws, rules, and regulations. You are solely responsible for all data, text, and
        content uploaded, posted, or stored through your use of the Services. <br /> **6. Acceptable Use Policy** You
        agree not to misuse the services or help anyone else do so. Misuse includes, but is not limited to, using the
        services to violate any law or distribute unsolicited or unauthorized advertising. <br /> **7. Intellectual
        Property Rights** The Services and the technology used to provide the Services are protected by copyright and
        other intellectual property rights. You agree not to copy, modify, or distribute our Services, any part of them,
        or our trademarks or logos. <br /> **8. Termination** We may terminate or suspend access to our Services
        immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you
        breach the Terms. <br /> **9. Disclaimer of Warranties** Our service is provided "as is" and without warranties
        of any kind, either expressed or implied.
        <br />
        **10. Limitation of Liability** In no event will CoverLetterGPT, its affiliates, officers, directors, employees,
        agents, suppliers, or licensors be liable for any indirect, incidental, special, consequential or punitive
        damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses. <br />{' '}
        <div  id='pp'></div>
        **11. Changes to Terms** We reserve the right to modify these Terms at any time. We will notify you of any
        changes via e-mail and by posting the new Terms on this page.
      </Text>

      <Text as='u'>
        **Privacy Policy**
      </Text>

      <Text>
        CoverLetterGPT ("we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your information when you visit our website and use our services. If you
        do not agree with the terms of this privacy policy, please do not access the site or use the services.
        <br /> **1. Information Collection** a. Personal Information: We collect personal information that you
        voluntarily provide to us when registering for an account, such as your name, email address, and credentials. b.
        Generated Content: When you use our services to create cover letters, we collect the information used to
        customize these documents, like CV details and job descriptions. c. Usage Data: We may collect non-personal data
        about how the service is accessed and used, including information such as your computer's IP address, browser
        type, and pages visited.
        <br /> **2. Use of Information** The information we collect is used for the following purposes: a. To provide
        and maintain our Service. b. To notify you about changes to our Service. c. To allow you to participate in
        interactive features of our Service when you choose to do so. d. To provide customer support. e. To detect,
        prevent, and address technical issues.
        <br /> **3. Sharing of Information** We will not share, sell, rent, or trade your personal information with
        third parties without your consent, except as necessary to provide the Service or if required by law.
        <br /> **4. Data Security** We take reasonable measures to protect your information from unauthorized access,
        alteration, disclosure, or destruction and have implemented industry-standard security safeguards.
        <br /> **5. Your Data Protection Rights** Depending on where you are located, you may have the following data
        protection rights: a. The right to access, update, or delete the information we have on you. b. The right to
        correction. c. The right to object. d. The right to data portability. e. The right to withdraw consent.
        <br /> **6. Use of Cookies** We use cookies and similar tracking technologies to track the activity on our
        Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a
        cookie is being sent.
        <br /> **7. Children's Privacy** Our Service is not intended for anyone under the age of 18. We do not knowingly
        collect personally identifiable information from children under 18.
        <br /> **8. Changes to This Privacy Policy** We may update our Privacy Policy from time to time. You are advised
        to review this Privacy Policy periodically for any changes.
        <br /> **9. Contact Us** If you have any questions about this Privacy Policy, please contact us.
      </Text>
    </BorderBox>
  );
}

export default TermsOfService;
