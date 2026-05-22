import type { WithId } from "mongodb";
import { getDb, isMongoConfigured } from "./client";

const COLLECTION = "admins";

type AdminDocument = {
  username: string;
  passwordHash: string;
  createdAt: Date;
};

export type Admin = {
  _id: string;
  username: string;
  createdAt: string;
};

function toAdmin(doc: WithId<AdminDocument>): Admin {
  return {
    _id: doc._id.toString(),
    username: doc.username,
    createdAt: doc.createdAt.toISOString(),
  };
}

async function collection() {
  const db = await getDb();
  return db.collection<AdminDocument>(COLLECTION);
}

export async function countAdmins(): Promise<number> {
  if (!isMongoConfigured()) return 0;
  return (await collection()).countDocuments();
}

export async function findAdminByUsername(username: string) {
  const doc = await (await collection()).findOne({
    username: username.trim().toLowerCase(),
  });
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    username: doc.username,
    passwordHash: doc.passwordHash,
  };
}

export async function createAdmin(input: {
  username: string;
  passwordHash: string;
}): Promise<Admin> {
  const now = new Date();
  const doc: AdminDocument = {
    username: input.username.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: now,
  };

  const result = await (await collection()).insertOne(doc);
  return toAdmin({ _id: result.insertedId, ...doc });
}

export async function ensureAdminIndexes(): Promise<void> {
  const col = await collection();
  await col.createIndex({ username: 1 }, { unique: true });
}
