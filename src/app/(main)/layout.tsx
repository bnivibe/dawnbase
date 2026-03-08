import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isAdminAuthenticated();

  return (
    <div className="flex h-screen">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
