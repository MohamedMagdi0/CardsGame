# Higher or Lower Card Game

A fully functional Higher or Lower card game built with Next.js 14+ using the App Router. The game logic runs server-side via API routes, with persistent session state managed through HTTP cookies.

## Game Rules

- **Card Values**: 2-10 face value, Ace=1, J/Q/K start at 5 and mutate during play.
- **Dynamic Face-Card Values**: J, Q, K values change based on guess correctness:
  - Correct guess involving the face card → value +1
  - Wrong guess involving the face card → value -1
  - Values are bounded between 1 and 10.
- **Game Flow**: Shuffle deck, draw first card, guess higher/lower, draw next, evaluate, score, repeat until deck empty, auto-reshuffle once, then game over.
- **Equal Values**: Treated as incorrect guesses.
- **Persistence**: Face-card values persist across reshuffles; score accumulates until game over.

## Architecture & Design Decisions

### Clean Architecture

The codebase follows clean architecture principles with clear separation of concerns:

- **Domain Layer** (`lib/types.ts`, `lib/game.ts`): Core business logic, game rules, and data structures. Pure functions with no side effects.
- **Application Layer** (`app/api/`): API routes handle HTTP requests, orchestrate domain logic, and manage session state.
- **Presentation Layer** (`app/components/Game.tsx`, `app/page.tsx`): React components for UI, client-side state management.

### Key Design Choices

- **Server-Side Game Logic**: All card manipulation, scoring, and state transitions happen on the server to prevent cheating and ensure consistency.
- **Session Persistence**: Game state stored in HTTP cookies for simplicity and stateless server design.
- **TypeScript**: Strong typing throughout for reliability and maintainability.
- **Tailwind CSS**: Simple, responsive styling without external UI libraries.
- **Edge Cases Handling**:
  - Face-card values clamped to [1, 10] range.
  - Equal card values result in incorrect guesses.
  - Seamless reshuffle when deck empties (one reshuffle allowed).
  - Game ends after reshuffle exhaustion.

### Trade-offs

- **Cookie Size**: Game state (deck of cards) stored in cookies; for larger games, consider server-side sessions or database.
- **No Animations**: Focused on core functionality; animations could be added for polish.
- **Single Reshuffle**: Limited to one reshuffle for simplicity; could be configurable.
- **No Probability Display**: Bonus feature not implemented; would require additional UI and calculations.

## Setup & Running Locally

1. **Prerequisites**: Node.js 18+, npm
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
4. **Open Browser**: Navigate to [http://localhost:3000](http://localhost:3000) (or 3001 if 3000 is in use)

## Project Structure

```
├── app/
│   ├── api/game/
│   │   ├── start/route.ts    # Initialize new game
│   │   ├── guess/route.ts    # Process higher/lower guesses
│   │   └── state/route.ts    # Get current game state
│   ├── components/
│   │   └── Game.tsx          # Main game UI component
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── lib/
│   ├── game.ts               # Game logic and state management
│   └── types.ts              # TypeScript type definitions
└── README.md
```

## API Endpoints

- `POST /api/game/start`: Initialize a new game session
- `POST /api/game/guess`: Submit a guess (body: `{ "guess": "higher" | "lower" }`)
- `GET /api/game/state`: Retrieve current game state

## Technologies Used

- **Next.js 14**: App Router, API routes, server components
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling
- **React**: Client-side interactivity

## Future Enhancements

- Unit tests for game logic
- Animations and transitions
- Probability calculations display
- Streak counters
- Multiple difficulty levels
- Leaderboards
