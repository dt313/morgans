<br />

<div align="center">
  <a href="https://github.com/YOUR_USERNAME/news-ai">
    <img src="./apps/web/src/assets/imgs/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Morgans</h3>

  <p align="center">
    <strong>Morgans</strong> is a Korean news reader that summarizes today's top stories into Vietnamese, lets you ask an AI anything about them, and reads you a short briefing every morning — built with <strong>Next.js</strong>, <strong>FastAPI</strong>, and <strong>PostgreSQL + pgvector</strong>.
  </p>
</div>

---

## 🚀 Features

✅ Korean news feed — fetched from 15+ trusted Korean sources
✅ Summarized & translated into Vietnamese by AI
✅ RAG-powered news chat — ask anything about the articles, with conversation memory
✅ Daily audio briefing — generated with ElevenLabs TTS
✅ Fully automated pipeline — crawl → extract → summarize → embed → publish
✅ Time-aware retrieval ("today" / "yesterday" filtering)
✅ Multilingual support (Korean ↔ Vietnamese)
✅ Responsive, Medium-inspired UI

---

## 🧑‍💻 Tech Stack

### 🖥️ Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Streaming chat (Server-Sent Events)

### 🔧 Backend

- FastAPI (Python)
- SQLAlchemy 2 (async)
- PostgreSQL + pgvector (semantic search)
- Alembic (migrations)
- JWT Authentication

### ⚙️ News Pipeline

- APScheduler (30-min interval or on-demand)
- feedparser & trafilatura (RSS + content extraction)
- DeepSeek or Ollama (summarization / translation)
- Ollama embeddings (bge-m3)

### 🎙️ Voice & AI

- ElevenLabs (TTS)
- RAG with pgvector cosine similarity
- Conversation memory + intent classification

---

## 📋 Architecture

```
├── apps/
│   ├── web/               # Next.js frontend
│   ├── api/               # FastAPI backend
│   └── news-pipeline/     # Crawler + summarizer + embedder scheduler
├── packages/              # Shared code (optional)
└── moon.yml               # Monorepo task runner (moon)
```

---

## 📦 Getting Started

> **Recommended:** the whole stack is run through **moon**, the monorepo build tool that
> powers this repo. It boots the API, frontend, and news pipeline together from a
> single command.

### ⚙️ 1. Prerequisites

- **moon** 2.3.x — [`proto`](https://moonrepo.dev/docs/install#proto) (`proto install moon`), [standalone binary](https://moonrepo.dev/docs/install#standalone) or `npm i -g @moonrepo/cli`
- Node.js 20+ & pnpm 10 (auto-installed by moon via `.prototools`)
- Python 3.11+ & uv (auto-installed by moon via `.prototools`)
- Docker (for PostgreSQL)
- Ollama (for embeddings; optional if using DeepSeek for LLM)

### 📚 2. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/news-ai.git
cd news-ai
```

### 🗄️ 3. Start the database

A PostgreSQL instance with the `pgvector` extension is shipped as a Docker Compose service.

```bash
docker compose -f apps/api/docker-compose.yml up -d
```

Tables are created automatically on API startup.

### 🚀 4. Run the full stack with moon

Install toolchains and project dependencies once:

```bash
moon setup
```

Then boot everything (API + frontend + pipeline):

```bash
moon run web-dev
```

`web-dev` (defined in the root `moon.yml`) runs `api:dev`, `web:dev`, and `news-pipeline:dev`
in parallel. Each app loads its own `.env.dev` automatically.

### 🛠️ 5. Useful moon tasks

| Task                        | Description                                |
| --------------------------- | ------------------------------------------ |
| `moon run web-dev`          | Run API + frontend + pipeline together     |
| `moon run api:dev`          | Run only the FastAPI backend (hot reload)  |
| `moon run api:prod`         | Run the API with `.env.prod`               |
| `moon run web:dev`          | Run only the Next.js frontend              |
| `moon run news-pipeline:dev`| Run the pipeline once (`--once`)           |
| `moon run news-pipeline:schedule` | Run the pipeline scheduler (daily loop) |
| `moon run api:lint` / `api:format` | Ruff check/format                   |
| `moon run web:lint`         | ESLint on the frontend                     |

### 📝 6. Configure environment files

Each app reads `.env.dev` (the `APP_ENV=dev` profile). Create them before running:

```bash
cp apps/api/.env.example apps/api/.env.dev
```

**API — `apps/api/.env.dev`**

```bash
APP_NAME="Morgans"
APP_ENV="dev"
DEBUG=true

DATABASE_URL=postgresql+asyncpg://postgres:123456@localhost:5555/news_dev

ACCESS_SECRET_KEY=<random-secret>
REFRESH_SECRET_KEY=<random-secret>

# LLM provider: "deepseek" or "ollama"
LLM_PROVIDER=deepseek
LLM_MODEL=deepseek-v4-flash
DEEPSEEK_API_KEY=<your-deepseek-api-key>

# Embeddings (always served by Ollama)
OLLAMA_BASE_URL=http://localhost:11434
EMBEDDING_MODEL=bge-m3

# ElevenLabs (audio briefings)
ELEVENLABS_API_KEY=<your-elevenlabs-api-key>
KOREAN_VOICE_ID=<voice-id>
VIETNAMESE_VOICE_ID=<voice-id>
AUDIO_CACHE_DIR=static/audio
```

**Frontend — `apps/web/.env.dev`** (_not_ auto-loaded by moon; export it or use a `.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Pipeline — `apps/news-pipeline/.env.dev`**

```bash
APP_ENV="dev"
DATABASE_URL=postgresql+asyncpg://postgres:123456@localhost:5555/news_dev

LLM_PROVIDER=deepseek
LLM_MODEL=deepseek-v4-flash
DEEPSEEK_API_KEY=<your-deepseek-api-key>

OLLAMA_BASE_URL=http://localhost:11434
EMBEDDING_MODEL=bge-m3

PIPELINE_INTERVAL_MINUTES=30
PIPELINE_RUN_ON_START=true
```

Swagger docs are available at `http://localhost:8000/docs`

### 🧰 7. Manual run (without moon)

**Frontend**

```bash
cd apps/web
pnpm install
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 pnpm dev
```

**Backend**

```bash
cd apps/api
uv sync
uv run --env-file .env.dev uvicorn src.main:app --reload
```

**Pipeline — single pass**

```bash
cd apps/news-pipeline
uv sync
uv run --env-file .env.dev python src/main.py --once
```

**Pipeline — scheduler (daily briefing loop)**

```bash
cd apps/news-pipeline
uv run --env-file .env.dev python src/main.py
```

---

## 🔌 API Overview

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | `/health`                   | Health check                         |
| GET    | `/articles`                 | Paginated article feed               |
| GET    | `/articles/categories`      | Available categories                 |
| GET    | `/articles/trending`        | Trending topics                      |
| GET    | `/articles/search?q=`       | Search articles                      |
| GET    | `/articles/{id}`            | Article detail                       |
| GET    | `/articles/{id}/audio`      | Article audio briefing               |
| POST   | `/chat`                     | Ask the news AI                      |
| POST   | `/chat/stream`              | Ask the news AI (SSE streaming)      |
| POST   | `/auth/...`                 | Register / login                     |

---

## 🖼️ Screenshots

![Morgans UI](./captures/1.png)