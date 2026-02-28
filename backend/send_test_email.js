import 'dotenv/config';
import { sendVerificationEmail } from './src/lib/emailService.js';

(async () => {
    try {
        await sendVerificationEmail('your-test-email@gmail.com', 'Test User', 'test-token', 'http://localhost');
        console.log('Test email sent successfully');
    } catch (err) {
        console.error('Error sending test email:', err);
    }
})();
