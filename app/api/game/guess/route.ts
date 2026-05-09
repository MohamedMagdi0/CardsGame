import { NextRequest, NextResponse } from "next/server";
import { makeGuess } from "@/lib/game";
import { GameState } from "@/lib/types";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { guess }: { guess: "higher" | "lower" } = await request.json();
  const cookieStore = cookies();
  const gameStateCookie = cookieStore.get("gameState");

  if (!gameStateCookie) {
    return NextResponse.json({ error: "No game state" }, { status: 400 });
  }

  const gameState: GameState = JSON.parse(gameStateCookie.value);
  const newState = makeGuess(gameState, guess);

  cookieStore.set("gameState", JSON.stringify(newState), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({
    currentCard: newState.currentCard,
    score: newState.score,
    faceValues: newState.faceValues,
    gameOver: newState.gameOver,
  });
}
