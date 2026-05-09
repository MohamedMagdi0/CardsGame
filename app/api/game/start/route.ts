import { NextResponse } from "next/server";
import { initializeGame } from "@/lib/game";
import { cookies } from "next/headers";

export async function POST() {
  const gameState = initializeGame();
  const cookieStore = cookies();
  cookieStore.set("gameState", JSON.stringify(gameState), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return NextResponse.json({ success: true });
}
