<script>
  import Fighter from "./Fighter.svelte";
  import { SPECIALS } from "./attack-presentation.js";
  export let actor;
  export let progress;
  export let kind = "ultimate";
  export let color;
  export let size;
  export let reducedMotion = false;
  $: special = SPECIALS[actor.heroId] ?? SPECIALS.suit;
  $: enter = reducedMotion ? 1 : Math.min(1, progress / 0.15);
  $: fade = reducedMotion ? 1 : Math.min(1, (1 - progress) / 0.16);
  $: spin = reducedMotion ? 0 : progress * 35;
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
</script>

<div
  class="ultimate-cutin"
  data-cutin-hero={actor.heroId}
  data-cutin-player={actor.id}
  data-cutin-progress={progress}
  data-cutin-kind={kind}
  aria-hidden="true"
  style={`--special-color:${special.color};--player-color:${color};--cutin-size:${size}px;--cutin-facing:${actor.angle}deg;opacity:${fade}`}
>
  <div class="cutin-dim"></div>
  <div class="cutin-seat">
    <div class="cutin-card" style={`transform:scale(${0.86 + enter * 0.14})`}>
      <svg class="cutin-rays" viewBox="0 0 300 300" fill="none">
        <g transform={`translate(150 150) rotate(${spin})`}>
          <circle r="99" stroke="currentColor" stroke-width="1" opacity=".5" />
          <circle
            r="116"
            stroke="currentColor"
            stroke-width="8"
            stroke-dasharray="4 38"
            opacity=".22"
          />
          {#each rays as angle}<path
              transform={`rotate(${angle})`}
              d="M0 -108 -3 -148H3Z"
              fill="currentColor"
              opacity=".45"
            />{/each}
          <path
            d="M-125 -68 125 -92M-125 90 125 68"
            stroke="currentColor"
            stroke-width="2"
          />
        </g>
      </svg>
      <div class="cutin-eyebrow">
        {kind === "comeback"
          ? "역전의 한방"
          : kind === "rally"
            ? "벼랑 끝 반격"
            : "필살기"}
      </div>
      <div class="cutin-portrait">
        <Fighter
          {color}
          number={actor.id}
          heroId={actor.heroId}
          pose="windup"
          attackStage="windup"
          attackProgress={progress}
          ultimate={true}
        />
      </div>
      <div class="cutin-name">{special.name}</div>
      <div class="cutin-owner"><b>{actor.id}</b>번</div>
    </div>
  </div>
</div>

<style>
  .ultimate-cutin {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    color: var(--special-color);
  }
  .cutin-dim {
    position: absolute;
    inset: 0;
    background: #070b12b0;
  }
  .cutin-seat {
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--cutin-size);
    height: var(--cutin-size);
    transform: translate(-50%, -50%) rotate(var(--cutin-facing));
  }
  .cutin-card {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      ellipse,
      #111e2cf5 10%,
      #0b101ee8 55%,
      transparent 70%
    );
  }
  .cutin-rays {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .cutin-eyebrow {
    z-index: 1;
    font-size: clamp(10px, 3vw, 13px);
    font-weight: 800;
    letter-spacing: 4px;
    margin-bottom: 9px;
  }
  .cutin-portrait {
    width: 31%;
    height: 37%;
    z-index: 1;
    filter: drop-shadow(0 0 13px var(--special-color));
  }
  .cutin-name {
    z-index: 1;
    margin-top: 13px;
    font-size: clamp(16px, calc(var(--cutin-size) * 0.105), 32px);
    font-weight: 900;
    letter-spacing: -1.5px;
    color: #f8fbff;
    white-space: nowrap;
    text-shadow: 0 2px 16px #000;
  }
  .cutin-owner {
    z-index: 1;
    color: var(--player-color);
    font-size: 12px;
    margin-top: 6px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  .cutin-owner b {
    font-size: 17px;
  }
</style>
