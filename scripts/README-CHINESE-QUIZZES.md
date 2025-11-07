# Chinese Quiz Management

This guide explains how to manage Chinese DMV quizzes with automatic numbering and ID generation.

## Overview

The Chinese quiz system automatically handles:
- ✅ Quiz numbering (Practice Test #1, #2, #3, etc.)
- ✅ Question numbering (1, 2, 3, etc.)
- ✅ API endpoint generation (`/api/quizzes/chinese-practice-test-4`)
- ✅ Quiz IDs and titles
- ✅ Consistent formatting

## File Structure

```
src/data/
  └── chinese-quizzes.json          # Main quiz data file

scripts/
  ├── add-chinese-quiz.js           # Management script
  └── README-CHINESE-QUIZZES.md     # This file
```

## Using the Management Script

### List All Quizzes

```bash
node scripts/add-chinese-quiz.js list
```

This shows all existing Chinese quizzes with their:
- Title
- ID
- Number of questions
- API endpoint

### Renumber Questions

If question IDs get out of sync, run:

```bash
node scripts/add-chinese-quiz.js renumber
```

This automatically renumbers all questions in all quizzes (1, 2, 3, etc.).

## Adding a New Quiz Manually

### Step 1: Open the quiz file

Edit `src/data/chinese-quizzes.json`

### Step 2: Add your quiz data

The script automatically handles numbering, but you need to:
1. Determine if it's a "simulator" or "practice" test
2. If practice, what number it should be (the script can auto-detect the next number)

### Format for a Quiz:

```json
{
  "id": "chinese-practice-test-4",
  "title": "DMV Chinese Practice Test #4 / DMV 中文練習考試 #4",
  "description": "California DMV 中文練習考試 - 基本交通規則和標誌。California DMV Chinese driving practice test with 10 real questions.",
  "category": "Chinese Tests / 中文考試",
  "slug": "practice-test-4",
  "passingScore": 85,
  "timeLimit": 30,
  "language": "zh",
  "questions": [
    {
      "id": 1,
      "question": "您的問題在這裡？",
      "options": [
        "選項 A",
        "選項 B",
        "選項 C"
      ],
      "correctAnswer": 0,
      "explanation": "解釋在這裡。",
      "category": "類別",
      "difficulty": "easy"
    }
  ]
}
```

### Step 3: Automatic Naming Convention

The system uses these patterns:

**For Simulator Test:**
- ID: `chinese-simulator-test`
- Title: `DMV Chinese Simulator Test / DMV 中文模擬考試`
- Slug: `simulator-test`
- API: `/api/quizzes/chinese-simulator-test`

**For Practice Tests:**
- ID: `chinese-practice-test-{N}` (e.g., `chinese-practice-test-4`)
- Title: `DMV Chinese Practice Test #{N} / DMV 中文練習考試 #{N}`
- Slug: `practice-test-{N}`
- API: `/api/quizzes/chinese-practice-test-{N}`

## Quick Reference: Answer Letters to Indices

When entering `correctAnswer`, use these indices:

- `a` or `A` = `0`
- `b` or `B` = `1`
- `c` or `C` = `2`
- `d` or `D` = `3`

Example: If the answer is "b", use `"correctAnswer": 1`

## Categories (Chinese)

Common categories to use:
- `安全` - Safety
- `法規` - Regulations
- `速度` - Speed
- `停車` - Parking
- `轉彎` - Turning
- `交通信號` - Traffic Signals
- `行人` - Pedestrians
- `高速公路` - Highway
- `照明` - Lighting
- `天氣` - Weather
- `鐵路` - Railroad
- `一般` - General

## Difficulty Levels

- `easy` - Easy questions
- `medium` - Medium difficulty
- `hard` - Hard questions

## Example Workflow

### Adding a new Practice Test #5

1. Open `src/data/chinese-quizzes.json`
2. Copy an existing practice test object
3. Update the number: `4` → `5`
4. Update all references:
   - `id`: `chinese-practice-test-5`
   - `title`: Include `#5`
   - `slug`: `practice-test-5`
5. Add your 10 questions
6. Save the file
7. Run: `node scripts/add-chinese-quiz.js renumber` (to ensure proper numbering)
8. Run: `node scripts/add-chinese-quiz.js list` (to verify)
9. Test: `curl http://localhost:3000/api/quizzes/chinese-practice-test-5`

## Current Quizzes

As of now, we have:
1. Chinese Simulator Test (10 questions)
2. Chinese Practice Test #1 (10 questions)
3. Chinese Practice Test #2 (10 questions)
4. Chinese Practice Test #3 (10 questions)

**Total: 40 questions across 4 quizzes**

## API Endpoints

All Chinese quizzes are accessible via:

**List all quizzes:**
```
GET /api/quizzes
```

**Get specific Chinese quiz:**
```
GET /api/quizzes/chinese-simulator-test
GET /api/quizzes/chinese-practice-test-1
GET /api/quizzes/chinese-practice-test-2
GET /api/quizzes/chinese-practice-test-3
```

**Filter by language (future enhancement):**
```
GET /api/quizzes?language=zh
```

## Troubleshooting

### Questions are not numbered correctly
Run: `node scripts/add-chinese-quiz.js renumber`

### Quiz doesn't appear in API
1. Check the JSON file is valid (use a JSON validator)
2. Restart the Next.js dev server
3. Check that the quiz is in the `quizzes` array

### Duplicate quiz IDs
Each quiz must have a unique ID. Use the naming convention:
- `chinese-simulator-test` (only one)
- `chinese-practice-test-1`, `chinese-practice-test-2`, etc.

## Tips

1. **Consistent formatting**: Keep the same structure for all quizzes
2. **Explanations**: Always provide clear explanations in Chinese
3. **Question quality**: Ensure questions are relevant to California DMV rules
4. **Testing**: Always test new quizzes via the API before deploying
5. **Backup**: Keep a backup of `chinese-quizzes.json` before making major changes

## Future Enhancements

Planned features:
- Interactive quiz creation via CLI
- Import from CSV/Excel
- Automatic translation validation
- Quiz difficulty analysis
- Question statistics tracking
