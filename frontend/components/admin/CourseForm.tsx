"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminCoursesApi } from "@/lib/api-client";

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  persona: z.enum(["youth", "parents", "educators", "trainers"]),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export function CourseForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      persona: "youth",
    }
  });

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      const session = await fetch("/api/auth/session").then((r) => r.json());
      const token = session?.user?.accessToken;

      await adminCoursesApi.create(data, token);
      router.push("/admin/courses");
      router.refresh();
    } catch (err: any) {
      setServerError(err?.message ?? "Failed to create course. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      {serverError && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {serverError}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
          <Input 
            {...register("title")} 
            placeholder="e.g. AI Basics for Youth" 
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
          <Input 
            {...register("slug")} 
            placeholder="e.g. ai-basics-youth" 
            className={errors.slug ? "border-red-500" : ""}
          />
          {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Persona</label>
            <select 
              {...register("persona")}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="youth">Youth</option>
              <option value="parents">Parents</option>
              <option value="educators">Educators</option>
              <option value="trainers">Master Trainers</option>
            </select>
            {errors.persona && <p className="mt-1 text-sm text-red-500">{errors.persona.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <Input 
              {...register("category")} 
              placeholder="e.g. Foundations" 
              className={errors.category ? "border-red-500" : ""}
            />
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea 
            {...register("description")} 
            rows={4}
            placeholder="Detailed course description..."
            className={`flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button variant="gradient" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Create Course"}
        </Button>
      </div>
    </form>
  );
}
