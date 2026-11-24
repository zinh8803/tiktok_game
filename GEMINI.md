# Project Instructions for Gemini & Antigravity Agents

Follow the **gstack** engineering standards defined in [AGENTS.md](file:///c:/vinhnq/tiktok_game/AGENTS.md) and [.agents/rules/gstack.md](file:///c:/vinhnq/tiktok_game/.agents/rules/gstack.md).

## Quick Reference
- **Stack**: NestJS (Node 22 built-in `node:sqlite`), Socket.IO, Vue 3, Vite, Pinia, Tailwind/custom CSS.
- **Port Mapping**:
  - Backend: `http://localhost:4100`
  - Frontend: `http://localhost:3001`
- **Quality Gates**:
  - Backend build: `npm --prefix backend run build`
  - Frontend build: `npm --prefix frontend run build`
  - Verification: `npm --prefix backend run verify`
- **gstack Command Modes**:
  - `/office-hours`, `/plan-eng-review`, `/review`, `/qa`, `/ship`, `/cso`
