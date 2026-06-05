import { prisma } from "@/lib/prisma";

const posColors: Record<string, { bg: string; fg: string }> = {
  GK:  { bg: "#2d1a00", fg: "#f59e0b" },
  DEF: { bg: "#0a1f0a", fg: "#22c55e" },
  MID: { bg: "#0a0f1f", fg: "#3b82f6" },
  FWD: { bg: "#1f0a0a", fg: "#ef4444" },
};

function makeSVG(initials: string, position: string): string {
  const { bg, fg } = posColors[position] || { bg: "#111", fg: "#f0b429" };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <circle cx="40" cy="40" r="40" fill="${bg}"/>
  <circle cx="40" cy="40" r="39" fill="none" stroke="${fg}" stroke-width="1.5" opacity="0.4"/>
  <text x="40" y="51" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="800" fill="${fg}" letter-spacing="-1">${initials}</text>
</svg>`;
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

  // If sofifaId is a direct image URL, proxy it with a short timeout
  if (player?.sofifaId?.startsWith("http")) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 1500);
      const res = await fetch(player.sofifaId, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } });
      clearTimeout(timer);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        return new Response(buf, {
          headers: {
            "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch {
      // fall through to SVG
    }
  }

  // Return instant SVG avatar — no external calls
  const name = player?.name || "??";
  const pos = player?.position || "MID";
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const svg = makeSVG(initials, pos);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
