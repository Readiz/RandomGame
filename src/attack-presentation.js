// Match Fighter's 44 × 52 viewBox and the responsive .fighter dimensions.
export const SPECIALS = {
  suit: { name: "아크 버스터", color: "#8ceaff" },
  shield: { name: "코멧 실드", color: "#bad6ff" },
  thunder: { name: "스톰 브레이크", color: "#a6c9ff" },
  giant: { name: "메테오 스매시", color: "#c6f08b" },
  web: { name: "웹 피니시", color: "#f3c5cd" },
  mage: { name: "차원 붕괴", color: "#ffcb89" },
};

// Position offsets keep bodies and number labels facing the screen center.
export function attackMotion(
  heroId,
  action,
  home,
  target,
  reducedMotion = false,
) {
  const dx = target.x - home.x,
    dy = target.y - home.y;
  const distance = Math.hypot(dx, dy) || 1;
  const ux = dx / distance,
    uy = dy / distance;
  const p = action.progress;
  let forward = 0,
    side = 0,
    lift = 0;
  const close =
    ["giant", "web"].includes(heroId) ||
    (heroId === "shield" && action.variant === 1);
  const reach = heroId === "giant" ? 29 : close ? 42 : 68;
  const travel = Math.max(
    0,
    Math.min(
      distance - reach,
      action.ultimate && close ? 180 : close ? 130 : 38,
    ),
  );
  if (action.stage === "windup") {
    forward = -8 * p;
    if (action.ultimate)
      lift = heroId === "giant" || heroId === "thunder" ? -18 * p : 0;
  } else if (action.stage === "dash" || action.stage === "impact") {
    const moving = action.stage === "dash";
    forward = travel * (moving ? 1 - (1 - p) ** 3 : 1);
    if (moving && (heroId === "web" || (heroId === "shield" && action.variant)))
      side = Math.sin(p * Math.PI) * (action.ultimate ? 52 : 24);
    if (moving && (heroId === "giant" || heroId === "thunder"))
      lift =
        -Math.sin(p * Math.PI) *
        (action.ultimate ? 55 : action.variant ? 25 : 5);
    if (moving && heroId === "suit")
      lift = -Math.sin(p * Math.PI) * (action.ultimate ? 22 : 9);
  } else if (action.stage === "recover") forward = travel * (1 - p);
  if (reducedMotion) side = 0;
  return {
    x: home.x + ux * forward - uy * side,
    y: home.y + uy * forward + ux * side,
    lift: reducedMotion ? 0 : lift,
  };
}

// Arms may aim at an opponent while the body and its number still face center.
export function attackRig(actor, target, width, stage = "windup", variant = 0) {
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
    const swing =
      ((stage === "windup"
        ? -100
        : variant === 1 && (stage === "dash" || stage === "impact")
          ? 140
          : 55) *
        Math.PI) /
      180;
    x = 31 + 6 * Math.cos(swing) + 13 * Math.sin(swing);
    y = 25 + 6 * Math.sin(swing) - 13 * Math.cos(swing);
  }
  return {
    armAngle: (aim * 180) / Math.PI,
    x: actor.x + ((x - 22) * c - (y - 26) * s) * scale,
    y: actor.y + ((x - 22) * s + (y - 26) * c) * scale,
  };
}
