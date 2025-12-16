"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (session?.user && status === "authenticated") {
      if (session?.user.role === "SERVICE") {
        router.push("/service");
      } else if (session?.user.role === "SUPPLIER") {
        router.push("/supply");
      } else if (session?.user.isAdmin) {
        router.push("/");
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      loginValue,
      password,
    });
    // console.log(loginValue, password);

    if (res?.error !== null) {
      console.error(res.error);
      setError(res?.error ?? "");
      setLoading(false);
    } else {
      setError("");
      if (session?.user.role === "SERVICE") {
        setLoading(false);
        router.push("/service");
      } else if (session?.user.role === "SUPPLIER") {
        setLoading(false);
        router.push("/supply");
      } else if (session?.user.isAdmin) {
        setLoading(false);
        router.push("/");
      }
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  return (
    <form onSubmit={handleSubmit} className="login-form flex flex-col gap-4 ">
      <h1 className="text-2xl text-center">Login</h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email/PhoneNumber</label>
        <input
          type="text"
          name="loginValue"
          id="loginValue"
          placeholder="Email or Phone Number"
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
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
      <input type="submit" value={loading ? "Signing in..." : "Sign In"} />
      {error && (
        <>
          {error === "CredentialsSignin" ? (
            // {error === "CredentialsSignIn" ? (
            <p className="text-red-500">Invalid Password or Email.</p>
          ) : (
            <p>{error}</p>
          )}
        </>
      )}
      <p>
        Dont have an account? <Link href="/signup">Create an account</Link>
      </p>
    </form>
  );
}
