import { ImageResponse } from "../types/types";

export const imageUploadService = async (file: Blob | File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  );
  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
  if (!uploadRes.ok) return null;
  const uploadData: ImageResponse = await uploadRes.json();
  return uploadData.secure_url;
};
