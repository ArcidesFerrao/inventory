import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
// import { type AuthOptions } from "next-auth/core/types";
import { db } from "./db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt"


export const authOptions: NextAuthConfig = {
    adapter: PrismaAdapter(db),
    providers: [
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

                const user = await db.user.findFirst({
                    where: {
                        OR: [
                            { email: loginValue },
                            { phoneNumber: loginValue },
                        ]
                    }
                });

                if (!user || !user.hashedPassword) return null;

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
    }, 
    callbacks: {
        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.sub as string;
                
            }
            const  userData = await db.user.findUnique({
                where: {
                    id: session.user.id,
                },
                select: {
                    id: true,
                    phoneNumber: true,
                    Service: {
                        select: {
                            id: true
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
                    isAdmin
                }
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}


export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);