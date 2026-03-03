import { upload } from "@imagekit/next";

export async function uploadToImageKit(file, folder = "/products") {
  // 1. Get auth params from server
  const res = await fetch("/api/upload-auth");
  if (!res.ok) {
    throw new Error("ImageKit authentication failed");
  }

  const auth = await res.json();

  // 2. Upload file
  const result = await upload({
    file,
    fileName: file.name,
    publicKey: auth.publicKey,
    token: auth.token,
    signature: auth.signature,
    expire: auth.expire,
    folder,
  });

  if (!result?.url) {
    throw new Error("Image upload failed");
  }

  return result.url;
}
