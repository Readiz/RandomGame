<script>
  export let heroId;
  export let from;
  export let to;
  export let stage;
  export let progress;
  export let ultimate = false;
  export let hit = false;
  export let reducedMotion = false;
  $: dx = to.x - from.x;
  $: dy = to.y - from.y;
  $: length = Math.hypot(dx, dy) || 1;
  $: px = -dy / length;
  $: py = dx / length;
  $: charge = stage === "windup";
  $: travel = stage === "dash" ? progress : charge ? 0 : 1;
  $: fade = stage === "recover" ? 1 - progress : 1;
  $: power = ultimate ? 1 : 0.55;
  $: spin = reducedMotion ? 0 : progress * 180;
  $: tip = { x: from.x + dx * travel, y: from.y + dy * travel };
  $: radius = (24 + progress * 54) * power;
  const spokes = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  const at = (i, r) => ({
    x: to.x + Math.cos((i * Math.PI) / 3) * r,
    y: to.y + Math.sin((i * Math.PI) / 3) * r,
  });
</script>

<g
  data-cue={ultimate ? `ultimate-${heroId}` : `alternate-${heroId}`}
  opacity={fade}
>
  {#if charge}
    <g transform={`translate(${from.x} ${from.y}) rotate(${spin})`}>
      <circle
        r={12 + progress * 22 * power}
        fill="currentColor"
        fill-opacity=".12"
        stroke="currentColor"
        stroke-width="2"
      />
      <circle
        r={24 + progress * 14 * power}
        stroke="currentColor"
        stroke-width="2"
        stroke-dasharray="8 10"
      />
      {#if ultimate}<path
          d="M0 -45V-32M0 32V45M-45 0H-32M32 0H45"
          stroke="currentColor"
          stroke-width="3"
        />{/if}
    </g>
  {:else if heroId === "suit"}
    <g data-cue="cross-beam">
      {#each [-1, 1] as side}
        <path
          d={`M${from.x + px * side * 13} ${from.y + py * side * 13}L${tip.x} ${tip.y}`}
          stroke="#61d7ff"
          stroke-width={ultimate ? 19 : 5}
          opacity=".45"
        />
        <path
          d={`M${from.x + px * side * 13} ${from.y + py * side * 13}L${tip.x} ${tip.y}`}
          stroke="#dcffff"
          stroke-width={ultimate ? 5 : 2}
        />
      {/each}
      {#if ultimate}<path
          d={`M${from.x} ${from.y}L${tip.x} ${tip.y}`}
          stroke="#9cefff"
          stroke-width="23"
          opacity=".6"
        /><path
          d={`M${from.x} ${from.y}L${tip.x} ${tip.y}`}
          stroke="#f5ffff"
          stroke-width="8"
        />{/if}
      {#if hit}<circle
          cx={to.x}
          cy={to.y}
          r={radius}
          stroke="#9cefff"
          stroke-width="3"
        /><circle
          cx={to.x}
          cy={to.y}
          r={radius * 0.65}
          fill="#b9faff"
          fill-opacity=".18"
        />{/if}
    </g>
  {:else if heroId === "shield"}
    <path
      d={`M${from.x} ${from.y}L${tip.x} ${tip.y}`}
      stroke="#a4c6ff"
      stroke-width={ultimate ? 28 : 14}
      opacity=".14"
    />
    {#each ultimate ? [0.6, 0.8, 1] : [0.7, 1] as tail}
      <g
        transform={`translate(${from.x + dx * travel * tail} ${from.y + dy * travel * tail}) rotate(${spin * 2})`}
        opacity={tail}
      >
        <circle
          r={ultimate ? 21 : 15}
          fill="#ca5364"
          stroke="#eab1bd"
          stroke-width="2"
        />
        <circle r={ultimate ? 15 : 10} fill="#f3f5ed" /><circle
          r={ultimate ? 10 : 7}
          fill="#5684c1"
        />
        <path d="m0 -9 3 6 7 2 -7 3 -3 7 -3 -7 -7 -3 7 -2Z" fill="#e9faff" />
      </g>
    {/each}
    {#if hit}<path
        transform={`translate(${to.x} ${to.y}) scale(${power * (1 + progress * 0.4)})`}
        d="m0 -48 12 31 36 2 -29 20 10 33 -29 -19 -29 19 10 -33 -29 -20 36 -2Z"
        stroke="#c1e0ff"
        stroke-width="3"
      />{/if}
  {:else if heroId === "thunder"}
    {#if stage === "dash"}
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${spin * 3})`}
        ><path d="M0 -6V18" stroke="#d9b789" stroke-width="5" /><rect
          x="-13"
          y="-16"
          width="26"
          height="17"
          rx="3"
          fill="#cceaff"
          stroke="#7fadcd"
          stroke-width="2"
        /></g
      >
      <path
        d={`M${from.x} ${from.y}L${tip.x} ${tip.y}`}
        stroke="#a3d7ff"
        stroke-width="4"
        opacity=".5"
      />
    {/if}
    {#if hit}
      {#each ultimate ? [-1, 0, 1] : [0] as branch}
        <path
          d={`M${to.x + branch * 78 - 14} ${to.y - 160 * power}l-14 42 28 -8 -22 46 20 -5L${to.x} ${to.y}`}
          stroke="#79acff"
          stroke-width="14"
          opacity=".3"
        />
        <path
          d={`M${to.x + branch * 78 - 14} ${to.y - 160 * power}l-14 42 28 -8 -22 46 20 -5L${to.x} ${to.y}`}
          stroke="#e8faff"
          stroke-width="3"
        />
      {/each}
      <ellipse
        cx={to.x}
        cy={to.y}
        rx={radius * 1.2}
        ry={radius * 0.5}
        stroke="#b5d8ff"
        stroke-width="3"
      />
    {/if}
  {:else if heroId === "giant"}
    {#if stage === "dash"}<path
        d={`M${from.x - px * 18} ${from.y - py * 18}l${-dx * 0.2} ${-dy * 0.2}M${from.x + px * 18} ${from.y + py * 18}l${-dx * 0.2} ${-dy * 0.2}`}
        stroke="#dcf4b1"
        stroke-width="4"
      />{/if}
    {#if hit}
      <g transform={`translate(${to.x} ${to.y})`}>
        <ellipse
          rx={radius * 1.5}
          ry={radius * 0.65}
          stroke="#cdef9d"
          stroke-width={ultimate ? 5 : 3}
        />
        <ellipse
          rx={radius}
          ry={radius * 0.45}
          stroke="#a4cc73"
          stroke-width="2"
        />
        {#each spokes as a}<path
            d={`M${Math.cos(a) * 13} ${Math.sin(a) * 13}l${Math.cos(a) * 24 * power} ${Math.sin(a) * 24 * power} -4 7 ${Math.cos(a) * 22 * power} ${Math.sin(a) * 22 * power}`}
            stroke="#cce8a0"
            stroke-width="2"
          />
          <rect
            x={Math.cos(a) * radius * 1.2 - 3}
            y={Math.sin(a) * radius * 0.7 - 4 - progress * 12}
            width="6"
            height="8"
            fill="#abc980"
            transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * radius * 1.2} ${Math.sin(a) * radius * 0.7})`}
          />{/each}
      </g>
    {/if}
  {:else if heroId === "web"}
    {#each [-1, 0, 1] as strand}<path
        d={`M${from.x} ${from.y}Q${from.x + dx * 0.5 + px * strand * 24} ${from.y + dy * 0.5 + py * strand * 24} ${tip.x} ${tip.y}`}
        stroke="#edf7ff"
        stroke-width={strand === 0 ? 2 : 1}
      />{/each}
    {#if hit}
      <g transform={`translate(${to.x} ${to.y}) rotate(${spin * 0.35})`}>
        {#each [16, 30, 44] as r}<path
            d={`M${spokes.map((a) => `${Math.cos(a) * r * power} ${Math.sin(a) * r * power}`).join("L")}Z`}
            stroke="#f1f8ff"
            stroke-width="1.8"
          />{/each}
        {#each spokes as a}<path
            d={`M0 0L${Math.cos(a) * 58 * power} ${Math.sin(a) * 58 * power}`}
            stroke="#fff"
            stroke-width="1.4"
          />{/each}
      </g>
    {/if}
  {:else if heroId === "mage"}
    {#each ultimate ? [0, 1, 2, 3, 4, 5] : [1, 4] as i}
      {@const portal = at(i, ultimate ? 65 : 38)}
      <g
        transform={`translate(${portal.x} ${portal.y}) rotate(${spin + i * 60})`}
      >
        <circle r={ultimate ? 16 : 12} stroke="#ffcb80" stroke-width="2" /><path
          d="M0 -13 11 7H-11ZM0 13 -11 -7H11Z"
          stroke="#efa861"
          stroke-width="1.3"
        />
      </g>
      <path
        d={`M${portal.x} ${portal.y}L${portal.x + (to.x - portal.x) * travel} ${portal.y + (to.y - portal.y) * travel}`}
        stroke="#ffb86d"
        stroke-width="5"
        opacity=".45"
      />
    {/each}
    {#if hit}<circle
        cx={to.x}
        cy={to.y}
        r={radius * 0.7}
        fill="#ffb970"
        fill-opacity=".15"
        stroke="#ffd39e"
        stroke-width="3"
      />{/if}
  {/if}
</g>
