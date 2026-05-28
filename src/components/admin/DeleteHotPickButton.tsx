"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteHotPickButton({ hotPickId }: { hotPickId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this hot pick banner?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/hot-picks/${hotPickId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      router.push("/hot-picks");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
