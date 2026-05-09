import { NextResponse } from "next/server";
import { initializeGame } from "@/lib/game";

export async function POST() {
  const gameState = initializeGame();
  return NextResponse.json({ success: true, gameState });
}
