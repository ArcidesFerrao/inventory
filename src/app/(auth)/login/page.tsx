"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  // const { data: session, status } = useSession();
  const sessionHook = useSession();
  const session = sessionHook.data;
  const status = sessionHook.status;

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
      } else if (session?.user.isAdmin || session?.user.role === "USER") {
        router.push("/");
      }
    }
  }, [session, status, router]);
  if (!sessionHook) return null;

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
      if (res.error) {
        console.error(res.error);
      }

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
      } else if (session?.user.isAdmin || session?.user.role === "USER") {
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
        <p>
          <Link href="/forgot-password" className="text-sm ">
            Forgot Password?
          </Link>
        </p>
      </div>
      <input type="submit" value={loading ? "Signing in..." : "Sign In"} />
      {error && (
        <>
          {error === "Configuration" || error === "CredentialsSignin" ? (
            <p className="text-red-500">Invalid Password or Email.</p>
          ) : (
            <p>{error}</p>
          )}
        </>
      )}
      <p>
        Dont have an account? <Link href="/signup">Create an account</Link>.
      </p>
      <button
        type="button"
        className="google-signin flex items-center gap-3 justify-center border my-5 bg-amber-50"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.1 0 5.8 1.1 8 3.2l6-6C34.2 3.2 29.5 1 24 1 14.9 1 7.3 6.8 3.6 15.1l7.1 5.5C12.5 14.3 17.8 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.1 24.5c0-1.7-.1-2.9-.4-4.2H24v8h12.7c-.6 3-2.3 5.6-4.9 7.3l7.5 5.8c4.4-4.1 6.8-10.1 6.8-16.9z"
          />
          <path
            fill="#4A90E2"
            d="M10.7 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6l-7.1-5.5C1.9 17.5 1 20.6 1 24s.9 6.5 2.6 10.1l7.1-5.5z"
          />
          <path
            fill="#FBBC05"
            d="M24 47c5.5 0 10.2-1.8 13.6-4.9l-7.5-5.8c-2.1 1.4-4.8 2.2-6.1 2.2-6.2 0-11.5-4.8-13.3-11.1l-7.1 5.5C7.3 41.2 14.9 47 24 47z"
          />
        </svg>
        <span>Sign In with Google</span>
      </button>
    </form>
  );
}
