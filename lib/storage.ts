import { createClient } from "@/lib/supabase/client";

/**
 * Upload a file to a Supabase Storage bucket and return its public URL.
 * Uses the browser client (called from Client Components).
 */
export async function uploadFile(
  bucket: "songs" | "covers" | "avatars",
  path: string,
  file: File
): Promise<string | null> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) {
    console.error(`uploadFile (${bucket}):`, error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
