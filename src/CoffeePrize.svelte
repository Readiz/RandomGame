<script>
  export let angle = 0;
</script>

<div
  class="coffee-prize"
  style={`--coffee-facing:${angle}deg`}
  aria-hidden="true"
>
  <svg viewBox="0 0 84 84" fill="none">
    <ellipse cx="40" cy="68" rx="31" ry="7" fill="#0c0d0f" opacity=".18" />
    <ellipse
      cx="40"
      cy="64"
      rx="32"
      ry="9"
      fill="#f6edda"
      stroke="#202328"
      stroke-width="2.5"
    />
    <path
      d="M61 32H66C84 32 80 54 62 54H57"
      stroke="#202328"
      stroke-width="10"
    />
    <path
      d="M61 32H66C84 32 80 54 62 54H57"
      stroke="#fff8e9"
      stroke-width="5"
    />
    <path
      d="M15 30H65L61 52Q58 66 40 67Q22 66 19 52Z"
      fill="#fff8e9"
      stroke="#202328"
      stroke-width="2.5"
    />
    <path
      d="M23 38 25 52Q27 58 31 59"
      stroke="#e5d8bd"
      stroke-width="3"
      stroke-linecap="round"
    />
    <ellipse
      cx="40"
      cy="30"
      rx="25"
      ry="9"
      fill="#f6ead3"
      stroke="#202328"
      stroke-width="2.5"
    />
    <ellipse cx="40" cy="30" rx="20" ry="5.8" fill="#784e33" />
    <path d="M40 32C26 27 34 24 40 28C46 24 54 27 40 32Z" fill="#ead5aa" />
    <path
      class="steam"
      d="M30 19C20 12 35 11 29 4M47 17C38 10 53 9 47 2"
      stroke="#fff8e9"
      stroke-width="2.5"
      stroke-linecap="round"
      opacity=".85"
    />
  </svg>
</div>

<style>
  .coffee-prize {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 78px;
    height: 78px;
    transform: translate(-50%, -50%) rotate(var(--coffee-facing));
    pointer-events: none;
    z-index: 2;
  }
  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
    animation: coffee-arrive 0.5s ease-out 0.15s both;
  }
  .steam {
    animation: coffee-steam 1.8s ease-in-out infinite alternate;
  }
  @keyframes coffee-arrive {
    from {
      opacity: 0;
      scale: 0.75;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }
  @keyframes coffee-steam {
    from {
      opacity: 0.45;
      translate: 0 2px;
    }
    to {
      opacity: 0.95;
      translate: 0 -2px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    svg,
    .steam {
      animation: none;
    }
  }
</style>
