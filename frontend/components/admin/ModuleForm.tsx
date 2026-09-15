"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { uploadFileToStorage } from "@/lib/api-client";
import { UploadCloud, Video, FileText, CheckSquare } from "lucide-react";

const moduleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["video", "text", "quiz"]),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

export function ModuleForm({ onSave, onCancel }: { onSave?: (data: any) => void, onCancel?: () => void }) {
  const [activeType, setActiveType] = useState<"video" | "text" | "quiz">("video");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      type: "video",
    }
  });

  const onSubmit = (data: ModuleFormValues) => {
    console.log("Saving module:", data);
    if (onSave) onSave(data);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const session = await fetch("/api/auth/session").then((r) => r.json());
      const token = session?.user?.accessToken;
      const objectUrl = await uploadFileToStorage(file, token);
      setValue("mediaUrl", objectUrl);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Module Title</label>
        <Input 
          {...register("title")} 
          placeholder="e.g. Introduction to LLMs" 
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Content Type</label>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => { setActiveType("video"); setValue("type", "video"); }}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              activeType === "video" 
                ? "border-blue-500 bg-blue-50 text-blue-700" 
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            <Video className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Video</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveType("text"); setValue("type", "text"); }}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              activeType === "text" 
                ? "border-blue-500 bg-blue-50 text-blue-700" 
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            <FileText className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Text / Article</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveType("quiz"); setValue("type", "quiz"); }}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
              activeType === "quiz" 
                ? "border-blue-500 bg-blue-50 text-blue-700" 
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`}
          >
            <CheckSquare className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Quiz</span>
          </button>
        </div>
      </div>

      {activeType === "video" && (
        <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <p className="text-sm text-slate-600 mb-4">
            {uploading ? "Uploading to storage..." : "Upload your video file (MP4, WebM)"}
          </p>
          <label className={`inline-flex items-center px-4 py-2 rounded-md border text-sm font-medium cursor-pointer transition-colors ${uploading ? "opacity-50 pointer-events-none" : "border-slate-300 bg-white hover:bg-slate-50"}`}>
            {uploading ? "Uploading..." : "Select File"}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          <input type="hidden" {...register("mediaUrl")} />
        </div>
      )}

      {activeType === "text" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Markdown Content</label>
          <textarea 
            {...register("content")} 
            rows={8}
            placeholder="Write your article in Markdown..."
            className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {activeType === "quiz" && (
        <div className="p-6 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-sm">
          Quiz builder UI would go here. For now, this is a placeholder.
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="gradient" type="submit">
          Save Module
        </Button>
      </div>
    </form>
  );
}
