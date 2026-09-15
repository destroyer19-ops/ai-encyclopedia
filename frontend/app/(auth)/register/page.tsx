"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const PERSONAS = ["Youth", "Parents", "Educators", "Trainers"];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persona, setPersona] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!persona) {
      toast.error("Please select your learning track before continuing.");
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with real API call — e.g. await authApi.register({ name, email, password, persona })
      await new Promise((r) => setTimeout(r, 1000)); // simulate network request

      toast.success("Account created! Welcome to AI Encyclopedia 🎉");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
      <div className="flex justify-center mb-6">
        <img src="/logo.png" alt="AI Encyclopedia Logo" className="h-12 w-auto object-contain" />
      </div>
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Create your account</h2>
      <p className="text-center text-sm text-slate-500 mb-8">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <Input
            type="text"
            required
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Persona Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">I am a…</label>
          <div className="grid grid-cols-2 gap-2">
            {PERSONAS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPersona(p)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  persona === p
                    ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white border-transparent shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="gradient" className="w-full h-11 text-base rounded-xl" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
            </span>
          ) : (
            "Create Free Account"
          )}
        </Button>

        <p className="text-center text-xs text-slate-400">
          By signing up, you agree to our{" "}
          <Link href="/about" className="underline hover:text-slate-600">Terms</Link>{" "}
          and{" "}
          <Link href="/about" className="underline hover:text-slate-600">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}
