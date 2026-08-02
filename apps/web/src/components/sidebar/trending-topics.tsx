const topics = [
  "#ArtificialIntelligence",
  "#Samsung",
  "#Climate",
  "#Korea",
  "#Startups",
  "#Markets",
];

export function TrendingTopics() {
  return (
    <section className="side-section">
      <h2>Trending topics</h2>
      <div className="topics">
        {topics.map((topic) => (
          <button key={topic}>{topic}</button>
        ))}
      </div>
    </section>
  );
}
