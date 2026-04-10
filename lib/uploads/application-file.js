import path from "path";
import { cloudinary } from "@/lib/cloudinary";

const MIME_EXT = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

function sanitizeBasename(name) {
  if (name == null || typeof name !== "string") return null;
  const base = path.basename(name.trim());
  if (!base || base === "." || base === "..") return null;
  return base.replace(/[/\\]/g, "").slice(0, 180);
}

/** Readable filename for Cloudinary public_id (extension helps browser / Content-Disposition). */
export function filenameForUpload(originalFilename, mimeType) {
  let base = sanitizeBasename(originalFilename);
  const mime = mimeType || "application/octet-stream";

  if (base && !path.extname(base)) {
    const ext = MIME_EXT[mime.toLowerCase()] || "";
    if (ext) base = `${base}${ext}`;
  }

  if (!base) {
    const ext = MIME_EXT[mime.toLowerCase()] || ".bin";
    base = `document${ext}`;
  }

  return base;
}

/**
 * PDFs must use resource_type `image` so Cloudinary delivers them like other images
 * (view-in-browser works). `raw` PDFs are often forced as attachments with awkward names.
 * @see https://cloudinary.com/documentation/upload_parameters#uploading_pdfs
 */
function resourceTypeForUpload(mimeType, originalFilename) {
  const mime = (mimeType || "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "image";
  const lower = (originalFilename || "").toLowerCase();
  if (lower.endsWith(".pdf")) return "image";
  return "raw";
}

export function uploadApplicationFile(buffer, { role, mimeType, originalFilename }) {
  const filenameOverride = filenameForUpload(originalFilename, mimeType);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `dispatchpro/applications/${role}`,
        resource_type: resourceTypeForUpload(mimeType, originalFilename),
        use_filename: true,
        unique_filename: true,
        filename_override: filenameOverride,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}
