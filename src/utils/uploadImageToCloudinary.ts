/* eslint-disable @typescript-eslint/no-explicit-any */

export async function uploadImageToCloudinary(base64Image: string): Promise<string> {
  try {
    // Convert base64 -> Response -> Blob
    const resBase64 = await fetch(base64Image);
    const blob = await resBase64.blob();

    // Convert Blob -> File (tên/loại có thể điều chỉnh)
    const file = new File([blob], "image.jpg", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);

    // THAY thành endpoint upload của bạn
    const UPLOAD_ENDPOINT = "http://localhost:8080/api/upload";

    const res = await fetch(UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorRes = await res.text();
      throw new Error("Upload failed: " + errorRes);
    }

    const data = await res.json();

    if (!data.url) {
      throw new Error("Server không trả về url (data.url undefined)");
    }

    return data.url;
  } catch (err: any) {
    console.error("Upload error:", err);
    throw new Error(err?.message || "Không upload được ảnh");
  }
}
