import { NextRequest, NextResponse } from "next/server";
import { makeGuess } from "@/lib/game";
import { GameState } from "@/lib/types";

export async function POST(request: NextRequest) {
  const {
    guess,
    gameState: requestGameState,
  }: { guess: "higher" | "lower"; gameState: GameState } = await request.json();
  const gameState = requestGameState;
  const newState = makeGuess(gameState, guess);

  return NextResponse.json({
    gameState: newState,
    currentCard: newState.currentCard,
    score: newState.score,
    faceValues: newState.faceValues,
    gameOver: newState.gameOver,
  });
}
