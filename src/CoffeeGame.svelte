<script>
  import { onMount } from "svelte";
  import Fighter from "./Fighter.svelte";
  import {
    COLORS,
    MAX_PLAYERS,
    MAX_HEALTH,
    MARCH_MS,
    createBattle,
    planAttack,
    resolveAttack,
    attackTiming,
    arenaSlots,
  } from "./battle-game.js";

  let arena, resultButton;
  let width = 360,
    height = 700;
  let participants = [],
    actors = [];
  let phase = "lobby",
    beat = "idle",
    countdown = 3;
  let battle = null,
    attack = null,
    timing = null;
  let paused = false,
    reducedMotion = false;
  let timer,
    pendingAction,
    deadline = 0,
    remaining = 0;
  let motionStarted = 0,
    pauseStarted = 0;
  let raf,
    lastFrame = 0;

  $: playing = phase === "march" || phase === "fight";
  $: alive = battle?.players.filter((p) => p.health > 0) ?? [];
  $: winner = battle?.players.find((p) => p.id === battle.winnerId);
  $: duel = phase === "fight" && alive.length === 2;
  $: rendered = [...actors].sort((a, b) => a.y - b.y);
  $: announcement =
    phase === "result"
      ? `${winner.id}번 ${COLORS[winner.colorIndex].name}, 마지막 생존자. 오늘 커피 당첨!`
      : phase === "march"
        ? "중앙으로 모이는 중. 손을 떼도 됩니다."
        : phase === "fight"
          ? `${alive.length}명 생존.${duel ? " 마지막 결투!" : ""}`
          : phase === "countdown"
            ? `${participants.length}명 참여. ${countdown}초 뒤 시작.`
            : participants.length
              ? "한 명 더 손가락을 올려주세요."
              : "손가락을 올려요. 마지막 생존자가 커피를 삽니다.";
  $: if (phase === "result" && resultButton)
    resultButton.focus({ preventScroll: true });

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
  const anchorPoint = (p, areaWidth = width, areaHeight = height) => ({
    x: clamp(p.x, 54, areaWidth - 54),
    y: clamp(p.y, 54, areaHeight - 54),
  });
  // The sprite's head points up at zero degrees. Its center sits under the touch.
  const heading = (from, to = { x: width / 2, y: height * 0.49 }) =>
    Math.hypot(to.x - from.x, to.y - from.y) < 1
      ? 0
      : (Math.atan2(to.x - from.x, from.y - to.y) * 180) / Math.PI;
  const turnToward = (current, target, blend) =>
    current + (((((target - current) % 360) + 540) % 360) - 180) * blend;
  $: if (!battle && width && height) syncLobby();

  function stopTimer() {
    clearTimeout(timer);
    pendingAction = null;
  }
  function arm() {
    deadline = performance.now() + remaining;
    timer = setTimeout(() => {
      const action = pendingAction;
      pendingAction = null;
      action?.();
    }, remaining);
  }
  function schedule(action, ms) {
    clearTimeout(timer);
    pendingAction = action;
    remaining = ms;
    if (!paused) arm();
  }
  function vibrate(pattern) {
    if (!reducedMotion && navigator.vibrate) navigator.vibrate(pattern);
  }

  function reset() {
    stopTimer();
    participants = [];
    actors = [];
    battle = null;
    attack = null;
    phase = "lobby";
    beat = "idle";
    countdown = 3;
  }

  function syncLobby() {
    actors = participants.map((p) => ({
      ...p,
      ...anchorPoint(p),
      health: MAX_HEALTH,
      pose: "idle",
      angle: heading(anchorPoint(p)),
    }));
  }

  function beginCountdown() {
    stopTimer();
    syncLobby();
    countdown = 3;
    phase = participants.length >= 2 ? "countdown" : "lobby";
    if (phase !== "countdown") return;
    function count() {
      countdown -= 1;
      if (countdown === 0) {
        battle = createBattle(participants);
        phase = "march";
        motionStarted = performance.now();
        actors = actors.map((p) => ({ ...p, fromX: p.x, fromY: p.y }));
        schedule(() => {
          const slots = arenaSlots(battle.players, width, height);
          actors = actors.map((p) => ({
            ...p,
            ...slots.find((s) => s.id === p.id),
          }));
          phase = "fight";
          startAttack();
        }, MARCH_MS);
      } else {
        vibrate(10);
        schedule(count, 1000);
      }
    }
    schedule(count, 1000);
  }

  function startAttack() {
    attack = planAttack(battle);
    timing = attackTiming(battle);
    beat = "windup";
    schedule(() => {
      beat = "dash";
      schedule(() => {
        battle = resolveAttack(battle, attack);
        beat = "impact";
        if (!battle.lastHit.dodged)
          vibrate(battle.lastHit.critical ? [18, 25, 35] : 12);
        schedule(() => {
          beat = "recover";
          if (battle.phase === "done") {
            schedule(() => {
              phase = "result";
              beat = "idle";
              vibrate([35, 55, 70]);
            }, 650);
          } else schedule(startAttack, timing.recover);
        }, timing.impact);
      }, timing.dash);
    }, timing.windup);
  }

  function addParticipant(x, y, pointerId = null) {
    if (participants.length >= MAX_PLAYERS) return;
    const used = new Set(participants.map((p) => p.colorIndex));
    const colorIndex = COLORS.findIndex((_, i) => !used.has(i));
    participants = [
      ...participants,
      { id: colorIndex + 1, colorIndex, pointerId, x, y },
    ];
    vibrate(8);
    beginCountdown();
  }
  function point(event) {
    const bounds = arena.getBoundingClientRect();
    return {
      x: clamp(event.clientX - bounds.left, 26, width - 26),
      y: clamp(event.clientY - bounds.top, 26, height - 26),
    };
  }
  function pointerDown(event) {
    if (
      playing ||
      phase === "result" ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    event.preventDefault();
    const { x, y } = point(event);
    if (event.pointerType === "mouse") {
      const nearby = participants.find(
        (p) => Math.hypot(p.x - x, p.y - y) < 38,
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
    if (!battle) syncLobby();
  }
  function pointerEnd(event) {
    if (!participants.some((p) => p.pointerId === event.pointerId)) return;
    if (battle)
      participants = participants.map((p) =>
        p.pointerId === event.pointerId ? { ...p, pointerId: null } : p,
      );
    else {
      participants = participants.filter(
        (p) => p.pointerId !== event.pointerId,
      );
      beginCountdown();
    }
  }
  function keyboardJoin(event) {
    if (event.key === "Escape") {
      reset();
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (playing || phase === "result" || event.repeat) return;
    const index = participants.length;
    addParticipant(
      width * (index % 2 ? 0.77 : 0.23),
      height * (0.2 + Math.floor(index / 2) * 0.15),
    );
  }

  function animate(now) {
    const dt = Math.min(now - lastFrame || 16, 48);
    lastFrame = now;
    if (!paused && battle) {
      const living = battle.players.filter((p) => p.health > 0);
      // Keep a just-defeated target's slot until the current impact finishes.
      const field =
        phase === "fight" &&
        (beat === "impact" || beat === "recover") &&
        battle.lastHit?.fallen
          ? battle.players.filter(
              (p) => p.health > 0 || p.id === battle.lastHit.targetId,
            )
          : living;
      const homes = arenaSlots(field, width, height);
      const targetHome = homes.find((p) => p.id === attack?.targetId);
      const attackerHome = homes.find((p) => p.id === attack?.attackerId);
      const dx = targetHome && attackerHome ? targetHome.x - attackerHome.x : 0;
      const dy = targetHome && attackerHome ? targetHome.y - attackerHome.y : 0;
      const length = Math.hypot(dx, dy) || 1;
      const ux = dx / length,
        uy = dy / length;
      actors = actors.map((actor) => {
        const stats = battle.players.find((p) => p.id === actor.id);
        let goal = homes.find((p) => p.id === actor.id) ?? actor;
        let pose = "idle",
          angle = heading(goal);
        const rotationBlend = reducedMotion ? 1 : 1 - Math.exp(-dt / 110);
        if (phase === "march") {
          const progress = clamp((now - motionStarted) / MARCH_MS, 0, 1);
          const eased = progress * progress * (3 - 2 * progress);
          const x = actor.fromX + (goal.x - actor.fromX) * eased;
          const y = actor.fromY + (goal.y - actor.fromY) * eased;
          return {
            ...actor,
            ...stats,
            x,
            y,
            pose: "walk",
            angle: turnToward(actor.angle, heading({ x, y }), rotationBlend),
          };
        }
        if (stats.health === 0) {
          return { ...actor, health: 0, pose: "down" };
        }
        if (phase === "result") {
          goal = anchorPoint(participants.find((p) => p.id === actor.id));
          angle = heading(goal);
          pose =
            Math.hypot(goal.x - actor.x, goal.y - actor.y) > 4 ? "walk" : "win";
        } else if (actor.id === attack?.attackerId && targetHome) {
          angle = heading(attackerHome, targetHome);
          if (beat === "windup") {
            pose = "windup";
            goal = { x: goal.x - ux * 7, y: goal.y - uy * 7 };
          } else if (beat === "dash" || beat === "impact") {
            pose = "swing";
            goal = { x: targetHome.x - ux * 29, y: targetHome.y - uy * 18 };
          }
        } else if (actor.id === attack?.targetId && attackerHome) {
          angle = heading(targetHome, attackerHome);
          if (beat === "impact") {
            const dodged = battle.lastHit?.dodged;
            goal = {
              x: goal.x + (dodged ? -uy * 22 : ux * 15),
              y: goal.y + (dodged ? ux * 22 : uy * 10),
            };
            pose = dodged ? "walk" : "hurt";
          }
        }
        const blend = reducedMotion
          ? 1
          : 1 - Math.exp(-dt / (beat === "dash" ? 24 : 90));
        const x = actor.x + (goal.x - actor.x) * blend,
          y = actor.y + (goal.y - actor.y) * blend;
        return {
          ...actor,
          health: stats.health,
          x,
          y,
          pose,
          angle: turnToward(actor.angle, angle, rotationBlend),
        };
      });
    }
    raf = requestAnimationFrame(animate);
  }

  onMount(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => (reducedMotion = preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    raf = requestAnimationFrame(animate);
    const visibility = () => {
      paused = document.hidden;
      if (paused) {
        pauseStarted = performance.now();
        remaining = Math.max(0, deadline - pauseStarted);
        clearTimeout(timer);
        if (!battle) reset();
      } else {
        if (phase === "march")
          motionStarted += performance.now() - pauseStarted;
        lastFrame = performance.now();
        if (pendingAction) arm();
      }
    };
    const blur = () => {
      if (!battle) reset();
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", blur);
    return () => {
      stopTimer();
      cancelAnimationFrame(raf);
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", blur);
    };
  });
</script>

<main
  class="game"
  class:duel
  class:paused
  class:finished={phase === "result"}
  data-phase={phase}
  data-beat={beat}
  data-turn={battle?.turn ?? 0}
  style={`--winner-color:${winner ? COLORS[winner.colorIndex].hex : "#101114"}`}
>
  <div
    class="arena"
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
    oncontextmenu={(event) => event.preventDefault()}
  >
    {#if !participants.length}
      <div class="invitation" aria-hidden="true">
        <p>손가락을 올려요</p>
        <span>마지막까지 살아남으면 커피 ☕</span>
      </div>
    {:else if phase === "lobby"}
      <div class="invitation waiting" aria-hidden="true"><p>한 명 더</p></div>
    {:else if phase === "countdown"}
      <div class="countdown" aria-hidden="true">{countdown}</div>
    {/if}
    {#if playing || phase === "result"}<div
        class="battle-ground"
        aria-hidden="true"
      ></div>{/if}
    {#if duel && battle?.phase !== "done"}<div
        class="duel-word"
        aria-hidden="true"
      >
        결투
      </div>{/if}

    {#each participants as participant (participant.id)}
      <div
        class="finger"
        class:away={!!battle}
        class:chosen={phase === "result" && winner.id === participant.id}
        style={`--player-color:${COLORS[participant.colorIndex].hex};--orbit-delay:${-participant.colorIndex * 0.6}s;left:${anchorPoint(participant, width, height).x}px;top:${anchorPoint(participant, width, height).y}px`}
        data-anchor-id={participant.id}
        aria-hidden="true"
      >
        <span class="finger-orbit"
          ><span class="orbit-number">{participant.id}</span></span
        >
      </div>
    {/each}

    {#each rendered as actor (actor.id)}
      <div
        class="fighter"
        class:fallen={actor.health === 0}
        class:winner={phase === "result" && winner.id === actor.id}
        style={`left:${actor.x}px;top:${actor.y}px;--player-color:${COLORS[actor.colorIndex].hex};--facing-angle:${actor.angle}deg`}
        data-player-id={actor.id}
        data-health={actor.health}
        data-pose={actor.pose}
        data-x={actor.x}
        data-y={actor.y}
        data-angle={actor.angle}
        aria-hidden="true"
      >
        {#if phase === "fight" && actor.health > 0}
          <span class="health"
            >{#each Array(MAX_HEALTH) as _, index}<i
                class:empty={index >= actor.health}
              ></i>{/each}</span
          >
        {/if}
        <Fighter
          color={COLORS[actor.colorIndex].hex}
          pose={actor.pose}
          number={actor.id}
        />
        {#if phase === "fight" && beat === "impact" && battle.lastHit.targetId === actor.id}
          {#key battle.turn}
            {#if battle.lastHit.dodged}<span class="hit-word">회피</span>
            {:else}<span class="slash" class:critical={battle.lastHit.critical}
              ></span>{/if}
          {/key}
        {/if}
      </div>
    {/each}
  </div>
  <p class="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
  {#if phase === "result"}
    <div class="result" style={`color:${COLORS[winner.colorIndex].hex}`}>
      <span>{winner.id}번</span> 오늘 커피 당첨
    </div>
    <button
      class="replay"
      bind:this={resultButton}
      onclick={() => {
        reset();
        arena.focus({ preventScroll: true });
      }}>한 판 더</button
    >
  {/if}
</main>
