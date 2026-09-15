import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, PlayCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { coursesApi, type ApiCourseDetail, type ApiModule } from "@/lib/api-client";

export default async function ModulePlayerPage({
  params,
}: {
  params: Promise<{ persona: string; slug: string; moduleId: string }>;
}) {
  const { persona, slug, moduleId } = await params;
  let course: ApiCourseDetail;
  try {
    course = await coursesApi.getBySlug(persona, slug);
  } catch {
    notFound();
  }

  const modules = course.modules.sort((a, b) => a.order - b.order);
  const currentModule = modules.find((m) => m.id === moduleId) ?? modules[0];
  const currentIndex = modules.findIndex((m) => m.id === currentModule.id);
  const prevModule = modules[currentIndex - 1];
  const nextModule = modules[currentIndex + 1];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-300">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <Link
          href={`/courses/${persona}/${slug}`}
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Link>
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${Math.round(((currentIndex + 1) / modules.length) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {currentIndex + 1}/{modules.length} Modules
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Video or Text Content */}
          {currentModule.contentType === "video" && (
            <div className="flex-1 bg-black flex items-center justify-center p-4 lg:p-8">
              {currentModule.contentUrl ? (
                <video
                  key={currentModule.contentUrl}
                  controls
                  className="w-full max-w-5xl rounded-xl"
                  src={currentModule.contentUrl}
                />
              ) : (
                <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
                  <PlayCircle className="h-20 w-20 text-slate-600" />
                </div>
              )}
            </div>
          )}

          {currentModule.contentType === "text" && (
            <div className="flex-1 bg-slate-950 p-6 lg:p-12 overflow-y-auto">
              <div className="prose prose-invert prose-lg max-w-3xl mx-auto">
                <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                  {currentModule.contentBody ?? "No content available."}
                </p>
              </div>
            </div>
          )}

          {currentModule.contentType === "quiz" && (
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-8">
              <div className="text-center text-slate-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-slate-700" />
                <p className="text-lg font-medium">Quiz coming soon</p>
              </div>
            </div>
          )}

          {/* Below Content Info Bar */}
          <div className="bg-slate-950 p-6 lg:p-8 border-t border-slate-800 shrink-0">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {currentModule.order}. {currentModule.title}
                </h1>
                <p className="text-slate-400 text-sm capitalize">{currentModule.contentType}</p>
              </div>
              <Button variant="gradient" className="shrink-0 gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Mark Complete
              </Button>
            </div>
          </div>
        </main>

        {/* Sidebar — Curriculum */}
        <aside className="w-full lg:w-80 bg-slate-950 border-l border-slate-800 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
            <h2 className="font-semibold text-white">Course Content</h2>
            <p className="text-xs text-slate-500 mt-1">{course.title}</p>
          </div>

          <div className="flex-1 py-2">
            {modules.map((mod) => {
              const isCurrent = mod.id === currentModule.id;
              return (
                <Link
                  key={mod.id}
                  href={`/courses/${persona}/${slug}/module/${mod.id}`}
                  className={`flex items-start gap-3 p-4 border-b border-slate-800/50 hover:bg-slate-900 transition-colors ${
                    isCurrent ? "bg-slate-900 border-l-2 border-l-blue-500" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {mod.contentType === "video" ? (
                      <PlayCircle className={`h-5 w-5 ${isCurrent ? "text-blue-400" : "text-slate-600"}`} />
                    ) : (
                      <FileText className={`h-5 w-5 ${isCurrent ? "text-blue-400" : "text-slate-600"}`} />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isCurrent ? "text-white" : "text-slate-400"}`}>
                      {mod.order}. {mod.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 capitalize">{mod.contentType}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Bottom Prev/Next Bar */}
      <footer className="h-16 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-4 sm:px-6 shrink-0">
        {prevModule ? (
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            asChild
          >
            <Link href={`/courses/${persona}/${slug}/module/${prevModule.id}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Link>
          </Button>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            asChild
          >
            <Link href={`/courses/${persona}/${slug}/module/${nextModule.id}`}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="gradient" asChild>
            <Link href={`/courses/${persona}/${slug}`}>
              🎉 Finish Course
            </Link>
          </Button>
        )}
      </footer>
    </div>
  );
}
