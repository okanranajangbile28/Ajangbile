import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export const sendMembershipApprovalSMS = async ({
  phone,
  fullName,
  initiationDate,
  initiationTime,
  initiationVenue,
  initiationFee,
}: {
  phone: string;
  fullName: string;
  initiationDate?: Date;
  initiationTime?: string;
  initiationVenue?: string;
  initiationFee?: number;
}) => {
  try {
    const formattedDate = initiationDate
      ? new Date(initiationDate).toLocaleDateString('en-GB')
      : 'To Be Announced';

    const formattedFee = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(initiationFee || 50000);

    const message = `Congratulations ${fullName}!

Your membership application has been APPROVED.

Initiation Date: ${formattedDate}
Time: ${initiationTime || 'TBA'}
Venue: ${initiationVenue || 'TBA'}

Initiation Fee: ${formattedFee}

For more information visit:
https://www.ajangbileheritage.com`;

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log('========== TWILIO RESPONSE ==========');
    console.log('SID:', sms.sid);
    console.log('Status:', sms.status);
    console.log('Error Code:', sms.errorCode);
    console.log('Error Message:', sms.errorMessage);
    console.log('To:', sms.to);
    console.log('From:', sms.from);
    console.log('====================================');
  } catch (err) {
    console.error('Twilio SMS Error:', err);
  }
};
