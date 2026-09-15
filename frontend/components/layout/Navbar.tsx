import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BrainCircuit, Menu } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { name?: string | null, role?: string } | undefined;

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="AI Encyclopedia Logo" className="h-16 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <Link href="/courses" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Courses
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              About
            </Link>
            <Link href="/help" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
              Help Center
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button variant="gradient" className="rounded-full px-6" asChild>
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                  Sign In
                </Link>
                <Button variant="gradient" className="rounded-full px-6" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button className="text-slate-600 hover:text-emerald-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
