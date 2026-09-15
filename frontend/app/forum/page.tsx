import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { MessageSquare, Search, TrendingUp, Users } from "lucide-react";

export default function ForumPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="relative border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000" alt="Forum" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 z-10">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-blue-400" />
                Community Forum
              </h1>
              <p className="mt-2 text-slate-300">Connect with other learners, ask questions, and share insights.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button size="lg" className="rounded-full shadow-sm bg-white text-slate-900 hover:bg-slate-50">
                New Discussion
              </Button>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="mt-8 relative max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search topics, questions, or tags..."
              className="block w-full rounded-xl border-0 bg-white/10 backdrop-blur-md py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-300 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Feed */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <a href="#" className="border-blue-500 text-blue-600 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                  Latest
                </a>
                <a href="#" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                  Top
                </a>
                <a href="#" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium">
                  Unanswered
                </a>
              </nav>
            </div>

            {/* Placeholder state for MVP/Phase 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="mx-auto h-24 w-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Forum Coming Soon</h2>
              <p className="text-slate-600 max-w-md mx-auto mb-6">
                We're building a dedicated space for you to discuss courses and collaborate on AI projects. Check back in Phase 2!
              </p>
              <Button variant="outline" asChild>
                <Link href="/courses">Return to Courses</Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Trending Topics
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-blue-600">Best prompt engineering tips?</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-blue-600">AI tools for educators</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-blue-600">Discussing the ethics module</a>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Community Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">0</div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">Members</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">0</div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">Posts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
