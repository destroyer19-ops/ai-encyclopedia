import { BookOpen, LayoutDashboard, Users, TrendingUp, Settings } from "lucide-react";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-emerald-500 text-white p-1.5 rounded-lg">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <BookOpen className="h-5 w-5" />
            <span>Courses</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="h-5 w-5" />
            <span>Users</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <TrendingUp className="h-5 w-5" />
            <span>Analytics</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors text-sm">
            <span>&larr; Exit Admin</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
