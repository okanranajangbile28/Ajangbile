import axios from 'axios';

interface SMSOptions {
  to: string;
  message: string;
}

export const sendSMS = async ({ to, message }: SMSOptions) => {
  try {
    const response = await axios.post(
      'https://api.ng.termii.com/api/sms/send',
      {
        api_key: process.env.TERMII_API_KEY,
        to,
        from: process.env.TERMII_SENDER_ID || 'Termii',
        sms: message,
        type: 'plain',
        channel: 'generic',
      },
    );

    console.log('✅ SMS SENT');
    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.error('❌ SMS FAILED');

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    throw error;
  }
};
