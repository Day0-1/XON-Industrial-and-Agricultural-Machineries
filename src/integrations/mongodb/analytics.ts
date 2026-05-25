import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured } from "./client";
import { listAllCollections } from "./collections";

const DAILY_CLICKS = "product_daily_clicks";

type DailyClickDocument = {
  productId: string;
  date: string;
  count: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthKey(date: string): string {
  return date.slice(0, 7);
}

export async function recordProductClick(productId: string): Promise<void> {
  if (!isMongoConfigured() || !ObjectId.isValid(productId)) return;

  const db = await getDb();
  const date = todayKey();

  await Promise.all([
    db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { clickCount: 1 } },
    ),
    db.collection<DailyClickDocument>(DAILY_CLICKS).updateOne(
      { productId, date },
      { $inc: { count: 1 } },
      { upsert: true },
    ),
  ]);
}

export async function ensureAnalyticsIndexes(): Promise<void> {
  if (!isMongoConfigured()) return;
  const db = await getDb();
  await db
    .collection(DAILY_CLICKS)
    .createIndex({ productId: 1, date: 1 }, { unique: true });
  await db.collection(DAILY_CLICKS).createIndex({ date: 1 });
}

export type MonthlyClickPoint = {
  label: string;
  clicks: number;
};

export type DashboardStats = {
  totalProducts: number;
  activeProducts: number;
  totalCollections: number;
  totalClicks: number;
  monthlyClicks: MonthlyClickPoint[];
  topProducts: Array<{
    _id: string;
    name: string;
    slug: string;
    imageUrl: string;
    clickCount: number;
    collectionName: string;
    active: boolean;
  }>;
  topCollections: Array<{
    name: string;
    slug: string;
    clicks: number;
    productCount: number;
  }>;
  recentProducts: Array<{
    _id: string;
    name: string;
    slug: string;
    imageUrl: string;
    clickCount: number;
    collectionName: string;
    active: boolean;
    updatedAt: string;
  }>;
};

function lastSixMonthKeys(): { key: string; label: string }[] {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short" });
    months.push({ key, label });
  }
  return months;
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  if (!isMongoConfigured()) return null;

  try {
    const db = await getDb();
    const productsCol = db.collection("products");
    const dailyCol = db.collection<DailyClickDocument>(DAILY_CLICKS);

    const [products, collections, dailyDocs] = await Promise.all([
      productsCol.find({}).toArray(),
      listAllCollections(),
      dailyCol.find({}).toArray(),
    ]);

    const collectionNameById = new Map(
      collections.map((c) => [c._id, c.name]),
    );

    const enriched = products.map((doc) => ({
      _id: doc._id.toString(),
      name: doc.name as string,
      slug: doc.slug as string,
      imageUrl: doc.imageUrl as string,
      clickCount: typeof doc.clickCount === "number" ? doc.clickCount : 0,
      collectionId: doc.collectionId as string | undefined,
      collectionName:
        collectionNameById.get(doc.collectionId as string) ?? "—",
      active: Boolean(doc.active),
      updatedAt:
        doc.updatedAt instanceof Date
          ? doc.updatedAt.toISOString()
          : new Date().toISOString(),
    }));

    const totalClicks = enriched.reduce((sum, p) => sum + p.clickCount, 0);
    const activeProducts = enriched.filter((p) => p.active).length;

    const monthBuckets = new Map<string, number>();
    for (const row of dailyDocs) {
      const month = monthKey(row.date);
      monthBuckets.set(month, (monthBuckets.get(month) ?? 0) + row.count);
    }

    const monthlyClicks = lastSixMonthKeys().map(({ key, label }) => ({
      label,
      clicks: monthBuckets.get(key) ?? 0,
    }));

    const topProducts = [...enriched]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5);

    const clicksByCollection = new Map<string, number>();
    const countByCollection = new Map<string, number>();
    for (const col of collections) {
      clicksByCollection.set(col._id, 0);
      countByCollection.set(col._id, 0);
    }
    for (const p of enriched) {
      if (p.collectionId) {
        clicksByCollection.set(
          p.collectionId,
          (clicksByCollection.get(p.collectionId) ?? 0) + p.clickCount,
        );
        countByCollection.set(
          p.collectionId,
          (countByCollection.get(p.collectionId) ?? 0) + 1,
        );
      }
    }

    const topCollections = collections
      .map((col) => ({
        name: col.name,
        slug: col.slug,
        clicks: clicksByCollection.get(col._id) ?? 0,
        productCount: countByCollection.get(col._id) ?? 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    const recentProducts = [...enriched]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 6);

    return {
      totalProducts: enriched.length,
      activeProducts,
      totalCollections: collections.length,
      totalClicks,
      monthlyClicks,
      topProducts,
      topCollections,
      recentProducts,
    };
  } catch {
    return null;
  }
}
