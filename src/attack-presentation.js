// Match Fighter's 44 × 52 viewBox and the responsive .fighter dimensions.
// Arms may aim at an opponent while the body and its number still face center.
export function attackRig(actor, target, width, stage = "windup") {
  const scale = width <= 360 ? 48 / 44 : 54 / 44;
  const angle = (actor.angle * Math.PI) / 180;
  const c = Math.cos(angle),
    s = Math.sin(angle);
  const dx = (target.x - actor.x) / scale;
  const dy = (target.y - actor.y) / scale;
  const aim = Math.atan2(-s * dx + c * dy + 1, c * dx + s * dy - 9);
  let x = 31 + Math.cos(aim) * 12;
  let y = 25 + Math.sin(aim) * 12;
  if (actor.heroId === "shield") {
    x = stage === "windup" ? 7 : 10;
    y = stage === "windup" ? 26 : 31;
  } else if (actor.heroId === "thunder") {
    const swing = ((stage === "windup" ? -100 : 55) * Math.PI) / 180;
    x = 31 + 6 * Math.cos(swing) + 13 * Math.sin(swing);
    y = 25 + 6 * Math.sin(swing) - 13 * Math.cos(swing);
  }
  return {
    armAngle: (aim * 180) / Math.PI,
    x: actor.x + ((x - 22) * c - (y - 26) * s) * scale,
    y: actor.y + ((x - 22) * s + (y - 26) * c) * scale,
  };
}
