import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
// import { type AuthOptions } from "next-auth/core/types";
import { db } from "./db";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt"


export const authOptions: NextAuthConfig = {
    adapter: PrismaAdapter(db),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                loginValue: { label: "Email or Phone Number", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (
                    !credentials ||
                    typeof credentials.loginValue !== "string" ||
                    typeof credentials.password !== "string"
                ) {
                    return null;
                }

                const { loginValue, password } = credentials;

                // Find user by email or phone number
                const user = await db.user.findFirst({
                    where: {
                        OR: [
                            { email: loginValue },
                            { phoneNumber: loginValue },
                        ]
                    }
                });

                if (!user || !user.hashedPassword) {
                    throw new Error("Invalid credentials");
                };

                // Check if email/phone is verified
                // const isEmail = loginValue.includes("@");
                // if (isEmail && !user.emailVerified) {
                //     throw new Error("Please verify your email before signing in");
                // }
                // if (!isEmail && !user.phoneNumberVerified) {
                //     throw new Error("Please verify your phone number before signing in");
                // }

                const isValid = await bcrypt.compare(password, user.hashedPassword);
                if (!isValid) return null;

                return user;
            }

        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
        verifyRequest: "/verify-request",
    }, 
    callbacks: {
        // async signIn({ user, account }) {
        //     // For OAuth providers (Google), automatically verify email
        //     if (account?.provider === "google" && user.email) {
        //         await db.user.update({
        //             where: { id: user.id },
        //             data: { emailVerified: new Date() }
        //         });
        //     }
        //     return true;
        // },
        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.sub as string;
                
            }

            if (!session.user?.id) {
                return session;
            }

            const  userData = await db.user.findUnique({
                where: {
                    id: session.user.id,
                },
                select: {
                    id: true,
                    phoneNumber: true,
                    email: true,
                    name: true,
                    role: true,
                    Service: {
                        select: {
                            id: true,
                            businessType: true,
                        }
                    },
                    Supplier: {
                        select: {
                            id: true
                        }
                    },
                }
            })

            const isAdmin = session.user.email === process.env.ADMIN_EMAIL;

            return {
                ...session,
                user: {
                    ...session.user,
                    phoneNumber: userData?.phoneNumber,
                    serviceId: userData?.Service?.id, 
                    supplierId: userData?.Supplier?.id, 
                    isAdmin,
                    role: userData?.role,
                    businessType: userData?.Service?.businessType
                }
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    events: {
        async linkAccount({ user, account }) {
            // For OAuth providers (Google), automatically verify email
            if (account.provider === "google" && user.email) {
                await db.user.update({
                    where: { id: user.id },
                    data: { emailVerified: new Date() }
                });
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}


export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);