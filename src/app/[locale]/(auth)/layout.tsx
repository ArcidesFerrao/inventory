import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="admin-main flex items-center justify-center gap-5">
      {children}
    </main>
  );
}
