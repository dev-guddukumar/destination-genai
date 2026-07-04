# Wanderlore

A modular cultural travel companion — 13 AI-powered modules sharing one persona, built with React and free LLM APIs.

## Modules

| Group | Modules |
|-------|---------|
| **Overview** | Dashboard |
| **Plan** | Discovery, Smart Itinerary, Budget Planner, Packing |
| **Culture** | Cultural Story, Hidden Gems, Local Events, Food Explorer |
| **Tools** | Safety Advisor, Local Guide, Translator, Offline Kit |

Each module sends structured JSON to the AI with your full traveler context and module-specific instructions.

## Quick start

```bash
npm install
npm run dev
```

1. Add a free API key (OpenRouter or Groq) in **Settings**
2. Fill in your **trip profile** (destination, dates, interests)
3. Pick a **module** from the left nav and hit **Generate**

## Architecture

```
src/
  config/modules.ts      # Module definitions (13 modules)
  types/index.ts         # TravelerContext, ModuleId, etc.
  prompts/
    system.ts            # Core Wanderlore system prompt
    buildMessages.ts     # JSON payload + chat message builder
  lib/
    context.ts           # Profile → TravelerContext
    llm.ts               # OpenRouter / Groq streaming client
    storage.ts           # localStorage persistence
  hooks/
    useModuleChat.ts     # Per-module AI chat logic
    useSettings.ts       # API key management
    useTheme.ts          # Light / dark / auto
  components/
    layout/              # ModuleNav, MobileNav
    module/              # ModuleWorkspace, ModuleHeader
```

## API request format

Each module call sends:

```json
{
  "active_module": "SMART_ITINERARY",
  "traveler_context": { ... },
  "user_request": "Plan day 2 with more food"
}
```

## Free AI providers

| Provider | Sign up |
|----------|---------|
| [OpenRouter](https://openrouter.ai/keys) | Free models + optional premium |
| [Groq](https://console.groq.com/keys) | Fast free inference |

Keys stay in your browser only — no backend required.

## Scripts

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # oxlint
```
# destination-genai
