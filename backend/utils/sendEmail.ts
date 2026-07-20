import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const CREST_URL = 'https://www.ajangbileheritage.com/images/crest.png';
// =====================================================
// OGBONI ACCOUNT APPROVAL EMAIL
// =====================================================

export const sendApprovalEmail = async (email: string, fullName: string) => {
  try {
    console.log('📧 Sending approval email to:', email);

    const { data, error } = await resend.emails.send({
      from: 'Iledi Ajangbile <admin@ajangbileheritage.com>',
      to: email,
      subject: 'Ogboni Account Approved',

      html: `
<div style="background:#ede7f6;padding:40px;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:720px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12);">

<!-- ================= HEADER ================= -->

<div
  style="
    background:linear-gradient(180deg,#4b0082 0%,#32005c 100%);
    padding:40px 30px;
    text-align:center;
  "
>

  <img
    src="https://www.ajangbileheritage.com/images/crest.png"
    alt="Iledi Ajangbile Crest"
    style="
      width:90px;
      display:block;
      margin:0 auto 20px;
    "
  />

  <div
    style="
      color:#FFD700;
      font-size:13px;
      letter-spacing:3px;
      text-transform:uppercase;
      font-weight:bold;
      margin-bottom:18px;
    "
  >
    Official Membership Notification
  </div>

  <h1
    style="
      color:#ffffff;
      font-size:30px;
      line-height:1.25;
      margin:0;
      font-weight:700;
      text-align:center;
    "
  >
    Membership Application<br>
    Approved
  </h1>

  <div
    style="
      width:80px;
      height:3px;
      background:#FFD700;
      margin:25px auto;
    "
  ></div>

  <div
    style="
      color:#FFD700;
      font-size:18px;
      font-weight:bold;
      line-height:1.5;
      max-width:520px;
      margin:auto;
    "
  >
    Confederation of Ogboni Aborigine Fraternity of Nigeria
  </div>

  <div
    style="
      color:#ffffff;
      font-size:15px;
      margin-top:12px;
      line-height:1.6;
    "
  >
    Ogun State Chapter • Iledi Ajangbile
  </div>

</div>

<!-- ================= END HEADER ================= -->

<div style="padding:40px;">

<h2 style="color:#4b0082;">
Dear ${fullName},
</h2>

<p style="line-height:1.9;">
Congratulations.
</p>

<p style="line-height:1.9;">
Your online member account has been successfully approved.
You may now log into the members portal using your registered
email address and password.
</p>

<div style="background:#fff8dc;border-left:6px solid #b8860b;padding:20px;border-radius:8px;margin:35px 0;">

<strong style="color:#4b0082;font-size:18px;">
Your account is now active.
</strong>

<p style="line-height:1.8;">
You now have access to your secure member dashboard.
</p>

</div>

<div style="text-align:center;margin:40px 0;">

<a
href="https://www.ajangbileheritage.com/ogboni-login"
style="
background:#4b0082;
color:white;
padding:16px 40px;
text-decoration:none;
border-radius:8px;
display:inline-block;
font-weight:bold;
">
Login to Member Portal
</a>

</div>

<div style="text-align:center;">

<a
href="https://www.ajangbileheritage.com"
style="
color:#4b0082;
text-decoration:none;
font-weight:bold;
">
Visit Official Website
</a>

</div>

<hr style="margin:45px 0;border:none;border-top:1px solid #ddd;">

<p style="line-height:1.9;">
Thank you for becoming part of our fraternity.
We pray that wisdom, honour and integrity continually guide your journey.
</p>

<p style="margin-top:40px;">
Regards,
</p>

<strong style="color:#4b0082;">
Confederation of Ogboni Aborigine Fraternity of Nigeria
</strong>

<br>

Ogun State Chapter

<br>

Iledi Ajangbile

</div>

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
  initiationFee,
}: {
  fullName: string;
  email: string;
  initiationDate?: Date;
  initiationTime?: string;
  initiationVenue?: string;
  initiationInstructions?: string;
  initiationFee?: number;
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

    const formattedFee = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(initiationFee || 50000);

    const { data, error } = await resend.emails.send({
      from: 'Iledi Ajangbile <admin@ajangbileheritage.com>',
      to: email,
      subject: 'Membership Application Approved',

      html: `

<div style="background:#ede7f6;padding:40px;font-family:Arial,Helvetica,sans-serif;">

<div style="
max-width:720px;
margin:auto;
background:#ffffff;
border-radius:16px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.12);
">

<div style="
background:#4b0082;
padding:40px;
text-align:center;
">

<img
src="${CREST_URL}"
alt="Iledi Ajangbile Crest"
style="width:120px;height:auto;"
/>

<h1 style="
color:#ffffff;
margin:20px 0 10px;
font-size:34px;
">
Membership Application Approved
</h1>

<div style="
color:#FFD700;
font-size:18px;
font-weight:bold;
">
Confederation of Ogboni Aborigine Fraternity of Nigeria
</div>

<div style="
color:#ffffff;
margin-top:8px;
">
Ogun State Chapter • Iledi Ajangbile
</div>

</div>

<div style="padding:40px;">

<h2 style="color:#4b0082;">
Congratulations, ${fullName}
</h2>

<p style="line-height:1.9;">
We are pleased to inform you that your application for membership into
the
<strong>
Confederation of Ogboni Aborigine Fraternity of Nigeria,
Ogun State Chapter – Iledi Ajangbile
</strong>
has been officially approved.
</p>

<p style="line-height:1.9;">
Your initiation ceremony has been scheduled as follows:
</p>

<div style="
border:1px solid #ddd;
border-radius:10px;
overflow:hidden;
margin-top:35px;
">

<div style="
background:#4b0082;
color:white;
padding:15px;
text-align:center;
font-size:20px;
font-weight:bold;
">
Initiation Details
</div>

<table style="
width:100%;
border-collapse:collapse;
">

<tr>

<td style="
padding:15px;
border-bottom:1px solid #eee;
font-weight:bold;
width:35%;
">
Date
</td>

<td style="
padding:15px;
border-bottom:1px solid #eee;
">
${formattedDate}
</td>

</tr>

<tr>

<td style="
padding:15px;
border-bottom:1px solid #eee;
font-weight:bold;
">
Time
</td>

<td style="
padding:15px;
border-bottom:1px solid #eee;
">
${initiationTime || 'To Be Announced'}
</td>

</tr>

<tr>

<td style="
padding:15px;
font-weight:bold;
">
Venue
</td>

<td style="
padding:15px;
">
${initiationVenue || 'To Be Announced'}
</td>

</tr>

</table>

</div>
<div style="
background:#fff8dc;
border-left:6px solid #b8860b;
padding:25px;
border-radius:8px;
margin-top:35px;
">

<h2 style="
margin-top:0;
color:#4b0082;
">
Initiation Fee
</h2>

<p style="
font-size:28px;
font-weight:bold;
color:#b8860b;
margin:10px 0;
">
${formattedFee}
</p>

<p style="
line-height:1.8;
margin-bottom:0;
">
Kindly ensure this fee is paid before your initiation date unless otherwise instructed by the administration.
</p>

</div>

<div style="
background:#f8f8f8;
padding:25px;
border-radius:8px;
margin-top:35px;
">

<h2 style="
margin-top:0;
color:#4b0082;
">
Instructions
</h2>

<p style="
line-height:1.9;
margin:0;
">
${
  initiationInstructions ||
  'Please arrive at least 30 minutes before the scheduled time. Come with a valid means of identification and any additional documents requested by the administration. Dress decently and follow all instructions given by the initiation committee.'
}
</p>

</div>

<div style="
text-align:center;
margin-top:45px;
">

<a
href="https://www.ajangbileheritage.com"
style="
background:#4b0082;
color:#ffffff;
padding:16px 42px;
border-radius:8px;
text-decoration:none;
display:inline-block;
font-weight:bold;
">
Visit Official Website
</a>

</div>

<hr style="
margin:45px 0;
border:none;
border-top:1px solid #ddd;
">

<p style="
line-height:1.9;
">
Congratulations once again on reaching this important milestone.
We look forward to welcoming you officially into the fraternity.
</p>

<p style="
margin-top:35px;
">
Yours faithfully,
</p>

<strong style="
color:#4b0082;
font-size:17px;
">
Confederation of Ogboni Aborigine Fraternity of Nigeria
</strong>

<br>

Ogun State Chapter

<br>

Iledi Ajangbile

</div>

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

<div style="background:#ede7f6;padding:40px;font-family:Arial,Helvetica,sans-serif;">

<div style="
max-width:720px;
margin:auto;
background:#ffffff;
border-radius:16px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.12);
">

<div style="
background:#4b0082;
padding:40px;
text-align:center;
">

<img
src="${CREST_URL}"
alt="Iledi Ajangbile Crest"
style="width:120px;height:auto;"
/>

<h1 style="
color:#ffffff;
margin:20px 0 10px;
font-size:34px;
">
Password Reset Request
</h1>

<div style="
color:#FFD700;
font-size:18px;
font-weight:bold;
">
Confederation of Ogboni Aborigine Fraternity of Nigeria
</div>

<div style="
color:#ffffff;
margin-top:8px;
">
Ogun State Chapter • Iledi Ajangbile
</div>

</div>

<div style="padding:40px;">

<h2 style="color:#4b0082;">
Dear ${fullName},
</h2>

<p style="line-height:1.9;">
We received a request to reset the password for your member account.
</p>

<p style="line-height:1.9;">
If you made this request, click the button below to create a new password.
</p>

<div style="
background:#fff8dc;
border-left:6px solid #b8860b;
padding:22px;
border-radius:8px;
margin:35px 0;
">

<strong style="
color:#4b0082;
font-size:18px;
">
Security Notice
</strong>

<p style="
margin-top:12px;
line-height:1.8;
">
This password reset link will expire in
<strong>30 minutes</strong>
for your security.
</p>

</div>

<div style="
text-align:center;
margin:45px 0;
">

<a
href="${resetURL}"
style="
background:#4b0082;
color:#ffffff;
padding:16px 40px;
text-decoration:none;
border-radius:8px;
display:inline-block;
font-weight:bold;
">
Reset Password
</a>

</div>

<p style="line-height:1.9;">
If you did not request a password reset, you can safely ignore this email.
Your password will remain unchanged.
</p>

<div style="
text-align:center;
margin-top:30px;
">

<a
href="https://www.ajangbileheritage.com"
style="
color:#4b0082;
text-decoration:none;
font-weight:bold;
">
Visit Official Website
</a>

</div>

<hr style="
margin:45px 0;
border:none;
border-top:1px solid #ddd;
">

<p style="line-height:1.9;">
If you experience any issues accessing your account, please contact the administration for assistance.
</p>

<p style="margin-top:35px;">
Regards,
</p>

<strong style="
color:#4b0082;
font-size:17px;
">
Confederation of Ogboni Aborigine Fraternity of Nigeria
</strong>

<br>

Ogun State Chapter

<br>

Iledi Ajangbile

</div>

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
