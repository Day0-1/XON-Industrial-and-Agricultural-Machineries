import { ObjectId, type Document, type WithId } from "mongodb";
import { slugify } from "@/lib/slug";
import type { Product, ProductCategory, ProductInput } from "@/types/product";
import { getDb, isMongoConfigured } from "./client";

const COLLECTION = "products";

type ProductDocument = {
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  imageUrl: string;
  cloudinaryPublicId: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toProduct(doc: WithId<ProductDocument>): Product {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    category: doc.category,
    imageUrl: doc.imageUrl,
    cloudinaryPublicId: doc.cloudinaryPublicId,
    featured: doc.featured,
    active: doc.active,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function collection() {
  const db = await getDb();
  return db.collection<ProductDocument>(COLLECTION);
}

export async function listActiveProducts(): Promise<Product[]> {
  if (!isMongoConfigured()) return [];
  const docs = await (await collection())
    .find({ active: true })
    .sort({ featured: -1, updatedAt: -1 })
    .toArray();
  return docs.map(toProduct);
}

export async function listAllProducts(): Promise<Product[]> {
  const docs = await (await collection())
    .find({})
    .sort({ updatedAt: -1 })
    .toArray();
  return docs.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isMongoConfigured()) return null;
  const doc = await (await collection()).findOne({ slug, active: true });
  return doc ? toProduct(doc) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await (await collection()).findOne({ _id: new ObjectId(id) });
  return doc ? toProduct(doc) : null;
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const col = await collection();
  let slug = base;
  let suffix = 0;

  while (true) {
    const query: Document = { slug };
    if (excludeId && ObjectId.isValid(excludeId)) {
      query._id = { $ne: new ObjectId(excludeId) };
    }
    const existing = await col.findOne(query);
    if (!existing) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const now = new Date();
  const baseSlug = slugify(input.name);
  const slug = await ensureUniqueSlug(baseSlug);

  const doc: ProductDocument = {
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    category: input.category,
    imageUrl: input.imageUrl,
    cloudinaryPublicId: input.cloudinaryPublicId,
    featured: input.featured ?? false,
    active: input.active ?? true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await (await collection()).insertOne(doc);
  return toProduct({ _id: result.insertedId, ...doc });
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<Product | null> {
  if (!ObjectId.isValid(id)) return null;

  const updates: Partial<ProductDocument> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) {
    updates.name = input.name.trim();
    updates.slug = await ensureUniqueSlug(slugify(input.name), id);
  }
  if (input.description !== undefined) updates.description = input.description.trim();
  if (input.category !== undefined) updates.category = input.category;
  if (input.imageUrl !== undefined) updates.imageUrl = input.imageUrl;
  if (input.cloudinaryPublicId !== undefined) {
    updates.cloudinaryPublicId = input.cloudinaryPublicId;
  }
  if (input.featured !== undefined) updates.featured = input.featured;
  if (input.active !== undefined) updates.active = input.active;

  const result = await (await collection()).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" },
  );

  return result ? toProduct(result) : null;
}

export async function deleteProduct(id: string): Promise<Product | null> {
  if (!ObjectId.isValid(id)) return null;
  const result = await (await collection()).findOneAndDelete({
    _id: new ObjectId(id),
  });
  return result ? toProduct(result) : null;
}

export async function ensureProductIndexes(): Promise<void> {
  const col = await collection();
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ active: 1, featured: -1, updatedAt: -1 });
}
