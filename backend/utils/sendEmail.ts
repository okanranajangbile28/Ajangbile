import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

                    <p
                      style="
                        font-size:17px;
                        line-height:1.9;
                        color:#444;
                        margin-bottom:25px;
                      ">

                      Your application to join

                      <strong>
                        Iledi Ajangbile,
                        Confederation of Ogboni Aborigine
                        Fraternity of Nigeria,
                        Ogun State Chapter
                      </strong>

                      has been approved.

                    </p>

                    <p
                      style="
                        font-size:17px;
                        line-height:1.9;
                        color:#444;
                        margin-bottom:40px;
                      ">

                      You may now login using your email address
                      and password.

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
                      ">

                      Login to Your Dashboard

                    </a>

                  </td>
                </tr>

                <tr>
                  <td>

                    <hr
                      style="
                        margin:45px 0 25px 0;
                        border:none;
                        border-top:1px solid #dddddd;
                      ">

                    <p
                      style="
                        color:#666;
                        font-size:15px;
                        line-height:1.8;
                        margin:0;
                      ">

                      Regards,

                      <br><br>

                      <strong>
                        Iledi Ajangbile
                      </strong>

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
      console.error('❌ Resend Error:', error);
      throw error;
    }

    console.log('✅ Approval email sent successfully.');
    console.log(data);

    return data;
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    throw err;
  }
};
