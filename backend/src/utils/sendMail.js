import transporter from "../config/mailConfig.js";
import logger from "../utils/logger.js";

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Uptech-Z"',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    // Safe fallback so workflow isn't blocked in dev mode
    return { success: false, error: error.message };
  }
};

export default sendMail;
