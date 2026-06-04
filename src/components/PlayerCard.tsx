"use client";
import { getFlag } from "@/lib/flags";

interface Player {
  id: string;
  name: string;
  position: string;
  country: string;
  clubTeam: string;
  value: number;
  totalPoints: number;
  sofifaId?: string | null;
  form?: number;
  ownership?: number;
}

interface Props {
  player: Player;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isSub?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  compact?: boolean;
}

const positionColors: Record<string, string> = {
  GK: "#f59e0b",
  DEF: "#22c55e",
  MID: "#3b82f6",
  FWD: "#ef4444",
};

export function PlayerImage({ player, size = 64 }: { player: Player; size?: number }) {
  const imageUrl = player.sofifaId
    ? `https://cdn.sofifa.net/players/${player.sofifaId}/25_120x120.png`
    : null;

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={player.name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size, background: "#0d1f3c" }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            const fallback = parent.querySelector(".fallback-avatar") as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }
        }}
      />
    );
  }
  return null;
}

export default function PlayerCard({ player, isCaptain, isViceCaptain, isSub, onClick, onRemove, compact }: Props) {
  const posColor = positionColors[player.position] || "#f0b429";
  const imageUrl = player.sofifaId
    ? `https://cdn.sofifa.net/players/${player.sofifaId}/25_120x120.png`
    : null;

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5"
        style={{ border: "1px solid rgba(240,180,41,0.1)" }}
      >
        <div className="relative flex-shrink-0">
          <div className="rounded-full overflow-hidden" style={{ width: 44, height: 44, background: "#0d1f3c" }}>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={player.name} width={44} height={44} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: posColor }}>
                {player.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 text-xs font-bold px-1 rounded" style={{ background: posColor, color: "#000", fontSize: "0.6rem" }}>
            {player.position}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate text-white">{player.name}</div>
          <div className="text-xs text-slate-400">{getFlag(player.country)} {player.country}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-sm" style={{ color: "#f0b429" }}>£{player.value}m</div>
          <div className="text-xs text-slate-400">{player.totalPoints} pts</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`player-token relative flex flex-col items-center text-center group ${isSub ? "opacity-80" : ""}`}
      onClick={onClick}
    >
      {/* Captain/VC badge */}
      {isCaptain && (
        <div className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: "#f0b429", color: "#050d1a" }}>
          C
        </div>
      )}
      {isViceCaptain && (
        <div className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black bg-slate-400" style={{ color: "#050d1a" }}>
          V
        </div>
      )}

      {/* Player image */}
      <div
        className={`relative rounded-full overflow-hidden mb-1 ${isCaptain ? "captain-ring" : isViceCaptain ? "vice-ring" : ""}`}
        style={{ width: 56, height: 56, background: "#0d2a4a", border: `2px solid ${posColor}40` }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={player.name} width={56} height={56} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg font-black" style={{ color: posColor }}>
            {player.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name tag */}
      <div
        className="px-2 py-0.5 rounded-md text-center"
        style={{ background: "rgba(5,13,26,0.85)", border: `1px solid ${posColor}50`, maxWidth: 80 }}
      >
        <div className="text-white font-semibold truncate" style={{ fontSize: "0.6rem", maxWidth: 72 }}>
          {player.name.split(" ").slice(-1)[0]}
        </div>
        <div className="font-bold" style={{ color: "#f0b429", fontSize: "0.55rem" }}>
          £{player.value}m
        </div>
      </div>

      {/* Points badge */}
      {player.totalPoints > 0 && (
        <div className="mt-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(240,180,41,0.2)", color: "#f0b429", fontSize: "0.55rem" }}>
          {player.totalPoints} pts
        </div>
      )}

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "#ef4444", color: "white", fontSize: "0.6rem", fontWeight: "bold" }}
        >
          ×
        </button>
      )}
    </div>
  );
}
