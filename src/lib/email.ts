// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DEV_EMAIL = process.env.DEV_EMAIL || 'cidesferrao@gamil.com'; // Your email for testing

export async function sendVerificationEmail(email: string, code: string) {
    if (!IS_PRODUCTION) {
        // Development mode - just log to console
        console.log('═══════════════════════════════════════');
        console.log('📧 VERIFICATION EMAIL');
        console.log('To:', email);
        console.log('Code:', code);
        console.log('═══════════════════════════════════════');
        return;
    }

    // Production mode - send real email
    try {
        await resend.emails.send({
            from: DEV_EMAIL, // Change this when you have a domain
            to: email,
            subject: 'Verify your email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Email Verification</h1>
                    <p>Your verification code is:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p>This code will expire in 15 minutes.</p>
                    <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Failed to send verification email:', error);
        // Fallback to console in case of error
        console.log(`Verification code for ${email}: ${code}`);
    }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
    if (!IS_PRODUCTION) {
        console.log('═══════════════════════════════════════');
        console.log('🔑 PASSWORD RESET EMAIL');
        console.log('To:', email);
        console.log('Reset URL:', resetUrl);
        console.log('═══════════════════════════════════════');
        return;
    }

    try {
        await resend.emails.send({
            from: DEV_EMAIL,
            to: email,
            subject: 'Reset your password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Password Reset</h1>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>Or copy and paste this link:</p>
                    <p style="background: #f4f4f4; padding: 10px; word-break: break-all;">${resetUrl}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        console.log(`Password reset URL for ${email}: ${resetUrl}`);
    }
}

// Validation utilities
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{8,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function formatPhoneNumber(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
}