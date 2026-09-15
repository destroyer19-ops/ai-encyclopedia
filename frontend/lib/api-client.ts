/**
 * lib/api-client.ts
 * Central typed fetch wrapper for the AI Encyclopedia backend API.
 * All requests go through here — token injection, error handling, type-safety.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.aiencyclopedia.org";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;  // JWT from NextAuth session
  tags?: string[]; // Next.js cache tags for revalidation
};

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, tags } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...(tags ? { next: { tags } } : {}),
  });

  if (!res.ok) {
    let errorData: unknown;
    try {
      errorData = await res.json();
    } catch {
      errorData = { message: res.statusText };
    }
    const message =
      typeof errorData === "object" && errorData !== null && "message" in errorData
        ? String((errorData as { message: string }).message)
        : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, errorData);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<{ accessToken: string; user: ApiUser }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (data: { name: string; email: string; password: string }) =>
    request<{ accessToken: string; user: ApiUser }>("/auth/register", {
      method: "POST",
      body: data,
    }),

  me: (token: string) =>
    request<ApiUser>("/users/me", { token }),
};

// ─── Courses (public) ────────────────────────────────────────────────────────

export const coursesApi = {
  getAll: (params?: { persona?: string; category?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<ApiCourse[]>(`/courses${qs ? `?${qs}` : ""}`, {
      tags: ["courses"],
    });
  },

  getBySlug: (persona: string, slug: string) =>
    request<ApiCourseDetail>(`/courses/${persona}/${slug}`, {
      tags: [`course-${persona}-${slug}`],
    }),

  getModules: (courseId: string) =>
    request<ApiModule[]>(`/courses/${courseId}/modules`, {
      tags: [`course-modules-${courseId}`],
    }),

  getModule: (courseId: string, moduleId: string) =>
    request<ApiModule>(`/courses/${courseId}/modules/${moduleId}`),
};

// ─── Enrollments ─────────────────────────────────────────────────────────────

export const enrollmentsApi = {
  enroll: (courseId: string, token: string) =>
    request<ApiEnrollment>("/enrollments", {
      method: "POST",
      body: { courseId },
      token,
    }),

  getMyEnrollments: (token: string) =>
    request<ApiEnrollment[]>("/enrollments", { token }),

  updateProgress: (enrollmentId: string, moduleId: string, token: string) =>
    request<ApiEnrollment>(`/enrollments/${enrollmentId}/progress`, {
      method: "PATCH",
      body: { moduleId },
      token,
    }),
};

// ─── Admin — Courses ─────────────────────────────────────────────────────────

export const adminCoursesApi = {
  list: (token: string) =>
    request<ApiCourse[]>("/admin/courses", { token }),

  create: (data: CreateCoursePayload, token: string) =>
    request<ApiCourse>("/admin/courses", { method: "POST", body: data, token }),

  update: (id: string, data: Partial<CreateCoursePayload>, token: string) =>
    request<ApiCourse>(`/admin/courses/${id}`, { method: "PATCH", body: data, token }),

  publish: (id: string, token: string) =>
    request<ApiCourse>(`/admin/courses/${id}/publish`, { method: "PATCH", token }),

  delete: (id: string, token: string) =>
    request<void>(`/admin/courses/${id}`, { method: "DELETE", token }),

  // Modules
  addModule: (courseId: string, data: CreateModulePayload, token: string) =>
    request<ApiModule>(`/admin/courses/${courseId}/modules`, {
      method: "POST",
      body: data,
      token,
    }),

  reorderModules: (courseId: string, order: { id: string; order: number }[], token: string) =>
    request<void>(`/admin/courses/${courseId}/modules/reorder`, {
      method: "PATCH",
      body: { order },
      token,
    }),
};

// ─── Admin — Uploads ──────────────────────────────────────────────────────────

export const adminUploadsApi = {
  presign: (filename: string, contentType: string, token: string) =>
    request<{ uploadUrl: string; finalUrl: string }>("/admin/uploads/presign", {
      method: "POST",
      body: { filename, contentType },
      token,
    }),
};

// ─── Admin — Users ────────────────────────────────────────────────────────────

export const adminUsersApi = {
  list: (token: string, search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    return request<ApiUser[]>(`/admin/users${qs}`, { token });
  },
};

// ─── Admin — Analytics ───────────────────────────────────────────────────────

export const analyticsApi = {
  overview: (token: string) =>
    request<AnalyticsOverview>("/admin/analytics/overview", { token }),

  byCourse: (courseId: string, token: string) =>
    request<CourseAnalytics>(`/admin/analytics/courses/${courseId}`, { token }),
};

// ─── Upload helper (client-side) ─────────────────────────────────────────────

/**
 * Requests a presigned URL from our backend, then PUTs the file
 * directly to S3/Spaces — the video never passes through our Node server.
 */
export async function uploadFileToStorage(file: File, token: string): Promise<string> {
  const { uploadUrl, finalUrl } = await adminUploadsApi.presign(file.name, file.type, token);

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload file to storage.");
  }

  return finalUrl;
}

// ─── Shared API Types ─────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: "learner" | "admin";
  persona?: string;
  nationality?: string;
  employmentStatus?: string;
  birthYear?: number;
}

export interface ApiCourse {
  id: string;
  title: string;
  slug: string;
  persona: string;
  category: string;
  description: string;
  imageUrl?: string;
  ecardUrl?: string;
  status: "draft" | "published";
  modulesCount?: number;
  durationMinutes?: number;
}

export interface ApiCourseDetail extends ApiCourse {
  modules: ApiModule[];
}

export interface ApiModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  contentType: "video" | "text" | "quiz";
  contentUrl?: string;
  contentBody?: string;
}

export interface ApiEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progressPct: number;
  completedModuleIds: string[];
  startedAt: string;
  completedAt?: string;
}

export interface AnalyticsOverview {
  totalBeneficiaries: number;
  newSignupsLast30d: number;
  publishedCourses: number;
  personaBreakdown: Record<string, number>;
}

export interface CourseAnalytics {
  courseId: string;
  totalLearners: number;
  completionRate: number;
  avgTimeToCompleteHrs?: number;
}

export interface CreateCoursePayload {
  title: string;
  slug: string;
  persona: string;
  category: string;
  description: string;
  imageUrl?: string;
  ecardUrl?: string;
}

export interface CreateModulePayload {
  title: string;
  contentType: "video" | "text" | "quiz";
  contentUrl?: string;
  contentBody?: string;
  order?: number;
}
