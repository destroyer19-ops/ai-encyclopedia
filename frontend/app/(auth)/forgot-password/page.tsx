"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement API call to send reset email
    setSubmitted(true);
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="flex justify-center mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Reset your password</h2>
      </div>

      {submitted ? (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-6">
            If an account exists for {email}, you will receive a password reset link shortly.
          </p>
          <Button className="w-full" variant="outline" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <p className="text-sm text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
