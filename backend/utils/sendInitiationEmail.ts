import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const CREST_URL = 'https://www.ajangbileheritage.com/images/crest.png';

// =====================================================
// FORMAT INITIATION TIME
// =====================================================

const formatInitiationTime = (time: string): string => {
  if (!time) {
    return 'To Be Announced';
  }

  const trimmedTime = String(time).trim();

  // ---------------------------------------------------
  // Already in 12-hour format
  // Example: 2:30 PM
  // ---------------------------------------------------

  const twelveHourMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (twelveHourMatch) {
    const hour = Number(twelveHourMatch[1]);
    const minute = twelveHourMatch[2];
    const period = twelveHourMatch[3].toUpperCase();

    if (hour >= 1 && hour <= 12) {
      return `${hour}:${minute} ${period}`;
    }
  }

  // ---------------------------------------------------
  // 24-hour format
  // Example: 14:30
  // ---------------------------------------------------

  const twentyFourHourMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})$/);

  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    const minute = Number(twentyFourHourMatch[2]);

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      const period = hour >= 12 ? 'PM' : 'AM';

      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

      return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
    }
  }

  // ---------------------------------------------------
  // Fallback
  // ---------------------------------------------------

  console.warn(`⚠️ Unable to format initiation time: "${trimmedTime}"`);

  return trimmedTime;
};

// =====================================================
// INTERFACE
// =====================================================

interface InitiationEmailOptions {
  fullName: string;
  email: string;
  initiationDate?: Date | string;
  initiationTime?: string;
  initiationVenue?: string;
  initiationInstructions?: string;
}

// =====================================================
// SEND INITIATION CEREMONY EMAIL
// =====================================================

export const sendInitiationEmail = async ({
  fullName,
  email,
  initiationDate,
  initiationTime,
  initiationVenue,
  initiationInstructions,
}: InitiationEmailOptions) => {
  try {
    console.log('======================================');
    console.log('📧 SENDING INITIATION CEREMONY EMAIL');
    console.log(`Recipient: ${email}`);
    console.log(`Name: ${fullName}`);
    console.log(`Raw Date: ${initiationDate}`);
    console.log(`Raw Time: ${initiationTime}`);
    console.log(`Venue: ${initiationVenue}`);
    console.log('======================================');

    // =================================================
    // FORMAT DATE
    // =================================================

    const formattedDate = initiationDate
      ? new Date(initiationDate).toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'To Be Announced';

    // =================================================
    // FORMAT TIME
    // =================================================

    const formattedTime = formatInitiationTime(initiationTime || '');

    // =================================================
    // SEND EMAIL
    // =================================================

    const { data, error } = await resend.emails.send({
      from: 'Iledi Ajangbile <admin@ajangbileheritage.com>',

      to: email,

      subject: 'Your Initiation Ceremony Details',

      html: `

<div style="
  margin:0;
  padding:40px 20px;
  background:#f4f1f8;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    max-width:720px;
    margin:auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 8px 30px rgba(0,0,0,.10);
  ">

    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div style="
      background:linear-gradient(180deg,#4b0082 0%,#32005c 100%);
      padding:40px 25px;
      text-align:center;
    ">

      <img
        src="${CREST_URL}"
        alt="Iledi Ajangbile Crest"
        style="
          width:90px;
          height:auto;
          display:block;
          margin:0 auto 18px;
        "
      />

      <h1 style="
        margin:0;
        color:#ffffff;
        font-size:30px;
        line-height:1.3;
        font-weight:bold;
      ">
        Initiation Ceremony
      </h1>

      <!-- PURPLE DIVIDER LINE -->

      <div style="
        width:80px;
        height:3px;
        background:#b48cff;
        margin:22px auto;
      "></div>

      <!-- ORGANIZATION NAME -->

      <div style="
        color:#b48cff;
        font-size:17px;
        font-weight:bold;
        line-height:1.6;
        max-width:600px;
        margin:auto;
      ">
        Confederation of Ogboni Aborigine Fraternity of Nigeria
      </div>

      <div style="
        color:#ffffff;
        font-size:14px;
        margin-top:8px;
        line-height:1.6;
      ">
        Ogun State Chapter • Iledi Ajangbile
      </div>

    </div>

    <!-- ================================================= -->
    <!-- BODY -->
    <!-- ================================================= -->

    <div style="
      padding:40px 30px;
    ">

      <h2 style="
        color:#4b0082;
        margin-top:0;
        font-size:24px;
      ">
        Dear ${fullName},
      </h2>

      <p style="
        color:#444444;
        font-size:16px;
        line-height:1.9;
      ">
        We are pleased to inform you that your initiation payment
        has been successfully confirmed.
      </p>

      <p style="
        color:#444444;
        font-size:16px;
        line-height:1.9;
      ">
        Your initiation ceremony has now been scheduled.
        Please find your official ceremony details below.
      </p>

      <!-- ================================================= -->
      <!-- CEREMONY DETAILS -->
      <!-- ================================================= -->

      <div style="
        margin-top:35px;
        background:#f8f6fb;
        border-left:6px solid #4b0082;
        padding:25px;
        border-radius:8px;
      ">

        <h2 style="
          margin:0 0 22px;
          color:#4b0082;
          font-size:22px;
        ">
          Initiation Details
        </h2>

        <table style="
          width:100%;
          border-collapse:collapse;
        ">

          <tr>
            <td style="
              padding:12px 0;
              color:#4b0082;
              font-weight:bold;
              width:100px;
              vertical-align:top;
            ">
              Date:
            </td>

            <td style="
              padding:12px 0;
              color:#333333;
              line-height:1.6;
            ">
              ${formattedDate}
            </td>
          </tr>

          <tr>
            <td style="
              padding:12px 0;
              color:#4b0082;
              font-weight:bold;
              width:100px;
              vertical-align:top;
            ">
              Time:
            </td>

            <td style="
              padding:12px 0;
              color:#333333;
              line-height:1.6;
            ">
              ${formattedTime}
            </td>
          </tr>

          <tr>
            <td style="
              padding:12px 0;
              color:#4b0082;
              font-weight:bold;
              width:100px;
              vertical-align:top;
            ">
              Venue:
            </td>

            <td style="
              padding:12px 0;
              color:#333333;
              line-height:1.6;
            ">
              ${initiationVenue || 'To Be Announced'}
            </td>
          </tr>

        </table>

      </div>

      <!-- ================================================= -->
      <!-- INSTRUCTIONS -->
      <!-- ================================================= -->

      <div style="
        margin-top:30px;
        background:#fff8dc;
        border-left:6px solid #b8860b;
        padding:25px;
        border-radius:8px;
      ">

        <h3 style="
          margin-top:0;
          color:#4b0082;
          font-size:20px;
        ">
          Important Instructions
        </h3>

        <p style="
          margin-bottom:0;
          color:#444444;
          font-size:15px;
          line-height:1.9;
          white-space:pre-wrap;
        ">
${initiationInstructions || 'Please follow all instructions provided by the administration.'}
        </p>

      </div>

      <!-- ================================================= -->
      <!-- IMPORTANT NOTICE -->
      <!-- ================================================= -->

      <div style="
        margin-top:30px;
        padding:20px;
        background:#f4f1f8;
        border-radius:8px;
        text-align:center;
      ">

        <p style="
          margin:0;
          color:#4b0082;
          font-size:15px;
          font-weight:bold;
          line-height:1.8;
        ">
          Please arrive at the designated venue on time
          and follow all instructions provided by the administration.
        </p>

      </div>

      <!-- ================================================= -->
      <!-- CLOSING -->
      <!-- ================================================= -->

      <p style="
        margin-top:35px;
        color:#444444;
        font-size:15px;
        line-height:1.9;
      ">
        We look forward to welcoming you into the
        Confederation of Ogboni Aborigine Fraternity of Nigeria.
      </p>

      <p style="
        margin-top:35px;
        color:#444444;
        font-size:15px;
      ">
        Yours faithfully,
      </p>

      <div style="
        margin-top:12px;
      ">

        <div style="
          color:#4b0082;
          font-size:22px;
          font-weight:bold;
          line-height:1.4;
        ">
          Confederation of Ogboni<br>
          Aborigine Fraternity of Nigeria
        </div>

        <div style="
          margin-top:8px;
          color:#555555;
          font-size:16px;
        ">
          Ogun State Chapter
        </div>

        <div style="
          color:#555555;
          font-size:16px;
        ">
          Iledi Ajangbile
        </div>

      </div>

      <hr style="
        border:none;
        border-top:1px solid #dddddd;
        margin:40px 0 25px;
      ">

      <div style="
        text-align:center;
      ">

        <a
          href="https://www.ajangbileheritage.com"
          style="
            display:inline-block;
            background:#4b0082;
            color:#ffffff;
            padding:14px 30px;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Visit Official Website
        </a>

      </div>

      <p style="
        margin-top:30px;
        text-align:center;
        color:#777777;
        font-size:13px;
        line-height:1.7;
      ">
        Ajangbile Heritage<br>
        Confederation of Ogboni Aborigine Fraternity of Nigeria<br>
        Ogun State Chapter • Iledi Ajangbile
      </p>

    </div>

  </div>

</div>

`,
    });

    if (error) {
      console.error('❌ Resend initiation email error:', error);

      throw new Error(error.message);
    }

    console.log('======================================');
    console.log('✅ INITIATION CEREMONY EMAIL SENT');
    console.log(`Recipient: ${email}`);
    console.log(`Formatted Date: ${formattedDate}`);
    console.log(`Formatted Time: ${formattedTime}`);
    console.log('======================================');

    return data;
  } catch (err) {
    console.error('❌ Failed to send initiation ceremony email:');

    console.error(err);

    throw err;
  }
};
