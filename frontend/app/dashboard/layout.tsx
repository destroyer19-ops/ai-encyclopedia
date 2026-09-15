import Link from "next/link";
import { User, BookOpen, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/dashboard" className="text-sm font-medium text-slate-900 border-b-2 border-emerald-500 py-5">
                  My Learning
                </Link>
                <Link href="/courses" className="text-sm font-medium text-slate-500 hover:text-slate-900 py-5 transition-colors">
                  Catalog
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard/profile" className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                <Settings className="h-5 w-5" />
              </Link>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                U
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 pb-12">
        {children}
      </main>
    </div>
  );
}
