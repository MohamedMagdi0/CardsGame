import { NextRequest, NextResponse } from "next/server";
import { makeGuess } from "@/lib/game";
import { GameState } from "@/lib/types";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const {
    guess,
    gameState: requestGameState,
  }: { guess: "higher" | "lower"; gameState?: GameState } =
    await request.json();
  const cookieStore = cookies();
  const gameStateCookie = cookieStore.get("gameState");

  const gameState: GameState | undefined = gameStateCookie
    ? JSON.parse(gameStateCookie.value)
    : requestGameState;

  if (!gameState) {
    return NextResponse.json({ error: "No game state" }, { status: 400 });
  }

  const newState = makeGuess(gameState, guess);

  cookieStore.set("gameState", JSON.stringify(newState), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({
    gameState: newState,
    currentCard: newState.currentCard,
    score: newState.score,
    faceValues: newState.faceValues,
    gameOver: newState.gameOver,
  });
}
