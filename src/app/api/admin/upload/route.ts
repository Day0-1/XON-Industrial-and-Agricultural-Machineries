import { jsonError, jsonOk, requireAdmin } from "@/lib/api/http";
import { uploadProductImage } from "@/integrations/cloudinary/upload";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return jsonError("Image file is required", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadProductImage(buffer, file.name);

    return jsonOk({
      imageUrl: result.url,
      cloudinaryPublicId: result.publicId,
    });
  } catch {
    return jsonError("Image upload failed", 500);
  }
}
