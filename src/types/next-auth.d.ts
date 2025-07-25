// types/next-auth.d.ts (or just next-auth.d.ts in your root)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    hashedPassword?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
