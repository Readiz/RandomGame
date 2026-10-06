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
    createBattleTimeline,
    attackFrame,
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
    timeline = null;
  let fightTime = 0,
    resolvedHits = 0,
    clips = [];
  let paused = false,
    reducedMotion = false;
  let timer,
    pendingAction,
    deadline = 0,
    remaining = 0;
  let motionStarted = 0,
    pauseStarted = 0;
  let raf,
    lastFrame = 0,
    orbitTime = 0;

  $: playing = phase === "march" || phase === "fight";
  $: alive = battle?.players.filter((p) => p.health > 0) ?? [];
  $: winner = battle?.players.find((p) => p.id === battle.winnerId);
  $: battleHomes = battle ? arenaSlots(battle.players, width, height) : [];
  $: duel = phase === "fight" && alive.length === 2;
  $: effects = clips.map((clip) => effectView(clip, actors, width, height));
  $: rendered = actors
    .map((actor) => {
      const effect = effects.filter((e) => e.attackerId === actor.id).at(-1);
      return {
        ...actor,
        attackStage: effect?.stage ?? "idle",
        attackProgress: effect?.progress ?? 0,
        armAngle: effect?.rig.armAngle ?? 0,
      };
    })
    .sort((a, b) => a.y - b.y);
  $: beat = clips.at(-1)?.stage ?? "idle";
  $: announcement =
    phase === "result"
      ? `${winner.id}번 ${COLORS[winner.colorIndex].name}, 마지막 생존자. 오늘 커피 당첨!`
      : phase === "march"
        ? "자기 자리 앞에서 난투를 준비합니다. 손을 떼도 됩니다."
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
  $: winnerMarker = markers.find((p) => p.id === winner?.id);
  // Keep the result centered on the same finger marker, even near an edge.
  $: resultSize = winnerMarker
    ? Math.min(
        224,
        width * 0.52,
        height * 0.52,
        2 *
          (Math.min(
            winnerMarker.x,
            width - winnerMarker.x,
            winnerMarker.y,
            height - winnerMarker.y,
          ) -
            8),
      )
    : 0;
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
        navigator.vibrate(
          pattern === "result" ? [180, 70, 200, 70, 200] : pattern,
        );
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
    timeline = null;
    clips = [];
    fightTime = 0;
    resolvedHits = 0;
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
        timeline = createBattleTimeline(
          participants.map((p) => ({
            ...p,
            originX: p.x / width,
            originY: p.y / height,
          })),
        );
        battle = timeline.initial;
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
          fightTime = 0;
          resolvedHits = 0;
        }, MARCH_MS);
      } else {
        vibrate(18);
        schedule(count, 1000);
      }
    }
    schedule(count, 1000);
  }

  function effectView(clip, field, areaWidth, areaHeight) {
    const striker = field.find((p) => p.id === clip.attackerId);
    const target = field.find((p) => p.id === clip.targetId);
    const to = clip.aim
      ? { x: clip.aim.x * areaWidth, y: clip.aim.y * areaHeight }
      : target;
    const rig = attackRig(striker, to, areaWidth, clip.stage);
    const from =
      clip.origin && (clip.stage === "recover" || striker.health === 0)
        ? { x: clip.origin.x * areaWidth, y: clip.origin.y * areaHeight }
        : rig;
    const landed = clip.stage === "impact" || clip.stage === "recover";
    return {
      ...clip,
      from,
      to,
      rig,
      heroId: striker.heroId,
      critical: landed && clip.result.lastHit.critical,
      dodged: landed && clip.result.lastHit.dodged,
    };
  }

  function advanceBrawl(dt) {
    fightTime += dt;
    for (const action of timeline.actions) {
      if (!action.aim && fightTime >= action.start + action.timing.windup) {
        const target = actors.find((p) => p.id === action.targetId);
        action.aim = { x: target.x / width, y: target.y / height };
      }
    }
    while (
      resolvedHits < timeline.actions.length &&
      timeline.actions[resolvedHits].hit <= fightTime
    ) {
      const action = timeline.actions[resolvedHits++];
      const striker = actors.find((p) => p.id === action.attackerId);
      const target = actors.find((p) => p.id === action.targetId);
      if (!action.result.lastHit.dodged)
        action.aim = { x: target.x / width, y: target.y / height };
      const origin = attackRig(
        striker,
        { x: action.aim.x * width, y: action.aim.y * height },
        width,
        "impact",
      );
      action.origin = { x: origin.x / width, y: origin.y / height };
      battle = action.result;
      if (!battle.lastHit.dodged)
        vibrate(
          battle.lastHit.fallen
            ? [45, 30, 65]
            : battle.lastHit.critical
              ? [30, 25, 50]
              : 28,
        );
    }
    clips = timeline.actions
      .filter((a) => a.start <= fightTime && fightTime < a.end)
      .map((a) => ({ ...a, ...attackFrame(a, fightTime, reducedMotion) }));
    if (fightTime >= timeline.end) {
      clips = [];
      phase = "result";
      vibrate("result");
    }
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
    const elapsed = Math.max(0, now - lastFrame || 16);
    const dt = Math.min(elapsed, 48);
    lastFrame = now;
    if (!paused && !reducedMotion && participants.length) orbitTime += dt;
    if (!paused && battle) {
      // Physics stays bounded on slow devices, but combat follows real elapsed time.
      if (phase === "fight") advanceBrawl(elapsed);
      const homes = battleHomes;
      actors = actors.map((actor) => {
        const stats = battle.players.find((p) => p.id === actor.id);
        let goal = homes.find((p) => p.id === actor.id) ?? actor;
        let pose = "idle";
        const action = clips.filter((c) => c.attackerId === actor.id).at(-1);
        const incoming = clips
          .filter((c) => c.targetId === actor.id && c.stage === "impact")
          .at(-1);
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
        } else {
          const home = goal;
          if (!reducedMotion) {
            goal = {
              x:
                home.x +
                Math.sin(fightTime / 230 + actor.id * 1.7) * 16 +
                Math.cos(fightTime / 530 + actor.id) * 10,
              y: home.y + Math.cos(fightTime / 270 + actor.id * 2.1) * 18,
            };
            pose = "walk";
          }
          if (action) {
            const target = action.aim
              ? { x: action.aim.x * width, y: action.aim.y * height }
              : actors.find((p) => p.id === action.targetId);
            const dx = target.x - home.x,
              dy = target.y - home.y;
            const distance = Math.hypot(dx, dy) || 1,
              ux = dx / distance,
              uy = dy / distance;
            if (action.stage === "windup") {
              pose = "windup";
              goal = { x: home.x - ux * 8, y: home.y - uy * 8 };
            } else if (action.stage === "dash" || action.stage === "impact") {
              pose = "swing";
              const reach =
                HEROES.find((h) => h.id === actor.heroId)?.reach ?? 29;
              const travel = Math.max(
                0,
                Math.min(distance - reach, actor.heroId === "giant" ? 150 : 38),
              );
              goal = { x: home.x + ux * travel, y: home.y + uy * travel };
            } else pose = "recover";
          }
          if (incoming) {
            const other = actors.find((p) => p.id === incoming.attackerId);
            const dx = actor.x - other.x,
              dy = actor.y - other.y,
              distance = Math.hypot(dx, dy) || 1;
            const ux = dx / distance,
              uy = dy / distance;
            const dodged = incoming.result.lastHit.dodged;
            goal = {
              x: goal.x + (dodged ? -uy * 24 : ux * 13),
              y: goal.y + (dodged ? ux * 24 : uy * 13),
            };
            if (!action) pose = dodged ? "walk" : "hurt";
          }
          goal = {
            x: clamp(goal.x, 36, width - 36),
            y: clamp(goal.y, 42, height - 42),
          };
        }
        const blend = reducedMotion
          ? 1
          : 1 - Math.exp(-dt / (action?.stage === "dash" ? 30 : 90));
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
  data-active-attacks={clips.length}
  style={`--winner-color:${winner ? COLORS[winner.colorIndex].hex : "#101114"};--result-size:${resultSize}px`}
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
            class:striking={clips.some(
              (c) =>
                c.stage === "impact" &&
                (link.id === c.attackerId || link.id === c.targetId),
            )}
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

    {#if phase === "result"}
      <svg
        class="result-target"
        style={`left:${winnerMarker.x}px;top:${winnerMarker.y}px`}
        viewBox={`0 0 ${resultSize} ${resultSize}`}
        aria-hidden="true"
      >
        <circle
          cx={resultSize / 2}
          cy={resultSize / 2}
          r={resultSize / 2 - 8}
          stroke-width="16"
        />
        <circle
          cx={resultSize / 2}
          cy={resultSize / 2}
          r={resultSize / 2 - 22}
          stroke-width="4"
        />
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
          attackStage={actor.attackStage}
          attackProgress={actor.attackProgress}
          armAngle={actor.armAngle}
        />
        {#each clips.filter((c) => c.targetId === actor.id && c.stage === "impact" && c.result.lastHit.dodged) as dodge (dodge.turn)}
          <span class="hit-word">회피</span>
        {/each}
      </div>
    {/each}
    {#if effects.length}
      <svg
        class="combat-effects"
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        {#each effects as effect (effect.turn)}
          <AttackEffect
            attackerId={effect.attackerId}
            turn={effect.turn}
            from={effect.from}
            to={effect.to}
            heroId={effect.heroId}
            stage={effect.stage}
            progress={effect.progress}
            {reducedMotion}
            critical={effect.critical}
            dodged={effect.dodged}
          />
        {/each}
      </svg>
    {/if}
  </div>
  <p class="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
  {#if phase === "result"}
    <div class="result-controls" class:at-top={winnerMarker.y >= height / 2}>
      <div class="result">
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
    </div>
  {/if}
</main>
