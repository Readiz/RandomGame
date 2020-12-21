<script>
  import {
    GameState,
    GameLifeCycle,
    GameAutoProcess,
    GameSummary,
    CharTypes,
  } from "./store";
  import { randomRange } from './utils';
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
  let highlight = false;
  export let GameLog = [];
  export let isAllGameOvered = false;
  export let handleGameOver = () => {
    // do nothing on default
  };
  export let isGameStarted = false;
  export let gameMode = -1; // -1: 표준
  export let forceChar = 0;
  $: if (gameMode === 0) playerInfo.charType = 0;
     else if (gameMode === 1 || gameMode === 2) playerInfo.charType = forceChar;
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
    if (isGameStarted && value > 0) {
      handleEnhancement();
    }
    if (playerInfo.gameOver) {
      highlight = playerInfo.highlight;
    } else {
      highlight = false;
    }
  });
  function startGame() {
    // 0번의 경우 랜덤 캐릭터이므로
    if (playerInfo.charType === 0) {
      playerInfo.charType = randomRange(1, CharTypes.length - 1);
    }
    if (playerInfo.charType === 2) {
      // 주유
      playerInfo.enhanceDurability = 2;
      playerInfo.enhanceWarranty = 5;
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
    if (playerInfo.charType === 5) {
      // 벤자민
      playerInfo.weaponEnhance = 11;
      playerInfo.enhanceDurability = 3;
      playerInfo.enhanceWarranty = 0;
      stepSuccessProb = 1;
    }
    GameLog.push(`${playerInfo.name}의 캐릭터는 ${CharTypes[playerInfo.charType].name}입니다.`);
  }
  function endGame() {
    // ToDO
  }
  function handleEnhancement() {
    if (playerInfo.gameOver) {
      return;
    }

    if (
      playerInfo.weaponEnhance < playerInfo.enhanceWarranty || // 강화 보장 구간이거나
      randomRange(1, 100) <= stepSuccessProb * 100
    ) {
      if (playerInfo.weaponEnhance < playerInfo.enhanceWarranty) {
        GameLog.push(`${playerInfo.name}, 강화 보장 구간이기 때문에 강화에 성공 하였습니다! 강화도 +1!`);
      } else {
        GameLog.push(`${playerInfo.name}, ${Math.round(stepSuccessProb * 100)}%의 확률을 뚫고 강화에 성공 하였습니다! 강화도 +1!`);
      }
      // 태성 전용: 50% 확률로 대성공
      if (playerInfo.charType === 3 && randomRange(1, 100) <= 50) {
        recentState = EnhanceState.BigSuccess;
        playerInfo.weaponEnhance += 2; // 강화 수치 추가 Up
        GameLog.push(`   - 예리한 태성은 예리한 기운을 받아 성공을 대성공으로 만들었습니다! 강화도 +1 추가!`);
      } else if (playerInfo.charType === 5) {
        // 벤자민 전용: 성공시 강화도 감소
        recentState = EnhanceState.Success;
        playerInfo.weaponEnhance--; // 강화 수치 Down
        if (playerInfo.weaponEnhance < 0) playerInfo.weaponEnhance = 0; // 음수 방지..
        GameLog.push(`   - 일 줄 알았지만, 벤자민의 강화는 거꾸로 갑니다! 강화도는 증가하지 않고 감소됩니다! 강화도 -1!`);
      } else {
        // 확률로 성공~!
        recentState = EnhanceState.Success;
        playerInfo.weaponEnhance++; // 강화 수치 Up
      }
      GameLog.push(`   - 무기 강화도: +${playerInfo.weaponEnhance}`);
    } else {
      // 실패~!
      playerInfo.enhanceDurability -= 1; // 내구도 깎자~~
      GameLog.push(`${playerInfo.name}, ${Math.round(stepSuccessProb * 100)}%의 확률을 뚫지 못하여 강화에 실패 하였습니다..`);
      if (randomRange(1, 100) <= 50 && playerInfo.weaponEnhance > 0) {
        recentState = EnhanceState.BigFailed;
        GameLog.push(`   - 손이 미끄러져서 강화에 대실패 하였습니다! 강화도 -1!`);
        if (playerInfo.charType === 5) {
          // 벤자민 전용: 대실패시 강화도 증가
          playerInfo.weaponEnhance += 1; // 강화 수치 Up
          GameLog.push(`   - 일 줄 알았지만, 벤자민의 강화는 거꾸로 갑니다! 강화도는 감소되지 않고 증가합니다! 강화도 +1!`);
        } else {
          playerInfo.weaponEnhance -= 1; // 50% 확률로 강화도 깎자~
          if (playerInfo.weaponEnhance < 0) playerInfo.weaponEnhance = 0; // 음수 방지.. (강보 때문에 이럴 일은 없긴 함)
        }
        if (playerInfo.enhanceDurability !== 0) // 어차피 마지막이면 강화도 보여주니 이외의 경우에만 출력
          GameLog.push(`   - 무기 강화도: +${playerInfo.weaponEnhance}`);
      } else {
        recentState = EnhanceState.Failed;
      }
      if (playerInfo.enhanceDurability === 0) {
        // 강화 내구도 다 되었고 실패.. gameover...
        playerInfo.gameOver = true;
        GameLog.push(`   - 내구도가 모두 소모되어 Game Over!`);
        GameLog.push(`   - 최종 달성 무기 강화도: +${playerInfo.weaponEnhance}`);
      } else {
        GameLog.push(`   - 남은 무기 내구도: ${playerInfo.enhanceDurability}`);
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
    if (playerInfo.charType === 4) stepSuccessProb *= 0.8;
    else if (playerInfo.charType === 5) { // 벤자민은 확률이 반대개념
      stepSuccessProb = 1 - (11 - playerInfo.weaponEnhance) * 0.1;
      if (stepSuccessProb > 1) stepSuccessProb = 1;
      if (stepSuccessProb < 0.1) stepSuccessProb = 0.1;
    }
  }
  $: ((gameOver) => {
    if (gameOver) {
      handleGameOver();
    }
  })(playerInfo.gameOver);
  $: $GameSummary[playerInfo.id] = playerInfo.weaponEnhance;
  let me;
</script>

<style>
  div.playerContainer {
    display: inline-block;
    border: 1px solid black;
    border-radius: 5px;
    margin: 2px;
    width: 140px;
    text-align: center;
  }
  div.playerContainer[highlight="true"] {
    border: 3px solid red;
    opacity: 1 !important;
  }
  div.playerContainer[isAllGameOvered="true"] {
    opacity: 0.5;
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
  div.btn {
    width: 100%;
  }
  div.btn small {
    line-height: 2.5;
    font-size: small;
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
  highlight={highlight}
  {recentState}
  isAllGameOvered={isAllGameOvered && isGameStarted}
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
  {#if !isGameStarted}
    {#if gameMode == 2}
      <img
        src={'./c0.png'}
        width="100"
        height="100"
        alt="" />
      <br />
      동일랜덤
    {:else}
      <img
        src={'./c' + playerInfo.charType + '.png'}
        width="100"
        height="100"
        alt="" />
      <br />
      {#if gameMode == -1}
      <label>
        <select class="form-control" bind:value={playerInfo.charType}>
          {#each CharTypes as charType}
            <option value={charType.id}>{charType.name}</option>
          {/each}
        </select>
      </label>
      {:else}
        {CharTypes[playerInfo.charType].name}
      {/if}
    {/if}
  {/if}

  {#if isGameStarted}
    <WeaponImage step={playerInfo.weaponEnhance} />
    {#if isGameStarted && playerInfo.gameOver}
    <!-- 게임 오버 메시지 --><br />
    {/if}

    {#if isGameStarted && !playerInfo.gameOver}
      <Durability durability={playerInfo.enhanceDurability} />
      <br />
      {#if $GameAutoProcess === 0}
        <div class="btn btn-lg btn-warning" on:click={handleEnhancement}>
          {#if playerInfo.enhanceWarranty > playerInfo.weaponEnhance || stepSuccessProb == 1}
            <small><b>강화!</b> 보장 구간</small>
          {:else}
            <small><b>강화!</b> 확률: {Math.round(stepSuccessProb * 100)}%</small>
          {/if}
        </div>
      {/if}
    {/if}
  {/if}
</div>
