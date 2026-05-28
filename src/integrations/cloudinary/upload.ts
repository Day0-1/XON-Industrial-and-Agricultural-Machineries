import crypto from "crypto";
import { getCloudinaryClient } from "./client";
import { getCloudinaryConfig } from "./config";

type UploadResult = {
  publicId: string;
  url: string;
};

const PRODUCT_FOLDER = "xon/products";
const HOT_PICK_FOLDER = "xon/hot-picks";

function signParams(params: Record<string, string>, apiSecret: string): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export async function uploadCloudinaryImage(
  buffer: Buffer,
  filename: string,
  folder: string,
): Promise<UploadResult> {
  const { apiKey, apiSecret } = getCloudinaryConfig();
  const client = getCloudinaryClient();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const params = { folder, timestamp };
  const signature = signParams(params, apiSecret);

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)]), filename);
  form.append("folder", folder);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("api_key", apiKey);

  const { data } = await client.post<{
    public_id: string;
    secure_url: string;
  }>("/image/upload", form);

  return {
    publicId: data.public_id,
    url: data.secure_url,
  };
}

export async function uploadProductImage(
  buffer: Buffer,
  filename: string,
): Promise<UploadResult> {
  return uploadCloudinaryImage(buffer, filename, PRODUCT_FOLDER);
}

export async function uploadHotPickImage(
  buffer: Buffer,
  filename: string,
): Promise<UploadResult> {
  return uploadCloudinaryImage(buffer, filename, HOT_PICK_FOLDER);
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  const { apiKey, apiSecret } = getCloudinaryConfig();
  const client = getCloudinaryClient();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const params = { public_id: publicId, timestamp };
  const signature = signParams(params, apiSecret);

  await client.post("/image/destroy", {
    public_id: publicId,
    timestamp,
    api_key: apiKey,
    signature,
  });
}
