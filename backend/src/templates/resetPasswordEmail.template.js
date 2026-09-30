export const getResetPasswordEmailTemplate = (resetUrl) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password - UpTech-Z</title>
</head>
<body style="margin: 0; padding: 0; background-color: #EEF2F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#EEF2F6" style="background-color: #EEF2F6; padding: 40px 15px;">
    <tr>
      <td align="center">

        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="max-width: 520px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0;">
          
          <!-- Branded Header -->
          <tr>
            <td align="center" bgcolor="#5825D1" style="background-color: #5825D1; padding: 36px 20px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">UpTech-Z</h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #E9D5FF; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">Learn Without Limits</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px 24px 32px; text-align: center;">
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #1E293B;">Password Reset Request</h2>
              <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 24px; color: #64748B;">
                We received a request to reset your password. Click the button below to choose a new password:
              </p>

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 28px auto;">
                <tr>
                  <td align="center" bgcolor="#5825D1" style="border-radius: 8px;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFBEB" style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; text-align: left;">
                    <p style="margin: 0; font-size: 13px; line-height: 18px; color: #92400E;">
                      ⏱️ <strong>This link is valid for 15 minutes only.</strong> If you did not request a password reset, please ignore this email or contact support if you suspect unauthorized access.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94A3B8; word-break: break-all;">
                Button not working? Copy and paste this link into your browser:<br />
                <a href="${resetUrl}" style="color: #5825D1; text-decoration: underline;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAFAFC" style="padding: 20px 32px 28px 32px; text-align: center; background-color: #FAFAFC; border-top: 1px solid #F1F5F9;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #64748B;">UpTech-Z Learning Platform</p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">This is an automated security message. Please do not reply directly.</p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
