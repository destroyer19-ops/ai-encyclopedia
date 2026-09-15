import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminCoursesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Courses</h2>
        <Button asChild><Link href="/admin/courses/new">New Course</Link></Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">No courses found. Create one to get started.</p>
      </div>
    </div>
  );
}
