import nodemailer from 'nodemailer';

// Simple Astro endpoint using ESM
export async function post({ request }) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ success: false, error: 'Missing fields' }), { status: 400 });
    }

    // create transporter using environment vars
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nouveau message de ${name} via Portfolio`,
      replyTo: email,
      text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Nom:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Contact API error:', err);
    return new Response(JSON.stringify({ success: false, error: (err && err.message) || 'Unknown' }), { status: 500 });
  }
}
