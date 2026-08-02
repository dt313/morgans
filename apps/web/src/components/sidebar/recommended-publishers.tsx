import { Icon } from "@/components/ui/icon";

const publishers = [
  "Yonhap News",
  "Korea Herald",
  "KBS News",
  "SBS News",
  "JoongAng Daily",
];

export function RecommendedPublishers() {
  return (
    <section className="side-section">
      <h2>Recommended publishers</h2>
      <ul className="publisher-list">
        {publishers.map((publisher) => (
          <li key={publisher}>
            <span className="publisher-mark">{publisher.slice(0, 1)}</span>
            {publisher}
            <Icon name="chevron" size={16} />
          </li>
        ))}
      </ul>
    </section>
  );
}
