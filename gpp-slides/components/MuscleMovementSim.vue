<script setup>
import { ref, computed, onUnmounted } from 'vue'

// State
const pecTension = ref(50)
const trapActivation = ref(50)
const viewMode = ref('superior') // 'superior' | 'sagittal'
const isPlaying = ref(false)
let animId = null
let animPhase = 0

function setPreset(type) {
  if (isPlaying.value) togglePlay()
  if (type === 'neutral') {
    pecTension.value = 50
    trapActivation.value = 50
  } else if (type === 'rounded') {
    pecTension.value = 92
    trapActivation.value = 18
  } else if (type === 'retracted') {
    pecTension.value = 18
    trapActivation.value = 90
  }
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    animId = setInterval(() => {
      animPhase += 0.045
      const wave = (Math.sin(animPhase) + 1) / 2
      pecTension.value = Math.round(18 + wave * 74)
      trapActivation.value = Math.round(92 - wave * 74)
    }, 32)
  } else {
    if (animId) clearInterval(animId)
  }
}

onUnmounted(() => {
  if (animId) clearInterval(animId)
})

// Net mechanical vector: positive = protracted/anterior, negative = retracted/posterior
const netVector = computed(() => (pecTension.value - trapActivation.value) / 100)

// Displacement in millimeters (simulated)
const displacementMm = computed(() => Math.round(netVector.value * 22))

// Superior (Top-down Axial) View Coordinates
const sup = computed(() => {
  const d = netVector.value // -1 to +1
  // Glenohumeral / Shoulder Joint
  const shoulderX = 295 + d * 8
  const shoulderY = 142 - d * 34

  // Coracoid process (anterior bony projection)
  const coracoidX = shoulderX - 16
  const coracoidY = shoulderY - 10

  // Acromion
  const acromionX = shoulderX - 6
  const acromionY = shoulderY + 8

  // Medial border of Scapula (slides along ribcage)
  const medialX = 238 + d * 24
  const medialY = 206 - d * 20

  // Spine anchor (T2 vertebra)
  const spineX = 180
  const spineY = 230

  // Sternum anchor (anterior midline)
  const sternumX = 180
  const sternumY = 72

  return {
    shoulderX,
    shoulderY,
    coracoidX,
    coracoidY,
    acromionX,
    acromionY,
    medialX,
    medialY,
    spineX,
    spineY,
    sternumX,
    sternumY,
  }
})

// Sagittal (Side View) Coordinates
const sag = computed(() => {
  const d = netVector.value
  // Shoulder joint center: moves forward and slightly downward in rounded posture
  const shoulderX = 205 + d * 34
  const shoulderY = 155 + d * 12

  // Scapula anterior tipping
  const tiltDeg = Math.round(d * 18)

  // Head/ear forward position
  const earX = 185 + d * 22
  const earY = 82 + d * 4

  return {
    shoulderX,
    shoulderY,
    tiltDeg,
    earX,
    earY,
  }
})

// Clinical status
const status = computed(() => {
  if (netVector.value > 0.28) {
    return {
      type: 'warning',
      title: 'Rounded Shoulder Posture',
      color: 'coral',
      space: 'Compressed',
      desc: 'Dominant pectoralis pulls scapula into protraction and anterior tilt. Subacromial clearance is compromised.',
    }
  } else if (netVector.value < -0.28) {
    return {
      type: 'active',
      title: 'Active Scapular Retraction',
      color: 'teal',
      space: 'Optimal / Open',
      desc: 'Trapezius anchors scapula medially and posteriorly against the ribcage. Anterior chest is lengthened.',
    }
  } else {
    return {
      type: 'balanced',
      title: 'Neutral Balanced Posture',
      color: 'sage',
      space: 'Normal Clearance',
      desc: 'Equalized force couple: pectoralis tension and trapezius tone maintain ideal scapulothoracic alignment.',
    }
  }
})
</script>

<template>
  <div class="sim-wrapper">
    <!-- Visual Display Panel -->
    <div class="sim-viewport">
      <!-- View Mode Tabs & Play Toggle -->
      <div class="sim-topbar">
        <div class="view-tabs">
          <button
            :class="['tab-btn', viewMode === 'superior' ? 'active' : '']"
            @click="viewMode = 'superior'"
          >
            Superior View (Axial)
          </button>
          <button
            :class="['tab-btn', viewMode === 'sagittal' ? 'active' : '']"
            @click="viewMode = 'sagittal'"
          >
            Sagittal View (Side)
          </button>
        </div>

        <button
          :class="['play-btn', isPlaying ? 'playing' : '']"
          @click="togglePlay"
        >
          <span :class="isPlaying ? 'i-carbon:pause' : 'i-carbon:play'" />
          {{ isPlaying ? 'Pause Motion' : 'Play Motion' }}
        </button>
      </div>

      <!-- SVG Rendering -->
      <div class="svg-container">
        <!-- SUPERIOR VIEW -->
        <svg
          v-if="viewMode === 'superior'"
          viewBox="0 0 380 270"
          class="sim-svg"
        >
          <defs>
            <marker
              id="arrow-pec"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--coral)" />
            </marker>
            <marker
              id="arrow-trap"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--teal)" />
            </marker>
          </defs>

          <!-- Thoracic Rib Cage Outline -->
          <ellipse
            cx="180"
            cy="150"
            rx="96"
            ry="75"
            fill="none"
            stroke="var(--border)"
            stroke-width="2"
            stroke-dasharray="4 3"
          />
          <text x="180" y="154" class="svg-label-sub" text-anchor="middle">
            Thoracic Ribcage
          </text>

          <!-- Spine (Posterior Anchor) -->
          <circle cx="180" cy="225" r="9" fill="var(--muted)" stroke="var(--heading)" stroke-width="1.8" />
          <text x="180" y="248" class="svg-label-bold" text-anchor="middle">
            Spine (T2)
          </text>

          <!-- Sternum (Anterior Anchor) -->
          <rect
            x="172"
            y="64"
            width="16"
            height="18"
            rx="3"
            fill="var(--muted)"
            stroke="var(--heading)"
            stroke-width="1.8"
          />
          <text x="180" y="56" class="svg-label-bold" text-anchor="middle">
            Sternum
          </text>

          <!-- Neutral Shoulder Reference (Dashed) -->
          <circle
            cx="295"
            cy="142"
            r="16"
            fill="none"
            stroke="var(--border)"
            stroke-width="1.5"
            stroke-dasharray="3 3"
          />
          <line
            x1="295"
            y1="30"
            x2="295"
            y2="250"
            stroke="var(--border)"
            stroke-width="1"
            stroke-dasharray="2 4"
          />
          <text x="300" y="38" class="svg-label-sub">
            Neutral Axis
          </text>

          <!-- Clavicle (Sternum -> Acromion) -->
          <path
            :d="`M 180 72 Q ${(180 + sup.acromionX) / 2} ${(72 + sup.acromionY) / 2 - 10} ${sup.acromionX} ${sup.acromionY}`"
            fill="none"
            stroke="var(--heading)"
            stroke-width="3.5"
            stroke-linecap="round"
          />

          <!-- Scapula Body (Curved blade from Acromion to Medial Border) -->
          <path
            :d="`M ${sup.acromionX} ${sup.acromionY} L ${sup.medialX} ${sup.medialY} Q ${sup.medialX - 6} ${sup.medialY + 12} ${sup.medialX + 4} ${sup.medialY + 16} Z`"
            fill="oklch(0.92 0.01 250 / 0.7)"
            stroke="var(--accent)"
            stroke-width="2.5"
            stroke-linejoin="round"
          />

          <!-- Coracoid Process -->
          <circle :cx="sup.coracoidX" :cy="sup.coracoidY" r="4.5" fill="var(--coral)" />

          <!-- Glenohumeral Joint (Humerus Head) -->
          <circle
            :cx="sup.shoulderX"
            :cy="sup.shoulderY"
            r="14"
            fill="oklch(1 0 0)"
            stroke="var(--heading)"
            stroke-width="2.2"
          />
          <circle :cx="sup.shoulderX" :cy="sup.shoulderY" r="4" fill="var(--heading)" />

          <!-- PECTORALIS MUSCLE VECTOR (Sternum to Coracoid & Humerus) -->
          <line
            x1="180"
            y1="82"
            :x2="sup.coracoidX"
            :y2="sup.coracoidY"
            stroke="var(--coral)"
            :stroke-width="1.5 + (pecTension / 100) * 4.5"
            :opacity="0.35 + (pecTension / 100) * 0.65"
            stroke-linecap="round"
            marker-end="url(#arrow-pec)"
          />
          <line
            x1="180"
            y1="96"
            :x2="sup.shoulderX - 8"
            :y2="sup.shoulderY - 2"
            stroke="var(--coral)"
            :stroke-width="1 + (pecTension / 100) * 3"
            :opacity="0.25 + (pecTension / 100) * 0.55"
            stroke-linecap="round"
          />

          <!-- TRAPEZIUS MUSCLE VECTOR (Spine to Scapula Medial & Acromion) -->
          <line
            x1="180"
            y1="220"
            :x2="sup.medialX"
            :y2="sup.medialY"
            stroke="var(--teal)"
            :stroke-width="1.5 + (trapActivation / 100) * 4.5"
            :opacity="0.35 + (trapActivation / 100) * 0.65"
            stroke-linecap="round"
            marker-end="url(#arrow-trap)"
          />
          <line
            x1="180"
            y1="205"
            :x2="sup.acromionX"
            :y2="sup.acromionY"
            stroke="var(--teal)"
            :stroke-width="1 + (trapActivation / 100) * 3"
            :opacity="0.25 + (trapActivation / 100) * 0.55"
            stroke-linecap="round"
          />

          <!-- Live Dynamic Labels on SVG -->
          <text
            :x="(180 + sup.coracoidX) / 2"
            :y="(82 + sup.coracoidY) / 2 - 8"
            class="svg-muscle-label coral"
            text-anchor="middle"
          >
            Pectoralis Pull
          </text>
          <text
            :x="(180 + sup.medialX) / 2 + 10"
            :y="(220 + sup.medialY) / 2 + 16"
            class="svg-muscle-label teal"
            text-anchor="middle"
          >
            Trapezius Anchor
          </text>
        </svg>

        <!-- SAGITTAL (SIDE) VIEW -->
        <svg
          v-else
          viewBox="0 0 380 270"
          class="sim-svg"
        >
          <!-- Plumb Line (Ideal Posture Reference) -->
          <line
            x1="205"
            y1="20"
            x2="205"
            y2="250"
            stroke="var(--border)"
            stroke-width="1.5"
            stroke-dasharray="3 3"
          />
          <text x="210" y="32" class="svg-label-sub">
            Plumb Alignment
          </text>

          <!-- Spine Silhouette (Curved depending on posture) -->
          <path
            :d="`M ${sag.earX} ${sag.earY + 25} Q ${175 - netVector * 15} 140 185 240`"
            fill="none"
            stroke="var(--muted-foreground)"
            stroke-width="3"
            stroke-dasharray="2 3"
          />

          <!-- Head & Neck -->
          <circle
            :cx="sag.earX"
            :cy="sag.earY"
            r="20"
            fill="oklch(0.97 0 0)"
            stroke="var(--heading)"
            stroke-width="2"
          />
          <!-- Ear canal indicator -->
          <circle :cx="sag.earX" :cy="sag.earY" r="3" fill="var(--accent)" />
          <text :x="sag.earX + 12" :y="sag.earY - 14" class="svg-label-sub">
            Ear
          </text>

          <!-- Torso outline -->
          <path
            :d="`M ${sag.earX + 10} 105 Q ${230 + netVector * 10} 130 225 240 L 165 240 Q 155 140 ${sag.earX - 10} 105 Z`"
            fill="oklch(0.95 0 0 / 0.3)"
            stroke="var(--border)"
            stroke-width="1.2"
          />

          <!-- Scapula (Lateral side profile with anterior tilt) -->
          <g :transform="`rotate(${sag.tiltDeg}, ${sag.shoulderX - 15}, ${sag.shoulderY})`">
            <path
              :d="`M ${sag.shoulderX - 26} ${sag.shoulderY - 18} L ${sag.shoulderX - 6} ${sag.shoulderY - 6} L ${sag.shoulderX - 22} ${sag.shoulderY + 34} Z`"
              fill="oklch(0.90 0.02 250 / 0.85)"
              stroke="var(--accent)"
              stroke-width="2"
            />
          </g>

          <!-- Glenohumeral Joint -->
          <circle
            :cx="sag.shoulderX"
            :cy="sag.shoulderY"
            r="15"
            fill="#ffffff"
            stroke="var(--heading)"
            stroke-width="2.4"
          />
          <line
            :x1="sag.shoulderX"
            :y1="sag.shoulderY"
            :x2="sag.shoulderX + netVector * 8"
            :y2="sag.shoulderY + 65"
            stroke="var(--heading)"
            stroke-width="4.5"
            stroke-linecap="round"
          />

          <!-- Visualizing the anterior translation arrow -->
          <line
            v1="indicator"
            x1="205"
            :y1="sag.shoulderY"
            :x2="sag.shoulderX"
            :y2="sag.shoulderY"
            :stroke="netVector > 0.2 ? 'var(--coral)' : 'var(--teal)'"
            stroke-width="2"
            stroke-dasharray="2 2"
          />
          <text
            :x="sag.shoulderX"
            :y="sag.shoulderY - 20"
            :class="['svg-muscle-label', netVector > 0.2 ? 'coral' : 'teal']"
            text-anchor="middle"
          >
            {{ displacementMm >= 0 ? `+${displacementMm}mm Forward` : `${displacementMm}mm Retracted` }}
          </text>
        </svg>
      </div>

      <!-- Realtime Readout Footnote -->
      <div class="viewport-footer">
        <span class="foot-pill" :class="status.color">
          {{ status.title }}
        </span>
        <span class="foot-metric">
          Scapular Translation: <strong>{{ displacementMm >= 0 ? `+${displacementMm} mm` : `${displacementMm} mm` }}</strong>
        </span>
        <span class="foot-metric">
          Subacromial Space: <strong>{{ status.space }}</strong>
        </span>
      </div>
    </div>

    <!-- Control & Diagnostic Panel -->
    <div class="sim-sidebar">
      <!-- Presets -->
      <div class="control-group">
        <label class="group-label">Movement Presets</label>
        <div class="preset-grid">
          <button class="btn-preset" @click="setPreset('neutral')">
            Neutral
          </button>
          <button class="btn-preset coral" @click="setPreset('rounded')">
            Rounded
          </button>
          <button class="btn-preset teal" @click="setPreset('retracted')">
            Retracted
          </button>
        </div>
      </div>

      <!-- Sliders -->
      <div class="control-group">
        <div class="slider-header">
          <span class="slider-title coral">
            <span class="i-carbon:direction-bear-right-01" /> Pectoralis Tension
          </span>
          <span class="slider-val">{{ pecTension }}%</span>
        </div>
        <input
          v-model.number="pecTension"
          type="range"
          min="0"
          max="100"
          class="range-slider coral-slider"
        >
        <div class="slider-hint">
          Pulls coracoid process forward & down (protraction / tilt)
        </div>
      </div>

      <div class="control-group">
        <div class="slider-header">
          <span class="slider-title teal">
            <span class="i-carbon:direction-bear-right-02" /> Trapezius Activation
          </span>
          <span class="slider-val">{{ trapActivation }}%</span>
        </div>
        <input
          v-model.number="trapActivation"
          type="range"
          min="0"
          max="100"
          class="range-slider teal-slider"
        >
        <div class="slider-hint">
          Retracts medial scapula toward spine & stabilizes posterior ribcage
        </div>
      </div>

      <!-- Diagnostic Card -->
      <div class="diagnostic-box" :class="status.color">
        <div class="diag-header">
          <span class="diag-indicator" />
          <span class="diag-title">{{ status.title }}</span>
        </div>
        <p class="diag-desc">
          {{ status.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sim-wrapper {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 14px;
  height: 345px;
  margin-top: 4px;
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

.sim-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.view-tabs {
  display: flex;
  gap: 6px;
  background: var(--secondary);
  padding: 3px;
  border-radius: 8px;
}

.tab-btn {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 4px 10px;
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab-btn.active {
  background: #ffffff;
  color: var(--heading);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.play-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 650;
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--card);
  color: var(--heading);
  cursor: pointer;
  transition: all 0.15s ease;
}

.play-btn.playing {
  border-color: var(--coral);
  color: var(--coral);
  background: oklch(0.62 0.15 35 / 0.08);
}

.svg-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.sim-svg {
  width: 100%;
  height: 100%;
  max-height: 215px;
  user-select: none;
}

.svg-label-bold {
  font-size: 11px;
  font-weight: 700;
  fill: var(--heading);
}

.svg-label-sub {
  font-size: 9.5px;
  font-weight: 500;
  fill: var(--muted-foreground);
}

.svg-muscle-label {
  font-size: 10.5px;
  font-weight: 700;
}

.svg-muscle-label.coral {
  fill: var(--coral);
}

.svg-muscle-label.teal {
  fill: var(--teal);
}

.viewport-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  border-top: 1px solid var(--border);
  font-size: 0.63rem;
}

.foot-pill {
  padding: 2px 7px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.60rem;
}

.foot-pill.coral {
  background: oklch(0.62 0.15 35 / 0.12);
  color: var(--coral);
}

.foot-pill.teal {
  background: oklch(0.54 0.12 185 / 0.12);
  color: var(--teal);
}

.foot-pill.sage {
  background: oklch(0.55 0.08 145 / 0.12);
  color: var(--sage);
}

.foot-metric {
  color: var(--muted-foreground);
}

.foot-metric strong {
  color: var(--heading);
}

/* Sidebar Controls */
.sim-sidebar {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.control-group {
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--card);
  padding: 6px 10px;
  box-shadow: var(--shadow-soft);
}

.group-label {
  display: block;
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-foreground);
  margin-bottom: 7px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.btn-preset {
  font-size: 0.70rem;
  font-weight: 650;
  padding: 5px 0;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--card);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-preset:hover {
  background: var(--secondary);
}

.btn-preset.coral:hover {
  border-color: var(--coral);
  color: var(--coral);
}

.btn-preset.teal:hover {
  border-color: var(--teal);
  color: var(--teal);
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.slider-title {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.slider-title.coral {
  color: var(--coral);
}

.slider-title.teal {
  color: var(--teal);
}

.slider-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--heading);
}

.range-slider {
  width: 100%;
  height: 5px;
  outline: none;
  border-radius: 3px;
  appearance: none;
  background: var(--secondary);
  cursor: pointer;
}

.range-slider.coral-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--coral);
  cursor: pointer;
}

.range-slider.teal-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--teal);
  cursor: pointer;
}

.slider-hint {
  font-size: 0.58rem;
  line-height: 1.25;
  color: var(--muted-foreground);
  margin-top: 5px;
}

/* Diagnostic Box */
.diagnostic-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.diagnostic-box.coral {
  background: oklch(0.62 0.15 35 / 0.06);
  border-color: oklch(0.62 0.15 35 / 0.3);
}

.diagnostic-box.teal {
  background: oklch(0.54 0.12 185 / 0.06);
  border-color: oklch(0.54 0.12 185 / 0.3);
}

.diagnostic-box.sage {
  background: oklch(0.55 0.08 145 / 0.06);
  border-color: oklch(0.55 0.08 145 / 0.3);
}

.diag-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.diag-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.diagnostic-box.coral .diag-indicator {
  background: var(--coral);
}

.diagnostic-box.teal .diag-indicator {
  background: var(--teal);
}

.diagnostic-box.sage .diag-indicator {
  background: var(--sage);
}

.diag-title {
  font-size: 0.74rem;
  font-weight: 750;
  color: var(--heading);
}

.diag-desc {
  font-size: 0.62rem;
  line-height: 1.35;
  color: var(--muted-foreground);
  margin: 0;
}
</style>
