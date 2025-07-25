"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //   const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } else {
      const data = await res.json();
      setError(data.message || "Failed to sign up");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      {error && <p>{error}</p>}
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input type="submit" value="Sign Up" />
      <p>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </form>
  );
}
