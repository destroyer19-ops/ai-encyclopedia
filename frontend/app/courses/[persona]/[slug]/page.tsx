import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BookOpen, Clock, CheckCircle2, PlayCircle, BarChart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { coursesApi, type ApiCourseDetail } from "@/lib/api-client";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ persona: string; slug: string }>;
}) {
  const { persona, slug } = await params;
  let course: ApiCourseDetail;

  try {
    course = await coursesApi.getBySlug(persona, slug);
  } catch {
    notFound();
  }

  const totalMinutes = course.modules.length * 15; // rough estimate; replace with real data

  return (
    <div className="flex min-h-screen flex-col font-sans bg-slate-50">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Course Header Banner */}
        <section className="bg-slate-900 text-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-emerald-400 mb-6 uppercase tracking-wider">
                For {persona}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-8">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <span>~{totalMinutes} mins to complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-slate-500" />
                  <span>{course.modules.length} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-slate-500" />
                  <span className="capitalize">{course.category}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content Grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Modules */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Modules</h2>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {course.modules
                      .sort((a, b) => a.order - b.order)
                      .map((mod) => (
                        <div
                          key={mod.id}
                          className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <PlayCircle className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                Module {mod.order}: {mod.title}
                              </p>
                              <p className="text-sm text-slate-500 capitalize">{mod.contentType}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Enrollment Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sticky top-28">
                  <div className="aspect-video bg-slate-100 rounded-xl mb-6 flex items-center justify-center border border-slate-200 relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
                      alt="Course Preview"
                      className="object-cover w-full h-full opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white drop-shadow-lg opacity-90" />
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Free Enrollment</h3>
                    <p className="text-sm text-slate-500">
                      Access to all course materials, videos, and a verifiable certificate upon completion.
                    </p>
                  </div>

                  <Button variant="gradient" className="w-full h-12 text-lg rounded-xl mb-4" asChild>
                    <Link href="/login">Enroll Now — It's Free</Link>
                  </Button>

                  <p className="text-center text-xs text-slate-400">
                    Join thousands of learners on this course.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
