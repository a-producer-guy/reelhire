"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Film, Clock, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav bar for contractors */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/contractor" className="flex items-center gap-2">
              <Film className="h-6 w-6 text-sky-400" />
              <span className="font-bold text-lg">ReelHire</span>
              <span className="text-xs text-slate-400 ml-1">Contractor Portal</span>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                href="/contractor"
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/contractor"
                    ? "bg-sky-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                <Clock className="h-4 w-4 inline mr-1.5" />
                My Timecards
              </Link>
              <Link
                href="/contractor/profile"
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/contractor/profile"
                    ? "bg-sky-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                )}
              >
                <User className="h-4 w-4 inline mr-1.5" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              >
                <LogOut className="h-4 w-4 inline mr-1.5" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
