import { CourseForm } from "@/components/admin/CourseForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCoursePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/courses" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to courses
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
          <p className="text-slate-500 mt-1">Set up the initial metadata for your new course.</p>
        </div>
      </div>
      
      <CourseForm />
    </div>
  );
}
