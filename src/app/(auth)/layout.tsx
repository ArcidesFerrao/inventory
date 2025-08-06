export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-main flex justify-center gap-5">{children}</main>
  );
}
