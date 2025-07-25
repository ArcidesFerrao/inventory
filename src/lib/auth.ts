import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { db } from "./db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt"


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) return null

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.hashedPassword) return null

                const isValid = await bcrypt.compare(credentials.password, user.hashedPassword)

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
                session.user.id = token.id as string
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}