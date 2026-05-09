import { NextResponse } from "next/server";
import { GameState } from "@/lib/types";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const gameStateCookie = cookieStore.get("gameState");

  if (!gameStateCookie) {
    return NextResponse.json({ gameState: null });
  }

  const gameState: GameState = JSON.parse(gameStateCookie.value);
  return NextResponse.json({
    gameState,
    currentCard: gameState.currentCard,
    score: gameState.score,
    faceValues: gameState.faceValues,
    gameOver: gameState.gameOver,
  });
}
