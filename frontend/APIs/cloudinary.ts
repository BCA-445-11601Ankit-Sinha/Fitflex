import axiosInstance from "@/lib/axios";

const baseUrl = "api/users";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const signatureResponse = await axiosInstance.get(`${baseUrl}/presigned-url`);
  if (!signatureResponse?.data) {
    throw new Error("Failed to get upload signature");
  }

  const { signature, timestamp, apiKey, cloudName, folder } = signatureResponse.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadResponse.ok) {
    const err = await uploadResponse.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Upload failed");
  }

  const uploadData = await uploadResponse.json();
  return uploadData.secure_url;
};