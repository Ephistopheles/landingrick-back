# Landing Rick — Backend API

NestJS backend for the Rick Sanchez interdimensional presidential campaign landing page.
Handles game sessions, shuffle-bag message selection, theme escalation logic, and the Omega Device.

> **Parody project.** Not affiliated with Adult Swim, Cartoon Network, or any Rick and Morty property.

---

## Tech Stack

- **NestJS 11** — modular Node.js framework
- **TypeScript** — strict mode
- **@nestjs/config** — environment variable management via `ConfigModule`
- **@nestjs/swagger** — auto-generated API docs at `/docs`
- **cookie-parser** — signed session cookies (`rick_session`, `httpOnly`, 24h)
- **UUID** — session ID generation
- **In-memory store** — `Map<string, GameSession>` (no database required)

---

## Requirements

- Node.js ≥ 20
- npm ≥ 10

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
# Port the server will listen on
PORT=3001

# Frontend origin allowed by CORS (no trailing slash)
CORS_ORIGIN=http://localhost:4321

# Secret for signing session cookies — generate a secure random string:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
COOKIE_SECRET=your-random-secret-here
```

> **Never commit `.env`** — it is already in `.gitignore`.

### 3. Run in development

```bash
npm run dev
```

The server starts with watch mode (auto-reload on file changes).

### 4. Run in production

```bash
npm run build
npm run start:prod
```

---

## API Endpoints

All routes are prefixed with `/api`. Interactive docs available at `http://localhost:{PORT}/docs`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/game/session` | Get or create the current session |
| `POST` | `/api/game/vote` | Get a random vote quote (shuffle bag) |
| `POST` | `/api/game/theme-click` | Process a theme button click (escalation phases) |
| `POST` | `/api/game/lang-switch` | Get a language-switch insult, reset shuffle bags |
| `POST` | `/api/game/nuke` | Activate the Omega Device for this session |

### Session (`GET /api/game/session`)

Returns the current session state. Creates a new session and sets the `rick_session` cookie if none exists.

```json
{ "sessionId": "uuid", "isNuked": false, "themeClicks": 0 }
```

### Vote (`POST /api/game/vote`)

Returns a non-repeating random index from the vote quotes pool (shuffle bag resets once exhausted).

```json
{ "key": "voteQuotes", "index": 4 }
```

### Theme Click (`POST /api/game/theme-click`)

Escalates through four phases based on total click count:

| Clicks | Phase | Returns |
|--------|-------|---------|
| 1 – 5 | `insult` | `key`, `index` |
| 6 – 10 | `threat` | `key`, `index`, `pixelatedIp` |
| 11 – 15 | `warning` | `key`, `index` |
| 16+ | `corrupt` | `ip` (raw) |

### Lang Switch (`POST /api/game/lang-switch`)

Returns a language-switch insult key and resets all shuffle bags.

```json
{ "key": "langInsults", "index": 2 }
```

### Nuke (`POST /api/game/nuke`)

Marks the session as nuked permanently.

```json
{ "success": true }
```

---

## Project Structure

```
src/
  app.module.ts          # Root module
  main.ts                # Bootstrap (CORS, cookies, Swagger, global prefix)
  game/
    game.controller.ts   # Route handlers with Swagger decorators
    game.service.ts      # Business logic (escalation, shuffle bags)
    constants.ts         # Message pool sizes
    dto/                 # Response shape definitions
  session/
    session.service.ts   # In-memory session store
    session.interface.ts # GameSession type
    session.module.ts    # Global module
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with file watcher (development) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Start compiled app |
| `npm run start:prod` | Start compiled app in production mode |

---

## Author

**Johan Amed**  
GitHub: [Ephistopheles](https://github.com/Ephistopheles)  
Email: [rjohanamed@gmail.com](mailto:rjohanamed@gmail.com)

---

## License

MIT