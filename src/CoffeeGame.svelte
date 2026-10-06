<script>
  import { onMount } from "svelte";
  import Fighter from "./Fighter.svelte";
  import AttackEffect from "./AttackEffect.svelte";
  import { attackRig } from "./attack-presentation.js";
  import {
    COLORS,
    HEROES,
    chooseHero,
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
  let beatStarted = 0,
    beatProgress = 0,
    attackAim = null;
  let raf,
    lastFrame = 0,
    orbitTime = 0;

  $: playing = phase === "march" || phase === "fight";
  $: alive = battle?.players.filter((p) => p.health > 0) ?? [];
  $: winner = battle?.players.find((p) => p.id === battle.winnerId);
  $: duel = phase === "fight" && alive.length === 2;
  $: rendered = [...actors].sort((a, b) => a.y - b.y);
  $: striker = actors.find((p) => p.id === attack?.attackerId);
  $: victim = actors.find((p) => p.id === attack?.targetId);
  $: aim =
    attackAim && beat !== "windup"
      ? { x: attackAim.x * width, y: attackAim.y * height }
      : victim;
  $: rig = striker && aim ? attackRig(striker, aim, width, beat) : null;
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
    x: clamp(p.x, 73, areaWidth - 73),
    y: clamp(p.y, 73, areaHeight - 73),
  });
  // The sprite's head points up at zero degrees. Its center sits under the touch.
  const heading = (
    from,
    areaWidth = width,
    areaHeight = height,
    fallback = 0,
  ) =>
    Math.hypot(areaWidth / 2 - from.x, areaHeight / 2 - from.y) < 1
      ? fallback
      : (Math.atan2(areaWidth / 2 - from.x, from.y - areaHeight / 2) * 180) /
        Math.PI;
  function fingerMarker(participant, areaWidth, areaHeight, elapsed) {
    const anchor = anchorPoint(participant, areaWidth, areaHeight);
    const orbit =
      ((elapsed / 6000 + participant.colorIndex / 10) % 1) * Math.PI * 2;
    const numbers = [0, 1, 2].map((index) => {
      const angle = orbit + (index * Math.PI * 2) / 3;
      const x = Math.sin(angle) * 56;
      const y = -Math.cos(angle) * 56;
      return {
        x,
        y,
        angle: heading(
          { x: anchor.x + x, y: anchor.y + y },
          areaWidth,
          areaHeight,
        ),
      };
    });
    return {
      ...participant,
      ...anchor,
      numbers,
    };
  }
  function connection(actor, participant, areaWidth, areaHeight) {
    const anchor = anchorPoint(participant, areaWidth, areaHeight);
    const dx = actor.x - anchor.x,
      dy = actor.y - anchor.y;
    const distance = Math.hypot(dx, dy);
    const ux = dx / (distance || 1),
      uy = dy / (distance || 1);
    return {
      ...actor,
      visible: distance > 66,
      x1: anchor.x + ux * 44,
      y1: anchor.y + uy * 44,
      x2: actor.x - ux * 22,
      y2: actor.y - uy * 22,
    };
  }
  $: markers = participants.map((p) =>
    fingerMarker(p, width, height, orbitTime),
  );
  $: connections = battle
    ? actors.map((actor) =>
        connection(
          actor,
          participants.find((p) => p.id === actor.id),
          width,
          height,
        ),
      )
    : [];
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
    if (pattern !== 0 && (reducedMotion || paused || document.hidden)) return;
    try {
      if (typeof window.ReadizHaptics?.postMessage === "function") {
        window.ReadizHaptics.postMessage(JSON.stringify(pattern));
      } else if (typeof navigator.vibrate === "function")
        navigator.vibrate(pattern);
    } catch {
      // Optional device feedback must never interrupt a round.
    }
  }

  function reset() {
    stopTimer();
    vibrate(0);
    orbitTime = 0;
    participants = [];
    actors = [];
    battle = null;
    attack = null;
    attackAim = null;
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
        vibrate([25, 35, 25]);
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
        vibrate(18);
        schedule(count, 1000);
      }
    }
    schedule(count, 1000);
  }

  function startAttack() {
    attack = planAttack(battle);
    timing = attackTiming(battle);
    attackAim = null;
    setBeat("windup");
    schedule(() => {
      const target = actors.find((p) => p.id === attack.targetId);
      attackAim = { x: target.x / width, y: target.y / height };
      setBeat("dash");
      schedule(() => {
        battle = resolveAttack(battle, attack);
        setBeat("impact");
        if (!battle.lastHit.dodged)
          vibrate(
            battle.lastHit.fallen
              ? [45, 30, 65]
              : battle.lastHit.critical
                ? [30, 25, 50]
                : 28,
          );
        schedule(() => {
          setBeat("recover");
          if (battle.phase === "done") {
            schedule(() => {
              phase = "result";
              beat = "idle";
              vibrate([60, 55, 100]);
            }, 650);
          } else schedule(startAttack, timing.recover);
        }, timing.impact);
      }, timing.dash);
    }, timing.windup);
  }

  function setBeat(value) {
    beat = value;
    beatStarted = performance.now();
    beatProgress = 0;
  }

  function addParticipant(x, y, pointerId = null) {
    if (participants.length >= MAX_PLAYERS) return;
    const used = new Set(participants.map((p) => p.colorIndex));
    const colorIndex = COLORS.findIndex((_, i) => !used.has(i));
    participants = [
      ...participants,
      {
        id: colorIndex + 1,
        colorIndex,
        heroId: chooseHero(participants),
        pointerId,
        x,
        y,
      },
    ];
    vibrate(12);
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
    if (!paused && !reducedMotion && participants.length) orbitTime += dt;
    if (!paused && battle) {
      if (phase === "fight" && timing)
        beatProgress = reducedMotion
          ? 1
          : clamp((now - beatStarted) / timing[beat], 0, 1);
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
        let pose = "idle";
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
            angle: heading({ x, y }, width, height, actor.angle),
          };
        }
        if (stats.health === 0) {
          return {
            ...actor,
            health: 0,
            pose: "down",
            angle: heading(actor, width, height, actor.angle),
          };
        }
        if (phase === "result") {
          goal = anchorPoint(participants.find((p) => p.id === actor.id));
          pose =
            Math.hypot(goal.x - actor.x, goal.y - actor.y) > 4 ? "walk" : "win";
        } else if (actor.id === attack?.attackerId && targetHome) {
          if (beat === "windup") {
            pose = "windup";
            goal = { x: goal.x - ux * 7, y: goal.y - uy * 7 };
          } else if (beat === "dash" || beat === "impact") {
            pose = "swing";
            const reach =
              HEROES.find((hero) => hero.id === actor.heroId)?.reach ?? 29;
            goal = {
              x: targetHome.x - ux * reach,
              y: targetHome.y - uy * reach,
            };
          } else if (beat === "recover") {
            pose = "recover";
          }
        } else if (actor.id === attack?.targetId && attackerHome) {
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
          angle: heading({ x, y }, width, height, actor.angle),
        };
      });
    }
    raf = requestAnimationFrame(animate);
  }

  onMount(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotion = preference.matches;
      if (reducedMotion) vibrate(0);
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    raf = requestAnimationFrame(animate);
    let appHidden = false;
    const visibility = () => {
      const hidden = document.hidden || appHidden;
      if (hidden === paused) return;
      paused = hidden;
      if (paused) {
        vibrate(0);
        pauseStarted = performance.now();
        remaining = Math.max(0, deadline - pauseStarted);
        clearTimeout(timer);
        if (!battle) reset();
      } else {
        beatStarted += performance.now() - pauseStarted;
        if (phase === "march")
          motionStarted += performance.now() - pauseStarted;
        lastFrame = performance.now();
        if (pendingAction) arm();
      }
    };
    const blur = () => {
      if (!battle) reset();
    };
    const appVisibility = (event) => {
      appHidden = event.detail?.hidden === true;
      visibility();
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("readiz-app-visibility", appVisibility);
    window.addEventListener("blur", blur);
    return () => {
      stopTimer();
      vibrate(0);
      cancelAnimationFrame(raf);
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("readiz-app-visibility", appVisibility);
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

    {#if battle}
      <svg
        class="connections"
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        {#each connections as link (link.id)}
          <line
            class="connection"
            class:eliminated={link.health === 0}
            class:striking={phase === "fight" &&
              beat === "impact" &&
              (link.id === attack?.attackerId || link.id === attack?.targetId)}
            data-link-id={link.id}
            x1={link.x1}
            y1={link.y1}
            x2={link.x2}
            y2={link.y2}
            stroke={COLORS[link.colorIndex].hex}
            visibility={link.visible ? "visible" : "hidden"}
          />
        {/each}
      </svg>
    {/if}

    {#each markers as participant (participant.id)}
      <div
        class="finger"
        class:away={!!battle}
        class:eliminated={battle?.players.find((p) => p.id === participant.id)
          ?.health === 0}
        class:chosen={phase === "result" && winner.id === participant.id}
        style={`--player-color:${COLORS[participant.colorIndex].hex};left:${participant.x}px;top:${participant.y}px`}
        data-anchor-id={participant.id}
        aria-hidden="true"
      >
        <span class="finger-orbit">
          {#each participant.numbers as number, index}
            <span
              class="orbit-number"
              data-orbit-index={index}
              data-angle={number.angle}
              style={`--number-x:${number.x}px;--number-y:${number.y}px;--number-angle:${number.angle}deg`}
              >{participant.id}</span
            >
          {/each}
        </span>
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
        data-hero={actor.heroId}
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
          heroId={actor.heroId}
          attackStage={phase === "fight" && actor.id === attack?.attackerId
            ? beat
            : "idle"}
          attackProgress={beatProgress}
          armAngle={actor.id === attack?.attackerId ? (rig?.armAngle ?? 0) : 0}
        />
        {#if phase === "fight" && beat === "impact" && battle.lastHit.targetId === actor.id}
          {#key battle.turn}
            {#if battle.lastHit.dodged}<span class="hit-word">회피</span>
            {/if}
          {/key}
        {/if}
      </div>
    {/each}
    {#if phase === "fight" && striker && aim && rig}
      <svg
        class="combat-effects"
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <AttackEffect
          from={rig}
          to={aim}
          heroId={striker.heroId}
          stage={beat}
          progress={beatProgress}
          {reducedMotion}
          critical={(beat === "impact" || beat === "recover") &&
            battle.lastHit?.critical}
          dodged={(beat === "impact" || beat === "recover") &&
            battle.lastHit?.dodged}
        />
      </svg>
    {/if}
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
