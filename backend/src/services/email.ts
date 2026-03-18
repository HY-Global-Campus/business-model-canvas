import nodemailer from 'nodemailer';
import config from '../config.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // In production, use proper SMTP configuration
    // For development, use console logging
    if (config.NODE_ENV === 'development') {
      console.log('=== EMAIL SENT (DEV MODE) ===');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('HTML Content:', options.html);
      console.log('Text Content:', options.text || 'N/A');
      console.log('================================');
      return;
    }

    // Production email configuration
    const transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE === 'true',
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: config.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendPasswordResetEmail = async (email: string, resetLink: string): Promise<void> => {
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password for your Business Model Canvas account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="
          background-color: #4CAF50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
        ">Reset Password</a>
      </div>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p>Best regards,<br/>The Business Model Canvas Team</p>
    </div>
  `;
  
  const text = `
    Password Reset Request
    
    Hello,
    
    We received a request to reset your password for your Business Model Canvas account.
    
    Click the link below to reset your password:
    ${resetLink}
    
    If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    
    This link will expire in 1 hour for security reasons.
    
    Best regards,
    The Business Model Canvas Team
  `;

  await sendEmail({ to: email, subject, html, text });
};