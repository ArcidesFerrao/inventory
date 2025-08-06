"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log(email, password);

    if (res?.error) {
      setError("Invalid email or password:");
    } else {
      setError("");
      router.push("/dashboard");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
      <h1 className="text-2xl text-center">Login</h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="emaiil"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <input type="submit" value="Sign In" />
      {error && <p>{error}</p>}
      <p>
        Dont have an account? <Link href="/signup">Create an account</Link>
      </p>
    </form>
  );
}
