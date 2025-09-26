import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: false,
});

export default api;

export async function uploadFile(
  file: File,
  category: string
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(
    `/api/files/upload?category=${encodeURIComponent(category)}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json().catch(() => ({}));
  if (res.ok && data?.success && data?.data?.url)
    return data.data.url as string;
  return null;
}

export async function uploadMultiple(
  files: File[],
  category: string
): Promise<Array<{ url: string }>> {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  const res = await fetch(
    `/api/files/upload-multiple?category=${encodeURIComponent(category)}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json().catch(() => ({}));
  if (res.ok && data?.success && Array.isArray(data?.data))
    return data.data as Array<{ url: string }>;
  return [];
}
