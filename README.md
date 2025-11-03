# DMV California - Next.js Quiz Platform

> Transforming a WordPress blog into a modern, interactive DMV quiz platform

## Project Overview

This is a complete rebuild of [dmvcalifornia.us](https://www.dmvcalifornia.us/) from WordPress to Next.js, focusing on:

- 🎯 **Interactive Quiz Platform** - Practice tests for California DMV
- 📚 **SEO-Preserved Blog Content** - All existing articles with original URLs
- 🚀 **Modern Performance** - Fast, responsive, mobile-first
- 📊 **Progress Tracking** - User quiz scores and improvement tracking
- 🎨 **Fresh Design** - Clean, engaging UI with gamification

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Prisma ORM)
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics

## Project Structure

```
dmvcalifornia/
├── src/
│   ├── app/                    # Next.js app router pages
│   ├── components/
│   │   ├── quiz/              # Quiz-related components
│   │   ├── blog/              # Blog-related components
│   │   └── ui/                # Shared UI components
│   └── lib/
│       ├── db/                # Database queries
│       ├── quiz-engine/       # Quiz logic
│       └── utils/             # Helper functions
├── prisma/                     # Database schema
├── data/wordpress/            # WordPress migration data
└── public/                    # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ (you currently have 18.20.3)
- npm or yarn
- WordPress database export (see `data/wordpress/README.md`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Migration Roadmap

### Phase 1: Setup ✅
- [x] Next.js project initialization
- [x] TypeScript configuration
- [x] Tailwind CSS setup
- [ ] Prisma setup

### Phase 2: WordPress Migration (In Progress)
- [ ] Export WordPress database
- [ ] Analyze content structure
- [ ] Design new database schema
- [ ] Build migration scripts
- [ ] Preserve all URLs for SEO

### Phase 3: Quiz System
- [ ] Design quiz engine
- [ ] Source DMV questions
- [ ] Build quiz UI components
- [ ] Implement progress tracking
- [ ] Create quiz categories

### Phase 4: Blog Integration
- [ ] Migrate blog posts
- [ ] Category/tag system
- [ ] Related posts
- [ ] SEO optimization

### Phase 5: Launch
- [ ] Performance optimization
- [ ] Final testing
- [ ] Deploy to Vercel
- [ ] DNS migration

## WordPress Data

To begin migration:

1. Export your WordPress MySQL database
2. Place the `.sql` file in `data/wordpress/`
3. See `data/wordpress/README.md` for detailed instructions

## Features

### Current (WordPress Site)
- Blog articles about DMV procedures
- Limited quiz functionality
- Good SEO performance

### New (Next.js Platform)
- ✨ **Interactive Quizzes**
  - Multiple categories (Road Signs, Traffic Laws, etc.)
  - Timed challenges
  - Detailed explanations
  - Progress tracking

- 📱 **Mobile-First Design**
  - Responsive on all devices
  - Touch-friendly quiz interface
  - Offline capability (PWA)

- 🎯 **Gamification**
  - Score history
  - Achievement badges
  - Daily challenges
  - Leaderboards

- 📈 **Analytics**
  - User progress tracking
  - Question difficulty analysis
  - Pass rate statistics

## Brand Colors

- **Primary Orange**: `#f4511e`
- See `tailwind.config.ts` for full color palette

## License

Proprietary - All rights reserved

## Contact

For questions about this migration project, contact the development team.

---

**Status**: 🚧 In Active Development
