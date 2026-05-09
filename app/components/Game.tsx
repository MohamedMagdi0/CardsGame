"use client";

import { useState, useEffect } from "react";
import { Card } from "@/lib/types";

interface GameState {
  currentCard: Card | null;
  score: number;
  faceValues: Record<"J" | "Q" | "K", number>;
  gameOver: boolean;
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGameState();
  }, []);

  const fetchGameState = async () => {
    const res = await fetch("/api/game/state");
    const data = await res.json();
    setGameState(data);
  };

  const startGame = async () => {
    setLoading(true);
    await fetch("/api/game/start", { method: "POST" });
    await fetchGameState();
    setLoading(false);
  };

  const makeGuess = async (guess: "higher" | "lower") => {
    setLoading(true);
    const res = await fetch("/api/game/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess }),
    });
    const data = await res.json();
    setGameState(data);
    setLoading(false);
  };

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8">Higher or Lower Card Game</h1>
        <button
          onClick={startGame}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Starting..." : "Start Game"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Higher or Lower</h1>
      <div className="text-xl mb-4">Score: {gameState.score}</div>
      <div className="mb-4">
        Face Values: J: {gameState.faceValues.J}, Q: {gameState.faceValues.Q},
        K: {gameState.faceValues.K}
      </div>
      {gameState.gameOver ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-4">Final Score: {gameState.score}</p>
          <button
            onClick={startGame}
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-6xl mb-8">
            {gameState.currentCard
              ? `${gameState.currentCard.rank}${getSuitSymbol(gameState.currentCard.suit)}`
              : ""}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => makeGuess("higher")}
              disabled={loading}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Higher
            </button>
            <button
              onClick={() => makeGuess("lower")}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Lower
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getSuitSymbol(suit: string): string {
  switch (suit) {
    case "hearts":
      return "♥";
    case "diamonds":
      return "♦";
    case "clubs":
      return "♣";
    case "spades":
      return "♠";
    default:
      return "";
  }
}
