import { emailSender } from '@wasp/jobs/emailSender.js';

// this just tests that the sendgrid worker is working correctly
// it can be removed here and within the `main.wasp` file after sendgrid is properly configured
export default async function () {
  await emailSender.submit({
    to: 'vincanger@gmail.com',
    subject: 'Test',
    text: 'Test',
    html: 'Test',
  });
}
