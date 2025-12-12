import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: proteger esta ruta usando getCurrentUserServer() (Firebase Admin)
  
  return <AppShell>{children}</AppShell>;
}
