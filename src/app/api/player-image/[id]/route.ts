import { prisma } from "@/lib/prisma";

const posColors: Record<string, { bg: string; fg: string }> = {
  GK:  { bg: "#2d1a00", fg: "#f59e0b" },
  DEF: { bg: "#0a1f0a", fg: "#22c55e" },
  MID: { bg: "#0a0f1f", fg: "#3b82f6" },
  FWD: { bg: "#1f0a0a", fg: "#ef4444" },
};

function makeSVG(initials: string, position: string): Response {
  const { bg, fg } = posColors[position] || { bg: "#111", fg: "#f0b429" };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <circle cx="40" cy="40" r="40" fill="${bg}"/>
  <circle cx="40" cy="40" r="39" fill="none" stroke="${fg}" stroke-width="1.5" opacity="0.4"/>
  <text x="40" y="51" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="800" fill="${fg}" letter-spacing="-1">${initials}</text>
</svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const player = await prisma.player.findUnique({
    where: { id },
    select: { name: true, position: true, sofifaId: true },
  });

  const name = player?.name || "?";
  const pos = player?.position || "MID";
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  // If we have a real image URL stored, redirect the browser directly to it.
  // Redirect is instant — no proxying, no body reading, no external latency server-side.
  if (player?.sofifaId?.startsWith("http")) {
    return Response.redirect(player.sofifaId, 302);
  }

  // Fallback: instant SVG avatar
  return makeSVG(initials, pos);
}
