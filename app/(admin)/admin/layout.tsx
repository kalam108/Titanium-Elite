import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hard guard: full session validation + role check on every admin page.
  await requireAdmin();

  return <>{children}</>;
}
