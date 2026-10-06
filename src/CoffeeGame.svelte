<script>
  import { onMount } from "svelte";
  import {
    COLORS,
    MAX_PLAYERS,
    ROUND_MS,
    SUCCESS_RATES,
    createMatch,
    advanceMatch,
    placeCards,
  } from "./coffee-game.js";

  let arena;
  let width = 360;
  let height = 440;
  let participants = [];
  let phase = "lobby";
  let countdown = 3;
  let match = null;
  let countdownTimer;
  let roundTimer;
  let notice = "";
  let demo = false;
  let rulesOpen = false;
  let rulesButton;
  let rulesClose;
  let resultButton;

  $: busy = phase === "playing" || phase === "tiebreak";
  $: players = match
    ? match.players
    : participants.map((p) => ({
        ...p,
        level: 0,
        status: "active",
        event: "참여 완료",
      }));
  $: positioned = placeCards(players, width, height);
  $: selected = match?.players.find((p) => p.id === match.selectedId);
  $: if (phase === "result" && resultButton)
    resultButton.focus({ preventScroll: true });
  $: if (rulesOpen && rulesClose) rulesClose.focus({ preventScroll: true });

  function stopTimers() {
    clearTimeout(countdownTimer);
    clearTimeout(roundTimer);
  }

  function reset(message = "") {
    stopTimers();
    participants = [];
    match = null;
    phase = "lobby";
    countdown = 3;
    notice = message;
    demo = false;
  }

  function beginCountdown() {
    clearTimeout(countdownTimer);
    countdown = 3;
    phase = participants.length >= 2 ? "countdown" : "lobby";
    if (phase !== "countdown") return;
    function count() {
      if (phase !== "countdown") return;
      countdown -= 1;
      if (countdown === 0) {
        match = createMatch(participants);
        phase = "playing";
        notice = "";
        scheduleRound();
      } else countdownTimer = setTimeout(count, 1000);
    }
    countdownTimer = setTimeout(count, 1000);
  }

  function scheduleRound() {
    clearTimeout(roundTimer);
    roundTimer = setTimeout(() => {
      if (!match || match.phase === "done") return;
      match = advanceMatch(match);
      phase = match.phase === "done" ? "result" : match.phase;
      if (phase !== "result") scheduleRound();
      else if (!demo && navigator.vibrate) navigator.vibrate([40, 60, 80]);
    }, ROUND_MS);
  }

  function addParticipant(x, y, pointerId = null) {
    if (participants.length >= MAX_PLAYERS) {
      notice = "최대 10명까지 함께할 수 있어요.";
      return;
    }
    const used = new Set(participants.map((p) => p.colorIndex));
    const colorIndex = COLORS.findIndex((_, i) => !used.has(i));
    participants = [
      ...participants,
      { id: colorIndex + 1, pointerId, colorIndex, x, y },
    ];
    notice = "";
    beginCountdown();
  }

  function point(event) {
    const bounds = arena.getBoundingClientRect();
    return {
      x: Math.max(26, Math.min(width - 26, event.clientX - bounds.left)),
      y: Math.max(26, Math.min(height - 26, event.clientY - bounds.top)),
    };
  }

  function pointerDown(event) {
    if (
      rulesOpen ||
      busy ||
      phase === "result" ||
      demo ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    event.preventDefault();
    const { x, y } = point(event);
    if (event.pointerType === "mouse") {
      // A mouse cannot hold several pointers. Clicks register persistent spots.
      const nearby = participants.find(
        (p) => Math.hypot(p.x - x, p.y - y) < 42,
      );
      if (nearby) {
        participants = participants.filter((p) => p.id !== nearby.id);
        beginCountdown();
      } else addParticipant(x, y);
      return;
    }
    if (participants.some((p) => p.pointerId === event.pointerId)) return;
    arena.setPointerCapture(event.pointerId);
    addParticipant(x, y, event.pointerId);
  }

  function pointerMove(event) {
    if (!participants.some((p) => p.pointerId === event.pointerId)) return;
    const position = point(event);
    participants = participants.map((p) =>
      p.pointerId === event.pointerId ? { ...p, ...position } : p,
    );
    if (match)
      match = {
        ...match,
        players: match.players.map((p) =>
          p.pointerId === event.pointerId ? { ...p, ...position } : p,
        ),
      };
  }

  function pointerEnd(event) {
    if (!participants.some((p) => p.pointerId === event.pointerId)) return;
    if (phase !== "lobby" && phase !== "countdown") {
      participants = participants.map((p) =>
        p.pointerId === event.pointerId ? { ...p, pointerId: null } : p,
      );
      if (match)
        match = {
          ...match,
          players: match.players.map((p) =>
            p.pointerId === event.pointerId ? { ...p, pointerId: null } : p,
          ),
        };
      return;
    }
    participants = participants.filter((p) => p.pointerId !== event.pointerId);
    beginCountdown();
  }

  function keyboardJoin(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (busy || phase === "result" || demo || rulesOpen || event.repeat) return;
    const index = participants.length;
    addParticipant(
      width * (index % 2 ? 0.73 : 0.27),
      height * (0.25 + Math.floor(index / 2) * 0.14),
    );
  }

  function startDemo() {
    reset();
    demo = true;
    [
      [0.26, 0.38],
      [0.74, 0.42],
      [0.5, 0.76],
    ].forEach(([x, y]) => addParticipant(width * x, height * y));
  }

  function closeRules() {
    rulesOpen = false;
    rulesButton?.focus();
  }

  function rulesKeys(event) {
    if (event.key === "Escape") closeRules();
    if (event.key === "Tab") {
      event.preventDefault();
      rulesClose?.focus();
    }
  }

  onMount(() => {
    const visibility = () => {
      if (document.hidden) {
        stopTimers();
        if (!match)
          reset("화면을 벗어나 참여 대기를 취소했어요. 다시 올려주세요.");
      } else if (match && match.phase !== "done") scheduleRound();
    };
    const blur = () => {
      if (phase === "lobby" || phase === "countdown")
        reset("손가락을 다시 올려주세요.");
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", blur);
    return () => {
      stopTimers();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", blur);
    };
  });
</script>

<div class="app-shell">
  <header class="app-header">
    <a class="wordmark" href="./" aria-label="운빨망겜 처음으로"
      ><span class="brand-symbol">✳</span> 운빨망겜<span class="edition"
        >COFFEE EDITION</span
      ></a
    >
    <button
      class="icon-button"
      aria-label="게임 방법"
      bind:this={rulesButton}
      disabled={participants.length > 0}
      onclick={() => (rulesOpen = true)}>?</button
    >
  </header>

  <main>
    <section class="game-heading" aria-live="polite" aria-atomic="true">
      <p class="eyebrow">
        <span></span>
        {demo ? "연습 게임 · 실제 내기 아니에요" : "점심 끝, 운빨 시작"}
      </p>
      {#if phase === "result"}
        <h1>
          {demo ? "이렇게 커피 주인공 결정!" : "오늘 커피는 내가 쏜다!"}
          <span>☕</span>
        </h1>
        <p>
          {match.lottery
            ? "재강화도 동점! 남은 사람 중 무작위로 한 명을 골랐어요."
            : "깨진 검의 주인공이 오늘의 바리스타."}
        </p>
      {:else if phase === "tiebreak"}
        <h1>같이 깨졌다! <span>한 번 더.</span></h1>
        <p>동시에 깨진 사람들끼리 자동으로 재강화해요.</p>
      {:else if phase === "playing"}
        <h1>제발, 내 검만은…</h1>
        <p>이제 손을 떼도 돼요. 가장 먼저 깨지면 커피 당첨!</p>
      {:else if phase === "countdown"}
        <h1>다 모였나요? <span>{countdown}초!</span></h1>
        <p>시작할 때까지 손가락을 그대로 올려두세요.</p>
      {:else}
        <h1>오늘 커피, <span>누가 살래?</span></h1>
        <p>손가락만 올려요. 검은 알아서 강화할게요.</p>
      {/if}
    </section>

    <div class="arena-wrap">
      <div class="arena-topline" aria-hidden="true">
        <span class:live={participants.length > 0}
          ><i></i>{phase === "result"
            ? "결과 발표"
            : busy
              ? "자동 강화 중"
              : `${participants.length}명 참여 중`}</span
        >
        <span
          >{phase === "tiebreak"
            ? `재강화 ${match.tieRound + 1}`
            : busy
              ? `ROUND ${String(match.round + 1).padStart(2, "0")}`
              : "가장 먼저 깨지면 ☕"}</span
        >
      </div>

      <div
        class="arena"
        class:has-players={participants.length > 0}
        class:is-result={phase === "result"}
        bind:this={arena}
        bind:clientWidth={width}
        bind:clientHeight={height}
        role="button"
        aria-label={`커피내기 참여 공간. ${participants.length}명 참여 중. 손가락을 올리거나 클릭하세요. 키보드는 Enter로 참여합니다.`}
        tabindex="0"
        onpointerdown={pointerDown}
        onpointermove={pointerMove}
        onpointerup={pointerEnd}
        onpointercancel={pointerEnd}
        onlostpointercapture={pointerEnd}
        onkeydown={keyboardJoin}
        oncontextmenu={(e) => e.preventDefault()}
      >
        {#if participants.length === 0}
          <div class="empty-state" aria-hidden="true">
            <div class="touch-illustration">
              <span class="orbit orbit-one"></span><span class="orbit orbit-two"
              ></span>
              <span class="mini-sword">✦</span>
              <svg viewBox="0 0 56 64" fill="none"
                ><path
                  d="M22 34V12a5 5 0 0 1 10 0v19-5a4.5 4.5 0 0 1 9 0v5-1a4.5 4.5 0 0 1 9 0v13c0 12-7 18-18 18-8 0-12-5-17-12L7 38c-3-5 3-10 7-6l8 8"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <span class="touch-dot dot-one"></span><span
                class="touch-dot dot-two"
              ></span>
            </div>
            <strong>여기에 손가락을 올려요</strong>
            <p>
              친구도 하나, 나도 하나.<br />2명 이상 모이면 자동으로 시작해요.
            </p>
            <span class="touch-hint">꾹 누르기 · 마우스는 한 명씩 클릭</span>
          </div>
        {:else if participants.length === 1}
          <div class="waiting-note" aria-hidden="true">
            좋아요! 한 명만 더 <span>↗</span>
          </div>
        {/if}

        {#if phase === "countdown"}<div
            class="countdown-number"
            aria-hidden="true"
          >
            {countdown}
          </div>{/if}

        <svg class="connectors" {width} {height} aria-hidden="true">
          {#each positioned as player (player.id)}
            <line
              x1={player.x}
              y1={player.y}
              x2={player.card.x + player.card.w / 2}
              y2={player.card.y + player.card.h / 2}
              stroke={COLORS[player.colorIndex].hex}
              opacity={player.status === "safe" ? 0.1 : 0.25}
              stroke-dasharray="3 5"
            />
          {/each}
        </svg>

        {#each positioned as player (player.id)}
          <div
            class="finger"
            class:chosen={player.status === "selected"}
            class:safe={player.status === "safe"}
            style={`--player-color:${COLORS[player.colorIndex].hex};left:${player.x}px;top:${player.y}px`}
            data-player-id={player.id}
            data-status={player.status}
            aria-hidden="true"
          >
            <span
              >{player.status === "selected"
                ? "☕"
                : player.status === "safe"
                  ? "✓"
                  : player.id}</span
            >
          </div>
          <div
            class="sword-popup"
            class:safe={player.status === "safe"}
            class:chosen={player.status === "selected"}
            style={`--player-color:${COLORS[player.colorIndex].hex};left:${player.card.x}px;top:${player.card.y}px;width:${player.card.w}px`}
            data-card-id={player.id}
          >
            <div class="popup-label">
              <span
                >{String(player.id).padStart(2, "0")}
                {COLORS[player.colorIndex].name}</span
              ><i></i>
            </div>
            {#key `${match?.round ?? 0}-${match?.tieRound ?? 0}`}
              <div class="weapon-row" class:enhancing={busy}>
                <img
                  src={`./${Math.min(player.level, 11)}.png`}
                  alt=""
                  class:cracked={player.status === "selected"}
                /><strong>+{player.level}</strong>
              </div>
            {/key}
            <span class="popup-event">{player.event}</span>
          </div>
        {/each}
      </div>

      <div class="arena-bottomline" aria-live="polite">
        {#if notice}<span>{notice}</span>
        {:else if phase === "result"}<span
            >{selected.id}번 {COLORS[selected.colorIndex].name} 당첨 · 총 {participants.length}명
            참여</span
          >
        {:else if phase === "tiebreak"}<span
            >동점자 {players.filter((p) => p.status === "active").length}명 ·
            재강화도 같은 확률로</span
          >
        {:else if busy}<span
            >다음 강화 성공률 <b
              >{Math.round((SUCCESS_RATES[match.round] ?? 0) * 100)}%</b
            > <span class="separator">/</span> 모두 같은 조건</span
          >
        {:else}<span
            >설정 없이 바로 <span class="separator">/</span> 2–10명
            <span class="separator">/</span> 약 10초</span
          >{/if}
      </div>
    </div>

    <footer class="game-footer">
      {#if phase === "result"}
        <div
          class="result-strip"
          style={`--player-color:${COLORS[selected.colorIndex].hex}`}
        >
          <span class="result-dot">{selected.id}</span>
          <div>
            <strong
              >{COLORS[selected.colorIndex].name}, {demo
                ? "커피 당첨 예시!"
                : "커피 부탁해요!"}</strong
            ><span
              >{demo
                ? "연습 끝! 친구들과 해볼까요?"
                : "덕분에 오후도 힘내볼게요 ☕"}</span
            >
          </div>
          <button
            class="primary-button"
            bind:this={resultButton}
            onclick={() => {
              reset();
              arena.focus();
            }}>한 판 더 <span>↗</span></button
          >
        </div>
      {:else if participants.length > 0}
        <div class="active-footer">
          <p>
            {demo
              ? "연습 중이에요. 실제 내기에는 사용하지 마세요."
              : busy
                ? "운명은 정해지는 중. 잠깐만 기다려요."
                : "다 같이 올리고, 시작할 때까지 꾹."}
          </p>
          <button class="text-button" onclick={() => reset()}
            >다시 모으기 ↺</button
          >
        </div>
      {:else}
        <div class="idle-footer">
          <span>실력 말고, 오늘의 운으로.</span><button
            class="demo-button"
            onclick={startDemo}>혼자 미리 해보기 <span>↗</span></button
          >
        </div>
      {/if}
    </footer>
  </main>
  <div class="page-footer">
    <span>MADE BY READIZ <span class="version">v2.0</span></span><a
      href="./classic.html">기존 강화 게임 ↗</a
    >
  </div>
</div>

{#if rulesOpen}
  <div class="modal-backdrop" role="presentation">
    <div
      class="rules-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
      tabindex="-1"
      onkeydown={rulesKeys}
    >
      <p class="eyebrow">HOW TO PLAY</p>
      <h2 id="rules-title">손가락 하나면 준비 끝.</h2>
      <ol>
        <li>친구들과 이 화면에 손가락을 올려요.</li>
        <li>2명 이상 모인 뒤 3초가 지나면 자동 시작!</li>
        <li>검이 가장 먼저 깨진 한 명이 커피를 사요.</li>
      </ol>
      <p>
        모두 같은 검, 같은 확률로 강화해요. 동시에 깨지면 해당 사람들끼리 최대
        3번 재강화하고, 그래도 같으면 남은 사람 중 무작위로 한 명을 골라요.
      </p>
      <p>
        시작 전 손을 떼면 참여가 취소돼요. 시작 후에는 손을 떼도 결과가
        유지돼요. 화면에서 인식한 손가락 수만큼 참여할 수 있어요.
      </p>
      <p>
        PC에서는 위치를 클릭해 한 명씩 추가하고, 같은 위치를 다시 클릭하면
        취소돼요. 키보드는 참여 공간에서 Enter를 누르세요.
      </p>
      <button class="primary-button" bind:this={rulesClose} onclick={closeRules}
        >좋아요, 해볼게요 ↗</button
      >
    </div>
  </div>
{/if}
