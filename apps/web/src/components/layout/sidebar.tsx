import { MostRead } from "@/components/sidebar/most-read";
import { RecommendedPublishers } from "@/components/sidebar/recommended-publishers";
import { TrendingTopics } from "@/components/sidebar/trending-topics";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <TrendingTopics />
      <MostRead />
      <RecommendedPublishers />
    </aside>
  );
}
