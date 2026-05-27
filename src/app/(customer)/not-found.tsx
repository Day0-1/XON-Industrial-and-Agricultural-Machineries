import { NotFoundContent } from "@/components/customer/NotFoundContent";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Page not found",
  path: "/404",
  noIndex: true,
});

export default function CustomerNotFound() {
  return <NotFoundContent />;
}
