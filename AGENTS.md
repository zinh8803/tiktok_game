# Workspace Agent Guidelines & gstack Integration

This workspace integrates **gstack** (`garrytan/gstack`), structuring AI agent interactions according to rigorous software engineering discipline:

## Core Principles
1. **Boil the Ocean**: Complete coverage with minimal code. Cover all edge cases, validations, and tests.
2. **Search Before Building**: Thoroughly check existing codebase utilities before creating new functions or adding dependencies.
3. **The Reuse Ladder**:
   - Level 1: Existing helpers/patterns in `backend/src/` or `frontend/src/`
   - Level 2: Node.js / JavaScript standard library (`node:sqlite`, `crypto`, etc.)
   - Level 3: Native web & CSS features
   - Level 4: Already-installed dependencies. Never install a package for what a few lines of code can solve.
4. **Root-Cause Fixes**: Fix the core architectural issue, not superficial symptoms.
5. **Anti-Slop UI & Clean Code**: Keep designs sharp, responsive, and functional without visual clutter or filler AI text.

## gstack Virtual Engineering Skills (`.agents/skills/`)
The agent can adopt specialized cognitive modes to assist throughout the product lifecycle:
- `/office-hours`: Brainstorm and challenge premises before writing code.
- `/plan-eng-review`: Architecture & data flow review.
- `/plan-ceo-review`: Scope & product-market fit challenge.
- `/plan-design-review` & `/design-review`: UX and UI polish audit.
- `/review`: Staff engineer code review for regressions & race conditions.
- `/qa`: End-to-end browser and API flow testing.
- `/cso`: OWASP and security compliance check.
- `/ship`: Release engineering, test suite execution, and clean PR generation.
- `/autoplan`: Automated full sprint plan and review.

See [.agents/rules/gstack.md](file:///c:/vinhnq/tiktok_game/.agents/rules/gstack.md) for detailed guidelines.
