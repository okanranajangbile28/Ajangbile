import nodemailer from 'nodemailer';

interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = async ({
  from,
  to,
  subject,
  text,
  html,
  replyTo,
}: MailOptions) => {
  const info = await transporter.sendMail({
    from: from || `"Ajangbile Heritage" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
    html,
    replyTo,
  });

  console.log('================================');
  console.log('EMAIL INFO');
  console.log(info);
  console.log('================================');

  return info;
};
