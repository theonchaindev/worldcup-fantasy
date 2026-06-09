import { prisma } from "@/lib/prisma";

const posColors: Record<string, { bg: string; fg: string }> = {
  GK:  { bg: "#1C1C2B", fg: "#FFB020" },
  DEF: { bg: "#1C1C2B", fg: "#00E08A" },
  MID: { bg: "#1C1C2B", fg: "#2F6BFF" },
  FWD: { bg: "#1C1C2B", fg: "#FF2E93" },
};

function svgResponse(initials: string, position: string): Response {
  const { bg, fg } = posColors[position] || { bg: "#14141F", fg: "#2F6BFF" };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100">
  <rect width="80" height="100" fill="${bg}" rx="4"/>
  <rect x="0" y="0" width="80" height="3" fill="${fg}" rx="2"/>
  <ellipse cx="40" cy="42" rx="13" ry="13" fill="${fg}" opacity="0.15"/>
  <text x="40" y="48" text-anchor="middle" font-family="Georgia,serif" font-size="17" font-weight="700" fill="${fg}" opacity="0.85" letter-spacing="-0.5">${initials}</text>
  <path d="M26,62 Q40,55 54,62 L56,100 H24 Z" fill="${fg}" opacity="0.1"/>
  <text x="40" y="92" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" font-weight="700" fill="${fg}" opacity="0.45" letter-spacing="1.5">${position}</text>
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
