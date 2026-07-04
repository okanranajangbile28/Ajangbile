import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================================================
// MEMBERSHIP APPROVAL EMAIL
// =====================================================

export const sendApprovalEmail = async (email: string, fullName: string) => {
  try {
    console.log('📧 Sending approval email to:', email);

    const { data, error } = await resend.emails.send({
      from: 'Iledi Ajangbile <admin@ajangbileheritage.com>',
      to: email,
      subject: 'Membership Application Approved',

      html: `
      <div style="background:#f5f5f5;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">

              <table
                width="650"
                cellpadding="0"
                cellspacing="0"
                style="
                  background:#ffffff;
                  border-radius:14px;
                  padding:45px;
                  max-width:650px;
                ">

                <tr>
                  <td align="center">

                    <img
                      src="https://www.ajangbileheritage.com/images/ajangbile-logo.png"
                      width="95"
                      alt="Iledi Ajangbile Logo"
                      style="display:block;margin-bottom:25px;"
                    />

                    <h1
                      style="
                        color:#4b0082;
                        font-size:30px;
                        margin:0;
                        white-space:nowrap;
                      ">
                      Congratulations!
                    </h1>

                    <h2
                      style="
                        color:#111;
                        font-size:25px;
                        margin-top:12px;
                        margin-bottom:35px;
                        font-weight:bold;
                      ">
                      ${fullName}
                    </h2>

                  </td>
                </tr>

                <tr>
                  <td>

                    <p style="font-size:17px;line-height:1.9;color:#444;">
                      Your application to join
                      <strong>
                        Iledi Ajangbile,
                        Confederation of Ogboni Aborigine Fraternity of Nigeria,
                        Ogun State Chapter
                      </strong>
                      has been approved.
                    </p>

                    <p style="font-size:17px;line-height:1.9;color:#444;">
                      You may now login using your email address and password.
                    </p>

                  </td>
                </tr>

                <tr>
                  <td align="center">

                    <a
                      href="https://www.ajangbileheritage.com/ogboni-login"
                      style="
                        background:#4b0082;
                        color:#ffffff;
                        text-decoration:none;
                        display:inline-block;
                        padding:16px 36px;
                        border-radius:8px;
                        font-size:17px;
                        font-weight:bold;
                        margin-top:25px;
                      ">
                      Login to Your Dashboard
                    </a>

                  </td>
                </tr>

                <tr>
                  <td>

                    <hr style="margin:45px 0 25px;border:none;border-top:1px solid #ddd;">

                    <p style="font-size:15px;color:#666;line-height:1.8;">
                      Regards,
                      <br><br>
                      <strong>Iledi Ajangbile</strong>
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </div>
      `,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    console.log('✅ Approval email sent.');

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
      <div style="background:#f5f5f5;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">

        <table width="100%">
          <tr>
            <td align="center">

              <table
                width="650"
                style="
                  background:#ffffff;
                  border-radius:14px;
                  padding:45px;
                  max-width:650px;
                ">

                <tr>
                  <td align="center">

                    <img
                      src="https://www.ajangbileheritage.com/images/ajangbile-logo.png"
                      width="95"
                      alt="Logo"
                    />

                    <h1 style="color:#4b0082;margin-top:25px;">
                      Password Reset
                    </h1>

                    <h2 style="color:#111;">
                      ${fullName}
                    </h2>

                  </td>
                </tr>

                <tr>
                  <td>

                    <p style="font-size:17px;line-height:1.9;color:#444;">

                      We received a request to reset the password for your
                      membership account with
                      <strong>
                        Iledi Ajangbile,
                        Confederation of Ogboni Aborigine Fraternity of Nigeria,
                        Ogun State Chapter.
                      </strong>

                    </p>

                    <p style="font-size:17px;line-height:1.9;color:#444;">
                      Click the button below to create a new password.
                    </p>

                  </td>
                </tr>

                <tr>
                  <td align="center">

                    <a
                      href="${resetURL}"
                      style="
                        background:#4b0082;
                        color:#fff;
                        text-decoration:none;
                        display:inline-block;
                        padding:16px 36px;
                        border-radius:8px;
                        font-size:17px;
                        font-weight:bold;
                        margin-top:20px;
                      ">
                      Reset Password
                    </a>

                  </td>
                </tr>

                <tr>
                  <td>

                    <p
                      style="
                        color:#666;
                        margin-top:35px;
                        font-size:15px;
                        line-height:1.8;
                      ">

                      This password reset link will expire in
                      <strong>30 minutes.</strong>

                      <br><br>

                      If you did not request this change,
                      you can safely ignore this email.

                    </p>

                    <hr style="margin:35px 0;border:none;border-top:1px solid #ddd;">

                    <p style="font-size:15px;color:#666;">
                      Regards,
                      <br><br>
                      <strong>Iledi Ajangbile</strong>
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </div>
      `,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    console.log('✅ Password reset email sent.');

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
