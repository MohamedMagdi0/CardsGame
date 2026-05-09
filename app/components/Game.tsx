"use client";

import { useEffect, useState } from "react";
import { Card } from "@/lib/types";

interface GameState {
  deck: Card[];
  currentCard: Card | null;
  score: number;
  faceValues: Record<"J" | "Q" | "K", number>;
  gameOver: boolean;
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    if (!gameState?.currentCard) return;
    setCardFlipped(true);
    const timeout = setTimeout(() => setCardFlipped(false), 420);
    return () => clearTimeout(timeout);
  }, [gameState?.currentCard]);

  console.log(gameState);

  const startGame = async () => {
    setLoading(true);
    console.log("starting...");

    try {
      const res = await fetch("/api/game/start", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Failed to start game");
      const data = await res.json();
      if (data.gameState) {
        setGameState(data.gameState);
      } else {
        setGameState(data);
      }
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setLoading(false);
    }
  };

  const makeGuess = async (guess: "higher" | "lower") => {
    setLoading(true);
    try {
      const res = await fetch("/api/game/guess", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess, gameState }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error ?? "Failed to make guess");
      }
      const data = await res.json();
      if (data.gameState) {
        setGameState(data.gameState);
      } else {
        setGameState(data);
      }
    } catch (error) {
      console.error("Error making guess:", error);
    } finally {
      setLoading(false);
    }
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
          <div className="relative mb-8">
            <div className="card-stack"></div>
            <div
              className={`game-card ${cardFlipped ? "flip" : ""} ${
                gameState.currentCard &&
                ["hearts", "diamonds"].includes(gameState.currentCard.suit)
                  ? "card-red"
                  : "card-black"
              }`}
            >
              <div className="card-corner top-left">
                <span>{gameState.currentCard?.rank}</span>
                <span>{getSuitSymbol(gameState.currentCard?.suit ?? "")}</span>
              </div>
              <div className="card-suit">
                {getSuitSymbol(gameState.currentCard?.suit ?? "")}
              </div>
              <div className="card-corner bottom-right">
                <span>{gameState.currentCard?.rank}</span>
                <span>{getSuitSymbol(gameState.currentCard?.suit ?? "")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 mb-6 text-sm text-slate-600">
            <span>Deck remaining: {gameState.deck.length}</span>
            <span>
              Face values: J: {gameState.faceValues.J}, Q:{" "}
              {gameState.faceValues.Q}, K: {gameState.faceValues.K}
            </span>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => makeGuess("higher")}
              disabled={loading}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              Higher
            </button>
            <button
              onClick={() => makeGuess("lower")}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-[0.98] transition-transform disabled:opacity-50"
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
