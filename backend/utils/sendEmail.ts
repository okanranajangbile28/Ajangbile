import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendApprovalEmail = async (email: string, fullName: string) => {
  try {
    console.log('📧 ABOUT TO SEND EMAIL TO:', email);

    const { data, error } = await resend.emails.send({
      from: 'Okanran <onboarding@resend.dev>',
      to: 'ajangbileheritage007@gmail.com', // ⚠️ change later when going production
      subject: 'Membership Application Approved 🎉',

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: purple;">
            Congratulations Chief ${fullName}
          </h2>

          <p>
            Your membership has been approved successfully.
          </p>

          <p>
            You can now log in to your dashboard.
          </p>

          <a href="http://localhost:5173/login"
             style="display:inline-block;
             background:purple;
             color:white;
             padding:12px 20px;
             text-decoration:none;
             border-radius:6px;">
            Login Now
          </a>

          <br/><br/>

          <p>Regards,<br/>Okanran System</p>
        </div>
      `,
    });

    // 🚨 HANDLE RESEND ERROR PROPERLY
    if (error) {
      console.log('❌ RESEND ERROR:', error);
      return { success: false, error };
    }

    console.log('✅ RESEND RESPONSE:', data);
    console.log('EMAIL SENT SUCCESSFULLY ✔');

    return { success: true, data };
  } catch (error) {
    console.log('❌ EMAIL EXCEPTION:', error);
    return { success: false, error };
  }
};
