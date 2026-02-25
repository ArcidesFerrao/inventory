"use client";

import { UserRole } from "@/generated/prisma";
import { useTranslations } from "next-intl";
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
  const a = useTranslations("Auth");
  const ct = useTranslations("Common");

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
    } else {
      const data = await res.json();
      setError(data.message || "Failed to sign up");
      setLoading(false);
    }
  };
  return (
    <form className="signup-form flex flex-col gap-4 " onSubmit={handleSubmit}>
      <h1 className="text-2xl text-center">{a("signUp")}</h1>
      {error && <p>{error}</p>}
      <input
        type="text"
        name="name"
        id="name"
        placeholder={ct("name") + "..."}
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
          {a("pickRole")}:
        </option>
        <option value="SERVICE">{ct("service")}</option>
        <option value="SUPPLIER">{ct("supplier")}</option>
        {/* <option value="MANAGER">{ct("manager")}</option> */}
        <option value="ADMIN">{ct("admin")}</option>
      </select>

      <input
        type="email"
        name="email"
        id="email"
        placeholder={a("email") + "..."}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="phonenumber"
        name="phonenumber"
        id="phonenumber"
        placeholder={a("phone") + "..."}
        value={phonenumber}
        onChange={(e) => setPhonenumber(e.target.value.toString())}
      />
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={a("password")}
      />
      <input type="submit" value={loading ? a("signingUp") : a("signUp")} />
      <p>
        {a("alreadyHaveAccount")} <Link href="/login">{a("signInHere")}</Link>
      </p>
    </form>
  );
}
