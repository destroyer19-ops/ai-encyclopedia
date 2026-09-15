import { coursesApi, type ApiCourse } from "@/lib/api-client";
import { CourseCard } from "@/components/course/CourseCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PersonaCoursesPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona: personaParam } = await params;
  let courses: ApiCourse[] = [];
  let fetchError = false;

  const persona = personaParam.charAt(0).toUpperCase() + personaParam.slice(1);

  try {
    courses = await coursesApi.getAll({ persona: personaParam });
  } catch {
    fetchError = true;
  }

  // Persona specific copy
  const copy = {
    Youth: {
      title: "AI Courses for Youth",
      description: "Build foundational skills and explore the exciting world of AI through interactive, engaging modules.",
      gradient: "from-blue-500 to-cyan-400"
    },
    Parents: {
      title: "AI Resources for Parents",
      description: "Learn how to guide your children in an AI-driven world and understand the tools shaping their future.",
      gradient: "from-emerald-500 to-teal-400"
    },
    Educators: {
      title: "AI for Educators",
      description: "Discover how to integrate AI tools into your classroom, streamline workflows, and enhance student learning.",
      gradient: "from-purple-500 to-pink-400"
    },
    Trainers: {
      title: "Master Trainer Program",
      description: "Advanced courses and certifications to become a certified AI Encyclopedia trainer.",
      gradient: "from-orange-500 to-red-400"
    },
    Default: {
      title: `Courses for ${persona}`,
      description: "Explore our specialized curriculum.",
      gradient: "from-blue-600 to-emerald-500"
    }
  };

  const currentCopy = (copy as any)[persona] || copy.Default;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/courses" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all courses
      </Link>

      <div className={`relative rounded-3xl overflow-hidden p-8 md:p-12 mb-12 shadow-lg text-white`}>
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000" alt="Persona" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${currentCopy.gradient} mix-blend-multiply opacity-80`}></div>
          <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{currentCopy.title}</h1>
          <p className="mt-4 text-lg max-w-2xl text-slate-200">{currentCopy.description}</p>
        </div>
      </div>

      {fetchError && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-6 py-4 mb-8 text-sm">
          Could not load courses. Please check your connection or try again later.
        </div>
      )}

      {!fetchError && courses.length === 0 && (
        <div className="text-center py-24 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-lg font-medium text-slate-600">No courses available yet.</p>
          <p className="text-sm mt-1">We are currently developing content for this track. Check back soon!</p>
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
  );
}
