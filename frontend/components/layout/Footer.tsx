import Link from "next/link";
import { MessageCircle, Globe, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Mission */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo.png" alt="AI Encyclopedia Logo" className="h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Democratizing AI education for everyone. We provide expert-led courses designed for youth, parents, educators, and master trainers to build skills for an AI-driven future.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Platform</h3>
            <ul className="space-y-4">
              <li><Link href="/courses" className="text-sm hover:text-white transition-colors">Course Catalog</Link></li>
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">Our Mission</Link></li>
              <li><Link href="/courses/trainers" className="text-sm hover:text-white transition-colors">Certifications</Link></li>
              <li><Link href="/forum" className="text-sm hover:text-white transition-colors">Community Forum</Link></li>
            </ul>
          </div>

          {/* Personas */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Learning Paths</h3>
            <ul className="space-y-4">
              <li><Link href="/courses/youth" className="text-sm hover:text-white transition-colors">For Youth</Link></li>
              <li><Link href="/courses/parents" className="text-sm hover:text-white transition-colors">For Parents</Link></li>
              <li><Link href="/courses/educators" className="text-sm hover:text-white transition-colors">For Educators</Link></li>
              <li><Link href="/courses/trainers" className="text-sm hover:text-white transition-colors">Master Trainers</Link></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/help" className="text-sm hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/help" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} AI Encyclopedia. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail className="h-4 w-4" />
            <a href="mailto:support@aiencyclopedia.com" className="hover:text-white transition-colors">support@aiencyclopedia.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
