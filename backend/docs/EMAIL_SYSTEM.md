# FinMate Email System 📧

A comprehensive email notification system for FinMate application that keeps users informed about important account activities and provides monthly financial summaries.

## Features

### 🎉 Automated Email Notifications

- **Welcome Email**: Sent when new users register
- **Currency Update**: Notifies users when they change their preferred currency
- **2FA Enabled**: Confirms when two-factor authentication is activated
- **Password Reset**: Confirmation when password is successfully changed
- **Profile Update**: Alerts when account details are modified
- **Security Alerts**: Warnings for suspicious activities

### 📊 Monthly Financial Summary

- **Automated Monthly Reports**: Sent on 1st of every month at 9:00 AM IST
- **Financial Overview**: Income, expenses, balance, and insights
- **Transaction Analytics**: Most used categories, highest expenses
- **Currency-aware**: Shows amounts in user's preferred currency

## Email Templates

### 1. Welcome Email

- **Trigger**: User registration
- **Content**: Welcome message, feature overview, getting started tips
- **Design**: Modern gradient design with FinMate branding

### 2. Currency Update Notification

- **Trigger**: Currency preference change
- **Content**: Old vs new currency, what's changed, security notice
- **Data**: Currency symbols, country information

### 3. Two-Factor Authentication

- **Trigger**: 2FA activation
- **Content**: Security confirmation, backup codes reminder
- **Security**: Alerts if user didn't enable 2FA

### 4. Password Reset Confirmation

- **Trigger**: Password change
- **Content**: Confirmation message, security tips
- **Security**: Contact support if unauthorized

### 5. Profile Update Alert

- **Trigger**: Username or email change
- **Content**: List of updated fields
- **Security**: Immediate action required if unauthorized

### 6. Monthly Financial Summary

- **Trigger**: 1st of every month (automated)
- **Content**:
  - Total income and expenses
  - Net balance with visual indicators
  - Transaction count and analytics
  - Highest expense and top category
  - Motivational messages based on performance

### 7. Security Alerts

- **Trigger**: Suspicious activities
- **Content**: Alert type, details, recommended actions
- **Urgency**: High priority styling and immediate action items

## Technical Implementation

### Email Service (`emailService.js`)

```javascript
// Send individual email
await sendEmail(userEmail, 'welcome', { username: 'John' });

// Send bulk emails
await sendBulkEmails([
  { to: 'user1@email.com', type: 'welcome', data: { username: 'User1' } },
  { to: 'user2@email.com', type: 'currencyUpdate', data: { ... } }
]);
```

### Email Controller (`emailController.js`)

- **Monthly Summary Calculation**: Aggregates user's financial data
- **Cron Job Management**: Scheduled email sending
- **Test Email Functionality**: For development and testing
- **Security Alert System**: Automated threat notifications

### Cron Jobs

- **Monthly Summary**: `0 9 1 * *` (1st of month, 9:00 AM IST)
- **Future**: Can add weekly summaries, reminders, etc.

## API Endpoints

### POST `/api/v1/emails/test-email`

Test email sending functionality

```json
{
  "email": "test@example.com",
  "type": "welcome"
}
```

### POST `/api/v1/emails/trigger-monthly-summary`

Manually trigger monthly summary emails (requires authentication)

## Environment Variables

Add these to your `.env` file:

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

**Note**: Use Gmail App Password, not regular password

## Email Template Customization

All email templates are in `emailService.js` with:

- **Responsive Design**: Works on all devices
- **Dark Mode Support**: Automatic dark/light theme detection
- **Brand Consistency**: FinMate colors and styling
- **Accessibility**: Proper contrast and readable fonts

## Security Features

- **Rate Limiting**: Delays between bulk emails to avoid spam
- **Data Validation**: Ensures user data integrity
- **Privacy Protection**: No sensitive data in email logs
- **Fallback Handling**: System continues if email fails

## Usage Examples

### User Registration (Automatic)

```javascript
// In userController.js
await sendEmail(email, "welcome", { username });
```

### Currency Update (Automatic)

```javascript
// In userController.js
await sendEmail(user.email, "currencyUpdate", {
  username: user.username,
  oldCurrency: "USD",
  newCurrency: "INR",
  currencySymbol: "₹",
});
```

### Manual Testing

```bash
curl -X POST http://localhost:5000/api/v1/emails/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "type": "welcome"}'
```

## Monitoring and Logs

- **Success Logs**: Email sent confirmations with message IDs
- **Error Logs**: Failed email attempts with detailed errors
- **Performance Tracking**: Bulk email processing statistics
- **User Activity**: Email sending triggered by user actions

## Future Enhancements

### 🚀 Planned Features

- **Weekly Financial Reports**: Optional weekly summaries
- **Budget Alerts**: Notifications when spending limits are reached
- **Goal Tracking**: Progress updates on financial goals
- **Expense Categories**: Insights on spending patterns
- **Multi-language Support**: Emails in user's preferred language
- **Email Preferences**: User control over notification types
- **Rich Analytics**: Advanced financial insights and recommendations

### 📈 Scalability

- **Queue System**: Redis-based email queue for high volume
- **Template Engine**: More sophisticated templating system
- **A/B Testing**: Different email versions for optimization
- **Analytics Integration**: Email open rates and engagement tracking

## Troubleshooting

### Common Issues

1. **Emails not sending**

   - Check EMAIL_USER and EMAIL_PASS in .env
   - Verify Gmail App Password is correct
   - Check network connectivity

2. **Cron jobs not running**

   - Verify server timezone settings
   - Check cron job initialization in app.js
   - Review server logs for cron errors

3. **Template rendering issues**
   - Validate data being passed to templates
   - Check for missing required fields
   - Test with different email clients

### Debug Mode

Enable detailed logging:

```javascript
console.log("Email data:", data);
console.log("Template result:", emailContent);
```

## Contributing

When adding new email types:

1. Create template in `emailTemplates` object
2. Add template data structure documentation
3. Update test data in `testEmail` function
4. Add usage examples in controller files
5. Update this README with new email type

## Support

For email system issues:

- Check server logs for detailed error messages
- Test email functionality with `/test-email` endpoint
- Verify all environment variables are set correctly
- Contact system administrator for SMTP configuration issues
