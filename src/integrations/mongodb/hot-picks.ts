import { ObjectId, type WithId } from "mongodb";
import { deleteCloudinaryImage } from "@/integrations/cloudinary/upload";
import type { HotPick, HotPickInput } from "@/types/hot-pick";
import { getDb, isMongoConfigured } from "./client";

const COLLECTION = "hot_picks";

export const dummyHotPicks: HotPick[] = [
  {
    _id: "dummy-hot-pick-1",
    title: "Latest Arrival: Mobile Crane",
    description:
      "Heavy-duty lifting solution now available. Tap to view crane options and request pricing.",
    imageUrl: "/media/industrial-crane-saudi-arabia--560x416.png",
    cloudinaryPublicId: "dummy/hot-pick-1",
    linkUrl: "/products?category=cranes",
    active: true,
    sortOrder: 0,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "dummy-hot-pick-2",
    title: "Hot Pick: Mining Air Compressor",
    description:
      "Reliable compressor set for field operations. Click to explore matching equipment.",
    imageUrl:
      "/media/Zimbabwe-Gold-Mining-Diesel-Air-Compressor-with-Hand-Rock-Drill.webp",
    cloudinaryPublicId: "dummy/hot-pick-2",
    linkUrl: "/products?category=mining-compressors",
    active: true,
    sortOrder: 1,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
];

type HotPickDocument = {
  title: string;
  description: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  linkUrl?: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

function toHotPick(doc: WithId<HotPickDocument>): HotPick {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    description: doc.description ?? "",
    imageUrl: doc.imageUrl,
    cloudinaryPublicId: doc.cloudinaryPublicId,
    linkUrl: doc.linkUrl?.trim() ? doc.linkUrl.trim() : null,
    active: doc.active !== false,
    sortOrder: typeof doc.sortOrder === "number" ? doc.sortOrder : 0,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function collection() {
  const db = await getDb();
  return db.collection<HotPickDocument>(COLLECTION);
}

export async function listActiveHotPicks(): Promise<HotPick[]> {
  if (!isMongoConfigured()) return [];

  try {
    const docs = await (await collection())
      .find({ active: true })
      .sort({ sortOrder: 1, updatedAt: -1 })
      .toArray();
    return docs.map(toHotPick);
  } catch {
    return [];
  }
}

export async function listAllHotPicks(): Promise<HotPick[]> {
  if (!isMongoConfigured()) return [];

  try {
    const docs = await (await collection())
      .find({})
      .sort({ sortOrder: 1, updatedAt: -1 })
      .toArray();
    return docs.map(toHotPick);
  } catch {
    return [];
  }
}

export async function getHotPickById(id: string): Promise<HotPick | null> {
  if (!isMongoConfigured() || !ObjectId.isValid(id)) return null;

  try {
    const doc = await (await collection()).findOne({ _id: new ObjectId(id) });
    return doc ? toHotPick(doc) : null;
  } catch {
    return null;
  }
}

export async function createHotPick(input: HotPickInput): Promise<HotPick> {
  const now = new Date();
  const doc: HotPickDocument = {
    title: input.title,
    description: input.description ?? "",
    imageUrl: input.imageUrl,
    cloudinaryPublicId: input.cloudinaryPublicId,
    linkUrl: input.linkUrl ?? null,
    active: input.active !== false,
    sortOrder: input.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  };

  const result = await (await collection()).insertOne(doc);
  return toHotPick({ ...doc, _id: result.insertedId });
}

export async function updateHotPick(
  id: string,
  input: Partial<HotPickInput>,
): Promise<HotPick | null> {
  if (!ObjectId.isValid(id)) return null;

  const updates: Partial<HotPickDocument> = { updatedAt: new Date() };
  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.imageUrl !== undefined) updates.imageUrl = input.imageUrl;
  if (input.cloudinaryPublicId !== undefined) {
    updates.cloudinaryPublicId = input.cloudinaryPublicId;
  }
  if (input.linkUrl !== undefined) updates.linkUrl = input.linkUrl;
  if (input.active !== undefined) updates.active = input.active;
  if (input.sortOrder !== undefined) updates.sortOrder = input.sortOrder;

  const col = await collection();
  const existing = await col.findOne({ _id: new ObjectId(id) });
  if (!existing) return null;

  await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? toHotPick(doc) : null;
}

export async function deleteHotPick(id: string): Promise<HotPick | null> {
  if (!ObjectId.isValid(id)) return null;

  const col = await collection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;

  await col.deleteOne({ _id: new ObjectId(id) });

  if (doc.cloudinaryPublicId) {
    try {
      await deleteCloudinaryImage(doc.cloudinaryPublicId);
    } catch {
      // Banner removed from site even if CDN delete fails
    }
  }

  return toHotPick(doc);
}

export async function ensureHotPickIndexes(): Promise<void> {
  const col = await collection();
  await col.createIndex({ active: 1, sortOrder: 1, updatedAt: -1 });
}
