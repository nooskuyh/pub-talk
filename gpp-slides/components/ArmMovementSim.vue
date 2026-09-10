<script setup>
import { ref, computed, onUnmounted } from 'vue'

// State
const elbowAngle = ref(90) // 40 (deep flexion) to 165 (full extension)
const isPlaying = ref(false)
const movementDirection = ref('flexion') // 'flexion' | 'extension'
let animId = null
let animPhase = Math.PI / 2

function setPreset(angle) {
  if (isPlaying.value) togglePlay()
  elbowAngle.value = angle
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    animId = setInterval(() => {
      // oscillate between 45 and 160 deg
      animPhase += 0.045
      const wave = (Math.sin(animPhase) + 1) / 2
      const prevAngle = elbowAngle.value
      elbowAngle.value = Math.round(45 + wave * 115)
      movementDirection.value = elbowAngle.value < prevAngle ? 'flexion' : 'extension'
    }, 32)
  } else {
    if (animId) clearInterval(animId)
  }
}

onUnmounted(() => {
  if (animId) clearInterval(animId)
})

// Kinematics calculations
// Forearm angle from vertical downward (0 rad = straight down = 180 deg)
const rad = computed(() => ((180 - elbowAngle.value) * Math.PI) / 180)

// Fixed Arm Anchors
const shoulder = { x: 155, y: 55 }
const elbow = { x: 155, y: 185 }
const humerusLen = 130
const forearmLen = 130

// Moving Forearm Coordinates
const wrist = computed(() => ({
  x: elbow.x + forearmLen * Math.sin(rad.value),
  y: elbow.y + forearmLen * Math.cos(rad.value),
}))

const hand = computed(() => ({
  x: elbow.x + (forearmLen + 24) * Math.sin(rad.value),
  y: elbow.y + (forearmLen + 24) * Math.cos(rad.value),
}))

// Biceps Attachments
// Origin: Anterior shoulder / coracoid
const bicepsOrigin = { x: 164, y: 68 }
// Insertion: Radial tuberosity (approx 32px from elbow along forearm)
const bicepsInsertion = computed(() => ({
  x: elbow.x + 32 * Math.sin(rad.value) + 6 * Math.cos(rad.value),
  y: elbow.y + 32 * Math.cos(rad.value) - 6 * Math.sin(rad.value),
}))

// Biceps belly midpoint and thickness (bulges when flexed, thins when extended)
const bicepsMid = computed(() => {
  const mx = (bicepsOrigin.x + bicepsInsertion.value.x) / 2
  const my = (bicepsOrigin.y + bicepsInsertion.value.y) / 2
  // outward anterior bulge offset
  const bulgeOffset = Math.max(8, 30 - (elbowAngle.value - 40) * 0.16)
  return {
    x: mx + bulgeOffset,
    y: my,
    thickness: Math.max(10, 26 - (elbowAngle.value - 40) * 0.13),
  }
})

// Triceps Attachments
// Origin: Posterior humerus / infraglenoid
const tricepsOrigin = { x: 140, y: 75 }
// Insertion: Olecranon process (behind elbow)
const tricepsInsertion = computed(() => ({
  x: elbow.x - 12 - 4 * Math.sin(rad.value),
  y: elbow.y + 6 - 4 * Math.cos(rad.value),
}))

const tricepsMid = computed(() => {
  const mx = (tricepsOrigin.x + tricepsInsertion.value.x) / 2
  const my = (tricepsOrigin.y + tricepsInsertion.value.y) / 2
  // bulges when extended, thins when flexed
  const bulgeOffset = Math.max(6, 6 + (elbowAngle.value - 40) * 0.14)
  return {
    x: mx - bulgeOffset,
    y: my,
    thickness: Math.max(8, 10 + (elbowAngle.value - 40) * 0.12),
  }
})

// Dynamic Muscle States
const isFlexingAction = computed(() => {
  if (isPlaying.value) return movementDirection.value === 'flexion'
  return elbowAngle.value <= 90
})

const bicepsState = computed(() => {
  const shortenPct = Math.round(100 - ((elbowAngle.value - 40) / 125) * 45) // 55% to 100%
  if (isFlexingAction.value) {
    return {
      role: 'Agonist (Prime Mover)',
      roleTag: 'Active Puller',
      action: 'Concentric Contraction',
      desc: 'Shortens actively to generate pulling force on the radius.',
      lengthPct: shortenPct,
      tension: Math.round(40 + (165 - elbowAngle.value) * 0.48),
      isContracted: true,
      color: 'coral',
    }
  } else {
    return {
      role: 'Antagonist (Counter-Muscle)',
      roleTag: 'Yielding',
      action: 'Passive Lengthening',
      desc: 'Elongates under controlled tone to permit smooth elbow extension.',
      lengthPct: shortenPct,
      tension: Math.round(15 + (165 - elbowAngle.value) * 0.18),
      isContracted: false,
      color: 'coral',
    }
  }
})

const tricepsState = computed(() => {
  const shortenPct = Math.round(55 + ((elbowAngle.value - 40) / 125) * 45) // 55% to 100%
  if (!isFlexingAction.value) {
    return {
      role: 'Agonist (Prime Mover)',
      roleTag: 'Active Extensor',
      action: 'Concentric Contraction',
      desc: 'Contracts and pulls olecranon process to straighten the joint.',
      lengthPct: shortenPct,
      tension: Math.round(35 + (elbowAngle.value - 40) * 0.48),
      isContracted: true,
      color: 'teal',
    }
  } else {
    return {
      role: 'Antagonist (Counter-Muscle)',
      roleTag: 'Yielding',
      action: 'Passive / Eccentric Lengthening',
      desc: 'Stretches across the posterior joint to yield to bicep pull.',
      lengthPct: shortenPct,
      tension: Math.round(15 + (elbowAngle.value - 40) * 0.18),
      isContracted: false,
      color: 'teal',
    }
  }
})
</script>

<template>
  <div class="arm-sim-wrapper">
    <!-- Visual Display Panel -->
    <div class="sim-viewport">
      <!-- Top controls -->
      <div class="viewport-header">
        <div class="action-badge" :class="isFlexingAction ? 'badge-coral' : 'badge-teal'">
          <span :class="isFlexingAction ? 'i-carbon:arrow-up-right' : 'i-carbon:arrow-down-right'" />
          <span>{{ isFlexingAction ? 'Flexion Phase: Biceps Pulling' : 'Extension Phase: Triceps Straightening' }}</span>
        </div>

        <button :class="['play-btn', isPlaying ? 'playing' : '']" @click="togglePlay">
          <span :class="isPlaying ? 'i-carbon:pause' : 'i-carbon:play'" />
          {{ isPlaying ? 'Pause Motion' : 'Auto Motion' }}
        </button>
      </div>

      <!-- SVG Kinematics Canvas -->
      <div class="svg-container">
        <svg viewBox="0 0 350 310" class="arm-svg">
          <defs>
            <linearGradient id="bicepsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--coral)" stop-opacity="0.9" />
              <stop offset="50%" stop-color="oklch(0.68 0.18 35)" stop-opacity="1" />
              <stop offset="100%" stop-color="var(--coral)" stop-opacity="0.85" />
            </linearGradient>

            <linearGradient id="tricepsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--teal)" stop-opacity="0.9" />
              <stop offset="50%" stop-color="oklch(0.60 0.14 185)" stop-opacity="1" />
              <stop offset="100%" stop-color="var(--teal)" stop-opacity="0.85" />
            </linearGradient>

            <marker id="arrow-pull-biceps" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--coral)" />
            </marker>

            <marker id="arrow-pull-triceps" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--teal)" />
            </marker>
          </defs>

          <!-- Shoulder Girdle Base / Scapula Anchor -->
          <ellipse cx="155" cy="50" rx="34" ry="16" fill="var(--muted)" stroke="var(--heading)" stroke-width="1.6" />
          <text x="155" y="32" class="svg-label-bold" text-anchor="middle">Shoulder / Scapula</text>

          <!-- Humerus (Upper Arm Bone) -->
          <line
            :x1="shoulder.x"
            :y1="shoulder.y"
            :x2="elbow.x"
            :y2="elbow.y"
            stroke="#d4d4d8"
            stroke-width="16"
            stroke-linecap="round"
          />
          <line
            :x1="shoulder.x"
            :y1="shoulder.y"
            :x2="elbow.x"
            :y2="elbow.y"
            stroke="#71717a"
            stroke-width="2"
            stroke-dasharray="3 3"
          />
          <text x="110" y="130" class="svg-label-sub" text-anchor="end">Humerus</text>

          <!-- TRICEPS MUSCLE (Posterior) -->
          <!-- Muscle Belly Path -->
          <path
            :d="`M ${tricepsOrigin.x} ${tricepsOrigin.y} Q ${tricepsMid.x} ${tricepsMid.y} ${tricepsInsertion.x} ${tricepsInsertion.y}`"
            fill="none"
            stroke="url(#tricepsGrad)"
            :stroke-width="tricepsMid.thickness"
            stroke-linecap="round"
          />
          <!-- Tendon anchors -->
          <circle :cx="tricepsOrigin.x" :cy="tricepsOrigin.y" r="4.5" fill="#ffffff" stroke="var(--teal)" stroke-width="2" />
          <circle :cx="tricepsInsertion.x" :cy="tricepsInsertion.y" r="4.5" fill="#ffffff" stroke="var(--teal)" stroke-width="2" />
          <text :x="tricepsMid.x - 14" :y="tricepsMid.y" class="muscle-tag teal-tag" text-anchor="end">
            Triceps ({{ tricepsState.isContracted ? 'Contracting' : 'Yielding' }})
          </text>

          <!-- Triceps pull vector arrow (when extending) -->
          <line
            v-if="!isFlexingAction"
            :x1="tricepsInsertion.x"
            :y1="tricepsInsertion.y"
            :x2="tricepsInsertion.x - 2"
            :y2="tricepsInsertion.y - 28"
            stroke="var(--teal)"
            stroke-width="2.5"
            marker-end="url(#arrow-pull-triceps)"
          />

          <!-- BICEPS MUSCLE (Anterior) -->
          <!-- Muscle Belly Path -->
          <path
            :d="`M ${bicepsOrigin.x} ${bicepsOrigin.y} Q ${bicepsMid.x} ${bicepsMid.y} ${bicepsInsertion.x} ${bicepsInsertion.y}`"
            fill="none"
            stroke="url(#bicepsGrad)"
            :stroke-width="bicepsMid.thickness"
            stroke-linecap="round"
          />
          <!-- Muscle striations / center highlight -->
          <path
            :d="`M ${bicepsOrigin.x} ${bicepsOrigin.y} Q ${bicepsMid.x} ${bicepsMid.y} ${bicepsInsertion.x} ${bicepsInsertion.y}`"
            fill="none"
            stroke="#ffffff"
            stroke-opacity="0.35"
            :stroke-width="Math.max(2, bicepsMid.thickness * 0.28)"
            stroke-linecap="round"
          />
          <!-- Tendon anchors -->
          <circle :cx="bicepsOrigin.x" :cy="bicepsOrigin.y" r="4.5" fill="#ffffff" stroke="var(--coral)" stroke-width="2" />
          <circle :cx="bicepsInsertion.x" :cy="bicepsInsertion.y" r="4.5" fill="#ffffff" stroke="var(--coral)" stroke-width="2" />
          <text :x="bicepsMid.x + 14" :y="bicepsMid.y" class="muscle-tag coral-tag" text-anchor="start">
            Biceps ({{ bicepsState.isContracted ? 'Contracting' : 'Yielding' }})
          </text>

          <!-- Biceps pull vector arrow (when flexing) -->
          <line
            v-if="isFlexingAction"
            :x1="bicepsInsertion.x"
            :y1="bicepsInsertion.y"
            :x2="bicepsInsertion.x - (bicepsInsertion.x - bicepsOrigin.x) * 0.35"
            :y2="bicepsInsertion.y - (bicepsInsertion.y - bicepsOrigin.y) * 0.35"
            stroke="var(--coral)"
            stroke-width="2.5"
            marker-end="url(#arrow-pull-biceps)"
          />

          <!-- Elbow Joint Pivot -->
          <circle :cx="elbow.x" :cy="elbow.y" r="10" fill="var(--card)" stroke="var(--heading)" stroke-width="2.2" />
          <circle :cx="elbow.x" :cy="elbow.y" r="4" fill="var(--heading)" />

          <!-- Forearm Bone (Radius / Ulna) -->
          <line
            :x1="elbow.x"
            :y1="elbow.y"
            :x2="wrist.x"
            :y2="wrist.y"
            stroke="#d4d4d8"
            stroke-width="14"
            stroke-linecap="round"
          />
          <line
            :x1="elbow.x"
            :y1="elbow.y"
            :x2="wrist.x"
            :y2="wrist.y"
            stroke="#52525b"
            stroke-width="2"
          />

          <!-- Hand / Wrist -->
          <circle :cx="wrist.x" :cy="wrist.y" r="8" fill="var(--muted)" stroke="var(--heading)" stroke-width="1.8" />
          <line
            :x1="wrist.x"
            :y1="wrist.y"
            :x2="hand.x"
            :y2="hand.y"
            stroke="var(--muted-foreground)"
            stroke-width="7"
            stroke-linecap="round"
          />

          <!-- Joint Angle Arc -->
          <path
            :d="`M ${elbow.x} ${elbow.y + 28} A 28 28 0 0 0 ${elbow.x + 28 * Math.sin(rad)} ${elbow.y + 28 * Math.cos(rad)}`"
            fill="none"
            stroke="var(--accent)"
            stroke-width="2"
            stroke-dasharray="2 2"
          />
          <text :x="elbow.x + 36" :y="elbow.y + 36" class="angle-badge">
            {{ elbowAngle }}°
          </text>
        </svg>
      </div>
    </div>

    <!-- Controls & Diagnostics Panel -->
    <div class="sim-sidebar">
      <!-- Angle slider & presets -->
      <div class="panel-section">
        <div class="section-title-row">
          <span class="section-label">Elbow Joint Angle</span>
          <span class="angle-value">{{ elbowAngle }}°</span>
        </div>
        <input
          v-model.number="elbowAngle"
          type="range"
          min="40"
          max="165"
          class="range-slider"
        >
        <div class="preset-row">
          <button :class="['preset-btn', elbowAngle === 45 ? 'active' : '']" @click="setPreset(45)">
            Flexed (45°)
          </button>
          <button :class="['preset-btn', elbowAngle === 90 ? 'active' : '']" @click="setPreset(90)">
            Mid (90°)
          </button>
          <button :class="['preset-btn', elbowAngle === 165 ? 'active' : '']" @click="setPreset(165)">
            Extended (165°)
          </button>
        </div>
      </div>

      <!-- Muscle Pair Cards -->
      <div class="muscle-cards-grid">
        <!-- Biceps Card -->
        <div class="muscle-card card-coral">
          <div class="card-head">
            <span class="m-name coral">Biceps Brachii</span>
            <span class="m-role-pill" :class="bicepsState.isContracted ? 'pill-active' : 'pill-passive'">
              {{ bicepsState.roleTag }}
            </span>
          </div>
          <div class="m-state-row">
            <span class="m-label">Role:</span>
            <span class="m-val"><strong>{{ bicepsState.role }}</strong></span>
          </div>
          <div class="m-state-row">
            <span class="m-label">Fiber Tension:</span>
            <div class="meter-bar">
              <div class="meter-fill coral-fill" :style="{ width: bicepsState.tension + '%' }" />
            </div>
            <span class="meter-num">{{ bicepsState.tension }}%</span>
          </div>
          <p class="m-desc">{{ bicepsState.desc }}</p>
        </div>

        <!-- Triceps Card -->
        <div class="muscle-card card-teal">
          <div class="card-head">
            <span class="m-name teal">Triceps Brachii</span>
            <span class="m-role-pill" :class="tricepsState.isContracted ? 'pill-active' : 'pill-passive'">
              {{ tricepsState.roleTag }}
            </span>
          </div>
          <div class="m-state-row">
            <span class="m-label">Role:</span>
            <span class="m-val"><strong>{{ tricepsState.role }}</strong></span>
          </div>
          <div class="m-state-row">
            <span class="m-label">Fiber Tension:</span>
            <div class="meter-bar">
              <div class="meter-fill teal-fill" :style="{ width: tricepsState.tension + '%' }" />
            </div>
            <span class="meter-num">{{ tricepsState.tension }}%</span>
          </div>
          <p class="m-desc">{{ tricepsState.desc }}</p>
        </div>
      </div>

      <!-- Foundational Rule Box -->
      <div class="sim-rule-box">
        <span class="rule-icon i-carbon:information" />
        <p class="rule-text">
          <strong>The Tug-of-War Law:</strong> Muscles can only pull, never push. Smooth movement requires reciprocal coordination—one muscle shortens while its counter-muscle elongates.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.arm-sim-wrapper {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 14px;
  height: 385px;
}

.sim-viewport {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
  box-shadow: var(--shadow-soft);
  padding: 10px 14px;
  overflow: hidden;
}

.viewport-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.action-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
  letter-spacing: 0.02em;
}

.badge-coral {
  background: oklch(0.62 0.15 35 / 0.1);
  color: var(--coral);
  border: 1px solid oklch(0.62 0.15 35 / 0.25);
}

.badge-teal {
  background: oklch(0.54 0.12 185 / 0.1);
  color: var(--teal);
  border: 1px solid oklch(0.54 0.12 185 / 0.25);
}

.play-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 650;
  padding: 4px 10px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--heading);
  cursor: pointer;
  transition: all 0.15s ease;
}

.play-btn:hover {
  background: var(--secondary);
}

.play-btn.playing {
  background: oklch(0.45 0.12 250 / 0.12);
  color: var(--accent);
  border-color: var(--accent);
}

.svg-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.arm-svg {
  width: 100%;
  height: 100%;
  max-height: 310px;
}

.svg-label-bold {
  font-size: 11px;
  font-weight: 750;
  fill: var(--heading);
  letter-spacing: 0.04em;
}

.svg-label-sub {
  font-size: 9.5px;
  font-weight: 600;
  fill: var(--muted-foreground);
}

.muscle-tag {
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.02em;
}

.coral-tag {
  fill: var(--coral);
}

.teal-tag {
  fill: var(--teal);
}

.angle-badge {
  font-size: 11px;
  font-weight: 800;
  fill: var(--accent);
}

/* Sidebar */
.sim-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-section {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  padding: 8px 12px;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.section-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--heading);
}

.angle-value {
  font-size: 0.85rem;
  font-weight: 850;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.range-slider {
  width: 100%;
  height: 5px;
  border-radius: 3px;
  background: var(--secondary);
  outline: none;
  cursor: pointer;
  margin: 4px 0 6px;
}

.preset-row {
  display: flex;
  gap: 6px;
}

.preset-btn {
  flex: 1;
  font-size: 0.62rem;
  font-weight: 650;
  padding: 4px 0;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted-foreground);
  cursor: pointer;
  transition: all 0.15s ease;
}

.preset-btn:hover {
  background: var(--secondary);
  color: var(--heading);
}

.preset-btn.active {
  background: var(--secondary);
  color: var(--heading);
  border-color: var(--heading);
  font-weight: 750;
}

/* Muscle Cards */
.muscle-cards-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.muscle-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  padding: 8px 12px;
}

.muscle-card.card-coral {
  border-color: oklch(0.62 0.15 35 / 0.22);
  background: oklch(0.62 0.15 35 / 0.03);
}

.muscle-card.card-teal {
  border-color: oklch(0.54 0.12 185 / 0.22);
  background: oklch(0.54 0.12 185 / 0.03);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.m-name {
  font-size: 0.74rem;
  font-weight: 800;
}

.m-name.coral {
  color: var(--coral);
}

.m-name.teal {
  color: var(--teal);
}

.m-role-pill {
  font-size: 0.58rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.pill-active {
  background: oklch(0.45 0.12 250 / 0.12);
  color: var(--accent);
}

.pill-passive {
  background: var(--secondary);
  color: var(--muted-foreground);
}

.m-state-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.64rem;
  margin-bottom: 3px;
}

.m-label {
  color: var(--muted-foreground);
  font-weight: 600;
}

.m-val {
  color: var(--heading);
}

.meter-bar {
  flex: 1;
  height: 5px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.1s ease;
}

.coral-fill {
  background: var(--coral);
}

.teal-fill {
  background: var(--teal);
}

.meter-num {
  font-size: 0.62rem;
  font-weight: 750;
  width: 26px;
  text-align: right;
  color: var(--heading);
  font-variant-numeric: tabular-nums;
}

.m-desc {
  font-size: 0.59rem;
  line-height: 1.35;
  color: var(--muted-foreground);
  margin: 3px 0 0;
}

/* Bottom Takeaway */
.sim-rule-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border-radius: 9px;
  background: var(--secondary);
  border: 1px solid var(--border);
  padding: 7px 10px;
}

.rule-icon {
  font-size: 0.85rem;
  color: var(--accent);
  flex-shrink: 0;
  margin-top: 1px;
}

.rule-text {
  font-size: 0.59rem;
  line-height: 1.35;
  color: var(--muted-foreground);
  margin: 0;
}

.rule-text strong {
  color: var(--heading);
}
</style>
