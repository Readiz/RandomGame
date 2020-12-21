<script>
  import { tick } from 'svelte';
  import PlayerCard from './PlayerCard.svelte';
  import PlayerCardSimple from './PlayerCardSimple.svelte';
  import {GameState, GameLifeCycle, GameAutoProcess, CharTypes} from './store';
  import { randomRange } from './utils';
  let GameLog = [];
  let isGameStarted = false;
  let isAllGameOvered = false;
  let isRematch = false;
  let playerNum = 4;
  let winnerPlayers = [];
  let winnerRank = 9999; // 9999 : the lowest
  let uid = 0; // Unique IDs for players
  let resultText = '';
  let players = [];
  let gameMode = 2;
  let forceChar = 1;
  $: updatePlayerNum(playerNum);
  $: assignCharAccordingToGameMode(gameMode);

  function assignCharAccordingToGameMode(gameMode) {
    if (gameMode === 2) { // 동일 랜덤
      forceChar = randomRange(1, CharTypes.length - 1);
    }
  }
  function updatePlayerNum(playerNum) {
    players = [];
    for (let i = 0; i < playerNum; i++) {
      players.push({
        uid: uid,
        id: i + 1,
        name: '유저 #' + (i + 1),
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
  function handleGameOver() {
    let isAllGameOver = true;
    for (const player of players) {
      if (player.gameOver === false) {
        isAllGameOver = false;
      }
    }
    if (isAllGameOver && !isAllGameOvered) {
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
      GameLog.push(`------------------------------------------`);
      if (winnerPlayers.length === 1) {
        updateHighlight([winnerPlayers[0]]);
        resultText += `<h4>${winnerPlayers[0].name} 님, ${winnerRank === 1 ? '1': '꼴'}등 축하드립니다.</h4>`;
        resultText += `<b>달성한 강화도: ${winnerPlayers[0].weaponEnhance}</b><br>`;
        resultText += '기분 좋은 마음으로 커피를 쏘면 어떨까요?';
        GameLog.push(`게임 종료! ${winnerPlayers[0].name} 님, ${winnerRank === 1 ? '1': '꼴'}등 축하드립니다.`);
        GameLog.push(`달성한 강화도: ${winnerPlayers[0].weaponEnhance}`);
        GameLog.push(`기분 좋은 마음으로 커피를 쏘면 어떨까요?`);
      } else {
        updateHighlight(winnerPlayers);
        resultText += `<h4>${winnerRank === 1 ? '1': '꼴'}등에 대한 동점자가 나왔군요!</h4><b>대상자: ` + winnerPlayerNames.join(' 님, ') + ' 님.</b><br>';
        resultText += `<b>달성한 강화도: ${winnerPlayers[0].weaponEnhance}</b><br>`;
        resultText += '동점자끼리 재경기를 원하시면 아래 버튼을 눌러주세요.';
        isRematch = true;
        GameLog.push(`게임 종료! ${winnerRank === 1 ? '1': '꼴'}등에 대한 동점자가 나왔습니다. ${winnerPlayerNames.join(' 님, ')}  님.`);
        GameLog.push(`달성한 강화도: ${winnerPlayers[0].weaponEnhance}`);
      }
      GameLog = GameLog;
    }
  }
  function updateHighlight(playerArr) {
    for (const player of players) {
      player.highlight = false;
    }
    for (let player of playerArr) {
      player.highlight = true;
    }
    $GameAutoProcess++; // Update card... forcibly.
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
	<input type=number bind:value={playerNum} min=1 max=30>
	<input type=range bind:value={playerNum} min=1 max=30 style="width:250px">
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
<br>

게임 모드:
<label>
  <input type=radio bind:group={gameMode} value={2}>
  동일랜덤
</label>
<label>
  <input type=radio bind:group={gameMode} value={0}>
  올랜덤
</label>
<label>
  <input type=radio bind:group={gameMode} value={-1}>
  개인선택
</label>
<label>
  <input type=radio bind:group={gameMode} value={1}>
  동캐전
  {#if gameMode == 1}
  <select bind:value={forceChar}>
    {#each CharTypes as charType}
    {#if charType.id != 0}
    <option value={charType.id}>{charType.name}</option>
    {/if}
    {/each}
  </select>
  {/if}
</label>
<br>
<div class="btn btn-md btn-primary" on:click={() => {
  (async () => {
    GameLog = [];
    GameLog.push('게임이 시작되었습니다.');
    await tick();
    isGameStarted = true;
    $GameState = GameLifeCycle.Started;
  })();
}}>
<h5>
게임 시작!
</h5>
</div>
{/if}


<div class="resultArea">
{#if isGameStarted}
<div class="cardArea">
  {#each players as player (player.uid)}
  <PlayerCardSimple playerInfo={player} isGameStarted={isGameStarted} handleGameOver={handleGameOver} gameMode={gameMode} forceChar={forceChar} {isAllGameOvered} GameLog={GameLog} />
  {/each}
</div>
<div style="clear:both;"></div>
{/if}

  {#if isAllGameOvered}
  {@html resultText}
  <br><br>
  {#if isRematch}
  <div class="btn btn-md btn-primary" on:click={() => {
    (async () => {
      isAllGameOvered = false;
      isGameStarted = true;
      isRematch = false;
      // To rematch: Add enhanceDurability!
      winnerPlayers = winnerPlayers.map(player => {
        player.enhanceDurability += 1;
        player.highlight = false;
        player.gameOver = false;
        return player;
      });
      $GameState = GameLifeCycle.NotStarted;
      $GameAutoProcess = 0;
      players = winnerPlayers;
      await tick();
      GameLog = [];
      GameLog.push('동점자 리매치가 시작되었습니다.');
      GameLog = GameLog;
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
    GameLog = [];
    // To reset
    updatePlayerNum(playerNum);
    assignCharAccordingToGameMode(gameMode);
  }}>
  게임 재시작
  </div>
  {/if}
  <hr>
  {/if}
  {#if isGameStarted && !isAllGameOvered && !$GameAutoProcess} 
  <div class="btn btn-lg btn-info" on:click={() => {
    (async () => {
      while (!isAllGameOvered) {
        GameLog.push(`------------ 자동진행 턴 #${$GameAutoProcess + 1} ------------`);
        GameLog = GameLog;
        $GameAutoProcess += 1;
        await tick();
        await timeout(1000);
      }
    })();
  }}>
  자동 진행
  </div>
  <hr>
  {/if}
</div>
<div class="cardArea">
  {#each players as player (player.uid)}
  <PlayerCard playerInfo={player} isGameStarted={isGameStarted} handleGameOver={handleGameOver} gameMode={gameMode} forceChar={forceChar} {isAllGameOvered} GameLog={GameLog} />
  {/each}
</div>
{#if isGameStarted}
<pre>{GameLog.join('\n')}</pre>
{/if}

<br><br>
{#if !isGameStarted}
<h3>튜토리얼</h3>
<ol>
  <li>게임이 사직되면, 각 플레이어는 각 플레이어의 특성에 맞는 스탯을 부여 받습니다.</li>
  <li>무기 강화를 시도하게 되면, 강화도가 1 상승하거나(성공), 유지되거나(실패), 하락할 수 있습니다(대실패).</li>
  <li>각 플레이어는 무기의 내구도가 모두 소모될 때까지 강화를 계속 시도 해야 합니다.</li>
  <li>모든 플레이어의 강화가 끝나면(=모든 플레이어의 무기 내구도가 모두 소모되면), 게임 시작시 설정한 순위의 사람이 당첨됩니다.</li>
  <li>순위는 무기 강화도가 높은 사람이 높습니다. 만약 동점자가 있다면 동점자끼리 간이 재경기가 시작됩니다.</li>
  <li>재경기 시에는 재경기에 돌입하는 사람들이 내구도 1을 추가로 받아 번외 경기가 시작됩니다.</li>
  <li>게임이 시작되면 자동진행이 가능합니다. 자동진행시 모든 플레이어의 강화가 끝날 때까지 강화가 계속 시도 됩니다.</li>
</ol>

<h4>캐릭터 특성 설명</h4>
<ul>
  {#each CharTypes as CharType}
  <li>{CharType.name}: {CharType.desc}</li>
  {/each}
</ul>

<b>Ver.</b> 2020/12/21<br>
<b>Made by</b> Readiz<br>
<b>Special Thanks to</b> HG, Lim
{/if}
