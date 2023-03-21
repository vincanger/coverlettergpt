import { emailSender } from '@wasp/jobs/emailSender.js';

export default async function () {
  await emailSender.submit({
    to: 'vincanger@gmail.com',
    subject: 'Test',
    text: 'Test',
    html: 'Test',
  });
}
