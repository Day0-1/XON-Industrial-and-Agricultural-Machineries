import type { AxiosInstance } from "axios";
import { createHttpClient } from "@/lib/http/client";
import { getCloudinaryConfig } from "./config";

let client: AxiosInstance | undefined;

export function getCloudinaryClient(): AxiosInstance {
  if (!client) {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    client = createHttpClient({
      baseURL: `https://api.cloudinary.com/v1_1/${cloudName}`,
      auth: { username: apiKey, password: apiSecret },
    });
  }
  return client;
}
