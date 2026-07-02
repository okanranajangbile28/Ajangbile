import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendApprovalEmail = async (email: string, fullName: string) => {
  console.log('========================================');
  console.log('📨 STARTING EMAIL FUNCTION');
  console.log('Recipient:', email);
  console.log('Name:', fullName);
  console.log('API KEY EXISTS:', !!process.env.RESEND_API_KEY);
  console.log('========================================');

  try {
    const response = await resend.emails.send({
      from: 'Ajangbile Heritage <admin@ajangbileheritage.com>',
      to: [email],

      subject: '🎉 Your Ogboni Membership Has Been Approved',

      html: `
      <div style="background:#f5f5f5;padding:40px;font-family:Arial,sans-serif;">
        <div style="max-width:650px;margin:auto;background:white;padding:40px;border-radius:12px;">

          <h1 style="color:#5B0B73;">
            Congratulations ${fullName}!
          </h1>

          <p style="font-size:16px;line-height:1.8;">
            Your application to join
            <strong>Ajangbile Heritage</strong>
            has been approved.
          </p>

          <p style="font-size:16px;line-height:1.8;">
            You may now login using your email address and password.
          </p>

          <div style="margin:40px 0;text-align:center;">
            <a
              href="http://localhost:5173/ogboni-login"
              style="
                background:#5B0B73;
                color:white;
                padding:15px 28px;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
                display:inline-block;
              ">
              Login Now
            </a>
          </div>

          <hr>

          <p>
            Regards,<br>
            <strong>Ajangbile Heritage</strong>
          </p>

        </div>
      </div>
      `,
    });

    console.log('==============================');
    console.log('📬 RESEND RESPONSE');
    console.log(response);
    console.log('==============================');

    return response;
  } catch (err: any) {
    console.log('==============================');
    console.log('❌ EMAIL FAILED');
    console.log(err);
    console.log(err?.message);
    console.log(err?.name);
    console.log(err?.statusCode);
    console.log(err?.response);
    console.log('==============================');

    throw err;
  }
};
