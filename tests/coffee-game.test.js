import { test } from "node:test";
import assert from "node:assert/strict";
import { createMatch, advanceMatch, placeCards } from "../src/coffee-game.js";

const people = (count = 4) =>
  Array.from({ length: count }, (_, id) => ({ id }));
const sequence = (...values) => {
  let index = 0;
  return () => values[index++ % values.length];
};

test("all participants receive the same guaranteed opening upgrades", () => {
  let game = createMatch(people());
  game = advanceMatch(
    advanceMatch(game, () => 0.999),
    () => 0.999,
  );
  assert.ok(game.players.every((player) => player.level === 2));
  assert.equal(game.phase, "playing");
});

test("a sole broken sword selects its owner and leaves the original state intact", () => {
  const original = { ...createMatch(people()), round: 2 };
  const game = advanceMatch(original, sequence(0, 0.99, 0, 0, 0));
  assert.equal(game.selectedId, 1);
  assert.equal(game.phase, "done");
  assert.equal(
    game.players.filter((player) => player.status === "selected").length,
    1,
  );
  assert.ok(original.players.every((player) => player.status === "active"));
  assert.equal(advanceMatch(game), game);
});

test("simultaneous breaks enter a rematch; safe participants cannot be selected", () => {
  let game = advanceMatch(
    { ...createMatch(people()), round: 2 },
    sequence(0.99, 0, 0.99, 0),
  );
  assert.equal(game.phase, "tiebreak");
  assert.deepEqual(
    game.players.filter((p) => p.status === "active").map((p) => p.id),
    [0, 2],
  );
  game = advanceMatch(game, sequence(0, 0.99, 0));
  assert.equal(game.selectedId, 2);
});

test("even repeated identical outcomes finish within twelve rounds with one payer", () => {
  for (const value of [0, 0.499, 0.5, 0.999]) {
    let game = createMatch(people(10));
    let attempts = 0;
    while (game.phase !== "done" && attempts++ < 13)
      game = advanceMatch(game, () => value);
    assert.equal(game.phase, "done");
    assert.ok(attempts <= 12);
    assert.equal(game.players.filter((p) => p.status === "selected").length, 1);
    assert.equal(game.lottery, true);
  }
});

test("reversing participant order and corresponding draws preserves the selected owner", () => {
  const a = advanceMatch(
    { ...createMatch(people()), round: 2 },
    sequence(0, 0.99, 0, 0, 0),
  );
  const b = advanceMatch(
    { ...createMatch(people().reverse()), round: 2 },
    sequence(0, 0, 0.99, 0, 0),
  );
  assert.equal(a.selectedId, b.selectedId);
});

test("cards remain on a small screen even with fingers along every edge", () => {
  const players = [
    [0, 0],
    [320, 0],
    [0, 300],
    [320, 300],
  ].map(([x, y], id) => ({ id, x, y }));
  for (const { card } of placeCards(players, 320, 300)) {
    assert.ok(card.x >= 8 && card.y >= 8);
    assert.ok(card.x + card.w <= 312 && card.y + card.h <= 292);
  }
});

test("invalid participant counts cannot start a match", () => {
  assert.throws(() => createMatch(people(1)), RangeError);
  assert.throws(() => createMatch(people(11)), RangeError);
});
