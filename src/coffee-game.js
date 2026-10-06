export const MAX_PLAYERS = 10;
export const ROUND_MS = 820;
export const SUCCESS_RATES = [1, 1, 0.94, 0.86, 0.72, 0.58, 0.42, 0.26, 0];
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

export function createMatch(participants) {
  if (participants.length < 2 || participants.length > MAX_PLAYERS) {
    throw new RangeError("2명 이상, 10명 이하로 시작하세요.");
  }
  return {
    phase: "playing",
    round: 0,
    tieRound: 0,
    selectedId: null,
    lottery: false,
    players: participants.map((player) => ({
      ...player,
      level: 0,
      status: "active",
      event: "강화 준비",
    })),
  };
}

// Resolve the entire round together so touch order cannot decide the payer.
export function advanceMatch(match, random = randomUnit) {
  if (match.phase === "done") return match;
  const isTie = match.phase === "tiebreak";
  const rate = isTie ? 0.5 : SUCCESS_RATES[match.round];
  const next = {
    ...match,
    round: match.round + (isTie ? 0 : 1),
    tieRound: match.tieRound + (isTie ? 1 : 0),
    players: match.players.map((player) => {
      if (player.status !== "active") return { ...player };
      const success = random() < rate;
      return {
        ...player,
        level: player.level + (success ? 1 : 0),
        event: success ? "강화 성공!" : "검이 깨졌어요",
        status: success ? "active" : "broken",
      };
    }),
  };
  let candidates = next.players.filter((player) => player.status === "broken");
  if (candidates.length === 0 && (!isTie || next.tieRound < 3)) return next;
  if (candidates.length === 0)
    candidates = next.players.filter((player) => player.status === "active");

  if (candidates.length === 1 || (isTie && next.tieRound >= 3)) {
    next.lottery = candidates.length > 1;
    next.selectedId = candidates[Math.floor(random() * candidates.length)].id;
    next.phase = "done";
    next.players = next.players.map((player) => ({
      ...player,
      status: player.id === next.selectedId ? "selected" : "safe",
      event:
        player.id === next.selectedId ? "오늘 커피 당첨!" : "오늘은 얻어먹기",
    }));
    return next;
  }

  next.phase = "tiebreak";
  const tiedIds = new Set(candidates.map((player) => player.id));
  next.players = next.players.map((player) => ({
    ...player,
    status: tiedIds.has(player.id) ? "active" : "safe",
    event: tiedIds.has(player.id) ? "동시 파괴 · 재강화" : "커피 방어 성공!",
  }));
  return next;
}

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const overlap = (a, b) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

// Prefer a nearby empty spot; clamp cards inside the actual touch surface.
export function placeCards(players, width, height) {
  const w = width < 360 ? 100 : 112;
  const h = 76;
  const placed = [];
  const anchors = players.map((player) => ({
    ...player,
    x: clamp(player.x, 26, width - 26),
    y: clamp(player.y, 26, height - 26),
  }));
  return anchors.map((player) => {
    const { x, y } = player;
    const options = [
      [-w / 2, -h - 46],
      [-w / 2, 46],
      [46, -h / 2],
      [-w - 46, -h / 2],
      [-w - 12, -h - 34],
      [12, -h - 34],
      [-w - 12, 34],
      [12, 34],
    ];
    const candidates = options.map(([dx, dy]) => ({
      x: clamp(x + dx, 8, width - w - 8),
      y: clamp(y + dy, 8, height - h - 8),
      w,
      h,
    }));
    const score = (card) =>
      placed.reduce((sum, other) => sum + overlap(card, other) * 4, 0) +
      anchors.reduce(
        (sum, finger) =>
          sum +
          overlap(card, { x: finger.x - 34, y: finger.y - 34, w: 68, h: 68 }) *
            6,
        0,
      ) +
      Math.hypot(card.x + w / 2 - x, card.y + h / 2 - y);
    candidates.sort((a, b) => score(a) - score(b));
    const card = candidates[0];
    placed.push(card);
    return { ...player, x, y, card };
  });
}
