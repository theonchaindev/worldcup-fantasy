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

const posColour: Record<string, string> = {
  GK:  "var(--pos-gk)",
  DEF: "var(--pos-def)",
  MID: "var(--pos-mid)",
  FWD: "var(--pos-fwd)",
};

export function PlayerAvatar({ player, size = 52 }: { player: Player; size?: number }) {
  const col     = posColour[player.position] || "var(--maroon)";
  const initials = player.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", background: "var(--ground)", flexShrink: 0, border: `1.5px solid var(--border)`, position: "relative" }}>
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
      <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.3, color: col, fontFamily: "var(--font-display)", background: "var(--ground)" }}>
        {initials}
      </div>
    </div>
  );
}

export default function PlayerCard({ player, isCaptain, isViceCaptain, isSub, onClick, onRemove, animDelay = 0 }: Props) {
  const col      = posColour[player.position] || "var(--maroon)";
  const initials = player.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const lastName = player.name.split(" ").slice(-1)[0].toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.28, type: "spring", stiffness: 280, damping: 24 }}
      whileHover={{ scale: isSub ? 1.04 : 1.06, y: -2 }}
      onClick={onClick}
      className="player-card-root"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", cursor: "pointer", position: "relative", opacity: isSub ? 0.78 : 1 }}
    >
      {/* C / V badge */}
      {(isCaptain || isViceCaptain) && (
        <div style={{
          position: "absolute", top: -4, right: -4, zIndex: 10,
          width: 18, height: 18, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 900, letterSpacing: "-0.02em",
          background: isCaptain ? "var(--maroon)" : "var(--navy)",
          color: "#fff",
          boxShadow: isCaptain ? "0 0 0 2px white, 0 0 8px rgba(123,28,46,0.4)" : "0 0 0 2px white",
        }}>
          {isCaptain ? "C" : "V"}
        </div>
      )}

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="remove-btn"
          style={{ position: "absolute", top: -4, left: -4, zIndex: 10, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#A01A1A", border: "none", cursor: "pointer", color: "white" }}
        >
          <X size={8} />
        </button>
      )}

      {/* Photo */}
      <div style={{
        width: 52, height: 52, borderRadius: "50%", overflow: "hidden",
        background: "var(--ground)", marginBottom: 5, flexShrink: 0,
        border: `2px solid ${isCaptain ? "var(--maroon)" : isViceCaptain ? "var(--navy)" : "var(--border)"}`,
        boxShadow: isCaptain ? "0 0 0 3px rgba(123,28,46,0.18)" : "none",
        position: "relative",
      }}>
        <img
          src={`/api/player-image/${player.id}`}
          alt={player.name}
          width={52} height={52}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          onError={e => {
            const t = e.target as HTMLImageElement;
            t.style.display = "none";
            const fb = t.nextElementSibling as HTMLElement | null;
            if (fb) fb.style.display = "flex";
          }}
        />
        <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: col, fontFamily: "var(--font-display)", background: "var(--ground)" }}>
          {initials}
        </div>
      </div>

      {/* Name tag — white card on the pitch */}
      <div style={{
        background: "rgba(255,255,255,0.96)",
        border: `1px solid ${isCaptain ? "var(--maroon)" : "var(--border)"}`,
        borderRadius: 4,
        padding: "2px 6px",
        maxWidth: 72,
        boxShadow: "0 1px 4px rgba(12,29,56,0.12)",
      }}>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.58rem", color: "var(--navy)", maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "0.01em" }}>
          {lastName}
        </div>
        <div style={{ fontSize: "0.52rem", fontWeight: 600, color: "var(--gold)", fontVariantNumeric: "tabular-nums" }}>
          £{player.value}m
        </div>
      </div>

      {player.totalPoints > 0 && (
        <div style={{ marginTop: 3, fontSize: "0.5rem", fontWeight: 700, color: "var(--maroon)", background: "var(--maroon-tint)", border: "1px solid rgba(123,28,46,0.15)", borderRadius: 100, padding: "1px 6px" }}>
          {player.totalPoints} pts
        </div>
      )}
    </motion.div>
  );
}
