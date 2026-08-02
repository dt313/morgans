````markdown
# News Feed UI Implementation

## Objective

Build a modern, production-quality News Feed page inspired by **Medium**.

The UI should prioritize readability, clean typography, generous whitespace, and a smooth reading experience.

This implementation should use **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

# Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Server Components where appropriate
- Responsive Design
- Component-based architecture

---

# Design Principles

The design should closely resemble Medium.

## Color Palette

- Primary: #242424
- Background: #FFFFFF
- Surface: #F9F9F9
- Border: #E6E6E6
- Primary Text: #242424
- Secondary Text: #6B6B6B
- Accent: #1A8917

The overall feeling should be:

- Clean
- Modern
- Minimal
- Elegant
- Content-focused

Avoid excessive colors or heavy shadows.

---

# Page Layout

```
---------------------------------------------------------
Header
---------------------------------------------------------

Category Tabs

---------------------------------------------------------

Featured Article

---------------------------------------------------------

News Feed                           Sidebar

Article Card                        Trending Topics

Article Card                        Most Read

Article Card                        Recommended Publishers

Article Card

---------------------------------------------------------
```

Desktop

- Feed: ~70%
- Sidebar: ~30%

Tablet

- Hide sidebar

Mobile

- Single-column layout
- Sticky header
- Horizontal category tabs

---

# Header

Sticky header containing:

- Logo
- Search input
- Notification button
- Bookmark button
- User avatar

Requirements

- Sticky
- White background
- Thin bottom border
- Slight backdrop blur while scrolling

---

# Category Tabs

Display categories as horizontal chips.

Example categories

- All
- Politics
- Economy
- Society
- Technology
- World
- Sports
- Entertainment

Requirements

- Horizontal scrolling on mobile
- Active category highlight
- Smooth transition

---

# Featured Article

Display one large featured article.

Include

- Cover image
- Category
- Title
- Summary
- Publisher
- Published date
- Estimated reading time
- Bookmark button

Requirements

- Large hero card
- Entire card clickable
- Image zoom on hover
- Soft shadow

---

# News Feed

Display a list of article cards.

Each card contains

- Thumbnail
- Category
- Title
- Summary
- Publisher
- Published date
- Reading time
- Bookmark button

Requirements

- Entire card clickable
- Responsive
- Soft hover animation
- Subtle shadow
- Image zoom effect

---

# Sidebar

Desktop only.

## Trending Topics

Display popular hashtags.

Example

- #AI
- #Samsung
- #Tesla
- #Korea

---

## Most Read

Display ranking list.

Each item includes

- Ranking number
- Article title
- Publisher

---

## Recommended Publishers

Example

- Yonhap News
- KBS
- SBS
- Korea Herald
- JoongAng Daily

Sidebar should remain sticky.

---

# UI States

## Loading

Use Skeleton Loading.

Do NOT use spinners.

---

## Empty State

Display an illustration and message

> No news available.

---

## Error State

Display

- Error icon
- Error message
- Retry button

---

# Responsive

Desktop

- Header
- Feed
- Sidebar

Tablet

- Sidebar hidden

Mobile

- Single column
- Compact header
- Horizontal category scrolling

---

# Folder Structure

```
src/

├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── article/
│   ├── category/
│   ├── search/
│   └── bookmark/
│
├── components/
│   ├── layout/
│   ├── feed/
│   ├── sidebar/
│   ├── common/
│   └── ui/
│
├── hooks/
├── services/
├── lib/
├── types/
├── data/
├── styles/
└── public/
```

---

# Components

```
components/

layout/
    Header.tsx
    Sidebar.tsx
    Footer.tsx

feed/
    FeaturedArticle.tsx
    NewsFeed.tsx
    ArticleCard.tsx
    CategoryTabs.tsx

sidebar/
    TrendingTopics.tsx
    MostRead.tsx
    RecommendedPublishers.tsx

common/
    SearchBox.tsx
    BookmarkButton.tsx
    LoadingSkeleton.tsx
    EmptyState.tsx
    ErrorState.tsx

ui/
    Button.tsx
    Badge.tsx
    Card.tsx
    Avatar.tsx
    Input.tsx
```

---

# Data Models

```ts
interface Article {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  category: string;
  publisher: string;
  publishedAt: string;
  readTime: number;
  bookmarked: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Publisher {
  id: string;
  name: string;
  logo?: string;
}
```

---

# Mock Data

Create mock data for:

- 30 Articles
- 8 Categories
- 5 Publishers
- 10 Trending Topics

The UI should be fully functional using mock data before integrating with APIs.

---

# Coding Standards

- TypeScript strict mode
- No `any`
- Functional components only
- Reusable components
- Clean architecture
- Consistent naming
- Strong typing
- Modular code
- Keep components focused on a single responsibility

---

# Animations

Use subtle animations only.

Examples

- Fade
- Scale
- Image zoom
- Shadow transition

Animation duration should be around 150–250ms.

---

# Accessibility

- Semantic HTML
- Keyboard navigation
- Proper aria labels
- Visible focus states
- Good color contrast

---

# Future Compatibility

The implementation should be easy to extend with:

- REST API
- Infinite Scroll
- Authentication
- Dark Mode
- Bookmark persistence
- Search
- Server-side rendering
- Pagination
- Filters

Avoid hardcoding data inside components.

---

# Goal

The final result should look and feel like a polished production news application inspired by Medium rather than a demo. Prioritize readability, clean UI, reusable architecture, responsive design, and maintainable code.
````
