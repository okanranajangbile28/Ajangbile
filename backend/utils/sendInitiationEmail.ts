import nodemailer from 'nodemailer';

interface InitiationEmailOptions {
  fullName: string;
  email: string;
  initiationDate?: Date | string;
  initiationTime: string;
  initiationVenue: string;
  initiationInstructions: string;
}

export const sendInitiationEmail = async ({
  fullName,
  email,
  initiationDate,
  initiationTime,
  initiationVenue,
  initiationInstructions,
}: InitiationEmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const formattedDate = initiationDate
    ? new Date(initiationDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'To Be Announced';

  await transporter.sendMail({
    from: `"Ajangbile Heritage" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Your Initiation Ceremony Details',
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Initiation Ceremony</title>
</head>

<body style="
margin:0;
padding:40px;
background:#f5f5f5;
font-family:Arial,sans-serif;
">

<table align="center" width="700" cellpadding="0" cellspacing="0" style="
background:#ffffff;
border-radius:12px;
overflow:hidden;
">

<tr>
<td style="
background:#4b0082;
padding:35px;
text-align:center;
color:white;
">

<h1 style="margin:0;font-size:32px;">
AJANGBILE HERITAGE
</h1>

<p style="margin-top:10px;color:#FFD700;font-size:18px;">
Confederation of Ogboni Aborigine Fraternity of Nigeria
</p>

</td>
</tr>

<tr>
<td style="padding:45px;">

<h2 style="
color:#4b0082;
margin-top:0;
">
Congratulations ${fullName},
</h2>

<p style="
font-size:17px;
line-height:1.8;
color:#444;
">

Your initiation payment has been confirmed.

We are pleased to invite you to your official initiation ceremony.

</p>

<div style="
margin-top:35px;
background:#f8f5ff;
border-left:6px solid #4b0082;
padding:25px;
">

<h3 style="
margin-top:0;
color:#4b0082;
">
Initiation Details
</h3>

<p><strong>Date:</strong> ${formattedDate}</p>

<p><strong>Time:</strong> ${initiationTime}</p>

<p><strong>Venue:</strong> ${initiationVenue}</p>

</div>

<div style="
margin-top:30px;
background:#fffbe8;
padding:25px;
border-left:6px solid #FFD700;
">

<h3 style="margin-top:0;color:#4b0082;">
Instructions
</h3>

<p style="
line-height:1.9;
color:#444;
">

${initiationInstructions}

</p>

</div>

<div style="
margin-top:40px;
text-align:center;
">

<p style="
font-size:18px;
font-weight:bold;
color:#4b0082;
">

We look forward to welcoming you into the fraternity.

</p>

</div>

<hr style="
margin:40px 0;
">

<p style="
text-align:center;
font-size:14px;
color:#777;
">

Ajangbile Heritage<br>

Confederation of Ogboni Aborigine Fraternity of Nigeria

</p>

</td>
</tr>

</table>

</body>

</html>
`,
  });
};
