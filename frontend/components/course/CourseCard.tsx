import Link from "next/link";
import { BookOpen, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  persona: string;
  modulesCount: number;
  durationMinutes: number;
}

export function CourseCard({ id, title, description, persona, modulesCount, durationMinutes }: CourseCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-white transition-all hover:shadow-md">
      <div className="flex-shrink-0 bg-blue-50 h-48 flex items-center justify-center border-b border-gray-100">
        <PlayCircle className="h-16 w-16 text-blue-300" />
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-600">
            {persona.charAt(0).toUpperCase() + persona.slice(1)}
          </p>
          <div className="mt-2 block">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{title}</h3>
            <p className="mt-3 text-base text-gray-500 line-clamp-3">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{modulesCount} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{durationMinutes} mins</span>
          </div>
        </div>
        <div className="mt-6">
          <Button className="w-full" asChild>
            <Link href={`/courses/${persona}/${id}`}>
              View Course
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
