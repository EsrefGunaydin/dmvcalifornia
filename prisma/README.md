# Database Schema Documentation

## Overview

This Prisma schema defines the database structure for the DMV California platform, supporting both blog content (migrated from WordPress) and a comprehensive quiz system.

## Schema Sections

### 1. Blog Content Models

Migrated from WordPress `wp_posts`, `wp_terms` tables:

- **Post**: Blog articles with SEO fields, multi-language support
- **Category**: Content categorization
- **Tag**: Content tagging
- **CategoryOnPost** & **TagOnPost**: Many-to-many relationships

**Key Features:**
- Preserves WordPress post IDs (`wpId`) for migration tracking
- SEO metadata (from RankMath plugin)
- Multi-language support
- Slug-based routing for SEO

### 2. Quiz System Models

Migrated from WP Pro Quiz plugin (`wp_wp_pro_quiz_*` tables):

- **Quiz**: Quiz metadata, settings, configuration
- **Question**: Quiz questions with explanations and tips
- **Answer**: Multiple choice answers (supports images for sign tests)

**Quiz Features:**
- Multi-language quizzes (English, Spanish, Turkish, etc.)
- Randomization (questions & answers)
- Time limits
- Passing score configuration
- Difficulty levels
- Categories (Traffic Laws, Road Signs, Parking, etc.)

### 3. User Progress & Stats Models

Track user performance and engagement:

- **User**: Registered or anonymous users
- **QuizAttempt**: Complete quiz attempt with score
- **QuestionAttempt**: Individual question answers for detailed analytics

**Stats Features:**
- Anonymous user tracking (via sessionId)
- Detailed timing data
- Correct/incorrect tracking
- Point system
- Tip usage tracking
- Historical performance

## Enums

### Language
Supported languages for quizzes and content:
- ENGLISH, SPANISH, TURKISH, FRENCH, CHINESE, VIETNAMESE, KOREAN

### Difficulty
- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

### QuizCategory
- GENERAL, TRAFFIC_LAWS, ROAD_SIGNS, PARKING, SAFETY
- RIGHT_OF_WAY, PENALTIES, MOTORCYCLE, COMMERCIAL
- DEFENSIVE_DRIVING, NIGHT_DRIVING, EMERGENCY

### AnswerType
- SINGLE_CHOICE (one correct answer)
- MULTIPLE_CHOICE (multiple correct answers)
- TRUE_FALSE

## Database Setup

### Option 1: Local PostgreSQL with Docker

```bash
# Start PostgreSQL container
docker run --name dmv-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dmvcalifornia \
  -p 5432:5432 \
  -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dmvcalifornia?schema=public"
```

### Option 2: Vercel Postgres (for production)

1. Create Vercel Postgres database
2. Copy connection string to `.env`
3. Run migrations

### Running Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# (Later) Create migration
npx prisma migrate dev --name init

# View database in Prisma Studio
npx prisma studio
```

## Migration from WordPress

### Data Mapping

**WordPress → Prisma:**

| WordPress Table | Prisma Model | Notes |
|----------------|--------------|-------|
| `wp_posts` | `Post` | Blog articles |
| `wp_terms` | `Category`, `Tag` | Taxonomy |
| `wp_wp_pro_quiz_master` | `Quiz` | Quiz metadata |
| `wp_wp_pro_quiz_question` | `Question`, `Answer` | Quiz content |
| `wp_wp_pro_quiz_statistic` | `QuizAttempt`, `QuestionAttempt` | User stats |

### Migration Scripts

Located in `/scripts/`:
- `migrate-posts.ts` - Blog content migration
- `migrate-quizzes.ts` - Quiz data migration (Option B)
- `migrate-stats.ts` - User statistics migration

## Indexes

Optimized indexes for performance:
- Post slugs, publish dates, language
- Quiz slugs, categories, language
- User attempts by date
- Question ordering within quizzes

## Relationships

### Blog
```
Post ←→ Category (many-to-many via CategoryOnPost)
Post ←→ Tag (many-to-many via TagOnPost)
```

### Quiz
```
Quiz → Question (one-to-many)
Question → Answer (one-to-many)
Quiz → QuizAttempt (one-to-many)
QuizAttempt → QuestionAttempt (one-to-many)
User → QuizAttempt (one-to-many, optional)
```

## Multi-language Strategy

Each quiz and post has a `language` field:
- Same quiz content in different languages stored as separate Quiz records
- Linked by same `slug` pattern (e.g., `dmv-test` vs `dmv-test-es`)
- Filter queries by language for appropriate content display

## Anonymous User Tracking

For user loyalty without requiring registration:
1. Generate unique `sessionId` on first visit (localStorage)
2. Store in `QuizAttempt.sessionId`
3. Track progress, scores, history
4. Option to "claim" attempts when user registers

## Example Queries

### Get Quiz with Questions
```typescript
const quiz = await prisma.quiz.findUnique({
  where: { slug: 'dmv-driving-test' },
  include: {
    questions: {
      include: { answers: true },
      orderBy: { order: 'asc' }
    }
  }
});
```

### Record Quiz Attempt
```typescript
const attempt = await prisma.quizAttempt.create({
  data: {
    sessionId: userSessionId,
    quizId: quiz.id,
    score: 85,
    pointsEarned: 34,
    pointsPossible: 40,
    correctCount: 34,
    totalQuestions: 40,
    timeSpent: 1200,
    startedAt: startTime,
    questionAttempts: {
      create: answers.map(a => ({
        questionId: a.questionId,
        selectedAnswer: a.answerId,
        isCorrect: a.correct,
        pointsEarned: a.correct ? 1 : 0
      }))
    }
  }
});
```

### Get User Stats
```typescript
const stats = await prisma.quizAttempt.findMany({
  where: { sessionId: userSessionId },
  include: { quiz: true },
  orderBy: { completedAt: 'desc' }
});
```

## Future Enhancements

Potential additions:
- [ ] `QuizCollection` - Group related quizzes
- [ ] `Achievement` - Badges and milestones
- [ ] `StudyPlan` - Personalized learning paths
- [ ] `Feedback` - User quiz feedback
- [ ] `Leaderboard` - Top scores (optional)

---

**Status**: ✅ Schema Complete | Ready for Migration
