# EcoBazar — High-Industrial E-Commerce Architecture

EcoBazar is a production-hardened, full-stack, enterprise-grade e-commerce platform designed for premium B2B bulk sourcing and B2C direct-to-consumer boutique shopping. Built using **React 18+, Vite, TypeScript, and Express**, the system features a robust offline-first caching layer, native environment validation, real-time AI-powered assistants, and structured, type-safe data pipelines.

---

## 🎨 Visual Identity & Brand System

EcoBazar's interface is crafted following modern, high-contrast, Swiss-inspired design principles rather than generic dashboard blueprints.
- **Brand Palette**:
  - **Primary**: Deep Teal (`#008D7F` / `#00B894`), conveying organic, trustworthy sourcing.
  - **Light Canvas**: Balanced off-white slate (`#ebf6f2` to `#f8fafc`) with deep charcoal text (`#1e293b`).
  - **Dark Canvas (Obsidian Green)**: Ultra-sleek obsidian/slate charcoal (`#090d16` to `#090e0c`) with sage accents.
- **Typography pairing**:
  - **Display Headings**: *Space Grotesk* — bold, geometric, tech-forward.
  - **Body copy**: *Inter* — modern, readable, highly legible.
  - **Technical Metrics / Price Tags**: *JetBrains Mono* / *Fira Code* — precise, industrial, clean.

---

## 🚀 Key Architectural Modules

### 1. Robust Type Safety & Domain Models (`src/types/index.ts`)
The entire application is bound by a unified, type-safe schema modeling core domains with strict TypeScript interfaces:
- **Product Model**: Supports dynamic Alibaba-style wholesale properties (MOQ, multi-tier volume discounts, verified suppliers).
- **Cart & Order System**: Local-storage persisted, highly interactive, supporting offline-first operations.
- **Blog & Review Systems**: Type-safe structures representing customer feedback, metadata, and markdown articles.

### 2. Full-Stack Routing & Navigation Router
EcoBazar implements a clean, high-performance hash router that maps:
- `#/` - Home View
- `#/shop` - Bento-grid Product Catalog (with responsive sliding sheet-drawer filters and brand checklist)
- `#/product/:id` - Immersive Product Details (with custom magnification hover zoom, photo/video preview toggles, Q&A Assistant tab)
- `#/track-order` - Real-time tracking and delivery logs
- `#/blog` & `#/blog/:slug` - Editorial insights and articles
- `#/compare` - Dynamic side-by-side product attribute comparison
- `#/wishlist` - Client-persisted save-for-later collection
- `#/checkout` - Advanced multi-tier billing calculator

### 3. Integrated AI Engines (`server.ts`)
The server exposes two Gemini-powered REST APIs (fully guarded with fallback heuristic handlers if the API key is not configured or offline):
- **AI Shopping Assistant** (`/api/shopping-assistant`): Fully aware of real-time inventory, materials, and shipping rates, offering customer assistance in English or Bengali.
- **SEO Health Checker & Trend Analyzer** (`/api/seo-health-checker`): Crawls product metadata to calculate Google snippet optimization scores and dynamically suggests higher-volume keywords.

---

## ⚙️ Environment Configuration

Define your variables inside a `.env` file at the root. Make sure they align with the `.env.example` blueprint:

```env
# Server Ingress Port Configuration
PORT=3000

# Server-Side Secure Secrets (Never exposed to frontend)
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend Client Public Variables
VITE_API_URL=http://localhost:3000
```

---

## 🛠️ Installation & Local Development

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server** (Runs both Express backend and Vite frontend concurrently):
   ```bash
   npm run dev
   ```

3. **Production Compilation**:
   ```bash
   npm run build
   ```
   The build pipeline compiles:
   - Frontend static files inside `/dist`
   - Express server bundled with esbuild into a CJS-safe module `/dist/server.cjs`

4. **Production Start**:
   ```bash
   npm start
   ```

---

## 📡 API Endpoint Schema Specification

### 1. AI Shopping Assistant
- **Endpoint**: `POST /api/shopping-assistant`
- **Request Body**:
  ```json
  {
    "product": {
      "title": "Premium Digital Rechargeable Mini Fan Collection",
      "price": 450,
      "category": "Smart Gadgets",
      "description": "Stay cool...",
      "quantity": 150
    },
    "messages": [
      { "role": "user", "content": "How much does express shipping cost?" }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "reply": "Express shipping to your location costs ৳450 BDT, arriving in 3-5 business days. Standard shipping is entirely free!",
    "source": "gemini_api"
  }
  ```

### 2. SEO Health & Trends Analyzer
- **Endpoint**: `POST /api/seo-health-checker`
- **Request Body**:
  ```json
  {
    "product": {
      "title": "Aesthetic Pearl Necklace Combo",
      "category": "Fashion Accessories",
      "description": "Luxury beads..."
    },
    "trends": [
      { "keyword": "handmade silver gemstone rings", "volume": 94 }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "result": {
      "score": 85,
      "analysis": [
        { "item": "Title Length", "grade": "A", "status": "Optimal", "feedback": "Ideal for snippets." }
      ],
      "matchedKeywords": [],
      "suggestedTitle": "Eco-Bazar Aesthetic Pearl Necklace Combo | Handmade Gemstone Sourcing",
      "suggestedDesc": "Get our Aesthetic Pearl Necklace...",
      "suggestedKeywords": "handmade silver gemstone rings, buy pearl neck",
      "trendInsights": "Search interest is actively rising."
    },
    "source": "fallback_heuristic"
  }
  ```

---

## 🚀 Deployment

The repository contains a fully verified `/vercel.json` and a modular build config suitable for immediate serverless deployments (Vercel, Cloud Run, AWS Elastic Beanstalk):
- Static and API routes are routed safely using root-level Vercel rewrites.
- Memory and load optimizations are enforced by lazy-loading images, chunking heavy libraries, and bundle minimization.
