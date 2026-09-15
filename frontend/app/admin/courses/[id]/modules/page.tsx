"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, GripVertical, FileText, Video, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ModuleForm } from "@/components/admin/ModuleForm";

// Mock data
const INITIAL_MODULES = [
  { id: "1", title: "Introduction to AI", type: "video" },
  { id: "2", title: "Core Concepts", type: "text" },
];

export default function CourseModulesPage({ params }: { params: { id: string } }) {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [isAdding, setIsAdding] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4 text-slate-500" />;
      case "text": return <FileText className="h-4 w-4 text-slate-500" />;
      case "quiz": return <CheckSquare className="h-4 w-4 text-slate-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <Link href="/admin/courses" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to courses
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Manage Modules</h1>
          <p className="text-slate-500 mt-1">Course ID: {params.id}</p>
        </div>
        <Button variant="outline" className="bg-white">Publish Course</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Module List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Curriculum</h2>
          
          {modules.map((mod, index) => (
            <div key={mod.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm group hover:border-blue-300 transition-colors cursor-pointer">
              <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{index + 1}. {mod.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {getIcon(mod.type)}
                  <span className="text-xs text-slate-500 capitalize">{mod.type}</span>
                </div>
              </div>
            </div>
          ))}

          <Button 
            variant="outline" 
            className="w-full mt-4 border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2">
          {isAdding ? (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">New Module</h2>
              <ModuleForm 
                onCancel={() => setIsAdding(false)} 
                onSave={(data) => {
                  setModules([...modules, { id: Date.now().toString(), title: data.title, type: data.type }]);
                  setIsAdding(false);
                }} 
              />
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-500 bg-slate-50/50">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <p>Select a module to edit or add a new one.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
