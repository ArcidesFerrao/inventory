"use client";
import { signIn } from "next-auth/react";

export const SignInButton = ({ label }: { label: string }) => {
  return (
    <button onClick={() => signIn()} className="login-button w-32 border">
      {label}
    </button>
  );
};
