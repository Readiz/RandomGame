export const MAX_PLAYERS = 10;
export const MAX_HEALTH = 3;
export const MARCH_MS = 1450;
// Archetypes change presentation and reach, never the combat draw or damage.
export const HEROES = [
  { id: "suit", name: "파워슈트", reach: 68 },
  { id: "shield", name: "방패 전사", reach: 80 },
  { id: "thunder", name: "번개 전사", reach: 62 },
  { id: "giant", name: "초록 거인", reach: 29 },
  { id: "web", name: "거미 곡예사", reach: 72 },
  { id: "mage", name: "마법사", reach: 82 },
];

export function chooseHero(participants, random = randomUnit) {
  const unused = HEROES.filter(
    (hero) => !participants.some((p) => p.heroId === hero.id),
  );
  const pool = unused.length ? unused : HEROES;
  return pool[Math.floor(random() * pool.length)].id;
}
export const COLORS = [
  { name: "라임", hex: "#d3f580" },
  { name: "라벤더", hex: "#bfacff" },
  { name: "코랄", hex: "#ff9f87" },
  { name: "하늘", hex: "#87d4ff" },
  { name: "핑크", hex: "#ff9ece" },
  { name: "민트", hex: "#81e1c2" },
  { name: "레몬", hex: "#f5d87c" },
  { name: "블루", hex: "#9baeff" },
  { name: "오렌지", hex: "#ffc48a" },
  { name: "실버", hex: "#dce1e8" },
];

export function randomUnit() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000;
}

export function createBattle(participants) {
  if (
    participants.length < 2 ||
    participants.length > MAX_PLAYERS ||
    new Set(participants.map((p) => p.id)).size !== participants.length
  ) {
    throw new RangeError("서로 다른 참가자 2–10명이 필요합니다.");
  }
  return {
    phase: "fighting",
    turn: 0,
    missedLast: false,
    winnerId: null,
    fallenIds: [],
    lastHit: null,
    players: participants.map((player) => ({ ...player, health: MAX_HEALTH })),
  };
}

// Only identity and remaining health affect combat. Finger position has no role.
export function planAttack(battle, random = randomUnit) {
  if (battle.phase === "done") return null;
  const alive = battle.players.filter((player) => player.health > 0);
  const attacker = alive[Math.floor(random() * alive.length)];
  const opponents = alive.filter((player) => player.id !== attacker.id);
  const target = opponents[Math.floor(random() * opponents.length)];
  return { attackerId: attacker.id, targetId: target.id, turn: battle.turn };
}

export function resolveAttack(battle, attack, random = randomUnit) {
  if (battle.phase === "done") return battle;
  const attacker = battle.players.find((p) => p.id === attack?.attackerId);
  const target = battle.players.find((p) => p.id === attack?.targetId);
  if (
    !attacker?.health ||
    !target?.health ||
    attacker.id === target.id ||
    attack.turn !== battle.turn
  ) {
    throw new RangeError("이미 끝났거나 유효하지 않은 공격입니다.");
  }
  // Never miss twice in a row, so a fight always terminates. The opening has no critical hits.
  const dodged = !battle.missedLast && random() < 0.14;
  const critical = !dodged && battle.turn >= 3 && random() < 0.22;
  const damage = dodged ? 0 : critical ? 2 : 1;
  const players = battle.players.map((p) =>
    p.id === target.id
      ? { ...p, health: Math.max(0, p.health - damage) }
      : { ...p },
  );
  const fallen = players.find((p) => p.id === target.id).health === 0;
  const alive = players.filter((p) => p.health > 0);
  return {
    ...battle,
    players,
    turn: battle.turn + 1,
    missedLast: dodged,
    fallenIds: fallen
      ? [...battle.fallenIds, target.id]
      : [...battle.fallenIds],
    phase: alive.length === 1 ? "done" : "fighting",
    winnerId: alive.length === 1 ? alive[0].id : null,
    lastHit: { ...attack, damage, critical, dodged, fallen },
  };
}

export function attackTiming(battle) {
  const alive = battle.players.filter((p) => p.health > 0).length;
  if (alive === 2) return { windup: 480, dash: 200, impact: 230, recover: 200 };
  if (alive <= 4) return { windup: 210, dash: 180, impact: 190, recover: 130 };
  return { windup: 140, dash: 160, impact: 160, recover: 110 };
}

export function arenaSlots(players, width, height) {
  const cx = width / 2,
    cy = height / 2;
  const radius =
    players.length === 2
      ? Math.min(width * 0.18, 70)
      : Math.min(width * 0.3, height * 0.2, 140);
  return players.map((player, index) => {
    const angle =
      players.length === 2
        ? index * Math.PI
        : (index * Math.PI * 2) / players.length - Math.PI / 2;
    return {
      id: player.id,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius * 0.7,
    };
  });
}
