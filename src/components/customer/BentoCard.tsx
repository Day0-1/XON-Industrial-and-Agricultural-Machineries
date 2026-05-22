import type { ReactNode } from "react";

type BentoCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
};

export function BentoCard({
  children,
  className = "",
  as: Tag = "div",
}: BentoCardProps) {
  return (
    <Tag
      className={`rounded-3xl bg-white p-6 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/80 ${className}`}
    >
      {children}
    </Tag>
  );
}
