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
  applicationId,
}: {
  fullName: string;
  email: string;
  applicationId: string;
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Iledi Ajangbile <admin@ajangbileheritage.com>',
      to: email,
      subject: 'Your Membership Application Has Been Approved',

      html: `

<div style="margin:0;padding:30px;background:#f4f1f8;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:680px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.08);">

<!-- HEADER -->

<div style="background:#4b0082;padding:30px 20px;text-align:center;">

<img
src="${CREST_URL}"
alt="Ajangbile Crest"
style="width:72px;height:auto;margin-bottom:15px;"
/>

<h1 style="
margin:0;
font-size:26px;
font-weight:bold;
color:#ffffff;
line-height:1.35;
">
Your Membership Application<br>
Has Been Approved
</h1>

<div style="
margin-top:18px;
color:#FFD700;
font-size:15px;
font-weight:bold;
line-height:1.6;
">
Confederation of Ogboni Aborigine Fraternity of Nigeria
</div>

<div style="
color:#ffffff;
font-size:14px;
margin-top:6px;
line-height:1.6;
">
Ogun State Chapter • Iledi Ajangbile
</div>

</div>

<!-- BODY -->

<div style="padding:35px 28px;">

<p style="
margin-top:0;
font-size:16px;
line-height:1.8;
color:#333333;
">
Dear <strong>${fullName}</strong>,
</p>

<p style="
font-size:15px;
line-height:1.9;
color:#444444;
margin-bottom:18px;
">
Congratulations.
</p>

<p style="
font-size:15px;
line-height:1.9;
color:#444444;
">
We are pleased to inform you that your membership application into the
<strong>Confederation of Ogboni Aborigine Fraternity of Nigeria, Ogun State Chapter – Iledi Ajangbile</strong>
has been officially approved.
</p>

<div style="
margin-top:28px;
padding:20px;
background:#fff8dc;
border-left:5px solid #b8860b;
border-radius:8px;
">

<p style="
margin:0;
font-size:15px;
line-height:1.9;
color:#444444;
">
The next step is to complete your initiation payment by selecting one of the approved initiation packages below.
</p>

</div>

<p style="
margin-top:28px;
font-size:15px;
line-height:1.9;
color:#444444;
">
Once your payment has been confirmed, the administration will contact you with your initiation date, time, venue and further instructions.
</p>

<!-- PACKAGES START -->

<div style="margin-top:35px;">

<h2 style="
text-align:center;
color:#4b0082;
font-size:26px;
margin-bottom:30px;
">
Select Your Preferred Initiation Package
</h2>

<!-- ================= BASIC ================= -->

<div style="
margin-bottom:28px;
border:1px solid #ddd;
border-radius:12px;
overflow:hidden;
">

<div style="
background:#4b0082;
padding:16px;
text-align:center;
color:#FFD700;
font-size:22px;
font-weight:bold;
">
Basic Package
</div>

<div style="padding:25px;">

<p style="
margin:0 0 18px;
text-align:center;
font-size:34px;
font-weight:bold;
color:#4b0082;
">
$0.50
</p>

<ul style="
margin:0;
padding-left:22px;
line-height:2;
font-size:15px;
color:#444;
">

<li>Irilẹ (Right of Passage into the Ogboni Fraternity)</li>

<li>Ikọta (3rd Day Ritual)</li>

<li>Ikojẹ (7th Day Ritual)</li>

</ul>

<div style="text-align:center;margin-top:28px;">

<a
href="https://ajangbile.onrender.com/api/payments/initiate?applicationId=${applicationId}&package=Basic"
style="
display:inline-block;
background:#4b0082;
color:#ffffff;
padding:14px 28px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
font-size:16px;
line-height:1.4;
white-space:normal;
word-break:keep-all;
text-align:center;
box-sizing:border-box;
">
Pay with<br>Stripe
</a>

</div>

</div>

</div>

<!-- ================= STANDARD ================= -->

<div style="
margin-bottom:28px;
border:1px solid #ddd;
border-radius:12px;
overflow:hidden;
">

<div style="
background:#4b0082;
padding:16px;
text-align:center;
color:#FFD700;
font-size:22px;
font-weight:bold;
">
Standard Package
</div>

<div style="padding:25px;">

<p style="
margin:0 0 18px;
text-align:center;
font-size:34px;
font-weight:bold;
color:#4b0082;
">
$0.50
</p>

<ul style="
margin:0;
padding-left:22px;
line-height:2;
font-size:15px;
color:#444;
">

<li>Irilẹ (Right of Passage into the Ogboni Fraternity)</li>

<li>Ikọta (3rd Day Ritual)</li>

<li>Ikojẹ (7th Day Ritual)</li>

<li>Ibori (Appeasing of One's Head)</li>

</ul>

<div style="text-align:center;margin-top:28px;">

<a
href="https://ajangbile.onrender.com/api/payments/stripe/initiate?applicationId=${applicationId}&package=Standard"
style="
display:inline-block;
background:#4b0082;
color:#ffffff;
padding:14px 28px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
font-size:16px;
line-height:1.4;
white-space:normal;
word-break:keep-all;
text-align:center;
box-sizing:border-box;
">
Pay with<br>Stripe
</a>

</div>

</div>

</div>

<!-- ================= PREMIUM ================= -->

<div style="
margin-bottom:28px;
border:1px solid #ddd;
border-radius:12px;
overflow:hidden;
">

<div style="
background:#4b0082;
padding:16px;
text-align:center;
color:#FFD700;
font-size:22px;
font-weight:bold;
">
Premium Package
</div>

<div style="padding:25px;">

<p style="
margin:0 0 18px;
text-align:center;
font-size:34px;
font-weight:bold;
color:#b8860b;
">
$0.50
</p>

<ul style="
margin:0;
padding-left:22px;
line-height:2;
font-size:15px;
color:#444;
">

<li>Irilẹ (Right of Passage into the Ogboni Fraternity)</li>

<li>Ikọta (3rd Day Ritual)</li>

<li>Ikojẹ (7th Day Ritual)</li>

<li>Ibori (Appeasing of One's Head)</li>

<li>Eran Oro (Sacrifice of a Lamb/Sheep)</li>

<li>Ikorita (Bestowment of Chieftaincy Title)</li>

</ul>

<div style="text-align:center;margin-top:28px;">

<a
href="https://ajangbile.onrender.com/api/payments/initiate?applicationId=${applicationId}&package=Premium"
style="
display:inline-block;
background:#4b0082;
color:#ffffff;
padding:14px 28px;
border-radius:8px;
text-decoration:none;
font-weight:bold;
font-size:16px;
line-height:1.4;
white-space:normal;
word-break:keep-all;
text-align:center;
box-sizing:border-box;
">
Pay with<br>Stripe
</a>

</div>

</div>
<div style="
margin-top:35px;
padding:20px;
background:#f8f8f8;
border-left:5px solid #4b0082;
border-radius:8px;
">

<p style="
margin:0;
font-size:15px;
line-height:1.9;
color:#444;
">

<hr style="
margin:45px 0;
border:none;
border-top:1px solid #ddd;
">

<p style="
line-height:1.9;
font-size:15px;
color:#444;
">
After payment has been verified, your initiation schedule will be sent to you by email and SMS.
</p>

<p style="
line-height:1.9;
font-size:15px;
color:#444;
">
We look forward to welcoming you into the Confederation of Ogboni Aborigine Fraternity of Nigeria.
</p>

<p style="
margin-top:35px;
font-size:15px;
color:#444;
">
Yours faithfully,
</p>

<strong style="
color:#4b0082;
font-size:20px;
line-height:1.5;
">
Confederation of Ogboni Aborigine Fraternity of Nigeria
</strong>

<br>

<span style="color:#555;">
Ogun State Chapter
</span>

<br>

<span style="color:#555;">
Iledi Ajangbile
</span>

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

<p style="
font-size:16px;
line-height:2;
color:#444;
">

After payment has been verified, your initiation schedule will be sent to you by email and SMS.

</p>

<p style="
font-size:16px;
line-height:2;
color:#444;
margin-top:20px;
">

We look forward to welcoming you into the Confederation of Ogboni Aborigine Fraternity of Nigeria.

</p>

<p style="
margin-top:45px;
font-size:16px;
color:#222;
">
Yours faithfully,
</p>

<div style="
margin-top:12px;
">

<div style="
font-size:28px;
font-weight:bold;
color:#4b0082;
line-height:1.25;
">
Confederation of Ogboni<br>
Aborigine Fraternity of<br>
Nigeria
</div>

<div style="
margin-top:8px;
font-size:18px;
color:#222;
">
Ogun State Chapter
</div>

<div style="
font-size:18px;
color:#222;
">
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
// ORDER RECEIPT EMAIL
// =====================================================

export const sendOrderReceiptEmail = async ({
  email,
  fullName,
  orderId,
  stripeReference,
  orderItems,
  totalAmount,
}: {
  email: string;
  fullName: string;
  orderId: string;
  stripeReference: string;
  orderItems: Array<{
    productName: string;
    price: number;
    quantity?: number;
  }>;
  totalAmount: number;
}) => {
  try {
    const itemsHtml = orderItems
      .map(
        (item) => `
          <tr>
            <td style="
              padding:14px;
              border-bottom:1px solid #e5e5e5;
              color:#333;
            ">
              ${item.productName}
            </td>

            <td style="
              padding:14px;
              border-bottom:1px solid #e5e5e5;
              text-align:center;
              color:#333;
            ">
              ${item.quantity || 1}
            </td>

            <td style="
              padding:14px;
              border-bottom:1px solid #e5e5e5;
              text-align:right;
              color:#333;
              font-weight:bold;
            ">
              $${(item.price * (item.quantity || 1)).toFixed(2)}
            </td>
          </tr>
        `,
      )
      .join('');

    const { data, error } = await resend.emails.send({
      from: 'Iledi Ajangbile <admin@ajangbileheritage.com>',

      to: email,

      subject: 'Your Ajangbile Heritage Order Receipt',

      html: `
<div style="
  margin:0;
  padding:40px 20px;
  background:#f4f1f8;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    max-width:700px;
    margin:auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 8px 30px rgba(0,0,0,.10);
  ">

    <!-- HEADER -->

    <div style="
      background:linear-gradient(180deg,#4b0082 0%,#32005c 100%);
      padding:40px 25px;
      text-align:center;
    ">

      <img
        src="${CREST_URL}"
        alt="Ajangbile Heritage Crest"
        style="
          width:90px;
          height:auto;
          margin-bottom:18px;
        "
      />

      <h1 style="
        margin:0;
        color:#ffffff;
        font-size:30px;
        line-height:1.3;
      ">
        Payment Successful
      </h1>

      <p style="
        color:#FFD700;
        margin:15px 0 0;
        font-size:16px;
        font-weight:bold;
      ">
        Your Order Receipt
      </p>

    </div>

    <!-- BODY -->

    <div style="padding:40px 30px;">

      <h2 style="
        color:#4b0082;
        margin-top:0;
      ">
        Thank You, ${fullName}
      </h2>

      <p style="
        color:#444;
        font-size:16px;
        line-height:1.8;
      ">
        Your payment has been successfully received and your order has been confirmed.
      </p>

      <!-- ORDER INFORMATION -->

      <div style="
        background:#f8f6fb;
        border-left:5px solid #4b0082;
        padding:20px;
        border-radius:8px;
        margin:30px 0;
      ">

        <p style="margin:8px 0;color:#444;">
          <strong>Order ID:</strong>
          ${orderId}
        </p>

        <p style="margin:8px 0;color:#444;">
          <strong>Payment Reference:</strong>
          ${stripeReference}
        </p>

        <p style="margin:8px 0;color:#444;">
          <strong>Payment Status:</strong>
          <span style="color:#16803c;font-weight:bold;">
            Paid
          </span>
        </p>

      </div>

      <!-- ORDER ITEMS -->

      <h2 style="
        color:#4b0082;
        margin-top:35px;
      ">
        Order Summary
      </h2>

      <table style="
        width:100%;
        border-collapse:collapse;
        margin-top:15px;
      ">

        <thead>

          <tr style="background:#4b0082;color:#ffffff;">

            <th style="
              padding:14px;
              text-align:left;
            ">
              Product
            </th>

            <th style="
              padding:14px;
              text-align:center;
            ">
              Quantity
            </th>

            <th style="
              padding:14px;
              text-align:right;
            ">
              Total
            </th>

          </tr>

        </thead>

        <tbody>

          ${itemsHtml}

        </tbody>

      </table>

      <!-- TOTAL -->

      <div style="
        margin-top:30px;
        padding:22px;
        background:#fff8dc;
        border-radius:10px;
        text-align:right;
      ">

        <span style="
          font-size:16px;
          color:#555;
        ">
          Total Paid:
        </span>

        <strong style="
          font-size:26px;
          color:#4b0082;
          margin-left:10px;
        ">
          $${totalAmount.toFixed(2)}
        </strong>

      </div>

      <!-- NEXT STEP -->

      <div style="
        margin-top:35px;
        padding:20px;
        background:#f4f1f8;
        border-radius:10px;
      ">

        <strong style="
          color:#4b0082;
          font-size:17px;
        ">
          What happens next?
        </strong>

        <p style="
          color:#444;
          line-height:1.8;
          margin-bottom:0;
        ">
          Your order is now being processed. We will contact you if any additional information is required regarding your order.
        </p>

      </div>

      <div style="
        text-align:center;
        margin:40px 0 20px;
      ">

        <a
          href="https://www.ajangbileheritage.com"
          style="
            background:#4b0082;
            color:#ffffff;
            padding:15px 32px;
            text-decoration:none;
            border-radius:8px;
            display:inline-block;
            font-weight:bold;
          "
        >
          Visit Ajangbile Heritage
        </a>

      </div>

      <hr style="
        border:none;
        border-top:1px solid #ddd;
        margin:35px 0;
      ">

      <p style="
        color:#666;
        line-height:1.8;
        font-size:14px;
        text-align:center;
      ">
        Please keep this email as your payment receipt.
      </p>

      <p style="
        color:#4b0082;
        text-align:center;
        font-weight:bold;
        line-height:1.7;
      ">
        Ajangbile Heritage
        <br />
        Confederation of Ogboni Aborigine Fraternity of Nigeria
      </p>

    </div>

  </div>

</div>
`,
    });

    if (error) {
      throw error;
    }

    console.log('======================================');
    console.log('📧 ORDER RECEIPT EMAIL SENT');
    console.log(`Customer: ${email}`);
    console.log(`Order ID: ${orderId}`);
    console.log('======================================');

    return data;
  } catch (err) {
    console.error('❌ Failed to send order receipt email:');
    console.error(err);

    throw err;
  }
};
