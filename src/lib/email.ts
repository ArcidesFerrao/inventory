
import { Resend } from 'resend';

export async function sendVerificationEmail(email: string, code: string) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Domínio padrão do Resend
            to: email,
            subject: 'Verify your email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Email Verification</h1>
                    <p>Your verification code is:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p style="color: #666;">This code will expire in 15 minutes.</p>
                    <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        });
        console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
        console.error('❌ Failed to send verification email:', error);
        throw new Error('Failed to send verification email');
    }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Domínio padrão do Resend
            to: 'delivered@resend.dev', // Substitua pelo email do destinatário
            subject: 'Reset your password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Password Reset</h1>
                    <p>You requested to reset your password. Click the button below to continue:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background: #0070f3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #666;">Or copy and paste this link:</p>
                    <p style="background: #f4f4f4; padding: 10px; word-break: break-all; font-size: 12px;">
                        ${resetUrl}
                    </p>
                    <p style="color: #666;">This link will expire in 1 hour.</p>
                    <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email. ${email}</p>
                </div>
            `
        });
        console.log(`✅ Password reset email sent to ${email}`);
    } catch (error) {
        console.error('❌ Failed to send password reset email:', error);
        throw new Error('Failed to send password reset email');
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