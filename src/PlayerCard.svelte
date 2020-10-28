<script>
  import {
    GameState,
    GameLifeCycle,
    GameAutoProcess,
    CharTypes,
  } from "./store";
  import WeaponImage from "./WeaponImage.svelte";
  import Durability from "./Durability.svelte";
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
  export let handleGameOver = () => {
    // do nothing on default
  };
  export let isGameStarted = false;
  let stepSuccessProb = 1.0;
  const EnhanceState = {
    Failed: "Failed",
    BigFailed: "BigFailed",
    Success: "Success",
    BigSuccess: "BigSuccess",
    NothingHappened: "NothingHappened",
  };
  let recentState = EnhanceState.NothingHappened;
  let name = "";
  $: name = CharTypes[playerInfo.charType].name;
  GameState.subscribe((value) => {
    if (value === GameLifeCycle.Started) {
      startGame();
    } else {
      endGame();
    }
  });
  GameAutoProcess.subscribe((value) => {
    if (isGameStarted) {
      handleEnhancement();
    }
  });
  function startGame() {
    // 0번의 경우 랜덤 캐릭터이므로
    if (playerInfo.charType === 0) {
      playerInfo.charType = randomRange(1, 4);
    }
    if (playerInfo.charType === 2) {
      // 주유
      playerInfo.enhanceWarranty = 5;
      stepSuccessProb = 0.5;
    }
    if (playerInfo.charType === 3) {
      // 태성
      playerInfo.enhanceDurability = 1;
    }
    if (playerInfo.charType === 4) {
      // 곽철용
      playerInfo.enhanceDurability = 6;
      playerInfo.enhanceWarranty = 0;
      stepSuccessProb = 0.8;
    }
  }
  function endGame() {
    // ToDO
  }
  function randomRange(n1, n2) {
    return Math.floor(Math.random() * (n2 - n1 + 1) + n1);
  }
  function handleEnhancement() {
    if (playerInfo.gameOver) {
      return;
    }

    if (
      playerInfo.weaponEnhance < playerInfo.enhanceWarranty || // 강화 보장 구간이거나
      randomRange(1, 100) < stepSuccessProb * 100
    ) {
      // 확률로 성공~!
      recentState = EnhanceState.Success;
      playerInfo.weaponEnhance++; // 강화 수치 Up
      
      // 태성 전용: 50% 확률로 대성공
      if (playerInfo.charType === 3 && randomRange(1, 100) <= 50) {
        recentState = EnhanceState.BigSuccess;
        playerInfo.weaponEnhance++; // 강화 수치 추가 Up
      }
    } else {
      // 실패~!
      recentState = EnhanceState.Failed;
      playerInfo.enhanceDurability -= 1; // 내구도 깎자~~
      if (randomRange(1, 100) <= 30) {
        if (playerInfo.weaponEnhance > 0) {
          recentState = EnhanceState.BigFailed;
          playerInfo.weaponEnhance -= 1; // 50% 확률로 강화도 깎자~
        }
      }
      if (playerInfo.enhanceDurability === 0) {
        // 강화 내구도 다 되었고 실패.. gameover...
        playerInfo.gameOver = true;
      }
    }

    // 다음 단계 확률 계산!
    if (playerInfo.weaponEnhance < 10) {
      // 1 ~ 2강: 100%, 3강: 90%, 4강: 80%, 5강: 70%, 6강: 60%, 7강: 50%, 8강: 40%, ... 
      stepSuccessProb = 1 - (playerInfo.weaponEnhance - 2) * 0.1;
      if (stepSuccessProb > 1) stepSuccessProb = 1;
    } else { // 10강 이상은 1% 확률로 고정
      stepSuccessProb = 0.01;
    }
    if (playerInfo.charType === 2) stepSuccessProb *= 0.5;
    else if (playerInfo.charType === 4) stepSuccessProb *= 0.8;
  }
  $: ((gameOver) => {
    if (gameOver) {
      handleGameOver();
    }
  })(playerInfo.gameOver);
  let me;
</script>

<style>
  div.playerContainer {
    display: inline-block;
    border: 1px solid black;
    border-radius: 5px;
    margin: 5px;
    width: 200px;
    text-align: center;
  }
  div.playerContainer[recentState="BigSuccess"] {
    background-color: cadetblue;
  }
  div.playerContainer[recentState="Success"] {
    background-color: yellowgreen;
  }
  div.playerContainer[recentState="Failed"] {
    background-color: burlywood;
  }
  div.playerContainer[recentState="BigFailed"] {
    animation: shake 0.5s;
    background-color: palevioletred;
  }
  div.playerContainer[isAutoPlaying="true"] {
    /* Start the shake animation and make the animation last for 0.5 seconds */
    animation: shake 0.5s;

    /* When the animation is finished, start again */
    animation-iteration-count: infinite;
  }

  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
</style>

<div
  bind:this={me}
  class="playerContainer"
  {recentState}
  isAutoPlaying={$GameAutoProcess > 0 && isGameStarted && !playerInfo.gameOver}>
  {#if !isGameStarted}
    <input class="form-control" bind:value={playerInfo.name} />
  {:else}
    <b>{playerInfo.name}</b>
    <br />
    {name}
    <img
      src={'./c' + playerInfo.charType + '.png'}
      width="20"
      height="20"
      alt="" />
  {/if}

  <hr />

  {#if !isGameStarted}
    <img
      src={'./c' + playerInfo.charType + '.png'}
      width="100"
      height="100"
      alt="" />
    <br />
    <label>
      <select class="form-control" bind:value={playerInfo.charType}>
        {#each CharTypes as charType}
          <option value={charType.id}>{charType.name}</option>
        {/each}
      </select>
    </label>
  {/if}

  {#if isGameStarted}
    <WeaponImage step={playerInfo.weaponEnhance} />
    {#if isGameStarted && playerInfo.gameOver}
      <br /><span style="color:black">게임 오버!</span><br /><br />
    {/if}

    {#if isGameStarted && !playerInfo.gameOver}
      <b>남은 강화 내구도</b><br />
      <Durability durability={playerInfo.enhanceDurability} />
      <br />
      <b>강화 보장</b> +{playerInfo.enhanceWarranty}
      {#if $GameAutoProcess === 0}
        <br />
        <div class="btn btn-lg btn-warning" on:click={handleEnhancement}>
          <b>강화 도전!!!</b><br />
          {#if playerInfo.enhanceWarranty > playerInfo.weaponEnhance}
            <small>강화 보장 구간</small>
          {:else}
            <small>성공확률: {Math.round(stepSuccessProb * 100)}%</small>
          {/if}
        </div>
      {/if}
    {/if}
  {/if}
</div>
