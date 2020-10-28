<script>
  import { tick } from 'svelte';
import Durability from './Durability.svelte';
  import PlayerCard from './PlayerCard.svelte';
  import {GameState, GameLifeCycle, GameAutoProcess, CharTypes} from './store';
  let isGameStarted = false;
  let isAllGameOvered = false;
  let isRematch = false;
  let playerNum = 4;
  let winnerPlayers = [];
  let winnerRank = 9999;
  let uid = 0;
  let players = [
    {
      uid: -1,
      id: 1,
      name: '',
      charType: 0,
      enhanceDurability: 3,
      enhanceWarranty: 3,
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
      weaponEnhance: 0,
      highlight: false,
      gameOver: false
    }
  ];
  $: updatePlayerNum(playerNum);

  function updatePlayerNum(playerNum) {
    players = [];
    for (let i = 0; i < playerNum; i++) {
      players.push({
        uid: uid,
        id: i + 1,
        name: '플레이어 #' + (i + 1),
        charType: 0,
        enhanceDurability: 3,
        enhanceWarranty: 3,
        weaponEnhance: 0,
        highlight: false,
        gameOver: false
      });
      uid++;
    }
  }

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
      let rank = 0;
      let currentCheckingEnhance = 99999;
      let bestEnhance = -1;
      let worstEnhance = -1;
      winnerPlayers = [];
      let winnerPlayerNames = [];
      resultText = '';
      const sortedPlayers = [...players].sort(comparePlayers);
      bestEnhance = sortedPlayers[0].weaponEnhance;
      worstEnhance = sortedPlayers[sortedPlayers.length - 1].weaponEnhance;

      for (const player of sortedPlayers) {
        if (currentCheckingEnhance > player.weaponEnhance) { // 무기 강화 단계가 줄어들면, rank를 올린다. (시작 Rank: 1)
          rank ++;
          currentCheckingEnhance = player.weaponEnhance;
        }
        
        if (winnerRank === 1) {
          if (player.weaponEnhance === bestEnhance) {
            winnerPlayers.push(player);
            winnerPlayerNames.push(player.name);
          }
        } else if (winnerRank === 9999) {
          if (player.weaponEnhance === worstEnhance) {
            winnerPlayers.push(player);
            winnerPlayerNames.push(player.name);
          }
        }
        // resultText += `<b>${rank}등: ${player.name} 님</b> / `;
        // resultText += `무기강화 결과: ${player.weaponEnhance}강<br>`;
      }
      if (winnerPlayers.length === 1) {
        resultText += `<hr><h4>${winnerPlayers[0].name} 님, ${winnerRank === 1 ? '1': '꼴'}등 축하드립니다.</h4>`;
        resultText += '기분 좋은 마음으로 커피를 쏘면 어떨까요?<br>';
      } else {
        resultText += `<hr><h4>${winnerRank === 1 ? '1': '꼴'}등에 대한 동점자가 나왔군요!</h4><br><b>대상자: ` + winnerPlayerNames.join(' 님, ') + ' 님.</b><br>';
        resultText += '동점자끼리 재경기를 원하시면 아래 버튼을 눌러주세요.<br>';
        isRematch = true;
      }
    }
  }
  function comparePlayers(a, b) {
    if (a.weaponEnhance > b.weaponEnhance) {
      return -1;
    }
    if (a.weaponEnhance < b.weaponEnhance) {
      return 1;
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
  div.resultArea {
    text-align: center;
  }
</style>

{#if !isGameStarted}
<h1>운빨망겜</h1> 
<p>
당신의 운을 시험해서 승자가 되세요.<br>
무기를 강화해 내기에서 승리하세요!
</p>

<label>
  게임 인원 수:
	<input type=number bind:value={playerNum} min=1 max=20>
	<input type=range bind:value={playerNum} min=1 max=20 style="width:300px">
</label>
<br>

내기 등수:
<label>
  <input type=radio bind:group={winnerRank} value={1}>
  1등
</label>
<label>
    <input type=radio bind:group={winnerRank} value={9999}>
    꼴등
</label>
{/if}

<div class="cardArea">
  {#each players as player (player.uid)}
  <PlayerCard playerInfo={player} isGameStarted={isGameStarted} handleGameOver={handleGameOver} />
  {/each}
</div>

<div class="resultArea">
{#if !isGameStarted}
<div class="btn btn-md btn-primary" on:click={() => {
  isGameStarted = true;
  $GameState = GameLifeCycle.Started;
}}>
<h2>
게임 시작!
</h2>
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
<h2>
게임 자동 진행
</h2>
</div>
{/if}

{#if isAllGameOvered}
{@html resultText}
{#if isRematch}
<div class="btn btn-md btn-primary" on:click={() => {
  (async () => {
    isAllGameOvered = false;
    isGameStarted = true;
    isRematch = false;
    $GameState = GameLifeCycle.NotStarted;
    $GameAutoProcess = 0;
    // To rematch: Add enhanceDurability!
    winnerPlayers = winnerPlayers.map(player => {
      player.enhanceDurability += 1;
      player.gameOver = false;
      return player;
    });
    players = winnerPlayers;
    await tick();

    // while (!isAllGameOvered) {
    //  $GameAutoProcess += 1;
    //  await tick();
    //  await timeout(400);
    // }
  })();
}}>
<h2>동점자 리매치</h2>
동점자들끼리 내구도 1로 현재 상태에서 강화를 추가로 시도합니다.
</div>
{:else}
<div class="btn btn-md btn-danger" on:click={() => {
  isAllGameOvered = false;
  isGameStarted = false;
  isRematch = false;
  $GameState = GameLifeCycle.NotStarted;
  $GameAutoProcess = 0;
  // To reset
  updatePlayerNum(playerNum);
}}>
게임 재시작
</div>
{/if}
{/if}
</div>
<br><br>
{#if !isGameStarted}
<h3>튜토리얼</h3>
<ol>
  <li>게임이 사직되면, 각 플레이어는 각 플레이어의 특성에 맞는 스탯을 부여 받습니다.</li>
  <li>무기 강화를 시도하게 되면, 강화도가 1 상승하거나(성공), 유지되거나(실패), 하락할 수 있습니다(대실패).</li>
  <li>각 플레이어는 무기의 내구도가 모두 소모될 때까지 강화를 계속 시도 해야 합니다.</li>
  <li>모든 플레이어의 강화가 끝나면(=모든 플레이어의 무기 내구도가 모두 소모되면), 게임 시작시 설정한 순위의 사람이 당첨됩니다.</li>
  <li>순위는 무기 강화도가 높은 사람이 높습니다. 만약 동점자가 있다면 동점자끼리 간이 재경기가 시작됩니다.</li>
  <li>재경기 시에는 재경기에 돌입하는 사람들이 내구도를 1 추가로 부텨 받아 경기가 시작됩니다.</li>
  <li>게임이 시작되면 자동진행을 할 수 있으며, 모든 플레이어의 강화가 끝날 때까지 자동진행이 지속 됩니다.</li>
</ol>

<h4>캐릭터 특성 설명</h4>
<ul>
  {#each CharTypes as CharType}
  <li>{CharType.name}: {CharType.desc}</li>
  {/each}
</ul>

<b>Ver 2020/10/29</b><br>
<b>Made by</b> Readiz<br>
Special Thanks to HG
{/if}
