<script>
  export let color = "#d3f580";
  export let pose = "idle";
  export let number = 1;
  export let heroId = "suit";
  export let attackStage = "idle";
  export let attackProgress = 0;
  export let armAngle = 0;
  export let variant = 0;
  export let ultimate = false;
  $: casting = attackStage !== "idle";
  $: aimed = casting && ["suit", "web", "mage"].includes(heroId);
  const suits = {
    suit: { body: "#b84446", trim: "#efcb78", legs: "#b84446" },
    shield: { body: "#4875ad", trim: "#e6edf2", legs: "#304e77" },
    thunder: { body: "#708494", trim: "#d4e1e7", legs: "#485565" },
    giant: { body: "#86bf65", trim: "#b8df83", legs: "#72508f" },
    web: { body: "#d9575a", trim: "#f2eeee", legs: "#35648e" },
    mage: { body: "#39768c", trim: "#efb867", legs: "#325060" },
  };
  $: suit = suits[heroId] ?? suits.suit;
</script>

<svg
  class={`hero ${heroId} ${pose}`}
  class:casting
  class:alt={variant === 1}
  class:ultimate
  data-attack-stage={attackStage}
  viewBox="0 0 44 52"
  fill="none"
  aria-hidden="true"
>
  <ellipse
    class="shadow"
    cx="22"
    cy="47"
    rx={heroId === "giant" ? 17 : 14}
    ry="3"
    fill="#000"
    opacity=".5"
  />
  <g class="body">
    {#if heroId === "suit" && casting}
      <path
        class="thrusters"
        d="M12 46 15 57 18 46M26 46 29 57 32 46"
        fill="#84eaff"
      />
    {/if}
    {#if heroId === "thunder" || heroId === "mage"}
      <path
        class="cape"
        d="M12 20 5 43Q22 52 38 43L32 20Z"
        fill={heroId === "mage" ? "#a93c4c" : "#c45860"}
      />
    {/if}
    <g class="leg left-leg">
      <path
        d="M16 34V44"
        stroke={suit.legs}
        stroke-width={heroId === "giant" ? 8 : 6}
      />
      <path
        d="M12 43H20V47H10V45Z"
        fill={heroId === "giant" ? suit.body : suit.trim}
      />
    </g>
    <g class="leg right-leg">
      <path
        d="M28 34V44"
        stroke={suit.legs}
        stroke-width={heroId === "giant" ? 8 : 6}
      />
      <path
        d="M24 43H32V47H24Z"
        fill={heroId === "giant" ? suit.body : suit.trim}
      />
    </g>
    <path
      d={heroId === "giant"
        ? "M10 21H34L33 37H11Z"
        : "M14 21H30L32 36 22 40 11 36Z"}
      fill={suit.body}
      stroke="#13202b"
      stroke-width=".8"
    />
    <path
      d="M13 23 9 31"
      stroke={suit.body}
      stroke-width={heroId === "giant" ? 9 : 6}
      stroke-linecap="round"
    />
    {#if heroId === "suit"}<path
        d="M13 24 17 27M28 27 32 24M15 37H29"
        stroke={suit.trim}
        stroke-width="2"
      />{/if}
    {#if heroId === "web"}<path
        d="M14 24 30 36M30 24 14 36M12 30H31"
        stroke="#742f41"
        stroke-width="1"
      />{/if}
    {#if heroId === "mage"}<path
        d="M12 20 18 26M32 20 27 26M14 36H31"
        stroke={suit.trim}
        stroke-width="3"
      />{/if}
    {#if heroId === "thunder"}<circle
        cx="14"
        cy="24"
        r="2.5"
        fill={suit.trim}
      /><circle cx="30" cy="24" r="2.5" fill={suit.trim} />{/if}

    {#if heroId === "suit"}
      <rect x="12" y="5" width="21" height="21" rx="7" fill={suit.body} />
      <path
        d="M15 10 18 8 22 11 27 8 30 10 29 21 25 24H19L15 20Z"
        fill={suit.trim}
      />
      <path d="M16 15H21M25 15H29" stroke="#b8f7ff" stroke-width="2" />
      <path d="M20 21H25" stroke="#624834" stroke-width="1.5" />
    {:else if heroId === "shield"}
      <rect x="12" y="7" width="21" height="19" rx="8" fill="#e9c5a0" />
      <path d="M12 19V11Q12 3 23 4Q33 4 33 12V20L28 17H17Z" fill={suit.body} />
      <path d="M16 15H20M25 15H29M22 7V11" stroke="#eef5f5" stroke-width="2" />
    {:else if heroId === "thunder"}
      <path d="M12 11Q22 1 32 11L34 28H10Z" fill="#d4b472" />
      <rect x="14" y="10" width="17" height="16" rx="6" fill="#e7c9a5" />
      <path d="M12 16V9Q23 2 32 9V16L25 12 22 15 18 12Z" fill={suit.trim} />
      <path d="M12 10 6 5 9 17 13 19M32 10 38 5 35 17 31 19" fill="#b7cbd6" />
      <path d="M17 18H20M25 18H28" stroke="#344452" stroke-width="1.6" />
    {:else if heroId === "giant"}
      <rect x="10" y="5" width="24" height="22" rx="6" fill={suit.body} />
      <path
        d="M10 13V7L16 3 22 5 29 3 34 8V13L28 10 25 12 18 10 14 13Z"
        fill="#263b2a"
      />
      <path d="M14 16 19 18M30 16 25 18" stroke="#244529" stroke-width="2" />
      <path d="M17 23H27" stroke="#dbe5bd" stroke-width="3" />
    {:else if heroId === "web"}
      <ellipse cx="22" cy="15" rx="10" ry="12" fill={suit.body} />
      <path
        d="M22 3V26M13 8 31 21M31 8 13 21M12 14H32M15 7Q22 14 29 7M13 21Q22 17 31 21"
        stroke="#872f42"
        stroke-width=".8"
      />
      <path
        d="M14 12 21 16 18 20Q13 19 14 12M30 12 23 16 26 20Q31 19 30 12"
        fill="#f4f8f6"
        stroke="#222d43"
        stroke-width="1"
      />
    {:else}
      <rect x="13" y="7" width="20" height="20" rx="6" fill="#d9af8b" />
      <path
        d="M13 15V8L19 3 25 5 31 4 34 10 32 17 28 10 21 10 17 14Z"
        fill="#28353e"
      />
      <path d="M14 10 17 7M30 10 31 7" stroke="#dae1db" stroke-width="2" />
      <path
        d="M17 17H20M26 17H29M19 24 23 26 27 23"
        stroke="#28353e"
        stroke-width="2"
      />
      <path d="M11 20 17 27 9 25ZM33 20 27 27 36 25Z" fill="#c95b69" />
    {/if}

    <g class="weapon" style={aimed ? `transform:rotate(${armAngle}deg)` : ""}>
      <path
        d={["suit", "web", "mage"].includes(heroId)
          ? "M31 25H43"
          : "M31 24 35 29"}
        stroke={suit.body}
        stroke-width={heroId === "giant" ? 9 : 6}
        stroke-linecap="round"
      />
      {#if heroId === "suit"}
        <circle cx="43" cy="25" r="4.5" fill={suit.trim} />
        <circle
          class="charge"
          cx="43"
          cy="25"
          r={casting ? 3.5 : 2}
          fill="#dcfcff"
        />
      {:else if heroId === "thunder"}
        <path d="M36 14 35 32" stroke="#b89569" stroke-width="3" />
        <path
          d="M30 8H43V17H30Z"
          fill="#d0e1eb"
          stroke="#6c879c"
          stroke-width="1.2"
        />
        <path d="M39 9 36 14 40 14" stroke="#fcfbdb" stroke-width="1.5" />
      {:else if heroId === "giant"}
        <rect
          x="31"
          y="23"
          width="11"
          height="11"
          rx="4"
          fill={suit.trim}
          stroke="#426442"
        />
      {:else if heroId === "web"}
        <path
          d="M40 25 47 22M40 25 47 28M40 25H44"
          stroke={suit.body}
          stroke-width="2.5"
          stroke-linecap="round"
        />
      {:else if heroId === "mage"}
        <circle
          class="charge"
          cx="43"
          cy="25"
          r="6"
          stroke="#ffc37b"
          stroke-width="1.5"
        />
        <path
          d="M43 19 48 28H38ZM43 31 38 22H48Z"
          stroke="#ee9956"
          stroke-width=".8"
        />
      {/if}
    </g>
    {#if heroId === "shield"}
      <g
        class="shield"
        style:opacity={attackStage === "dash" ||
        attackStage === "impact" ||
        (attackStage === "recover" && attackProgress < 0.9)
          ? 0
          : 1}
        ><circle cx="10" cy="31" r="10" fill="#be5361" /><circle
          cx="10"
          cy="31"
          r="7"
          fill="#e7ece8"
        /><circle cx="10" cy="31" r="4.5" fill="#497eae" /><path
          d="m10 27 1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1Z"
          fill="#eff5ec"
        /></g
      >
    {/if}
    <circle
      cx="23"
      cy="32"
      r="6.3"
      fill={color}
      stroke="#18221ed9"
      stroke-width=".8"
    />
    <text
      class="torso-number"
      class:double-digit={number >= 10}
      x="23"
      y="35.3"
      text-anchor="middle"
      fill="#152018">{number}</text
    >
  </g>
</svg>

<style>
  .hero {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .torso-number {
    font:
      900 9px system-ui,
      sans-serif;
    font-variant-numeric: tabular-nums;
  }
  .double-digit {
    font-size: 7.5px;
    letter-spacing: -0.5px;
  }
  .body {
    transform-origin: 22px 38px;
  }
  .leg {
    transform-origin: 22px 34px;
  }
  .weapon {
    transform-origin: 31px 25px;
  }
  .suit .weapon,
  .web .weapon,
  .mage .weapon {
    transform: rotate(45deg);
  }
  .walk .body {
    animation: bob 0.2s infinite alternate;
  }
  .walk .left-leg {
    animation: step 0.2s infinite alternate;
  }
  .walk .right-leg {
    animation: step 0.2s infinite alternate-reverse;
  }
  .windup .weapon {
    transform: rotate(-28deg);
  }
  .windup .charge {
    filter: drop-shadow(0 0 4px #fff8c7);
  }
  .swing .weapon {
    transform: rotate(55deg);
  }
  .thunder.windup .weapon {
    transform: rotate(-100deg);
  }
  .thunder.recover .weapon {
    transform: rotate(55deg);
  }
  .shield.windup .shield {
    transform: translate(-3px, -5px);
  }
  .shield.swing .weapon {
    transform: rotate(-75deg);
  }
  .giant.windup .body {
    transform: translate(0, -3px) scale(1.08, 1.12);
  }
  .giant.windup .weapon {
    transform: rotate(-140deg);
  }
  .giant.swing .body {
    transform: translate(0, 4px) scale(1.12, 0.9);
  }
  .web.casting .left-leg {
    transform: rotate(35deg);
  }
  .web.casting .right-leg {
    transform: rotate(-25deg);
  }
  .mage.casting .cape {
    transform: scaleX(1.15);
    transform-origin: 22px 25px;
  }
  .thrusters {
    filter: drop-shadow(0 0 3px #62d6ff);
  }
  .hurt .body {
    animation: hit 0.18s ease-out;
    filter: brightness(1.5);
  }
  .guard .body {
    transform: translate(0, 2px) scaleY(0.94);
    filter: brightness(1.2);
  }
  .guard .weapon {
    transform: rotate(-65deg);
  }
  .ultimate .body {
    filter: drop-shadow(0 0 3px #b8edff);
  }
  .ultimate.windup .body {
    transform: translate(0, -3px) scale(1.08);
  }
  .suit.alt.swing .body {
    transform: translate(0, -3px);
  }
  .shield.alt.swing .body {
    transform: translate(-3px, 2px) rotate(-12deg);
  }
  .thunder.alt.swing .weapon {
    transform: rotate(140deg);
  }
  .giant.alt.swing .weapon {
    transform: rotate(-95deg);
  }
  .giant.ultimate.swing .body {
    transform: translate(0, 5px) scale(1.18, 0.86);
  }
  .web.alt.swing .left-leg {
    transform: rotate(65deg);
  }
  .web.alt.swing .right-leg {
    transform: rotate(-50deg);
  }
  .mage.ultimate .cape {
    transform: scaleX(1.35);
    transform-origin: 22px 25px;
  }
  .down .body {
    transform: translate(4px, 7px) rotate(85deg);
    opacity: 0.22;
  }
  .down .shadow {
    opacity: 0.18;
  }
  .win .body {
    animation: hop 0.6s ease-in-out infinite;
  }
  .win .weapon {
    transform: rotate(-100deg);
  }
  @keyframes bob {
    from {
      translate: 0 0;
    }
    to {
      translate: 0 -2px;
    }
  }
  @keyframes step {
    from {
      rotate: -10deg;
    }
    to {
      rotate: 10deg;
    }
  }
  @keyframes hit {
    from {
      translate: 3px -1px;
    }
    to {
      translate: 0 0;
    }
  }
  @keyframes hop {
    0%,
    100% {
      translate: 0 0;
    }
    50% {
      translate: 0 -5px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
    }
  }
</style>
