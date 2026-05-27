import Link from "next/link";
import type { ComponentProps } from "react";

type CustomerLinkProps = ComponentProps<typeof Link>;

/** Internal customer-site links with viewport prefetch enabled by default. */
export function CustomerLink({ prefetch = true, ...props }: CustomerLinkProps) {
  return <Link prefetch={prefetch} {...props} />;
}
