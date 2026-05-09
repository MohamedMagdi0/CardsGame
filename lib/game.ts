import { Card, GameState, Rank, Suit } from "./types";

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const RANKS: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        value: getInitialValue(rank),
      });
    }
  }
  return deck;
}

function getInitialValue(rank: Rank): number {
  if (rank === "A") return 1;
  if (["2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(rank))
    return parseInt(rank);
  return 5; // J, Q, K
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function initializeGame(): GameState {
  const deck = shuffleDeck(createDeck());
  const currentCard = deck.pop()!;
  return {
    deck,
    currentCard,
    score: 0,
    faceValues: { J: 5, Q: 5, K: 5 },
    reshufflesLeft: 1, // Allow one reshuffle
    gameOver: false,
  };
}

export function makeGuess(
  state: GameState,
  guess: "higher" | "lower",
): GameState {
  if (state.gameOver) return state;

  let newDeck = [...state.deck];
  let reshufflesLeft = state.reshufflesLeft;
  let gameOver = false;

  if (newDeck.length === 0) {
    if (reshufflesLeft > 0) {
      newDeck = shuffleDeck(createDeck());
      reshufflesLeft -= 1;
    } else {
      gameOver = true;
    }
  }

  if (gameOver) {
    return {
      ...state,
      gameOver: true,
    };
  }

  const nextCard = newDeck.pop()!;
  const isCorrect = evaluateGuess(state.currentCard!, nextCard, guess);

  let newScore = state.score;
  let newFaceValues = { ...state.faceValues };

  // Update face values
  const involvedCards = [state.currentCard!.rank, nextCard.rank].filter((r) =>
    ["J", "Q", "K"].includes(r),
  ) as ("J" | "Q" | "K")[];
  for (const rank of involvedCards) {
    if (isCorrect) {
      newFaceValues[rank] = Math.min(10, newFaceValues[rank] + 1);
    } else {
      newFaceValues[rank] = Math.max(1, newFaceValues[rank] - 1);
    }
  }

  if (isCorrect) {
    newScore += 1;
  }

  // Update card values based on new face values
  const updatedCurrentCard = {
    ...state.currentCard!,
    value: getValue(state.currentCard!.rank, newFaceValues),
  };
  const updatedNextCard = {
    ...nextCard,
    value: getValue(nextCard.rank, newFaceValues),
  };

  return {
    deck: newDeck,
    currentCard: updatedNextCard,
    score: newScore,
    faceValues: newFaceValues,
    reshufflesLeft,
    gameOver,
  };
}

function evaluateGuess(
  current: Card,
  next: Card,
  guess: "higher" | "lower",
): boolean {
  if (current.value === next.value) return false; // Equal values are incorrect
  if (guess === "higher") return next.value > current.value;
  return next.value < current.value;
}

function getValue(
  rank: Rank,
  faceValues: Record<"J" | "Q" | "K", number>,
): number {
  if (rank === "A") return 1;
  if (["2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(rank))
    return parseInt(rank);
  return faceValues[rank as "J" | "Q" | "K"];
}
