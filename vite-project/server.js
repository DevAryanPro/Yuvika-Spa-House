// Nodemailer transporter setup
// IMPORTANT: Store your email credentials in a .env file for security
// .env file example:
// EMAIL_USER=your-email@example.com
// EMAIL_PASS=your-app-password
// OWNER_EMAIL=myemail@example.com (the email address to send feedback to)

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email provider e.g., 'outlook', 'yahoo'
  auth: {
    user: process.env.EMAIL_USER, // Your email address from .env
    pass: process.env.EMAIL_PASS, // Your email app password from .env
  },
});

// API endpoint to handle feedback submission
app.post('/api/send-feedback', async (req, res) => {
  const { fullName, email, subject, message } = req.body;

  if (!fullName || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (your system's email)
    to: process.env.OWNER_EMAIL, // List of receivers (your email address)
    subject: `New Feedback Submission: ${subject}`, // Subject line
    html: `
      <h3>New Feedback Received</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Feedback email sent successfully');
    res.status(200).json({ success: true, message: 'Feedback submitted and email sent successfully!' });
  } catch (error) {
    console.error('Error sending feedback email:', error);
    res.status(500).json({ error: 'Failed to send feedback email.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
