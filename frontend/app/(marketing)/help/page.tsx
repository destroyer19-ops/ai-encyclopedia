import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000" alt="Customer Support" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            How can we help?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
            Search our knowledge base or browse the frequently asked questions below.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-blue-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How do I get started with a course?</h3>
              <p className="text-slate-600">
                To get started, simply create an account, browse our course catalog, and enroll in a course that fits your persona (Youth, Parents, Educators, or Master Trainers). Most introductory modules are completely free!
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Are the certifications recognized?</h3>
              <p className="text-slate-600">
                Our certifications are industry-aligned and demonstrate a practical, working knowledge of AI concepts and tools. You can easily share them on LinkedIn or include them on your resume.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">I forgot my password. How can I reset it?</h3>
              <p className="text-slate-600">
                You can reset your password by clicking the "Forgot Password" link on the login page. We'll send you an email with instructions on how to create a new one securely.
              </p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Can I switch my learning track (persona)?</h3>
              <p className="text-slate-600">
                Yes! You can explore courses outside of your primary persona. While your dashboard will highlight recommendations for your chosen track, the full catalog is always available to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-50 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Still need help?</h2>
          <p className="text-slate-600 mb-8">
            If you couldn't find the answer to your question, our support team is ready to assist you.
          </p>
          <Button size="lg" className="rounded-full px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white" asChild>
            <a href="mailto:support@example.com">Contact Support</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
