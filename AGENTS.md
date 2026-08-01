# Project operating rules

- Canonical root: `/Users/timeabout/projects/split-snap`. Do not create or use `splitsnap` or other duplicate roots.
- `product/problem-definition.md` is the V1 product authority; implement only its frozen scope.
- Owner has authorized implementation and public launch. Do not treat wording such as “not yet validated” as a reason to idle; preserve claims honestly while building.
- Use TDD for calculation, persistence, sharing, offline, and accessibility-critical behavior.
- Review gates protect material correctness/privacy/release risk; do not restart 3-pass review for formatting, bookkeeping, or evidence-file trivia.
- In each run, continue through as many dependent steps as time permits: fix, review, implement, test, commit, push, deploy, verify.
- Never commit secrets or user bill data.
