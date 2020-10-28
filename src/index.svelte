<script>
  import { tick } from 'svelte';
  import PlayerCard from './PlayerCard.svelte';
  import {GameState, GameLifeCycle, GameAutoProcess, CharTypes} from './store';
  let isGameStarted = false;
  let isAllGameOvered = false;
  let playerNum = 4;
  let winnerRank = 4;
  let uid = 0;
  let players = [
    {
      uid: -1,
      id: 1,
      name: '',
      charType: 0,
      enhanceDurability: 3,
      enhanceWarranty: 3,
      enhanceNum: 0,
      weaponEnhance: 0,
      highlight: false,
      gameOver: false
    },
    {
      uid: -1,
      id: 2,
      name: '',
      charType: 0,
      enhanceDurability: 3,
      enhanceWarranty: 3,
      enhanceNum: 0,
      weaponEnhance: 0,
      highlight: false,
      gameOver: false
    }
  ];
  $: ((playerNum) => {
    players = [];
    for (let i = 0; i < playerNum; i++) {
      players.push({
        uid: uid,
        id: i + 1,
        name: '플레이어 #' + (i + 1),
        charType: 0,
        enhanceDurability: 3,
        enhanceWarranty: 3,
        enhanceNum: 0,
        weaponEnhance: 0,
        highlight: false,
        gameOver: false
      });
      uid++;
    }
  })(playerNum)
  $: winnerRank = playerNum;

  let resultText = '';
  function handleGameOver() {
    let isAllGameOver = true;
    for (const player of players) {
      if (player.gameOver === false) {
        isAllGameOver = false;
      }
    }
    if (isAllGameOver) {
      isAllGameOvered = true;
      let rank = 1;
      let winnerPlayer;
      resultText = '';
      for (const player of players.sort(comparePlayers)) {
        if (rank === winnerRank) {
          winnerPlayer = player.name;
        }
        resultText += `<hr><b>${rank}등: ${player.name} 님</b><br>`;
        resultText += `무기강화 결과: ${player.weaponEnhance}강 / `;
        resultText += `총 강화 시도 횟수: ${player.enhanceNum}회`;
        rank ++;
      }
      resultText += `<br><hr><h4>${winnerPlayer} 님, ${winnerRank}등 축하드립니다.</h4>`;
      resultText += '기분 좋은 마음으로 커피를 쏘면 어떨까요?<br>';
    }
  }
  function comparePlayers(a, b) {
    if (a.weaponEnhance > b.weaponEnhance) {
      return -1;
    }
    if (a.weaponEnhance < b.weaponEnhance) {
      return 1;
    }
    if (a.enhanceNum > b.enhanceNum) {
      return 1;
    }
    if (a.enhanceNum < b.enhanceNum) {
      return -1;
    }
    return 0;
  }
  function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
</script>

<style>
  :global(body) {
    
    height: 100vh;
    padding: 15px;
  }
  div.cardArea {
    text-align: center;
  }
  
</style>

<h1>운빨망겜</h1> 
<p>
당신의 운을 시험해서 승자가 되세요.<br>
무기를 강화해 내기에서 승리하세요!
</p>

{#if !isGameStarted}
<label>
  게임 인원 수:
	<input type=number bind:value={playerNum} min=1 max=10>
	<input type=range bind:value={playerNum} min=1 max=10>
</label>
<br>
<label>
  내기 등수:
	<input type=number bind:value={winnerRank} min=1 max={playerNum}>
	<input type=range bind:value={winnerRank} min=1 max={playerNum}>
</label>
{/if}

<div class="cardArea">
  {#each players as player (player.uid)}
  <PlayerCard playerInfo={player} isGameStarted={isGameStarted} handleGameOver={handleGameOver} />
  {/each}
</div>

{#if !isGameStarted}
<div class="btn btn-md btn-primary" on:click={() => {
  isGameStarted = true;
  $GameState = GameLifeCycle.Started;
}}>
게임 시작!
</div>
{/if}
{#if isGameStarted && !isAllGameOvered && !$GameAutoProcess} 
<div class="btn btn-lg btn-info" on:click={() => {
  (async () => {
    while (!isAllGameOvered) {
      $GameAutoProcess += 1;
      await tick();
      await timeout(400);
    }
  })();
}}>
<h1>
게임 자동 진행
</h1>
</div>
{/if}

{#if isAllGameOvered}
{@html resultText}
<div class="btn btn-md btn-danger" on:click={() => {
  isAllGameOvered = false;
  isGameStarted = false;
  $GameState = GameLifeCycle.NotStarted;
  $GameAutoProcess = 0;
  // To reset
  players = [];
  playerNum = 4;
}}>
게임 재시작
</div>
{/if}
<br><br>
{#if !isGameStarted}
<h3>튜토리얼</h3>
<ol>
  <li>게임이 사직되면, 각 플레이어는 각 플레이어의 특성에 맞는 스탯을 부여 받습니다.</li>
  <li>무기 강화를 시도하게 되면, 강화도가 1 상승하거나, 유지되거나, 하락할 수 있습니다.</li>
  <li>각 플레이어는 무기의 내구도가 모두 소모될 때까지 강화를 계속 시도 해야 합니다.</li>
  <li>모든 플레이어의 강화가 끝나면, 처음에 설정한 순위의 사람이 당첨 되게 됩니다.</li>
  <li>순위는 무기 강화도가 높은 사람이 높으며, 동점인 경우 시도 횟수가 적은 사람이 높습니다.</li>
  <li>게임이 시작되면 자동 진행을 할 수 있으며, 자동진행을 하게 되면 모든 플레이어의 강화가 끝날 때까지 게임이 지속 됩니다.</li>
</ol>

<h4>캐릭터 특성 설명</h4>
<ul>
  {#each CharTypes as CharType}
  <li>{CharType.name}: {CharType.desc}</li>
  {/each}
</ul>
{/if}