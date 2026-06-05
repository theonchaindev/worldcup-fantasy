import { prisma } from "@/lib/prisma";

const posColors: Record<string, { bg: string; fg: string }> = {
  GK:  { bg: "#2d1a00", fg: "#f59e0b" },
  DEF: { bg: "#0a1f0a", fg: "#22c55e" },
  MID: { bg: "#0a0f1f", fg: "#3b82f6" },
  FWD: { bg: "#1f0a0a", fg: "#ef4444" },
};

function svgResponse(initials: string, position: string): Response {
  const { bg, fg } = posColors[position] || { bg: "#111", fg: "#f0b429" };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <circle cx="40" cy="40" r="40" fill="${bg}"/>
  <circle cx="40" cy="40" r="39" fill="none" stroke="${fg}" stroke-width="1.5" opacity="0.4"/>
  <text x="40" y="51" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="800" fill="${fg}" letter-spacing="-1">${initials}</text>
</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=604800" },
  });
}

/** Strip accents: "Mbappé" → "Mbappe", "Éder" → "Eder" */
function normalize(name: string): string {
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Shortened last-name only search term */
function lastName(name: string): string {
  const parts = normalize(name).split(" ");
  return parts[parts.length - 1];
}

async function tryUrl(url: string): Promise<Response | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2000);
    const r = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } });
    clearTimeout(t);
    if (!r.ok) return null;
    const buf = await r.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": r.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=604800",
      },
    });
  } catch {
    return null;
  }
}

async function sportsDbUrl(searchTerm: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const r = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(searchTerm)}`,
      { signal: ctrl.signal }
    );
    clearTimeout(t);
    if (!r.ok) return null;
    const data = await r.json();
    const p = data?.player?.[0];
    return p?.strCutout || p?.strThumb || null;
  } catch {
    return null;
  }
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

  // 1. If sofifaId is a stored TheSportsDB/direct URL → redirect instantly
  if (player?.sofifaId?.startsWith("http")) {
    return Response.redirect(player.sofifaId, 302);
  }

  // 2. If sofifaId is a numeric FIFA player ID → try FutBin CDN (public, no hotlink block)
  if (player?.sofifaId && /^\d+$/.test(player.sofifaId)) {
    const futbinUrl = `https://cdn.futbin.com/content/fifa25/img/players/${player.sofifaId}.png`;
    const res = await tryUrl(futbinUrl);
    if (res) return res;
  }

  // 3. Try TheSportsDB by normalized name, then last name only
  for (const term of [normalize(name), lastName(name)]) {
    const url = await sportsDbUrl(term);
    if (url) {
      // Persist so next request is instant
      prisma.player.update({ where: { id }, data: { sofifaId: url } }).catch(() => {});
      return Response.redirect(url, 302);
    }
  }

  // 4. SVG initials fallback
  return svgResponse(initials, pos);
}
