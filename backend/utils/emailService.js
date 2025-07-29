import nodemailer from "nodemailer";

// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email Templates
const emailTemplates = {
  // Welcome email after registration
  welcome: (username) => ({
    subject: "🎉 Welcome to FinMate - Your Financial Journey Starts Here!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; overflow: hidden;">
        <div style="padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0 0 20px 0; font-size: 28px;">Welcome to FinMate! 🚀</h1>
          <p style="font-size: 18px; margin: 0 0 30px 0;">Hi ${username}!</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Congratulations on taking the first step towards better financial management! 
            FinMate is here to help you track your expenses, manage your income, and achieve your financial goals.
          </p>
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #fff;">🌟 What you can do with FinMate:</h3>
            <ul style="text-align: left; padding-left: 20px; margin: 0;">
              <li>📊 Track your income and expenses</li>
              <li>📈 Visualize your financial data with charts</li>
              <li>💰 Manage multiple currencies</li>
              <li>🔒 Secure your account with 2FA</li>
              <li>📱 Access from any device</li>
            </ul>
          </div>
          <p style="font-size: 16px; margin: 20px 0;">
            Start exploring your dashboard and take control of your finances today!
          </p>
          <p style="font-size: 14px; margin: 30px 0 0 0; opacity: 0.8;">
            Happy budgeting! 💼<br>
            The FinMate Team
          </p>
        </div>
      </div>
    `,
  }),

  // Currency update notification
  currencyUpdate: (username, oldCurrency, newCurrency, currencySymbol) => ({
    subject: `💱 Currency Updated - Now using ${newCurrency}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px;">Currency Updated Successfully! 💱</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p style="font-size: 16px; margin: 0 0 20px 0;">Hi ${username},</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Your account currency has been successfully updated from <strong>${oldCurrency}</strong> to <strong>${newCurrency} (${currencySymbol})</strong>.
          </p>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #28a745;">✅ What's Changed:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>All amounts will now display in ${currencySymbol}</li>
              <li>New transactions will use ${newCurrency}</li>
              <li>Reports and charts updated to ${newCurrency}</li>
            </ul>
          </div>
          <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
            If you didn't make this change, please contact our support team immediately.
          </p>
        </div>
      </div>
    `,
  }),

  // 2FA enabled notification
  twoFactorEnabled: (username) => ({
    subject: "🔒 Two-Factor Authentication Enabled - Account More Secure!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px;">🔒 2FA Enabled Successfully!</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p style="font-size: 16px; margin: 0 0 20px 0;">Hi ${username},</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Great news! Two-Factor Authentication (2FA) has been successfully enabled on your FinMate account.
          </p>
          <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #6f42c1; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #6f42c1;">🛡️ Your Account is Now More Secure:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Extra layer of protection for your financial data</li>
              <li>Authentication codes required for login</li>
              <li>Backup codes saved for emergency access</li>
            </ul>
          </div>
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>Important:</strong> Keep your backup codes in a safe place. You'll need them if you lose access to your authenticator app.
            </p>
          </div>
          <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
            If you didn't enable 2FA, please contact our support team immediately.
          </p>
        </div>
      </div>
    `,
  }),

  // Password reset notification
  passwordReset: (username) => ({
    subject: "🔑 Password Reset Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #fd7e14 0%, #e83e8c 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px;">🔑 Password Reset Successful</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p style="font-size: 16px; margin: 0 0 20px 0;">Hi ${username},</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Your password has been successfully reset. You can now log in to your FinMate account with your new password.
          </p>
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #856404;">🔐 Security Tips:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Use a strong, unique password</li>
              <li>Don't share your password with anyone</li>
              <li>Consider enabling 2FA for extra security</li>
              <li>Log out from shared devices</li>
            </ul>
          </div>
          <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
            If you didn't reset your password, please contact our support team immediately.
          </p>
        </div>
      </div>
    `,
  }),

  // Profile update notification
  profileUpdate: (username, updatedFields) => ({
    subject: "👤 Profile Updated Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #17a2b8 0%, #6610f2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px;">👤 Profile Updated!</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p style="font-size: 16px; margin: 0 0 20px 0;">Hi ${username},</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Your profile has been successfully updated with the following changes:
          </p>
          <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #17a2b8;">📝 Updated Fields:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${updatedFields.map((field) => `<li>${field}</li>`).join("")}
            </ul>
          </div>
          <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
            If you didn't make these changes, please contact our support team immediately.
          </p>
        </div>
      </div>
    `,
  }),

  // Monthly financial summary
  monthlySummary: (username, data) => ({
    subject: `📊 Your ${data.month} Financial Summary - FinMate`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #495057 0%, #6c757d 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px;">📊 Monthly Financial Summary</h1>
          <p style="margin: 0; font-size: 18px;">${data.month} ${data.year}</p>
        </div>
        <div style="padding: 30px; color: #333;">
          <p style="font-size: 16px; margin: 0 0 20px 0;">Hi ${username},</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Here's your financial summary for ${data.month}:
          </p>
          
          <div style="display: flex; gap: 15px; margin: 20px 0;">
            <div style="flex: 1; background: #d4edda; padding: 15px; border-radius: 8px; text-align: center;">
              <h4 style="margin: 0 0 5px 0; color: #155724;">💰 Total Income</h4>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: #155724;">${
                data.currencySymbol
              }${data.totalIncome}</p>
            </div>
            <div style="flex: 1; background: #f8d7da; padding: 15px; border-radius: 8px; text-align: center;">
              <h4 style="margin: 0 0 5px 0; color: #721c24;">💸 Total Expenses</h4>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: #721c24;">${
                data.currencySymbol
              }${data.totalExpenses}</p>
            </div>
          </div>
          
          <div style="background: ${
            data.balance >= 0 ? "#d1ecf1" : "#f8d7da"
          }; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: ${
              data.balance >= 0 ? "#0c5460" : "#721c24"
            };">
              💼 Net Balance: ${data.currencySymbol}${data.balance}
            </h3>
            <p style="margin: 0; color: ${
              data.balance >= 0 ? "#0c5460" : "#721c24"
            };">
              ${
                data.balance >= 0
                  ? "🎉 Great job! You saved money this month!"
                  : "⚠️ You spent more than you earned this month."
              }
            </p>
          </div>

          <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #495057;">📈 Quick Stats:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Number of transactions: ${data.transactionCount}</li>
              <li>Highest expense: ${data.currencySymbol}${
      data.highestExpense
    }</li>
              <li>Most used category: ${data.topCategory}</li>
            </ul>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center; margin: 20px 0 0 0;">
            Keep up the great work with FinMate! 🚀
          </p>
        </div>
      </div>
    `,
  }),

  // Security alert
  securityAlert: (username, alertType, details) => ({
    subject: `🚨 Security Alert - ${alertType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px;">🚨 Security Alert</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p style="font-size: 16px; margin: 0 0 20px 0;">Hi ${username},</p>
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #721c24;">⚠️ ${alertType}</h3>
            <p style="margin: 0; color: #721c24;">${details}</p>
          </div>
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>What you should do:</strong><br>
              1. Review your recent account activity<br>
              2. Change your password if needed<br>
              3. Enable 2FA for extra security<br>
              4. Contact support if you notice anything suspicious
            </p>
          </div>
        </div>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async (to, emailType, data = {}) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[emailType];

    if (!template) {
      throw new Error(`Email template '${emailType}' not found`);
    }

    const emailContent =
      typeof template === "function"
        ? template(...Object.values(data))
        : template;

    const mailOptions = {
      from: `"FinMate" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}: ${emailContent.subject}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// Bulk email function for notifications
export const sendBulkEmails = async (emailList) => {
  const results = [];

  for (const emailData of emailList) {
    const result = await sendEmail(
      emailData.to,
      emailData.type,
      emailData.data
    );
    results.push({ ...emailData, result });

    // Add delay between emails to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
};

// Schedule monthly summary emails (can be used with cron jobs)
export const scheduleMonthlyEmails = async () => {
  // This function would be called by a cron job
  // Implementation would involve:
  // 1. Get all users
  // 2. Calculate their monthly summary
  // 3. Send summary emails
  console.log(
    "Monthly email scheduling functionality - to be implemented with cron jobs"
  );
};

export default {
  sendEmail,
  sendBulkEmails,
  scheduleMonthlyEmails,
  emailTemplates,
};
