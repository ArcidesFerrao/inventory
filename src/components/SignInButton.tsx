"use client";
import { signIn } from "next-auth/react";

export const SignInButton = ({ label }: { label: string }) => {
  return (
    <button
      onClick={() => signIn()}
      className="login-button border  opacity-75 hover:opacity-100"
    >
      {label}
    </button>
  );
};
