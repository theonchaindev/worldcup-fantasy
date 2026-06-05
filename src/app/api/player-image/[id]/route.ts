export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Sanitise — only digits allowed
  if (!/^\d+$/.test(id)) {
    return new Response(null, { status: 400 });
  }

  const url = `https://cdn.sofifa.net/players/${id}/25_120x120.png`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)",
        Accept: "image/webp,image/png,image/*",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return new Response(null, { status: 404 });

    const buf = await res.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
