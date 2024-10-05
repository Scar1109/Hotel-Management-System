const nodemailer = require('nodemailer');

// Email setup with Gmail configuration
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use true for 465 port and SSL
    auth: {
        user: process.env.GMAIL_EMAIL,  // Email address from environment variable (.env)
        pass: process.env.GMAIL_PASSWORD,  // Gmail password or App Password (if 2FA is enabled)
    },
});

// EmailService class to handle sending emails
class EmailService {
    /**
     * Sends a reminder email to the user with event details.
     * @param {string} userEmail - The recipient email address.
     * @param {Object} event - The event object containing event details.
     */
    static async sendReminderEmail(userEmail, event) {
        try {
            // Format the event date for better readability in the email
            const eventDateFormatted = new Date(event.eventDate).toLocaleString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            });

            // Set up email options
            const mailOptions = {
                from: `"Event Reminder" <${process.env.GMAIL_EMAIL}>`, // Sender email (from your .env)
                to: userEmail, // Recipient email (user)
                subject: `Reminder: ${event.eventName} is Coming Up!`, // Custom subject line with event name
                text: `Hello,\n\nDon't forget! The event "${event.eventName}" is happening on ${eventDateFormatted}. Make sure to mark your calendar!\n\nThank you.`, // Plain text body
            };

            // Send the email
            const info = await transporter.sendMail(mailOptions);

            // Log a success message to the console
            console.log(`Reminder email successfully sent to ${userEmail}: ${info.response}`);
        } catch (error) {
            // Log any error that occurs during the email sending process
            console.error(`Error sending reminder email to ${userEmail}: `, error);
        }
    }
}

module.exports = EmailService;
