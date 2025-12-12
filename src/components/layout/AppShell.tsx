"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOutClient } from "@/lib/auth-client";
import { useState } from "react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navItems = [
    { href: "/app/dashboard", label: "Dashboard" },
    { href: "/app/profile/mock-profile/progress", label: "Progress" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <h2 className="text-lg font-semibold">InterviewLabs AI</h2>
          </div>
          <Separator />
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Separator />
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full"
              disabled={isSigningOut}
              onClick={async () => {
                try {
                  setIsSigningOut(true);
                  await signOutClient();
                  router.push("/login");
                } catch (error) {
                  console.error("Error signing out:", error);
                } finally {
                  setIsSigningOut(false);
                }
              }}
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
