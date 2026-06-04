import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { checkTokenBalance, verifyEntryPayment } from "@/lib/solana";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, clubName, country, walletAddress, txSignature } = await req.json();

    if (!username || !email || !password || !clubName || !country || !walletAddress || !txSignature) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }, { walletAddress }] },
    });
    if (existing) {
      return Response.json({ error: "Email, username, or wallet already registered" }, { status: 409 });
    }

    // Verify token balance
    const hasTokens = await checkTokenBalance(walletAddress);
    if (!hasTokens) {
      return Response.json({ error: `You need 500,000 WCF tokens to enter` }, { status: 403 });
    }

    // Verify payment transaction
    const paid = await verifyEntryPayment(txSignature, walletAddress);
    if (!paid) {
      return Response.json({ error: "Payment not found or insufficient. Please send exactly 0.2 SOL to the treasury wallet." }, { status: 402 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, email, password: hashed, clubName, country, walletAddress, txSignature, verified: true },
    });

    // Give all 4 chips
    await prisma.userChip.createMany({
      data: [
        { userId: user.id, chipType: "wildcard" },
        { userId: user.id, chipType: "triple_captain" },
        { userId: user.id, chipType: "bench_boost" },
        { userId: user.id, chipType: "free_hit" },
      ],
    });

    const token = await signToken({ userId: user.id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set("wc-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return Response.json({ ok: true, userId: user.id });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
