export const MAX_PLAYERS = 10;
export const MAX_HEALTH = 3;
export const MARCH_MS = 1050;
export const FINGER_RING_SIZE = 112;
export const FINGER_ORBIT_RADIUS = 78;
export const FINGER_MARGIN = 94;
export const DUEL_EXCHANGES = 6;
export const CUTIN_MS = 820;
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
  if (alive === 2)
    return { windup: 320, dash: 210, impact: 240, recover: 240, gap: 620 };
  if (alive <= 4)
    return { windup: 190, dash: 210, impact: 230, recover: 260, gap: 300 };
  return { windup: 170, dash: 210, impact: 230, recover: 260, gap: 260 };
}

// Keep exactly the same random combat draws; only their presentation overlaps.
// Ordered hits ensure an eliminated player never starts a later attack.
export function createBattleTimeline(participants, random = randomUnit) {
  const initial = createBattle(participants);
  let state = initial,
    nextStart = 0,
    previousHit = -1,
    duelStaged = false;
  const available = new Map(),
    actions = [];
  while (state.phase !== "done") {
    const finalists = state.players.filter((p) => p.health > 0);
    if (!duelStaged && finalists.length === 2) {
      duelStaged = true;
      // A symmetric six-hit exchange adds anticipation without consuming random
      // draws, changing health, or replacing the already established combat rules.
      nextStart = Math.max(nextStart, 0, ...actions.map((a) => a.end)) + 180;
      for (let i = 0; i < DUEL_EXCHANGES; i++) {
        const attacker = finalists[(state.turn + i) % 2];
        const target = finalists[(state.turn + i + 1) % 2];
        const timing = {
          windup: 180,
          dash: 150,
          impact: 130,
          recover: 170,
          gap: 420,
        };
        const start = nextStart,
          hit = start + timing.windup + timing.dash;
        const end = hit + timing.impact + timing.recover;
        const hitEffect = {
          attackerId: attacker.id,
          targetId: target.id,
          turn: state.turn,
          damage: 0,
          critical: false,
          dodged: false,
          fallen: false,
          parried: true,
        };
        actions.push({
          ...hitEffect,
          id: actions.length,
          visualOnly: true,
          start,
          hit,
          end,
          timing,
          result: state,
          hitEffect,
        });
        available.set(attacker.id, hit + timing.impact);
        previousHit = hit;
        nextStart = start + timing.gap;
      }
      nextStart = Math.max(...actions.map((a) => a.end)) + 180;
    }
    const attack = planAttack(state, random);
    const timing = attackTiming(state);
    const start = Math.max(nextStart, available.get(attack.attackerId) ?? 0);
    const hit = Math.max(start + timing.windup + timing.dash, previousHit + 1);
    const result = resolveAttack(state, attack, random);
    const end = hit + timing.impact + timing.recover;
    actions.push({
      ...attack,
      id: actions.length,
      visualOnly: false,
      start,
      hit,
      end,
      timing,
      result,
      hitEffect: result.lastHit,
    });
    available.set(attack.attackerId, hit + timing.impact);
    nextStart = start + timing.gap;
    previousHit = hit;
    state = result;
  }
  return stageBattlePresentation(initial, actions);
}

// Choose spectacle from already resolved hits. No extra random draws or damage.
export function stageBattlePresentation(initial, source) {
  let before = initial;
  const hits = source
    .filter((action) => !action.visualOnly)
    .map((action) => {
      const attacker = before.players.find((p) => p.id === action.attackerId);
      const target = before.players.find((p) => p.id === action.targetId);
      const afterTarget = action.result.players.find((p) => p.id === target.id);
      const duel = before.players.filter((p) => p.health > 0).length === 2;
      const rally =
        duel && attacker.health === 1 && action.hitEffect.damage > 0;
      const comeback =
        rally &&
        attacker.health < target.health &&
        attacker.health > afterTarget.health;
      before = action.result;
      return { action, rally, comeback };
    });
  const finale = hits.at(-1);
  const highlight =
    hits.find((h) => h.comeback) ??
    hits.find((h) => h.rally) ??
    hits.find((h) => h.action.hitEffect.critical);
  const selected = new Map();
  if (highlight && highlight.action.attackerId !== finale.action.attackerId)
    selected.set(
      highlight.action.id,
      highlight.comeback ? "comeback" : highlight.rally ? "rally" : "ultimate",
    );
  selected.set(
    finale.action.id,
    finale.comeback ? "comeback" : finale.rally ? "rally" : "ultimate",
  );
  let shift = 0,
    barrier = 0,
    latestEnd = 0;
  const counts = new Map();
  const actions = source.map((original) => {
    const count = counts.get(original.attackerId) ?? 0;
    counts.set(original.attackerId, count + 1);
    const action = {
      ...original,
      variant: count % 2,
      ultimate: selected.has(original.id),
    };
    shift += Math.max(0, barrier - (original.start + shift));
    action.start += shift;
    action.hit += shift;
    action.end += shift;
    if (action.ultimate) {
      action.specialKind = selected.get(action.id);
      action.cutinStart = Math.max(action.start, latestEnd + 120);
      action.start = action.cutinStart + CUTIN_MS;
      action.timing = {
        windup: 280,
        dash: 360,
        impact: 260,
        recover: 300,
        gap: 1200,
      };
      action.hit = action.start + action.timing.windup + action.timing.dash;
      action.end = action.hit + action.timing.impact + action.timing.recover;
      shift = action.end - original.end;
      barrier = action.end + 120;
    }
    latestEnd = Math.max(latestEnd, action.end);
    return action;
  });
  return { initial, actions, end: latestEnd + 180 };
}

export function cinematicFrame(timeline, elapsed) {
  const action = timeline.actions.find(
    (a) => a.ultimate && elapsed >= a.cutinStart && elapsed < a.start,
  );
  return action
    ? { ...action, progress: (elapsed - action.cutinStart) / CUTIN_MS }
    : null;
}

export function advanceFightClock(timeline, current, elapsed) {
  const cinematic = cinematicFrame(timeline, current);
  if (cinematic)
    return Math.min(cinematic.start, current + Math.min(elapsed, 100));
  const next = timeline.actions.find(
    (a) =>
      a.ultimate && a.cutinStart > current && a.cutinStart <= current + elapsed,
  );
  return next ? next.cutinStart : current + elapsed;
}

export function attackFrame(action, elapsed, reducedMotion = false) {
  let stage, started, duration;
  if (elapsed < action.start + action.timing.windup) {
    stage = "windup";
    started = action.start;
    duration = action.timing.windup;
  } else if (elapsed < action.hit) {
    stage = "dash";
    started = action.start + action.timing.windup;
    duration = action.hit - started;
  } else if (elapsed < action.hit + action.timing.impact) {
    stage = "impact";
    started = action.hit;
    duration = action.timing.impact;
  } else {
    stage = "recover";
    started = action.hit + action.timing.impact;
    duration = action.timing.recover;
  }
  return {
    stage,
    progress: reducedMotion
      ? 1
      : Math.max(0, Math.min(1, (elapsed - started) / duration)),
  };
}

export function fingerAnchor(player, width, height) {
  const mx = Math.min(FINGER_MARGIN, width / 2),
    my = Math.min(FINGER_MARGIN, height / 2);
  return {
    x: Math.max(mx, Math.min(player.x, width - mx)),
    y: Math.max(my, Math.min(player.y, height - my)),
  };
}

export function resultSlot(player, width, height) {
  const anchor = fingerAnchor(player, width, height);
  const cx = width / 2,
    cy = height / 2;
  let dx = anchor.x - cx,
    dy = anchor.y - cy;
  if (Math.hypot(dx, dy) < 1) {
    dx = 0;
    dy = 1;
  }
  const distance = Math.hypot(dx, dy);
  const ux = dx / distance,
    uy = dy / distance;
  // In the seat's orientation, the cup rim is 11px above its center and
  // the fighter's feet are 26px below its center. Keep the feet on the rim.
  // The cup drawing is also 2px left of its SVG center.
  return {
    x: cx - ux * 37 - uy * 2,
    y: cy - uy * 37 + ux * 2,
    angle: (Math.atan2(-ux, uy) * 180) / Math.PI,
  };
}

export function arenaSlots(
  players,
  width,
  height,
  { minimumAdvance = 120, inwardRatio = 0.42 } = {},
) {
  const clamp = (value, low, high) => Math.max(low, Math.min(value, high));
  const cx = width / 2,
    cy = height / 2;
  const slots = players.map((player) => {
    const { x, y } = fingerAnchor(
      {
        x: player.originX == null ? player.x : player.originX * width,
        y: player.originY == null ? player.y : player.originY * height,
      },
      width,
      height,
    );
    const dx = cx - x,
      dy = cy - y,
      distance = Math.hypot(dx, dy);
    const inward = Math.min(
      distance,
      Math.max(minimumAdvance, distance * inwardRatio),
    );
    const fallback = player.id * 2.4;
    return {
      id: player.id,
      x:
        x +
        (distance < 1
          ? Math.cos(fallback) * minimumAdvance
          : (dx / distance) * inward),
      y:
        y +
        (distance < 1
          ? Math.sin(fallback) * minimumAdvance
          : (dy / distance) * inward),
    };
  });
  // Separate close touches without replacing their original side of the table.
  for (let pass = 0; pass < 8; pass++) {
    for (let i = 0; i < slots.length; i++)
      for (let j = i + 1; j < slots.length; j++) {
        const a = slots[i],
          b = slots[j];
        const dx = b.x - a.x,
          dy = b.y - a.y,
          distance = Math.hypot(dx, dy);
        if (distance >= 54) continue;
        const fallback = (i * 2.4 + j) % (Math.PI * 2);
        const ux = distance > 0.01 ? dx / distance : Math.cos(fallback);
        const uy = distance > 0.01 ? dy / distance : Math.sin(fallback);
        const push = (54 - distance) * 0.5;
        a.x -= ux * push;
        a.y -= uy * push;
        b.x += ux * push;
        b.y += uy * push;
      }
    for (const slot of slots) {
      slot.x = clamp(slot.x, 42, width - 42);
      slot.y = clamp(slot.y, 55, height - 55);
    }
  }
  return slots;
}
