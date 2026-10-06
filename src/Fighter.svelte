<script>
  export let color = "#d3f580";
  export let pose = "idle";
  export let number = 1;
</script>

<svg
  class="knight"
  class:walk={pose === "walk"}
  class:windup={pose === "windup"}
  class:swing={pose === "swing"}
  class:hurt={pose === "hurt"}
  class:down={pose === "down"}
  class:win={pose === "win"}
  viewBox="0 0 44 52"
  fill="none"
  aria-hidden="true"
>
  <ellipse
    class="shadow"
    cx="22"
    cy="47"
    rx="14"
    ry="3"
    fill="#000"
    opacity=".5"
  />
  <g class="body">
    <path
      class="cape"
      d="M13 22 8 43Q22 49 34 43L30 22Z"
      fill={color}
      opacity=".5"
    />
    <g class="leg left-leg"
      ><path d="M16 33V43" stroke="#47515c" stroke-width="6" /><path
        d="M13 43H20V47H11V45Z"
        fill="#90969f"
      /></g
    >
    <g class="leg right-leg"
      ><path d="M27 33V43" stroke="#47515c" stroke-width="6" /><path
        d="M24 43H31V47H23V45Z"
        fill="#90969f"
      /></g
    >
    <path d="M14 21H29L32 35 22 39 11 35Z" fill={color} />
    <path
      d="M13 22 10 30M29 22 33 29"
      stroke="#9aa3ac"
      stroke-width="6"
      stroke-linecap="round"
    />
    <rect x="12" y="8" width="20" height="17" rx="7" fill="#e6c4a1" />
    <path d="M10 16V10Q10 4 22 4T34 10V18H30V12H14V18H10Z" fill="#75838f" />
    <path d="M15 6H29V10H15Z" fill={color} />
    <path d="M18 4V1H26V5" fill={color} />
    <rect x="13" y="14" width="18" height="7" rx="2" fill="#222b36" />
    <path d="M17 16V19M26 16V19" stroke="#eaf7f8" stroke-width="2" />
    <path d="M17 24H27" stroke="#a4b0b8" stroke-width="3" />
    <g class="sword-arm">
      <path
        d="M31 25 35 29"
        stroke="#b5bdc5"
        stroke-width="5"
        stroke-linecap="round"
      />
      <path d="M34 28 35 11 38 7 40 12 37 29Z" fill="#ecf1ec" />
      <path d="M37 12 36 27" stroke="#9dbbc8" />
      <path
        d="M31 28 40 30"
        stroke="#edc773"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path d="M35 30 34 34" stroke="#8f6852" stroke-width="3" />
    </g>
    <path
      d="M7 24 17 24 18 31Q16 37 12 39Q7 37 6 31Z"
      fill={color}
      stroke="#d6ddd9"
      stroke-width="1.2"
    />
    <path
      d="M12 26V35M9 30H15"
      stroke="#17251d"
      opacity=".4"
      stroke-width="1.5"
    />
    <text
      class="torso-number"
      class:double-digit={number >= 10}
      x="23.5"
      y="34"
      text-anchor="middle"
      fill="#152018">{number}</text
    >
  </g>
</svg>

<style>
  .knight {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .torso-number {
    font:
      900 10px system-ui,
      sans-serif;
    font-variant-numeric: tabular-nums;
  }
  .torso-number.double-digit {
    font-size: 8px;
    letter-spacing: -0.7px;
  }
  .body {
    transform-origin: 22px 43px;
  }
  .leg {
    transform-origin: 22px 34px;
  }
  .sword-arm {
    transform-origin: 31px 25px;
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
  .windup .sword-arm {
    transform: rotate(-48deg);
  }
  .windup .body {
    transform: rotate(-7deg);
  }
  .swing .sword-arm {
    transform: rotate(78deg);
  }
  .swing .body {
    transform: rotate(10deg);
  }
  .hurt .body {
    animation: hit 0.18s ease-out;
    filter: brightness(1.6);
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
  .win .sword-arm {
    transform: rotate(-130deg);
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
    0% {
      translate: 4px -1px;
      rotate: 12deg;
    }
    100% {
      translate: 0 0;
      rotate: 0deg;
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
