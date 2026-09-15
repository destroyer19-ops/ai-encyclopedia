import Link from "next/link";
import { PlayCircle, Clock, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div>
      {/* Welcome Hero */}
      <div className="relative text-white pb-24 pt-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=2000" alt="Dashboard" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Welcome back, Learner!</h1>
          <p className="text-slate-300 text-lg">Pick up right where you left off.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Continue Learning */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-emerald-500" />
                  Continue Learning
                </h2>
              </div>
              
              {/* Empty State for MVP - normally you'd map over in-progress courses */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center">
                <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <BookOpen className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No courses in progress</h3>
                <p className="text-slate-500 mb-6">Explore the catalog to find your first AI course.</p>
                <Button variant="gradient" asChild>
                  <Link href="/courses">Browse Catalog</Link>
                </Button>
              </div>
            </div>

            {/* Recommended */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended for You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dummy Recommended Course */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-slate-100 relative">
                    <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600" alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-medium text-blue-600 mb-2 tracking-wide uppercase">Youth Track</div>
                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">AI Foundations for Students</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">Learn the basics of how AI works and how to use it responsibly.</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Your Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Courses Completed</span>
                    <span className="font-bold text-slate-900">0</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Learning Hours</span>
                    <span className="font-bold text-slate-900">0h</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Certificates Earned</span>
                    <span className="font-bold text-slate-900">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
