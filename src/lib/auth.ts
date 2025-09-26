import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { db } from "./db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                loginValue: { label: "Email or Phone Number", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.loginValue || !credentials.password) return null

                const user = await db.user.findFirst({
                    where: {
                        OR: [{ email: credentials.loginValue },
                            { phoneNumber: credentials.loginValue}
                        ]}
                })

                if (!user || !user.hashedPassword) return null

                const isValid = await bcrypt.compare(
                    credentials.password, 
                    user.hashedPassword
                );

                if (!isValid) return null

                return user
            },
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
            const service = await db.service.findUnique({
                where: {
                    userId: session.user.id
                },
                select: {
                    id: true,
                }
            })
            const supplier = await db.supplier.findUnique({
                where: {
                    userId: session.user.id
                },
                select: {
                    id: true,
                }
            })
            return {
                ...session,
                user: {
                    ...session.user,
                    serviceId: service?.id, 
                    supplierId: supplier?.id 
                }
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}