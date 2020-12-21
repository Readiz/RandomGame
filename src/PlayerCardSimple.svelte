<script>
  import { GameSummary, GameAutoProcess } from './store';
  import { tweened } from 'svelte/motion';
  import WeaponImageSimple from './WeaponImageSimple.svelte';
  export let playerInfo = {
    uid: 0,
    id: 0,
    name: "",
    charType: 0,
    enhanceDurability: 3,
    enhanceWarranty: 3,
    weaponEnhance: 0,
    highlight: false,
    gameOver: false,
  };
  let highlight = false;
  export let isAllGameOvered = false;
  export let isGameStarted = false;
  const MAX_ENHANCE = 11;
  const progress = tweened(0);

  function changeProgress(val) {
    progress.set(val / MAX_ENHANCE);
  }
  GameAutoProcess.subscribe((value) => {
    if (playerInfo.gameOver) {
      highlight = playerInfo.highlight;
    } else {
      highlight = false;
    }
  });
  $: changeProgress($GameSummary[playerInfo.id]);
</script>

<style>
  progress {
    display: block;
    width: 100%;
    overflow: hidden;
    border: 0;
    height: 100%;
  }
  div.wrapper {
    width: 100%;
    float: left;
    height: 20px;
    margin-bottom: 5px;
  }
  div.name, div.progress, div.image {
    float: left;
    overflow: hidden;
    font-size: 12px;
  }
  div.name {
    width: 70px;
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;
  }
  div.progress {
    width: calc(100% - 90px);
    height: 20px;
  }
  div.progress progress::-webkit-progress-bar {
    background-color: white;
  }
  div.progress progress::-webkit-progress-value, div.progress progress::-webkit-progress-inner-element {
    background-color: crimson !important;
  }
  div.image {
    width: 20px;
  }
  div.wrapper[highlight="true"] {
    outline: 2px solid red;
    opacity: 1 !important;
  }
  div.wrapper[isAllGameOvered="true"] {
    opacity: 0.5;
  }
</style>

<div class="wrapper" highlight={highlight} 
isAllGameOvered={isAllGameOvered && isGameStarted}>
  <div class="name">
    <img
      src={'./c' + playerInfo.charType + '.png'}
      width="15"
      height="15"
      alt=""
    />
    {playerInfo.name}
  </div>
  <div class="image">
    <WeaponImageSimple step={$GameSummary[playerInfo.id]} />
  </div>
  <div class="progress">
    <progress value={$progress}></progress>
  </div>
  <div style="clear:both;"></div>
</div>
