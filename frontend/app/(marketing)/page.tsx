import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookOpen, Users, Award } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="flex-1 relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/95 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
            Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AI Education</span>
            <br className="hidden lg:block"/> for Everyone
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
            Join thousands of learners in our expert-led courses designed for youth, parents, educators, and trainers. Build the skills you need for the AI-driven future.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="gradient" className="rounded-full px-8 text-lg" asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 text-lg border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
          
          <div className="mt-20 mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative aspect-video">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000" 
              alt="People interacting with AI concept" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-blue-50/50 py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why Learn With Us?</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100/50">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tailored Curriculums</h3>
              <p className="text-slate-600 leading-relaxed">
                Whether you're a parent guiding your child or a professional looking to upskill, we have a specialized path designed just for you.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100/50">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Driven</h3>
              <p className="text-slate-600 leading-relaxed">
                Learn alongside peers, participate in lively discussions, and get real-time support from our expert mentors when you need it.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100/50">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Earn Certifications</h3>
              <p className="text-slate-600 leading-relaxed">
                Complete modules and earn official certificates to showcase your newly acquired AI skills to the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500"></div>
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
          alt="Abstract tech background" 
          className="absolute inset-0 object-cover w-full h-full mix-blend-overlay opacity-20"
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Ready to start your AI journey?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-50">
            Create an account today and get immediate access to our foundational courses and community resources.
          </p>
          <div className="mt-10">
            <Button size="lg" variant="secondary" className="rounded-full px-10 text-lg font-bold text-slate-900 shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-white hover:bg-slate-50" asChild>
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
