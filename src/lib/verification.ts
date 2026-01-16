import { db } from "./db";
import crypto from "crypto";

// Generate a random 6-digit code
export function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a secure token for password reset
export function generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

// Create email verification token
export async function createEmailVerificationToken(email: string, userId?: string) {
    const token = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing tokens for this email
    await db.verificationToken.deleteMany({
        where: { identifier: email, type: "email" }
    });

    // Create new token
    const verificationToken = await db.verificationToken.create({
        data: {
            identifier: email,
            token,
            type: "email",
            expires,
            userId
        }
    });

    return verificationToken;
}

// Create phone verification token
export async function createPhoneVerificationToken(phoneNumber: string, userId?: string) {
    const token = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing tokens for this phone
    await db.verificationToken.deleteMany({
        where: { identifier: phoneNumber, type: "phone" }
    });

    // Create new token
    const verificationToken = await db.verificationToken.create({
        data: {
            identifier: phoneNumber,
            token,
            type: "phone",
            expires,
            userId
        }
    });

    return verificationToken;
}

// Verify email token
export async function verifyEmailToken(email: string, token: string) {
    const verificationToken = await db.verificationToken.findFirst({
        where: {
            identifier: email,
            token,
            type: "email"
        }
    });

    if (!verificationToken) {
        throw new Error("Invalid verification code");
    }

    if (new Date() > verificationToken.expires) {
        throw new Error("Verification code has expired");
    }

    // Mark email as verified
    await db.user.update({
        where: { email },
        data: { emailVerified: new Date() }
    });

    // Delete the used token
    await db.verificationToken.delete({
        where: { id: verificationToken.id }
    });

    return true;
}

// Verify phone token
export async function verifyPhoneToken(phoneNumber: string, token: string) {
    const verificationToken = await db.verificationToken.findFirst({
        where: {
            identifier: phoneNumber,
            token,
            type: "phone"
        }
    });

    if (!verificationToken) {
        throw new Error("Invalid verification code");
    }

    if (new Date() > verificationToken.expires) {
        throw new Error("Verification code has expired");
    }

    // Mark phone as verified
    await db.user.update({
        where: { phoneNumber },
        data: { phoneNumberVerified: true }
    });

    // Delete the used token
    await db.verificationToken.delete({
        where: { id: verificationToken.id }
    });

    return true;
}

// Create password reset token
export async function createPasswordResetToken(email: string) {
    const user = await db.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const token = generateSecureToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Delete any existing tokens
    await db.passwordResetToken.deleteMany({
        where: { email }
    });

    // Create new token
    const resetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
            userId: user.id
        }
    });

    return resetToken;
}

// Verify password reset token
export async function verifyPasswordResetToken(token: string) {
    const resetToken = await db.passwordResetToken.findUnique({
        where: { token }
    });

    if (!resetToken) {
        throw new Error("Invalid reset token");
    }

    if (new Date() > resetToken.expires) {
        throw new Error("Reset token has expired");
    }

    return resetToken;
}

// Reset password
export async function resetPassword(token: string, newPassword: string) {
    const resetToken = await verifyPasswordResetToken(token);
    
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
        where: { id: resetToken.userId },
        data: { hashedPassword }
    });

    // Delete the used token
    await db.passwordResetToken.delete({
        where: { id: resetToken.id }
    });

    return true;
}