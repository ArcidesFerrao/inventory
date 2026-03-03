"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const rt = useTranslations("Responses");
  const at = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.error || rt("somethingWentWrong"));
      }
    } catch (err) {
      console.error(err);
      setError(rt("resetEmailFail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <h1 className="text-2xl text-center">{at("forgotPasswordTitle")}</h1>
      <p className="text-center text-gray-600">
        {at("forgotPasswordSubtitle")}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="reset-btn py-2 px-4 border text-white rounded  disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && <p className="text-green-600 text-center">{message}</p>}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <p className="text-center">
          {at("rememberPassword")}
          <Link href="/login" className=" hover:underline">
            {at("signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}
