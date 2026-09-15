import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyticsApi, adminCoursesApi, type AnalyticsOverview, type ApiCourse } from "@/lib/api-client";
import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { Users, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const token = (session?.user as any)?.accessToken as string;

  let overview: AnalyticsOverview | null = null;
  let courses: ApiCourse[] = [];

  try {
    [overview, courses] = await Promise.all([
      analyticsApi.overview(token),
      adminCoursesApi.list(token),
    ]);
  } catch {
    // fail gracefully, show zero states
  }

  const drafts = courses.filter((c) => c.status === "draft").slice(0, 4);
  const published = courses.filter((c) => c.status === "published").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {session?.user?.name ?? "Admin"}.
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/admin/courses/new">Create Course</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <AnalyticsCard
          title="Total Beneficiaries"
          value={overview?.totalBeneficiaries?.toLocaleString() ?? "—"}
          icon={Users}
          description="registered learners"
        />
        <AnalyticsCard
          title="Published Courses"
          value={published || "—"}
          icon={BookOpen}
          description={`${drafts.length} in draft`}
        />
        <AnalyticsCard
          title="New Signups (30d)"
          value={overview?.newSignupsLast30d?.toLocaleString() ?? "—"}
          icon={TrendingUp}
          description="last 30 days"
        />
        <AnalyticsCard
          title="Persona Breakdown"
          value={overview ? `${Object.keys(overview.personaBreakdown).length} segments` : "—"}
          icon={GraduationCap}
          description="youth · parents · educators · trainers"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Draft Courses */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Draft Courses</h2>
          {drafts.length === 0 ? (
            <p className="text-sm text-slate-400">No drafts yet.</p>
          ) : (
            <div className="space-y-3">
              {drafts.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{course.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{course.persona} · {course.category}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/courses/${course.id}/modules`}>Edit</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link href="/admin/courses" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Manage all courses &rarr;
            </Link>
          </div>
        </div>

        {/* Persona Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Learner Breakdown by Persona</h2>
          {overview?.personaBreakdown ? (
            <div className="space-y-4">
              {Object.entries(overview.personaBreakdown).map(([persona, count]) => {
                const total = overview.totalBeneficiaries || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={persona}>
                    <div className="flex justify-between text-sm text-slate-700 mb-1">
                      <span className="font-medium capitalize">{persona}</span>
                      <span>{count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Analytics data will appear here once available.</p>
          )}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link href="/admin/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View full analytics &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
