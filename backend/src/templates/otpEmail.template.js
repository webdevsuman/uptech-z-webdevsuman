export const getOtpEmailTemplate = (otp) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email - UpTech-Z</title>
</head>
<body style="margin: 0; padding: 0; background-color: #EEF2F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <!-- Outer Background Table -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#EEF2F6" style="background-color: #EEF2F6; padding: 40px 15px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="max-width: 520px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0;">
          
          <!-- Branded Solid Purple Header -->
          <tr>
            <td align="center" bgcolor="#5825D1" style="background-color: #5825D1; padding: 36px 20px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      UpTech-Z
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 12px; color: #E9D5FF; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">
                      Learn Without Limits
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 36px 32px 24px 32px; text-align: center;">
              
              <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #1E293B;">
                Verify Your Account
              </h2>
              <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 24px; color: #64748B;">
                Welcome to <strong style="color: #0F172A;">UpTech-Z</strong>! To finalize your registration and start learning, please use the verification code below:
              </p>

              <!-- OTP Code Display Card -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 28px auto;">
                <tr>
                  <td align="center" bgcolor="#F5F3FF" style="background-color: #F5F3FF; border: 2px dashed #8B5CF6; border-radius: 12px; padding: 16px 32px;">
                    <span style="font-size: 34px; font-weight: 800; color: #5825D1; letter-spacing: 10px; font-family: 'Courier New', Courier, monospace; display: inline-block; margin-left: 10px;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFBEB" style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; text-align: left;">
                    <p style="margin: 0; font-size: 13px; line-height: 18px; color: #92400E;">
                      ⏱️ <strong>Valid for 5 minutes only.</strong> Do not share this code with anyone. UpTech-Z will never ask for your verification code.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #94A3B8;">
                If you did not attempt to sign up for UpTech-Z, please ignore this email.
              </p>

            </td>
          </tr>

          <!-- Subtle Divider Line -->
          <tr>
            <td style="padding: 0 32px;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top: 1px solid #F1F5F9; height: 1px;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#FAFAFC" style="padding: 20px 32px 28px 32px; text-align: center; background-color: #FAFAFC;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #64748B;">
                UpTech-Z Learning Platform
              </p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                This is an automated security message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Card Container -->

      </td>
    </tr>
  </table>

</body>
</html>
`;
