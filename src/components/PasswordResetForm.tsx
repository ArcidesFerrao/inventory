"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const at = useTranslations("Auth");
  const rt = useTranslations("Responses");
  const lt = useTranslations("Loading");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid reset link");
        setValidating(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setTokenValid(true);
        } else {
          setError(data.error || rt("invalidLink"));
        }
      } catch (err) {
        console.error(err);
        setError(rt("validateLinkFail"));
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validation
    if (password.length < 8) {
      setError(rt("passwordRule"));
      return;
    }

    if (password !== confirmPassword) {
      setError(rt("noMatchPassword"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(rt("resetPasswordSuccess"));
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || rt("resetFail"));
      }
    } catch (err) {
      console.error(err);
      setError(rt("resetFail"));
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="flex flex-col gap-4 max-w-md mx-auto p-6">
        <p className="text-center">{lt("resetValidating")}</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex flex-col gap-4 max-w-md mx-auto p-6">
        <h1 className="text-2xl text-center">{at("invalidLink")}</h1>
        <p className="text-red-500 text-center">{error}</p>
        <p className="text-center">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            {at("newLinkRequest")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <h1 className="text-2xl text-center">{at("resetPasswordTitle")}</h1>
      <p className="text-center text-gray-600">{at("resetPasswordSubtitle")}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="password">{at("newPassword")}</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword">{at("confirmPassword")}</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder={at("reEnter")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 reset-btn border text-white rounded  disabled:opacity-50"
        >
          {loading ? lt("reseting") : at("resetPassword")}
        </button>

        {message && <p className="text-green-600 text-center">{message}</p>}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <p className="text-center">
          <Link href="/login" className=" hover:underline">
            {at("backToLogin")}
          </Link>
        </p>
      </form>
    </div>
  );
}
