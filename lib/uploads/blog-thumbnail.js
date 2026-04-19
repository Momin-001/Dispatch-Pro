import { cloudinary } from "@/lib/cloudinary";

const ALLOWED_THUMBNAIL_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function isAllowedThumbnailMime(mime) {
  return ALLOWED_THUMBNAIL_MIMES.has((mime || "").toLowerCase());
}

export function uploadBlogThumbnail(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "dispatchpro/blogs",
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function deleteBlogThumbnail(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.error("Failed to delete blog thumbnail:", err);
  }
}
