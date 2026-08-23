# Next 10 Days: Self-Learning Study Packs

This folder contains the source generator for 30 printable worksheets. The generated PDFs are in `output/pdf/next-10-days/`.

Each pack has four pages:

1. Cover and the day's learning target.
2. From-zero notes and fully worked examples.
3. Six independent questions with working space.
4. Locked answers, a correction log, and send-back instructions.

## Daily order

| Study day | Pure Mathematics 1 | Mechanics 1 | AS Business |
|---|---|---|---|
| 1 | P1 Day 5: Coordinate geometry | M1 Day 4: Friction | Business Day 4: Market research |
| 2 | P1 Day 6: Circles | M1 Day 5: Inclined planes | Business Day 5: Product and price |
| 3 | P1 Day 7: Radians | M1 Day 6: Connected particles | Business Day 6: Promotion and place |
| 4 | P1 Day 8: Trigonometry | M1 Day 7: Equilibrium | Business Day 7: Production and productivity |
| 5 | P1 Day 9: Binomial expansion | M1 Day 8: Work and energy | Business Day 8: Capacity and quality |
| 6 | P1 Day 10: Sequences and series | M1 Day 9: Power | Business Day 9: Motivation |
| 7 | P1 Day 11: Differentiation | M1 Day 10: Momentum and impulse | Business Day 10: Leadership and organisation |
| 8 | P1 Day 12: Stationary points | M1 Day 11: Collisions | Business Day 11: Costs and break-even |
| 9 | P1 Day 13: Integration | M1 Day 12: Mixed Mechanics | Business Day 12: Cash flow |
| 10 | P1 Day 14: P1 consolidation | M1 Day 13: M1 consolidation | Business Day 13: Business consolidation |

## Student routine

- Complete page 2 with the answer page closed.
- Complete all six questions on page 3 without notes.
- Mark page 3 using page 4 in a different colour.
- Fill in the correction log for the first three errors.
- Send pages 3 and 4 back for teacher/AI marking.

## Rebuild

Run:

```bash
/Users/abdulwahabshafiq/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 study-packs/next-10-days/generate_packs.py
```
