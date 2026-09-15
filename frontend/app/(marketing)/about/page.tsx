import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" alt="Team working" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Our Mission: Democratizing AI Education
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
            We believe that understanding artificial intelligence shouldn't be limited to computer scientists and engineers. It's the new literacy, essential for everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-blue-50/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Our Story</h2>
          <div className="prose prose-lg text-slate-600">
            <p>
              In a world rapidly transformed by artificial intelligence, we noticed a growing gap. While tools and technologies advanced at an unprecedented pace, the education needed to understand, navigate, and utilize these tools was lagging behind.
            </p>
            <p className="mt-4">
              AI Encyclopedia was founded to bridge this gap. We set out to create a comprehensive, accessible platform that caters to diverse audiences—youth seeking foundational knowledge, parents wanting to guide their children, educators looking to integrate AI in classrooms, and master trainers ready to lead the charge.
            </p>
            <p className="mt-4">
              Our team consists of industry veterans, passionate educators, and AI researchers who have come together to curate and create high-quality learning experiences. We break down complex concepts into digestible, actionable modules.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Accessibility</h3>
              <p className="text-slate-600">
                Education should be available to everyone, regardless of background or technical expertise. We design our courses to be approachable and engaging.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Empowerment</h3>
              <p className="text-slate-600">
                We don't just teach theory; we focus on practical skills that empower our learners to use AI responsibly and effectively in their daily lives and careers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community</h3>
              <p className="text-slate-600">
                Learning is a collaborative journey. We foster a supportive community where learners can share insights, ask questions, and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-gradient-to-br from-blue-50 to-emerald-50">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Join Us in Shaping the Future</h2>
        <Button size="lg" variant="gradient" className="rounded-full px-8 text-lg" asChild>
          <Link href="/register">Start Learning Today</Link>
        </Button>
      </section>
    </div>
  );
}
