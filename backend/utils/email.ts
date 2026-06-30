// import nodemailer from 'nodemailer';
// import { google } from 'googleapis';

// // These id's and secrets should come from .env file.

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLEMAIL_REDIRECT_URL,
// );
// oAuth2Client.setCredentials({
//   refresh_token: process.env.GOOGLEMAIL_REFRESH_TOKEN,
// });

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// export const sendMail = async ({
//   to,
//   subject,
//   text,
//   html,
// }: MailOptions): Promise<any> => {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();

//     const transport = nodemailer.createTransport({
//       // service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         user: process.env.AUTHORIZED_MAIL,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLEMAIL_REFRESH_TOKEN,
//         accessToken,
//       },
//     });

//     const mailOptions: MailOptions = {
//       from: `BAZ <${process.env.AUTHORIZED_MAIL}>`,
//       to,
//       subject,
//       text,
//       html,
//     };

//     const result = await transport.sendMail(mailOptions);
//     return result;
//   } catch (error) {
//     console.log(error);
//     throw error; // You can handle the error as needed
//   }
// };
export const sendMail = ({ to, subject, text, html }: MailOptions) => {
  return;
};
