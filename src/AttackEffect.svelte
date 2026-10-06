<script>
  export let from;
  export let to;
  export let heroId;
  export let critical = false;
  $: dx = to.x - from.x;
  $: dy = to.y - from.y;
  $: length = Math.hypot(dx, dy) || 1;
  $: px = -dy / length;
  $: py = dx / length;
  $: bolt = `M${from.x} ${from.y} L${from.x + dx * 0.35 + px * 9} ${from.y + dy * 0.35 + py * 9} L${from.x + dx * 0.6 - px * 8} ${from.y + dy * 0.6 - py * 8} L${to.x} ${to.y}`;
</script>

<g
  class="attack-effect"
  class:critical
  data-attack-effect={heroId}
  fill="none"
  stroke-linecap="round"
>
  {#if heroId === "suit"}
    <path
      d={`M${from.x} ${from.y}L${to.x} ${to.y}`}
      stroke="#79dbe8"
      stroke-width="5"
      opacity=".55"
    />
    <path
      d={`M${from.x} ${from.y}L${to.x} ${to.y}`}
      stroke="#effffe"
      stroke-width="1.8"
    />
    <circle cx={to.x} cy={to.y} r="18" stroke="#abf6f8" stroke-width="2" />
  {:else if heroId === "thunder"}
    <path d={bolt} stroke="#99c9ff" stroke-width="6" opacity=".35" />
    <path d={bolt} stroke="#e7f6ff" stroke-width="2.5" />
  {:else if heroId === "giant"}
    <ellipse
      cx={to.x}
      cy={to.y + 10}
      rx="31"
      ry="16"
      stroke="#d5eaaa"
      stroke-width="3"
    />
    <path
      d={`M${to.x - 29} ${to.y - 16}l-6 -7M${to.x + 28} ${to.y - 16}l6 -7M${to.x} ${to.y + 26}v7`}
      stroke="#e9edc5"
      stroke-width="2"
    />
  {:else if heroId === "web"}
    {#each [-1, 0, 1] as offset}<path
        d={`M${from.x} ${from.y}L${to.x + px * offset * 15} ${to.y + py * offset * 15}`}
        stroke="#e4edf0"
        stroke-width="1.1"
      />{/each}
    <circle cx={to.x} cy={to.y} r="20" stroke="#e4edf0" stroke-width="1.3" />
    <path
      d={`M${to.x - 20} ${to.y}h40M${to.x} ${to.y - 20}v40M${to.x - 14} ${to.y - 14}l28 28M${to.x + 14} ${to.y - 14}l-28 28`}
      stroke="#e4edf0"
      stroke-width=".9"
    />
  {:else if heroId === "mage"}
    <path
      d={`M${from.x} ${from.y}L${to.x} ${to.y}`}
      stroke="#f1b56d"
      opacity=".4"
    />
    <circle cx={to.x} cy={to.y} r="25" stroke="#ffc67c" stroke-width="2" />
    <circle cx={to.x} cy={to.y} r="18" stroke="#dc8e61" stroke-width="1" />
    <path
      d={`M${to.x} ${to.y - 24}L${to.x + 21} ${to.y + 12}H${to.x - 21}ZM${to.x} ${to.y + 24}L${to.x - 21} ${to.y - 12}H${to.x + 21}Z`}
      stroke="#f0b271"
    />
  {:else}
    <circle
      cx={to.x}
      cy={to.y}
      r="23"
      stroke="#e9ddd2"
      stroke-width="3"
      stroke-dasharray="50 18"
    />
    <path
      d={`M${to.x - 25} ${to.y + 18}Q${to.x + 24} ${to.y + 14} ${to.x + 25} ${to.y - 21}`}
      stroke="#a2c4ec"
      stroke-width="3"
    />
  {/if}
</g>

<style>
  .attack-effect {
    pointer-events: none;
    animation: impact 0.28s ease-out both;
  }
  .critical {
    filter: drop-shadow(0 0 4px #fff0ba);
  }
  @keyframes impact {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .attack-effect {
      animation: none;
    }
  }
</style>
