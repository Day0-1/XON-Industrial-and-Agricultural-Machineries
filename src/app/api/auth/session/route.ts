import { isAuthenticated } from "@/lib/auth/session";
import { jsonOk } from "@/lib/api/http";

export async function GET() {
  return jsonOk({ authenticated: await isAuthenticated() });
}
