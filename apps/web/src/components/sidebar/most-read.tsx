import { articles } from "@/data/news";

export function MostRead() {
  return (
    <section className="side-section">
      <h2>Most read</h2>
      <ol className="most-read">
        {articles.slice(0, 3).map((article, index) => (
          <li key={article.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{article.title}</h3>
              <p>{article.publisher}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
