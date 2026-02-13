---
description: How to seed the database with VIA form questions
---

This workflow seeds the database with the VIA character strengths questions.

1. Ensure your database is running and reachable.
2. Run the seed script:

```bash
node scripts/seed-questions.js
```

This will populate the `form_questions` table with the VIA items defined in `src/core/content/questionnaire-items.ts`.
