import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_HEALTH,
  createBattle,
  planAttack,
  resolveAttack,
  attackTiming,
  arenaSlots,
  HEROES,
  chooseHero,
  createBattleTimeline,
  attackFrame,
} from "../src/battle-game.js";
const people = (count = 4) =>
  Array.from({ length: count }, (_, id) => ({ id, x: id * 80, y: id * 120 }));
const sequence = (...values) => {
  let index = 0;
  return () => values[index++ % values.length];
};
const seeded = (seed) => () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 0x100000000;
};

function finish(players, random) {
  let battle = createBattle(players);
  const limit = 2 * (MAX_HEALTH * players.length - 1);
  while (battle.phase !== "done" && battle.turn <= limit)
    battle = resolveAttack(battle, planAttack(battle, random), random);
  assert.equal(battle.phase, "done");
  assert.ok(battle.turn <= limit);
  assert.equal(battle.players.filter((p) => p.health > 0).length, 1);
  assert.equal(battle.players.find((p) => p.health > 0).id, battle.winnerId);
  assert.equal(new Set(battle.fallenIds).size, players.length - 1);
  return battle;
}

test("damage applies only to a distinct living target without mutating the prior state", () => {
  const battle = createBattle(people());
  const attack = planAttack(battle, sequence(0, 0.6));
  assert.notEqual(attack.attackerId, attack.targetId);
  const next = resolveAttack(battle, attack, () => 0.8);
  assert.equal(
    next.players.find((p) => p.id === attack.targetId).health,
    MAX_HEALTH - 1,
  );
  assert.ok(battle.players.every((p) => p.health === MAX_HEALTH));
});

test("opening attacks cannot critically eliminate someone before the fight develops", () => {
  const battle = createBattle(people());
  const next = resolveAttack(
    battle,
    planAttack(battle, () => 0.5),
    sequence(0.8, 0),
  );
  assert.equal(next.lastHit.damage, 1);
  assert.equal(next.lastHit.critical, false);
});

test("a missed hit cannot be followed by another miss", () => {
  const battle = createBattle(people());
  const missed = resolveAttack(
    battle,
    planAttack(battle, () => 0.2),
    () => 0,
  );
  assert.equal(missed.lastHit.dodged, true);
  const next = resolveAttack(
    missed,
    planAttack(missed, () => 0.2),
    () => 0,
  );
  assert.equal(next.lastHit.dodged, false);
});

test("critical damage clamps health and a fallen character never attacks again", () => {
  let battle = createBattle(people());
  battle = {
    ...battle,
    turn: 4,
    players: battle.players.map((p) => ({ ...p, health: p.id === 1 ? 1 : 3 })),
  };
  const next = resolveAttack(
    battle,
    { attackerId: 0, targetId: 1, turn: 4 },
    sequence(0.8, 0),
  );
  assert.equal(next.players[1].health, 0);
  assert.deepEqual(next.fallenIds, [1]);
  for (let i = 0; i < 100; i++) {
    const action = planAttack(next, seeded(i));
    assert.notEqual(action.attackerId, 1);
    assert.notEqual(action.targetId, 1);
  }
});

test("even adversarial repeated random values finish with exactly one survivor", () => {
  for (const count of [2, 3, 10])
    for (const draw of [0, 0.139, 0.14, 0.5, 0.999999])
      finish(people(count), () => draw);
});

test("finger positions and screen layout do not change combat or the winner", () => {
  const first = finish(people(6), seeded(84));
  const moved = finish(
    people(6).map((p) => ({ ...p, x: 5000 - p.x, y: -2000 + p.y })),
    seeded(84),
  );
  assert.equal(first.winnerId, moved.winnerId);
  assert.deepEqual(first.fallenIds, moved.fallenIds);
  assert.equal(first.turn, moved.turn);
});

test("hero abilities never change the winner, damage, or elimination order", () => {
  for (let seed = 1; seed <= 24; seed++) {
    const first = finish(
      people(6).map((p, i) => ({ ...p, heroId: HEROES[i].id })),
      seeded(seed),
    );
    const swapped = finish(
      people(6).map((p, i) => ({ ...p, heroId: HEROES[5 - i].id })),
      seeded(seed),
    );
    assert.equal(first.winnerId, swapped.winnerId);
    assert.deepEqual(first.fallenIds, swapped.fallenIds);
    assert.deepEqual(
      first.players.map((p) => p.health),
      swapped.players.map((p) => p.health),
    );
    assert.equal(first.turn, swapped.turn);
  }
});

test("the first six participants receive distinct heroes and all ten remain valid", () => {
  const participants = [];
  const random = seeded(15);
  for (let i = 0; i < 10; i++)
    participants.push({ heroId: chooseHero(participants, random) });
  assert.equal(new Set(participants.slice(0, 6).map((p) => p.heroId)).size, 6);
  assert.ok(participants.every((p) => HEROES.some((h) => h.id === p.heroId)));
});

test("stale actions cannot double-apply a hit, and finished results are stable", () => {
  const battle = createBattle(people());
  const attack = planAttack(battle, () => 0.5);
  const next = resolveAttack(battle, attack, () => 0.5);
  assert.throws(() => resolveAttack(next, attack), RangeError);
  const done = finish(people(), seeded(2));
  assert.equal(planAttack(done), null);
  assert.equal(resolveAttack(done, null), done);
});

test("duels slow the anticipation while keeping center positions on a small landscape screen", () => {
  assert.ok(
    attackTiming(createBattle(people(2))).windup >
      attackTiming(createBattle(people(10))).windup,
  );
  for (const count of [2, 4, 10]) {
    const slots = arenaSlots(people(count), 320, 240);
    assert.ok(
      slots.every((p) => p.x >= 30 && p.x <= 290 && p.y >= 55 && p.y <= 210),
    );
  }
});

test("all touch identities can win across seeded games", () => {
  const winners = new Set();
  for (let seed = 1; seed <= 120; seed++)
    winners.add(finish(people(4), seeded(seed)).winnerId);
  assert.equal(winners.size, 4);
});

test("invalid participant counts and duplicate identities are rejected", () => {
  assert.throws(() => createBattle(people(1)), RangeError);
  assert.throws(() => createBattle(people(11)), RangeError);
  assert.throws(() => createBattle([{ id: 1 }, { id: 1 }]), RangeError);
});

test("overlapping brawls preserve the exact serial combat draw and one winner", () => {
  for (const count of [2, 6, 10])
    for (let seed = 1; seed <= 30; seed++) {
      const players = people(count);
      const timeline = createBattleTimeline(players, seeded(seed));
      const random = seeded(seed);
      let state = createBattle(players),
        previousHit = -1;
      for (const action of timeline.actions) {
        const expected = planAttack(state, random);
        assert.equal(action.attackerId, expected.attackerId);
        assert.equal(action.targetId, expected.targetId);
        assert.ok(action.hit > previousHit);
        assert.ok(action.start < action.hit && action.hit < action.end);
        state = resolveAttack(state, expected, random);
        assert.deepEqual(action.result, state);
        previousHit = action.hit;
      }
      assert.equal(state.phase, "done");
      assert.equal(state.players.filter((p) => p.health > 0).length, 1);
      assert.ok(timeline.actions.every((a) => a.end < timeline.end));
    }
});

test("separate attackers overlap but an arm finishes its impact before attacking again", () => {
  const timeline = createBattleTimeline(people(10), seeded(42));
  assert.ok(
    timeline.actions.some((a, i) => timeline.actions[i + 1]?.start < a.hit),
  );
  const last = new Map();
  for (const action of timeline.actions) {
    if (last.has(action.attackerId))
      assert.ok(action.start >= last.get(action.attackerId));
    last.set(action.attackerId, action.hit + action.timing.impact);
    assert.equal(attackFrame(action, action.start).stage, "windup");
    assert.equal(
      attackFrame(action, action.start + action.timing.windup).stage,
      "dash",
    );
    assert.equal(attackFrame(action, action.hit).stage, "impact");
    assert.equal(
      attackFrame(action, action.hit + action.timing.impact).stage,
      "recover",
    );
  }
});

test("assembly stays on each finger's side and moves only a short distance inward", () => {
  const players = [
    { id: 1, x: 90, y: 130 },
    { id: 2, x: 340, y: 130 },
    { id: 3, x: 90, y: 770 },
    { id: 4, x: 340, y: 770 },
  ];
  const slots = arenaSlots(players, 430, 900);
  for (const p of players) {
    const slot = slots.find((s) => s.id === p.id);
    const before = Math.hypot(p.x - 215, p.y - 450);
    assert.ok(Math.hypot(slot.x - p.x, slot.y - p.y) < before * 0.4);
    assert.equal(Math.sign(slot.x - 215), Math.sign(p.x - 215));
    assert.equal(Math.sign(slot.y - 450), Math.sign(p.y - 450));
  }
  const normalized = players.map((p) => ({
    ...p,
    originX: p.x / 430,
    originY: p.y / 900,
  }));
  const rotated = arenaSlots(normalized, 900, 430);
  assert.ok(
    rotated.every((p) => p.x >= 42 && p.x <= 858 && p.y >= 55 && p.y <= 375),
  );
  const crowded = arenaSlots(
    people(10).map((p) => ({ ...p, x: 160, y: 120 })),
    320,
    240,
  );
  assert.ok(crowded.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)));
  assert.ok(
    crowded.every((p, i) =>
      crowded.every((q, j) => i === j || Math.hypot(p.x - q.x, p.y - q.y) > 35),
    ),
  );
});
