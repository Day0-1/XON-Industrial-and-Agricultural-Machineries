"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white"
    >
      Sign out
    </button>
  );
}
