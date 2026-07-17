import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================================================
// OGBONI ACCOUNT APPROVAL EMAIL
// =====================================================

export const sendApprovalEmail = async (email: string, fullName: string) => {
  try {
    console.log('📧 Sending approval email to:', email);

    const { data, error } = await resend.emails.send({
      from: 'Iledi Ajangbile <admin@ajangbileheritage.com>',
      to: email,
      subject: 'Membership Account Approved',

      html: `
      <div style="background:#f5f5f5;padding:40px;font-family:Arial,sans-serif;">

        <div style="max-width:700px;margin:auto;background:#fff;padding:40px;border-radius:12px;">

          <h1
  style="
    color:#4b0082;
    text-align:center;
    font-size:38px;
    line-height:1.25;
    margin:0 0 25px;
    font-weight:bold;
  "
>
  Member Account<br>
  Approved
</h1>

          <h2 style="text-align:center;">
            ${fullName}
          </h2>

          <p>
            Your Ogboni member account has been approved.
          </p>

          <p>
            You can now login using your registered email address and password.
          </p>

          <div style="text-align:center;margin-top:35px;">

            <a
              href="https://www.ajangbileheritage.com/ogboni-login"
              style="
                background:#4b0082;
                color:#fff;
                padding:15px 35px;
                text-decoration:none;
                border-radius:8px;
                display:inline-block;
              "
            >
              Login
            </a>

          </div>

          <p style="margin-top:40px;">
            Regards,<br>
            <strong>Iledi Ajangbile</strong>
          </p>

        </div>

      </div>
      `,
    });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// =====================================================
// MEMBERSHIP APPLICATION APPROVAL EMAIL
// =====================================================

export const sendMembershipApprovalEmail = async ({
  fullName,
  email,
  initiationDate,
  initiationTime,
  initiationVenue,
  initiationInstructions,
}: {
  fullName: string;
  email: string;
  initiationDate?: Date;
  initiationTime?: string;
  initiationVenue?: string;
  initiationInstructions?: string;
}) => {
  try {
    const formattedDate = initiationDate
      ? new Date(initiationDate).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'To Be Announced';

    const { data, error } = await resend.emails.send({
      from: 'Iledi Ajangbile <admin@ajangbileheritage.com>',
      to: email,
      subject: 'Membership Application Approved',

      html: `
      <div style="background:#f5f5f5;padding:40px;font-family:Arial,sans-serif;">

        <div style="max-width:700px;margin:auto;background:#fff;padding:40px;border-radius:12px;">

          <h1
  style="
    color:#4b0082;
    text-align:center;
    font-size:38px;
    line-height:1.25;
    margin:0 0 25px;
    font-weight:bold;
  "
>
  Membership<br>
  Application Approved
</h1>

          <h2 style="text-align:center;">
  ${fullName}
</h2>

          <p>
            Congratulations!
          </p>

          <p>
            Your application to join
            <strong>
              Iledi Ajangbile, Confederation of Ogboni Aborigine Fraternity of Nigeria,
              Ogun State Chapter
            </strong>
            has been approved.
          </p>

          <h2 style="margin-top:35px;color:#4b0082;">
            Initiation Details
          </h2>

          <table style="width:100%;border-collapse:collapse;">

            <tr>
              <td style="padding:10px;border:1px solid #ddd;">
                <strong>Date</strong>
              </td>

              <td style="padding:10px;border:1px solid #ddd;">
                ${formattedDate}
              </td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;">
                <strong>Time</strong>
              </td>

              <td style="padding:10px;border:1px solid #ddd;">
                ${initiationTime || 'To Be Announced'}
              </td>
            </tr>

            <tr>
              <td style="padding:10px;border:1px solid #ddd;">
                <strong>Venue</strong>
              </td>

              <td style="padding:10px;border:1px solid #ddd;">
                ${initiationVenue || 'To Be Announced'}
              </td>
            </tr>

          </table>

          <h3 style="margin-top:35px;color:#4b0082;">
            Instructions
          </h3>

          <p style="line-height:1.8;">
            ${
              initiationInstructions ||
              'Please arrive early and come with all required documents.'
            }
          </p>

          <div style="text-align:center;margin-top:40px;">

            <a
              href="https://www.ajangbileheritage.com"
              style="
                background:#4b0082;
                color:#fff;
                padding:15px 35px;
                text-decoration:none;
                border-radius:8px;
                display:inline-block;
              "
            >
              Visit Website
            </a>

          </div>

          <p style="margin-top:45px;">
            Regards,<br>
            <strong>Iledi Ajangbile</strong>
          </p>

        </div>

      </div>
      `,
    });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// =====================================================
// PASSWORD RESET EMAIL
// =====================================================

export const sendPasswordResetEmail = async (
  email: string,
  fullName: string,
  token: string,
) => {
  try {
    const resetURL = `https://www.ajangbileheritage.com/ogboni-reset-password/${token}`;

    const { data, error } = await resend.emails.send({
      from: 'Iledi Ajangbile <admin@ajangbileheritage.com>',
      to: email,
      subject: 'Reset Your Password',

      html: `
      <div style="background:#f5f5f5;padding:40px;font-family:Arial,sans-serif;">

        <div style="max-width:700px;margin:auto;background:#fff;padding:40px;border-radius:12px;">

          <h1 style="color:#4b0082;text-align:center;">
            Password Reset
          </h1>

          <h2 style="text-align:center;">
            ${fullName}
          </h2>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <div style="text-align:center;margin-top:35px;">

            <a
              href="${resetURL}"
              style="
                background:#4b0082;
                color:#fff;
                padding:15px 35px;
                text-decoration:none;
                border-radius:8px;
                display:inline-block;
              "
            >
              Reset Password
            </a>

          </div>

          <p style="margin-top:35px;">
            This link will expire in <strong>30 minutes</strong>.
          </p>

          <p>
            If you didn't request this, simply ignore this email.
          </p>

          <p style="margin-top:40px;">
            Regards,<br>
            <strong>Iledi Ajangbile</strong>
          </p>

        </div>

      </div>
      `,
    });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
