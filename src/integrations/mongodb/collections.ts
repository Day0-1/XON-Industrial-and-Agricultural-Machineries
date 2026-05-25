import { ObjectId, type WithId } from "mongodb";
import { slugify } from "@/lib/slug";
import type { Collection, CollectionInput } from "@/types/collection";
import { getDb, isMongoConfigured } from "./client";

const COLLECTION = "collections";

type CollectionDocument = {
  name: string;
  slug: string;
  description: string;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

function toCollection(doc: WithId<CollectionDocument>): Collection {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    active: doc.active,
    sortOrder: doc.sortOrder,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function collection() {
  const db = await getDb();
  return db.collection<CollectionDocument>(COLLECTION);
}

const DEFAULT_COLLECTIONS: CollectionInput[] = [
  {
    name: "Industrial",
    description: "Industrial equipment and heavy machinery.",
    sortOrder: 0,
  },
  {
    name: "Agricultural",
    description: "Farm and field equipment.",
    sortOrder: 1,
  },
];

export async function listActiveCollections(): Promise<Collection[]> {
  if (!isMongoConfigured()) return [];
  try {
    const docs = await (await collection())
      .find({ active: true })
      .sort({ sortOrder: 1, name: 1 })
      .toArray();
    return docs.map(toCollection);
  } catch {
    return [];
  }
}

export async function listAllCollections(): Promise<Collection[]> {
  if (!isMongoConfigured()) return [];

  try {
    const docs = await (await collection())
      .find({})
      .sort({ sortOrder: 1, name: 1 })
      .toArray();
    return docs.map(toCollection);
  } catch {
    return [];
  }
}

export async function getCollectionById(id: string): Promise<Collection | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await (await collection()).findOne({ _id: new ObjectId(id) });
  return doc ? toCollection(doc) : null;
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  const doc = await (await collection()).findOne({
    slug: slug.trim().toLowerCase(),
  });
  return doc ? toCollection(doc) : null;
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const col = await collection();
  let slug = base;
  let suffix = 0;

  while (true) {
    const query: { slug: string; _id?: { $ne: ObjectId } } = { slug };
    if (excludeId && ObjectId.isValid(excludeId)) {
      query._id = { $ne: new ObjectId(excludeId) };
    }
    const existing = await col.findOne(query);
    if (!existing) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

export async function createCollection(
  input: CollectionInput,
): Promise<Collection> {
  const now = new Date();
  const baseSlug = slugify(input.name);
  const slug = await ensureUniqueSlug(baseSlug);

  const doc: CollectionDocument = {
    name: input.name.trim(),
    slug,
    description: input.description?.trim() ?? "",
    active: input.active !== false,
    sortOrder: input.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  const result = await (await collection()).insertOne(doc);
  return toCollection({ _id: result.insertedId, ...doc });
}

export async function updateCollection(
  id: string,
  input: Partial<CollectionInput>,
): Promise<Collection | null> {
  if (!ObjectId.isValid(id)) return null;

  const updates: Partial<CollectionDocument> = { updatedAt: new Date() };

  if (input.name !== undefined) {
    updates.name = input.name.trim();
    updates.slug = await ensureUniqueSlug(slugify(input.name), id);
  }
  if (input.description !== undefined) {
    updates.description = input.description.trim();
  }
  if (input.active !== undefined) updates.active = input.active;
  if (input.sortOrder !== undefined) updates.sortOrder = input.sortOrder;

  const result = await (await collection()).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" },
  );

  return result ? toCollection(result) : null;
}

export async function deleteCollection(id: string): Promise<Collection | null> {
  if (!ObjectId.isValid(id)) return null;
  const result = await (await collection()).findOneAndDelete({
    _id: new ObjectId(id),
  });
  return result ? toCollection(result) : null;
}

export async function countProductsInCollection(id: string): Promise<number> {
  if (!ObjectId.isValid(id)) return 0;
  const db = await getDb();
  return db.collection("products").countDocuments({ collectionId: id });
}

export async function ensureCollectionIndexes(): Promise<void> {
  const col = await collection();
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ active: 1, sortOrder: 1, name: 1 });
}

export async function seedDefaultCollectionsIfEmpty(): Promise<void> {
  if (!isMongoConfigured()) return;
  const count = await (await collection()).countDocuments();
  if (count > 0) return;

  for (const item of DEFAULT_COLLECTIONS) {
    await createCollection(item);
  }
}
