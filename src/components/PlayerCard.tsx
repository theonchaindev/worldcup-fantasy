"use client";
import { motion } from "framer-motion";
import { getFlag } from "@/lib/flags";
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
  animDelay?: number;
}

const positionColors: Record<string, string> = {
  GK: "#f59e0b",
  DEF: "#22c55e",
  MID: "#3b82f6",
  FWD: "#ef4444",
};

export function PlayerAvatar({
  player,
  size = 56,
}: {
  player: Player;
  size?: number;
}) {
  const posColor = positionColors[player.position] || "#f0b429";
  const proxyUrl = player.sofifaId
    ? `/api/player-image/${player.sofifaId}`
    : null;

  return (
    <div
      className="relative rounded-full overflow-hidden flex-shrink-0"
      style={{ width: size, height: size, background: "#0a1e38" }}
    >
      {proxyUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={proxyUrl}
          alt={player.name}
          width={size}
          height={size}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.style.display = "none";
            const fb = t.nextElementSibling as HTMLElement | null;
            if (fb) fb.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="absolute inset-0 items-center justify-center font-black text-sm"
        style={{
          display: proxyUrl ? "none" : "flex",
          color: posColor,
          background: `${posColor}18`,
        }}
      >
        {player.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)}
      </div>
    </div>
  );
}

export function PlayerRow({
  player,
  onClick,
  rank,
}: {
  player: Player;
  onClick?: () => void;
  rank?: number;
}) {
  const posColor = positionColors[player.position] || "#f0b429";
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
      whileTap={{ scale: 0.99 }}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {rank && (
        <span className="text-xs text-slate-500 w-5 text-center flex-shrink-0">
          {rank}
        </span>
      )}
      <PlayerAvatar player={player} size={40} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-sm truncate">
          {player.name}
        </div>
        <div className="text-xs text-slate-400">
          {getFlag(player.country)} {player.clubTeam}
        </div>
      </div>
      <span
        className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0"
        style={{
          background: `${posColor}20`,
          color: posColor,
        }}
      >
        {player.position}
      </span>
      <span className="font-bold text-yellow-400 text-sm flex-shrink-0">
        £{player.value}m
      </span>
    </motion.button>
  );
}

export default function PlayerCard({
  player,
  isCaptain,
  isViceCaptain,
  isSub,
  onClick,
  onRemove,
  animDelay = 0,
}: Props) {
  const posColor = positionColors[player.position] || "#f0b429";
  const proxyUrl = player.sofifaId
    ? `/api/player-image/${player.sofifaId}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: animDelay,
        duration: 0.4,
        type: "spring",
        stiffness: 220,
        damping: 22,
      }}
      whileHover={{ scale: isSub ? 1.03 : 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative flex flex-col items-center text-center cursor-pointer select-none"
      style={{ opacity: isSub ? 0.85 : 1 }}
    >
      {/* Captain / VC badge */}
      {(isCaptain || isViceCaptain) && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-1 z-20 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shadow-lg"
          style={{
            background: isCaptain ? "#f0b429" : "#94a3b8",
            color: "#050d1a",
          }}
        >
          {isCaptain ? "C" : "V"}
        </motion.div>
      )}

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -left-1 z-20 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
          style={{ background: "#ef4444", color: "white" }}
        >
          <X size={9} />
        </button>
      )}

      {/* Photo */}
      <div
        className="relative rounded-full overflow-hidden mb-1.5"
        style={{
          width: 54,
          height: 54,
          background: "#0a1e38",
          border: `2px solid ${isCaptain ? "#f0b429" : isViceCaptain ? "#94a3b8" : `${posColor}60`}`,
          boxShadow: isCaptain
            ? "0 0 12px rgba(240,180,41,0.5)"
            : isViceCaptain
            ? "0 0 8px rgba(148,163,184,0.4)"
            : "none",
        }}
      >
        {proxyUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={proxyUrl}
            alt={player.name}
            width={54}
            height={54}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = "none";
              const fb = t.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 items-center justify-center font-black text-base"
          style={{
            display: proxyUrl ? "none" : "flex",
            color: posColor,
            background: `${posColor}18`,
          }}
        >
          {player.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </div>
      </div>

      {/* Name tag */}
      <div
        className="px-1.5 py-0.5 rounded-md"
        style={{
          background: "rgba(5,13,26,0.9)",
          border: `1px solid ${posColor}40`,
          maxWidth: 76,
        }}
      >
        <div
          className="font-bold text-white truncate"
          style={{ fontSize: "0.58rem", maxWidth: 68 }}
        >
          {player.name.split(" ").slice(-1)[0].toUpperCase()}
        </div>
        <div
          className="font-semibold"
          style={{ color: "#f0b429", fontSize: "0.52rem" }}
        >
          £{player.value}m
        </div>
      </div>

      {player.totalPoints > 0 && (
        <div
          className="mt-0.5 font-bold px-1.5 rounded-full"
          style={{
            background: "rgba(240,180,41,0.18)",
            color: "#f0b429",
            fontSize: "0.5rem",
          }}
        >
          {player.totalPoints} pts
        </div>
      )}
    </motion.div>
  );
}
