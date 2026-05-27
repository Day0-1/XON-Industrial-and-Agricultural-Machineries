import { ObjectId, type Document, type WithId } from "mongodb";
import { slugify } from "@/lib/slug";
import type { Product, ProductImage, ProductInput } from "@/types/product";
import {
  getCollectionById,
  getCollectionBySlug,
  seedDefaultCollectionsIfEmpty,
} from "./collections";
import {
  PRODUCTS_PAGE_SIZE,
  type PaginatedResult,
} from "@/lib/pagination";
import { normalizeProductFeatures } from "@/lib/product-features";
import { mergeQueryWithSearch } from "@/lib/search";
import { getDb, isMongoConfigured } from "./client";

const COLLECTION = "products";

export type { PaginatedResult };

type ProductDocument = {
  name: string;
  slug: string;
  description: string;
  collectionId: string;
  /** @deprecated Legacy field — migrated to collectionId on read */
  category?: "industrial" | "agricultural";
  imageUrl: string;
  cloudinaryPublicId: string;
  images?: ProductImage[];
  featured: boolean;
  active: boolean;
  clickCount?: number;
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
};

type CollectionMeta = {
  collectionId: string;
  collectionName: string;
  collectionSlug: string;
};

async function resolveCollectionMeta(
  doc: ProductDocument,
): Promise<CollectionMeta | null> {
  if (doc.collectionId) {
    const col = await getCollectionById(doc.collectionId);
    if (col) {
      return {
        collectionId: col._id,
        collectionName: col.name,
        collectionSlug: col.slug,
      };
    }
  }

  if (doc.category) {
    const col = await getCollectionBySlug(doc.category);
    if (col) {
      return {
        collectionId: col._id,
        collectionName: col.name,
        collectionSlug: col.slug,
      };
    }
  }

  return null;
}

function resolveImages(doc: ProductDocument): ProductImage[] {
  if (doc.images?.length) return doc.images;
  if (doc.imageUrl && doc.cloudinaryPublicId) {
    return [{ imageUrl: doc.imageUrl, cloudinaryPublicId: doc.cloudinaryPublicId }];
  }
  return [];
}

function toIsoString(value: Date | string | undefined): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.length > 0) return value;
  return new Date().toISOString();
}

async function toProduct(doc: WithId<ProductDocument>): Promise<Product | null> {
  const meta = await resolveCollectionMeta(doc);
  if (!meta) return null;

  const images = resolveImages(doc);
  const primary = images[0];

  return {
    _id: doc._id.toString(),
    name: doc.name ?? "Untitled product",
    slug: doc.slug,
    description: doc.description ?? "",
    collectionId: meta.collectionId,
    collectionName: meta.collectionName,
    collectionSlug: meta.collectionSlug,
    images,
    imageUrl: primary?.imageUrl ?? doc.imageUrl ?? "",
    cloudinaryPublicId: primary?.cloudinaryPublicId ?? doc.cloudinaryPublicId ?? "",
    featured: Boolean(doc.featured),
    active: doc.active !== false,
    clickCount: typeof doc.clickCount === "number" ? doc.clickCount : 0,
    features: doc.features ?? [],
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt),
  };
}

async function collection() {
  const db = await getDb();
  return db.collection<ProductDocument>(COLLECTION);
}

async function buildActiveProductsQuery(
  collectionSlug?: string,
): Promise<Document | null> {
  let collectionId: string | undefined;
  if (collectionSlug) {
    const col = await getCollectionBySlug(collectionSlug);
    if (!col) return null;
    collectionId = col._id;
  }

  const query: Document = { active: true };
  if (collectionId) {
    query.$or = [{ collectionId }, { category: collectionSlug }];
  }
  return query;
}

async function docsToProducts(
  docs: WithId<ProductDocument>[],
): Promise<Product[]> {
  const products: Product[] = [];
  for (const doc of docs) {
    const product = await toProduct(doc);
    if (product) products.push(product);
  }
  return products;
}

function emptyPaginated<T>(page: number, pageSize: number): PaginatedResult<T> {
  return {
    items: [],
    page: 1,
    pageSize,
    total: 0,
    totalPages: 1,
  };
}

export async function listActiveProductsPaginated(
  page: number,
  pageSize = PRODUCTS_PAGE_SIZE,
  collectionSlug?: string,
  search?: string,
): Promise<PaginatedResult<Product>> {
  if (!isMongoConfigured()) return emptyPaginated(page, pageSize);

  try {
    const baseQuery = await buildActiveProductsQuery(collectionSlug);
    if (!baseQuery) return emptyPaginated(page, pageSize);
    const query = mergeQueryWithSearch(baseQuery, search);

    const col = await collection();
    const total = await col.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const skip = (safePage - 1) * pageSize;

    const docs = await col
      .find(query)
      .sort({ featured: -1, updatedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const items = await docsToProducts(docs);

    return {
      items,
      page: safePage,
      pageSize,
      total,
      totalPages,
    };
  } catch {
    return emptyPaginated(page, pageSize);
  }
}

export async function listAllProductsPaginated(
  page: number,
  pageSize = PRODUCTS_PAGE_SIZE,
  search?: string,
): Promise<PaginatedResult<Product>> {
  if (!isMongoConfigured()) return emptyPaginated(page, pageSize);

  try {
    const col = await collection();
    const query = mergeQueryWithSearch({}, search);
    const total = await col.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const skip = (safePage - 1) * pageSize;

    const docs = await col
      .find(query)
      .sort({ clickCount: -1, updatedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const items = await docsToProducts(docs);

    return {
      items,
      page: safePage,
      pageSize,
      total,
      totalPages,
    };
  } catch {
    return emptyPaginated(page, pageSize);
  }
}

/** Full list — for sitemap, APIs, and other non-paginated callers. */
export async function listActiveProducts(
  collectionSlug?: string,
): Promise<Product[]> {
  if (!isMongoConfigured()) return [];

  try {
    const query = await buildActiveProductsQuery(collectionSlug);
    if (!query) return [];

    const docs = await (await collection())
      .find(query)
      .sort({ featured: -1, updatedAt: -1 })
      .toArray();

    return docsToProducts(docs);
  } catch {
    return [];
  }
}

/** Full list — for admin API and other non-paginated callers. */
export async function listAllProducts(): Promise<Product[]> {
  if (!isMongoConfigured()) return [];

  try {
    const docs = await (await collection())
      .find({})
      .sort({ clickCount: -1, updatedAt: -1 })
      .toArray();

    return docsToProducts(docs);
  } catch {
    return [];
  }
}

async function backfillProductImagesIfNeeded(
  doc: WithId<ProductDocument>,
): Promise<WithId<ProductDocument>> {
  if (doc.images?.length) return doc;
  if (!doc.imageUrl || !doc.cloudinaryPublicId) return doc;

  const images: ProductImage[] = [
    { imageUrl: doc.imageUrl, cloudinaryPublicId: doc.cloudinaryPublicId },
  ];

  await (await collection()).updateOne(
    { _id: doc._id },
    { $set: { images } },
  );

  return { ...doc, images };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isMongoConfigured()) return null;

  try {
    const raw = await (await collection()).findOne({ slug, active: true });
    if (!raw) return null;
    const doc = await backfillProductImagesIfNeeded(raw);
    return toProduct(doc);
  } catch {
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!ObjectId.isValid(id)) return null;

  try {
    const raw = await (await collection()).findOne({ _id: new ObjectId(id) });
    if (!raw) return null;
    const doc = await backfillProductImagesIfNeeded(raw);
    return toProduct(doc);
  } catch {
    return null;
  }
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
  const col = await getCollectionById(input.collectionId);
  if (!col) {
    throw new Error("Collection not found");
  }

  const now = new Date();
  const baseSlug = slugify(input.name);
  const slug = await ensureUniqueSlug(baseSlug);
  const images = input.images.length > 0 ? input.images : [];
  const primary = images[0];
  if (!primary) throw new Error("At least one product image is required");

  const doc: ProductDocument = {
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    collectionId: col._id,
    images,
    imageUrl: primary.imageUrl,
    cloudinaryPublicId: primary.cloudinaryPublicId,
    featured: input.featured ?? false,
    active: input.active ?? true,
    clickCount: 0,
    features: normalizeProductFeatures(input.features),
    createdAt: now,
    updatedAt: now,
  };

  const result = await (await collection()).insertOne(doc);
  const product = await toProduct({ _id: result.insertedId, ...doc });
  if (!product) throw new Error("Failed to create product");
  return product;
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
  if (input.collectionId !== undefined) {
    const col = await getCollectionById(input.collectionId);
    if (!col) throw new Error("Collection not found");
    updates.collectionId = col._id;
  }
  if (input.images !== undefined && input.images.length > 0) {
    const primary = input.images[0];
    updates.images = input.images;
    updates.imageUrl = primary.imageUrl;
    updates.cloudinaryPublicId = primary.cloudinaryPublicId;
  } else if (input.imageUrl !== undefined && input.cloudinaryPublicId !== undefined) {
    updates.imageUrl = input.imageUrl;
    updates.cloudinaryPublicId = input.cloudinaryPublicId;
    updates.images = [
      { imageUrl: input.imageUrl, cloudinaryPublicId: input.cloudinaryPublicId },
    ];
  } else {
    if (input.imageUrl !== undefined) updates.imageUrl = input.imageUrl;
    if (input.cloudinaryPublicId !== undefined) {
      updates.cloudinaryPublicId = input.cloudinaryPublicId;
    }
  }
  if (input.featured !== undefined) updates.featured = input.featured;
  if (input.active !== undefined) updates.active = input.active;
  if (input.clickCount !== undefined) {
    const count = Math.max(0, Math.floor(input.clickCount));
    updates.clickCount = count;
  }
  if (input.features !== undefined) {
    updates.features = normalizeProductFeatures(input.features);
  }

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

export async function incrementProductClickBySlug(
  slug: string,
): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  try {
    const doc = await (await collection()).findOne({ slug, active: true });
    if (!doc) return false;
    const { recordProductClick } = await import("./analytics");
    await recordProductClick(doc._id.toString());
    return true;
  } catch {
    return false;
  }
}

export async function ensureProductIndexes(): Promise<void> {
  await seedDefaultCollectionsIfEmpty();
  const col = await collection();
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ active: 1, featured: -1, updatedAt: -1 });
  await col.createIndex({ collectionId: 1, active: 1 });
  await col.createIndex({ clickCount: -1 });
  const { ensureAnalyticsIndexes } = await import("./analytics");
  await ensureAnalyticsIndexes();
}
