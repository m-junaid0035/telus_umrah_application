import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "03104676590umary@gmail.com",
      pass: "tkddvduqxtmpskhe",
    },
  });

  // URL encode the token to handle special characters
  const encodedToken = encodeURIComponent(resetToken);
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${encodedToken}`;

  const mailOptions = {
    from: `"Telus Umrah" <03104676590umary@gmail.com>`,
    to,
    subject: "Password Reset Request - Telus Umrah",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Roboto', Helvetica, Arial, Tahoma, sans-serif; margin: 0; padding: 0; background-color: #f0f0f0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; width: 100% !important; height: 100% !important; margin: 0; padding: 0; background-color: #f0f0f0;">
    <tr>
      <td align="center" valign="top" style="padding: 20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" valign="top" style="background: linear-gradient(135deg, #2563eb 0%, #059669 100%); padding: 30px 20px;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0;">Password Reset Request</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td align="left" valign="top" style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello,
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  You requested to reset your password for your Telus Umrah account. Click the button below to reset your password:
              </p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #2563eb; font-size: 14px; line-height: 1.6; margin: 10px 0; word-break: break-all;">
                ${resetUrl}
              </p>

              <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <strong>Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" valign="top" style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 12px; line-height: 1.6; margin: 0;">
                This email was sent to <a href="mailto:${to}" style="color: #2563eb; text-decoration: none;">${to}</a>
              </p>
              <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 10px 0 0 0;">
                Please do not reply to this email. If you have any questions, please contact our support team.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw new Error("Error sending password reset email");
  }
}

