<script>
  import PowerAttack from "./PowerAttack.svelte";
  import { SPECIALS } from "./attack-presentation.js";
  export let from;
  export let to;
  export let heroId;
  export let stage;
  export let progress = 0;
  export let critical = false;
  export let dodged = false;
  export let parried = false;
  export let clipId;
  export let reducedMotion = false;
  export let attackerId;
  export let turn;
  export let variant = 0;
  export let ultimate = false;
  $: dx = to.x - from.x;
  $: dy = to.y - from.y;
  $: length = Math.hypot(dx, dy) || 1;
  $: px = -dy / length;
  $: py = dx / length;
  $: charging = stage === "windup";
  $: hit = (stage === "impact" || stage === "recover") && !dodged && !parried;
  $: fade = stage === "recover" ? 1 - progress : 1;
  $: travel =
    stage === "dash"
      ? progress
      : stage === "recover" && heroId === "shield"
        ? 1 - progress
        : 1;
  $: tip = { x: from.x + dx * travel, y: from.y + dy * travel };
  $: bend = Math.min(length * 0.2, 28);
  $: disc = {
    x: tip.x + px * 4 * bend * travel * (1 - travel),
    y: tip.y + py * 4 * bend * travel * (1 - travel),
  };
  $: bolt = `M${from.x} ${from.y}L${from.x + dx * travel * 0.32 + px * 11 * travel} ${from.y + dy * travel * 0.32 + py * 11 * travel}L${from.x + dx * travel * 0.62 - px * 9 * travel} ${from.y + dy * travel * 0.62 - py * 9 * travel}L${tip.x} ${tip.y}`;
  $: spin = reducedMotion ? 0 : progress * (stage === "recover" ? -540 : 540);
  $: shock = 12 + progress * 22;
  const spokes = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
</script>

<g
  class="attack-effect"
  class:critical
  data-attack-effect={heroId}
  data-attacker-id={attackerId}
  data-attack-turn={turn}
  data-attack-id={clipId}
  data-stage={stage}
  data-progress={progress}
  data-variant={variant}
  data-ultimate={ultimate}
  data-dodged={dodged}
  data-parried={parried}
  data-origin-x={from.x}
  data-origin-y={from.y}
  fill="none"
  stroke-linecap="round"
  style={`color:${SPECIALS[heroId]?.color ?? "#d4f5ff"}`}
>
  {#if ultimate || variant === 1}
    <PowerAttack
      {heroId}
      {from}
      {to}
      {stage}
      {progress}
      {ultimate}
      {hit}
      {reducedMotion}
    />
  {:else if charging}
    <g transform={`translate(${from.x} ${from.y})`} data-cue="charge">
      {#if heroId === "suit"}
        <circle
          r={5 + progress * 8}
          stroke="#82e7ff"
          stroke-width="2"
          opacity=".7"
        />
        <circle r={3 + progress * 3} fill="#eaffff" />
        <path
          d="M-18 0H-12M12 0H18M0 -18V-12M0 12V18"
          stroke="#a8f7ff"
          stroke-width="2"
        />
      {:else if heroId === "shield"}
        <path d="M-15 8A17 17 0 0 1 11 -13" stroke="#b3d6ff" stroke-width="3" />
      {:else if heroId === "thunder"}
        <path
          d="M-17 -10 -8 -3 -12 4 -2 10M9 -17 3 -9 11 -4 5 4M17 6 10 9 14 16"
          stroke="#b4e1ff"
          stroke-width="2"
        />
        <circle r={4 + progress * 5} fill="#ceeeff" opacity=".55" />
      {:else if heroId === "giant"}
        <path
          d="M-22 8 -27 -2M-16 -8 -18 -18M5 -15 8 -24"
          stroke="#bbdc92"
          stroke-width="3"
        />
      {:else if heroId === "web"}
        <path
          d="M-8 0H8M0 -8V8M-5 -5 5 5M-5 5 5 -5"
          stroke="#f7faff"
          stroke-width="1.5"
        />
      {:else if heroId === "mage"}
        <g transform={`rotate(${spin})`}>
          <circle r={10 + progress * 7} stroke="#ffc477" stroke-width="2" />
          <path
            d="M0 -15 13 8H-13ZM0 15 -13 -8H13Z"
            stroke="#ffce8c"
            stroke-width="1.4"
          />
        </g>
      {/if}
    </g>
  {:else if heroId === "suit"}
    <g opacity={fade} data-cue="beam">
      <path
        d={`M${from.x} ${from.y}L${tip.x} ${tip.y}`}
        stroke="#54cfff"
        stroke-width={critical ? 17 : 12}
        opacity=".3"
      />
      <path
        d={`M${from.x} ${from.y}L${tip.x} ${tip.y}`}
        stroke="#84eaff"
        stroke-width={critical ? 8 : 6}
      />
      <path
        d={`M${from.x} ${from.y}L${tip.x} ${tip.y}`}
        stroke="#f3ffff"
        stroke-width="2.5"
      />
      <circle cx={from.x} cy={from.y} r="7" fill="#d9ffff" />
      {#if hit}<circle
          cx={to.x}
          cy={to.y}
          r={shock}
          stroke="#a8f5ff"
          stroke-width="2"
          opacity={1 - progress * 0.6}
        />{/if}
    </g>
  {:else if heroId === "shield"}
    <path
      d={`M${from.x} ${from.y}Q${from.x + dx * 0.5 + px * bend * 2} ${from.y + dy * 0.5 + py * bend * 2} ${to.x} ${to.y}`}
      stroke="#a2c8ff"
      stroke-width="3"
      opacity=".4"
    />
    <g
      transform={`translate(${disc.x} ${disc.y}) rotate(${spin})`}
      data-cue="shield-flight"
    >
      <circle r="14" fill="#c34d60" stroke="#e4a0ac" stroke-width="1" />
      <circle r="10" fill="#eff5f1" /><circle r="6.5" fill="#497eae" />
      <path d="m0 -6 2 4 4 1 -4 2 -2 5 -2 -5 -4 -2 4 -1Z" fill="#effaff" />
    </g>
  {:else if heroId === "thunder"}
    <g opacity={fade} data-cue="lightning">
      <path d={bolt} stroke="#6caaff" stroke-width="9" opacity=".4" />
      <path d={bolt} stroke="#e5faff" stroke-width="3" />
      {#if hit}
        <path
          d={`M${to.x - 9} ${to.y - 92}l-14 36 24 -5 -15 33 14 -4L${to.x} ${to.y}`}
          stroke="#85bcff"
          stroke-width="11"
          opacity=".35"
        />
        <path
          d={`M${to.x - 9} ${to.y - 92}l-14 36 24 -5 -15 33 14 -4L${to.x} ${to.y}`}
          stroke="#e4faff"
          stroke-width="3.5"
        />
        <path
          d={`M${to.x - 5} ${to.y - 28}l26 -18 -8 -12`}
          stroke="#a0d5ff"
          stroke-width="2"
        />
      {/if}
    </g>
  {:else if heroId === "giant"}
    {#if stage === "dash"}
      <path
        d={`M${from.x - px * 17} ${from.y - py * 17}l${-dx * 0.28} ${-dy * 0.28}M${from.x + px * 17} ${from.y + py * 17}l${-dx * 0.22} ${-dy * 0.22}`}
        stroke="#bddb98"
        stroke-width="3"
      />
    {/if}
    {#if hit}
      <g
        transform={`translate(${to.x} ${to.y})`}
        opacity={fade}
        data-cue="ground-smash"
      >
        <ellipse
          rx={shock * 1.65}
          ry={shock}
          stroke="#d1eaa3"
          stroke-width="3"
        />
        <ellipse
          rx={shock * 1.15}
          ry={shock * 0.65}
          stroke="#adc48b"
          stroke-width="1.5"
        />
        <path
          d="M-8 -4 -25 -13 -32 -9 -43 -17M6 -4 24 -15 27 -9 42 -14M1 5 -2 15 7 20 3 29"
          stroke="#aabb8a"
          stroke-width="2"
        />
        {#each spokes as angle}
          <path
            d="m-2 -2 5 1 -1 4 -4 -1Z"
            transform={`translate(${Math.cos(angle) * shock * 1.8} ${Math.sin(angle) * shock}) rotate(${(angle * 180) / Math.PI})`}
            fill="#b8cc93"
          />
        {/each}
      </g>
    {/if}
  {:else if heroId === "web"}
    <g opacity={fade} data-cue="web-shot">
      {#each [-1, 0, 1] as offset}
        <path
          d={`M${from.x} ${from.y}L${tip.x + px * offset * 9 * travel} ${tip.y + py * offset * 9 * travel}`}
          stroke="#eff8ff"
          stroke-width={offset === 0 ? 2 : 1}
        />
      {/each}
      {#if hit}
        <g transform={`translate(${to.x} ${to.y})`}>
          <circle r="26" stroke="#eef9ff" stroke-width="1.5" /><circle
            r="15"
            stroke="#eef9ff"
          />
          {#each spokes as angle}<path
              d={`M0 0L${Math.cos(angle) * 29} ${Math.sin(angle) * 29}`}
              stroke="#eef9ff"
              stroke-width="1.2"
            />{/each}
        </g>
      {/if}
    </g>
  {:else if heroId === "mage"}
    <g opacity={fade} data-cue="spell">
      <circle
        cx={from.x}
        cy={from.y}
        r="16"
        stroke="#ffc57f"
        stroke-width="2"
      />
      <path
        d={`M${from.x} ${from.y}L${tip.x} ${tip.y}`}
        stroke="#e8a35c"
        stroke-width="6"
        opacity=".35"
      />
      <g
        transform={`translate(${hit ? to.x : tip.x} ${hit ? to.y : tip.y}) rotate(${spin})`}
      >
        <circle r={hit ? 30 : 11} stroke="#ffc67c" stroke-width="2.5" />
        <circle r={hit ? 23 : 7} stroke="#df9154" stroke-width="1.5" />
        <path
          d="M0 -23 20 12H-20ZM0 23 -20 -12H20Z"
          stroke="#ffd296"
          stroke-width="1.5"
        />
      </g>
    </g>
  {/if}
  {#if parried && (stage === "impact" || stage === "recover")}
    <g transform={`translate(${to.x} ${to.y})`} opacity={fade} data-cue="parry">
      <circle
        r={25 + progress * 5}
        fill="#bdefff"
        fill-opacity=".12"
        stroke="#cff7ff"
        stroke-width="2.5"
      />
      <path
        d="M-18 -18A26 26 0 0 1 18 18M-22 12A26 26 0 0 1 -22 -12"
        stroke="#78dfff"
        stroke-width="4"
      />
      {#each spokes.slice(0, 6) as angle}
        <path
          d={`M${Math.cos(angle) * 32} ${Math.sin(angle) * 32}l${Math.cos(angle) * 7} ${Math.sin(angle) * 7}`}
          stroke="#eaffff"
          stroke-width="2"
        />
      {/each}
    </g>
  {/if}
  {#if hit && stage === "impact" && heroId !== "giant"}
    <g transform={`translate(${to.x} ${to.y})`} opacity={1 - progress * 0.8}>
      {#each spokes.slice(0, 6) as angle}<path
          d={`M${Math.cos(angle) * 26} ${Math.sin(angle) * 26}l${Math.cos(angle) * 8} ${Math.sin(angle) * 8}`}
          stroke="#fff3d2"
          stroke-width={critical ? 3 : 1.5}
        />{/each}
    </g>
  {/if}
</g>

<style>
  .attack-effect {
    pointer-events: none;
  }
  .critical {
    filter: drop-shadow(0 0 3px #fff0ba);
  }
</style>
