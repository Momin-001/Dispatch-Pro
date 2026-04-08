import { cloudinary } from "@/lib/cloudinary";

export function uploadApplicationFile(buffer, { role, mimeType }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `dispatchpro/applications/${role}`,
        resource_type: mimeType?.startsWith("image/") ? "image" : "raw",
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
