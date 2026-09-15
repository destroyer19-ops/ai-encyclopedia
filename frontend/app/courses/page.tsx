import { coursesApi, type ApiCourse } from "@/lib/api-client";
import { CourseCard } from "@/components/course/CourseCard";
import { Search } from "lucide-react";

const PERSONAS = ["All", "Youth", "Parents", "Educators", "Trainers"];

export default async function CoursesCatalogPage({
  searchParams,
}: {
  searchParams: { persona?: string; category?: string };
}) {
  let courses: ApiCourse[] = [];
  let fetchError = false;

  try {
    const persona =
      searchParams.persona && searchParams.persona !== "All"
        ? searchParams.persona.toLowerCase()
        : undefined;

    courses = await coursesApi.getAll({ persona });
  } catch {
    fetchError = true;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=2000" alt="Courses" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Course Catalog</h1>
              <p className="mt-4 text-xl text-slate-300 max-w-2xl">Find the perfect AI course tailored to your needs and persona.</p>
            </div>

            <form method="GET" className="mt-8 md:mt-0 max-w-md w-full relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="search"
                name="q"
                placeholder="Search courses..."
                className="flex h-12 w-full rounded-full border border-slate-300 bg-white px-4 py-2 pl-12 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
              />
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full">

      {/* Persona Filters */}
      <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
        {PERSONAS.map((p) => {
          const isActive =
            p === "All"
              ? !searchParams.persona || searchParams.persona === "All"
              : searchParams.persona === p;
          return (
            <a
              key={p}
              href={p === "All" ? "/courses" : `/courses?persona=${p}`}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p}
            </a>
          );
        })}
      </div>

      {fetchError && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-6 py-4 mb-8 text-sm">
          Could not load courses. Please check your connection or try again later.
        </div>
      )}

      {!fetchError && courses.length === 0 && (
        <div className="text-center py-24 text-slate-400">
          <p className="text-lg font-medium">No courses found.</p>
          <p className="text-sm mt-1">Try changing your filter or check back soon.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.slug}
            title={course.title}
            description={course.description}
            persona={course.persona}
            modulesCount={course.modulesCount ?? 0}
            durationMinutes={course.durationMinutes ?? 0}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
