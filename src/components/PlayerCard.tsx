"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface Player {
  id: string;
  name: string;
  position: string;
  country: string;
  clubTeam: string;
  value: number;
  totalPoints: number;
  sofifaId?: string | null;
}

interface Props {
  player: Player;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isSub?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  animDelay?: number;
}

const posColor: Record<string, string> = {
  GK:  "oklch(0.72 0.15 75)",
  DEF: "oklch(0.62 0.17 145)",
  MID: "oklch(0.60 0.17 230)",
  FWD: "oklch(0.60 0.21 25)",
};

export function PlayerAvatar({ player, size = 52 }: { player: Player; size?: number }) {
  const col = posColor[player.position] || "var(--primary)";
  const initials = player.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", background: "var(--surface-high)", flexShrink: 0, border: `1.5px solid ${col}40`, position: "relative" }}>
      <img
        src={`/api/player-image/${player.id}`}
        alt={player.name}
        width={size}
        height={size}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        onError={e => {
          const t = e.target as HTMLImageElement;
          t.style.display = "none";
          const fb = t.nextElementSibling as HTMLElement | null;
          if (fb) fb.style.display = "flex";
        }}
      />
      <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.32, color: col, fontFamily: "var(--font-display)" }}>
        {initials}
      </div>
    </div>
  );
}

export default function PlayerCard({ player, isCaptain, isViceCaptain, isSub, onClick, onRemove, animDelay = 0 }: Props) {
  const col = posColor[player.position] || "var(--primary)";
  const initials = player.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const lastName = player.name.split(" ").slice(-1)[0].toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.3, type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ scale: isSub ? 1.04 : 1.06, y: -2 }}
      onClick={onClick}
      className="player-card-root"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer", position: "relative", opacity: isSub ? 0.78 : 1 }}
    >
      {(isCaptain || isViceCaptain) && (
        <div style={{ position: "absolute", top: -4, right: -4, zIndex: 10, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, background: isCaptain ? "var(--primary)" : "oklch(0.55 0 0)", color: isCaptain ? "oklch(0.08 0 0)" : "var(--ink)", boxShadow: isCaptain ? "0 0 8px oklch(0.76 0.146 65 / 0.5)" : "none" }}>
          {isCaptain ? "C" : "V"}
        </div>
      )}

      {onRemove && (
        <button onClick={e => { e.stopPropagation(); onRemove(); }} className="remove-btn" style={{ position: "absolute", top: -4, left: -4, zIndex: 10, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--danger)", border: "none", cursor: "pointer", color: "white" }}>
          <X size={8} />
        </button>
      )}

      <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", background: "var(--surface-high)", marginBottom: 6, border: `2px solid ${isCaptain ? "var(--primary)" : isViceCaptain ? "oklch(0.55 0 0)" : `${col}50`}`, boxShadow: isCaptain ? `0 0 10px oklch(0.76 0.146 65 / 0.4)` : "none", flexShrink: 0, position: "relative" }}>
        <img src={`/api/player-image/${player.id}`} alt={player.name} width={52} height={52} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          onError={e => { const t = e.target as HTMLImageElement; t.style.display = "none"; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = "flex"; }} />
        <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: col, fontFamily: "var(--font-display)" }}>{initials}</div>
      </div>

      <div style={{ background: "oklch(0.08 0 0 / 0.92)", border: `1px solid ${col}35`, borderRadius: "var(--r-sm)", padding: "2px 6px", maxWidth: 72 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.6rem", color: "var(--ink)", maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lastName}</div>
        <div style={{ fontSize: "0.52rem", fontWeight: 600, color: "var(--primary)", fontFeatureSettings: '"tnum"' }}>£{player.value}m</div>
      </div>

      {player.totalPoints > 0 && (
        <div style={{ marginTop: 3, fontSize: "0.5rem", fontWeight: 700, color: "var(--accent)", background: "oklch(0.56 0.18 145 / 0.15)", borderRadius: "var(--r-full)", padding: "1px 6px" }}>
          {player.totalPoints} pts
        </div>
      )}
    </motion.div>
  );
}
