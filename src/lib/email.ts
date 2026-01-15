
import { Resend } from 'resend';

export async function sendVerificationEmail(email: string, code: string) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: email,
        subject: 'Verify your email',
        html: `
            <h1>Email Verification</h1>
            <p>Your verification code is: <strong>${code}</strong></p>
            <p>This code will expire in 15 minutes.</p>
        `
    });
    
    // For development, just log it
    console.log(`Verification email sent to ${email}: ${code}`);
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: email,
        subject: 'Reset your password',
        html: `
            <h1>Password Reset</h1>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `
    });
    
    console.log(`Password reset email sent to ${email}: ${resetUrl}`);
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