import { MongoClient, type Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

function createMongoClient(uri: string): MongoClient {
  return new MongoClient(uri, {
    // Fail fast instead of retrying for many minutes (default ~30s × many attempts).
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
  });
}

async function connectClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createMongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = createMongoClient(uri).connect();
  }
  return clientPromise;
}

/** Connects only when called — not at module load. */
export async function getDb(): Promise<Db> {
  const client = await connectClient();
  return client.db(process.env.MONGODB_DB_NAME ?? "xon");
}
