import SendGrid from '@sendgrid/mail';

export type Email = {
  from?: EmailFromField;
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type EmailFromField = {
  name?: string;
  email: string;
};

export type SendGridProvider = {
  type: 'sendgrid';
  apiKey: string;
};

SendGrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendGrid(email: Email, context: any) {
  const fromField = {
    name: 'CoverLetterGPT',
    email: 'vince@wasp-lang.dev',
  };

  let sentEmail: any = undefined;
  console.log('Sending email: ', email)
  try {
    sentEmail = await SendGrid.send({
      from: {
        email: fromField.email,
        name: fromField.name,
      },
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    console.log('Email sent: ', sentEmail);
  } catch (error) {
    console.error('Error sending email: ', error);
  }

  return sentEmail;
}
