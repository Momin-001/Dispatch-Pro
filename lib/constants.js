import dotenv from "dotenv";
dotenv.config();

export const {
    DATABASE_URL,
    JWT_SECRET,
    NEXT_PUBLIC_APP_URL,

    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,

    ADMIN_EMAIL,
    ADMIN_PASSWORD,

    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env