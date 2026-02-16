import ProviderWrapper from "@/components/ProviderWrapper";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProviderWrapper>
      <main className="auth-main flex justify-center gap-5">{children}</main>
    </ProviderWrapper>
  );
}
