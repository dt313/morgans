import { Suspense } from "react";
import { NewsFeedLayout } from "@/layout/news-feed-layout";

export default function FeedPage() {
  return (
    <Suspense fallback={null}>
      <NewsFeedLayout />
    </Suspense>
  );
}
