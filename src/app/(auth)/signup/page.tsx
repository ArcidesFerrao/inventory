"use client";

import { UserRole } from "@/generated/prisma";
// import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
      },
      body: JSON.stringify({ name, email, password, phonenumber, role }),
    });

    if (res.ok) {
      setLoading(false);
      router.push("/");
      // await signIn("credentials", {
      //   email,
      //   password,
      //   phonenumber,
      //   redirect: true,
      //   callbackUrl: "/",
      // });
    } else {
      const data = await res.json();
      setError(data.message || "Failed to sign up");
      setLoading(false);
    }
  };
  return (
    <form className="signup-form flex flex-col gap-4 " onSubmit={handleSubmit}>
      <h1 className="text-2xl text-center">Create Account</h1>
      {error && <p>{error}</p>}
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        name="role"
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
      >
        <option value="" disabled>
          Pick a role:
        </option>
        <option value="SERVICE">Service</option>
        <option value="SUPPLIER">Supplier</option>
        <option value="MANAGER">Manager</option>
        <option value="ADMIN">Admin</option>
      </select>

      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="phonenumber"
        name="phonenumber"
        id="phonenumber"
        placeholder="Phone Number..."
        value={phonenumber}
        onChange={(e) => setPhonenumber(e.target.value.toString())}
      />
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input type="submit" value={loading ? "Signing Up..." : "Sign Up"} />
      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </form>
  );
}
