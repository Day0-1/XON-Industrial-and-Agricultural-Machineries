import crypto from "crypto";
import { getCloudinaryClient } from "./client";
import { getCloudinaryConfig } from "./config";

type UploadResult = {
  publicId: string;
  url: string;
};

export async function uploadProductImage(
  buffer: Buffer,
  filename: string,
): Promise<UploadResult> {
  const { apiSecret } = getCloudinaryConfig();
  const client = getCloudinaryClient();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp: String(timestamp) };
  const signature = crypto
    .createHash("sha1")
    .update(`timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)]), filename);
  form.append("timestamp", params.timestamp);
  form.append("signature", signature);
  form.append("api_key", getCloudinaryConfig().apiKey);

  const { data } = await client.post<{
    public_id: string;
    secure_url: string;
  }>("/image/upload", form);

  return {
    publicId: data.public_id,
    url: data.secure_url,
  };
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  const client = getCloudinaryClient();
  await client.post("/image/destroy", { public_id: publicId });
}
