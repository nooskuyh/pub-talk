<script setup>
import { ref, computed } from 'vue'

// State
const bicepsTone = ref(30) // 10% (relaxed) to 95% (hypertonic / shortened)
const activePreset = ref('healthy') // 'healthy' | 'acute' | 'chronic'

function selectPreset(preset) {
  activePreset.value = preset
  if (preset === 'healthy') {
    bicepsTone.value = 25
  } else if (preset === 'acute') {
    bicepsTone.value = 85
  } else if (preset === 'chronic') {
    bicepsTone.value = 92
  }
}

// Reciprocal Inhibition calculation: Triceps motor tone is neurologically inhibited as Biceps tone rises
const tricepsInhibition = computed(() => {
  // higher biceps tone -> higher inhibition of triceps
  return Math.min(95, Math.round(bicepsTone.value * 0.95))
})

const tricepsEffectiveTone = computed(() => {
  return Math.max(8, 100 - tricepsInhibition.value)
})

// Resulting Resting Joint Angle (degrees)
// Balanced arm rests around 145-160 deg. Hypertonic biceps pulls it into flexion (down to 75 deg).
const restingAngle = computed(() => {
  return Math.round(162 - (bicepsTone.value / 100) * 88)
})

// Angle rad
const rad = computed(() => ((180 - restingAngle.value) * Math.PI) / 180)

// Arm coordinates
const elbow = { x: 130, y: 155 }
const shoulder = { x: 130, y: 45 }
const humerusLen = 110
const forearmLen = 110

const wrist = computed(() => ({
  x: elbow.x + forearmLen * Math.sin(rad.value),
  y: elbow.y + forearmLen * Math.cos(rad.value),
}))

const bicepsInsertion = computed(() => ({
  x: elbow.x + 28 * Math.sin(rad.value) + 5 * Math.cos(rad.value),
  y: elbow.y + 28 * Math.cos(rad.value) - 5 * Math.sin(rad.value),
}))

const tricepsInsertion = computed(() => ({
  x: elbow.x - 10 - 3 * Math.sin(rad.value),
  y: elbow.y + 5 - 3 * Math.cos(rad.value),
}))

// Clinical Status
const status = computed(() => {
  if (bicepsTone.value > 70) {
    return {
      severity: 'severe',
      title: 'Chronic Adaptive Shortening (Postural Trap)',
      color: 'coral',
      icon: 'i-carbon:warning-alt',
      jointState: `Resting Contracture (${restingAngle.value}° limit)`,
      neurological: `Continuous Ia firing → Triceps suppressed to ${tricepsEffectiveTone.value}%.`,
      shoulderEquivalent: 'Equivalent to hypertonic Pectoralis Minor locking the shoulder girdle forward while Trapezius/Rhomboids are neurologically silenced.',
    }
  } else if (bicepsTone.value > 45) {
    return {
      severity: 'moderate',
      title: 'Mild Hypertonicity / Functional Restriction',
      color: 'amber',
      icon: 'i-carbon:warning',
      jointState: `Restricted Extension (${restingAngle.value}° resting)`,
      neurological: `Elevated anterior tone creates partial antagonist inhibition (${tricepsInhibition.value}%).`,
      shoulderEquivalent: 'Early stage rounded posture: anterior chest starts tightening, back muscles begin fatiguing under stretch.',
    }
  } else {
    return {
      severity: 'normal',
      title: 'Healthy Reciprocal Balance',
      color: 'sage',
      icon: 'i-carbon:checkmark-outline',
      jointState: `Full Normal Range (${restingAngle.value}° free)`,
      neurological: 'Spinal reflex loop operates symmetrically; no chronic motor suppression.',
      shoulderEquivalent: 'Neutral shoulder girdle: equal resting tension between chest and back keeps scapula flush against ribcage.',
    }
  }
})
</script>

<template>
  <div class="inhibition-sim-wrapper">
    <!-- Visual Neurological & Kinematic Canvas -->
    <div class="sim-viewport">
      <!-- Top Preset Bar -->
      <div class="preset-bar">
        <button
          :class="['preset-tab', activePreset === 'healthy' ? 'active' : '']"
          @click="selectPreset('healthy')"
        >
          1. Healthy Balance
        </button>
        <button
          :class="['preset-tab', activePreset === 'acute' ? 'active' : '']"
          @click="selectPreset('acute')"
        >
          2. Active Contraction
        </button>
        <button
          :class="['preset-tab', activePreset === 'chronic' ? 'active-alert' : '']"
          @click="selectPreset('chronic')"
        >
          3. Chronic Shortening (Trap)
        </button>
      </div>

      <!-- SVG Visualization -->
      <div class="svg-container">
        <svg viewBox="0 0 380 275" class="inhibition-svg">
          <defs>
            <marker id="nerve-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--coral)" />
            </marker>
            <marker id="inhib-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          <!-- SPINAL CORD REFLEX ARC SCHEMATIC (Right half of SVG) -->
          <g class="reflex-arc" transform="translate(190, 20)">
            <!-- Spinal Cord Cross-Section Box -->
            <rect
              x="50"
              y="20"
              width="120"
              height="140"
              rx="14"
              fill="oklch(0.96 0 0)"
              stroke="var(--border)"
              stroke-width="1.8"
            />
            <text x="110" y="38" class="svg-label-bold" text-anchor="middle">Spinal Cord (C5-C7)</text>

            <!-- Grey Matter Butterfly Outline -->
            <path
              d="M 75 60 C 85 80 85 100 75 120 C 100 115 110 90 120 90 C 130 90 140 115 145 120 C 135 100 135 80 145 60 C 135 70 125 70 110 75 C 95 70 85 70 75 60 Z"
              fill="oklch(0.92 0 0)"
              stroke="var(--border)"
              stroke-width="1.2"
            />

            <!-- Inhibitory Interneuron (-) -->
            <circle cx="110" cy="90" r="13" fill="#ffffff" stroke="var(--coral)" stroke-width="2" />
            <text x="110" y="94" font-size="12" font-weight="900" fill="var(--coral)" text-anchor="middle">-</text>
            <text x="110" y="116" class="svg-label-sub" text-anchor="middle">Inhibitory Interneuron</text>

            <!-- Afferent Signal (Sensory from Biceps Spindle) -->
            <path
              d="M -40 70 C -10 65 20 70 97 90"
              fill="none"
              stroke="var(--coral)"
              :stroke-width="bicepsTone > 50 ? 2.8 : 1.8"
              :stroke-dasharray="bicepsTone > 50 ? 'none' : '4 3'"
            />
            <text x="25" y="65" class="nerve-text coral">Ia Afferent Signal</text>

            <!-- Inhibitory Output Signal to Triceps Motor Neuron -->
            <path
              d="M 110 103 C 105 140 30 170 -65 130"
              fill="none"
              stroke="var(--muted-foreground)"
              :stroke-width="bicepsTone > 60 ? 3 : 1.8"
              stroke-dasharray="4 3"
            />
            <text x="0" y="165" class="nerve-text muted">(-) Motor Inhibition</text>
          </g>

          <!-- ARM SKELETAL & MUSCLE DRAWING (Left side of SVG) -->
          <!-- Shoulder -->
          <circle :cx="shoulder.x" :cy="shoulder.y" r="14" fill="var(--secondary)" stroke="var(--heading)" stroke-width="1.5" />
          <text :x="shoulder.x" :y="shoulder.y - 18" class="svg-label-sub" text-anchor="middle">Shoulder</text>

          <!-- Humerus -->
          <line :x1="shoulder.x" :y1="shoulder.y" :x2="elbow.x" :y2="elbow.y" stroke="#d4d4d8" stroke-width="12" stroke-linecap="round" />

          <!-- Triceps Muscle (Posterior, Subject to Inhibition) -->
          <path
            :d="`M ${shoulder.x - 14} ${shoulder.y + 15} Q ${elbow.x - 22} ${(shoulder.y + elbow.y)/2} ${tricepsInsertion.x} ${tricepsInsertion.y}`"
            fill="none"
            :stroke="bicepsTone > 65 ? '#a1a1aa' : 'var(--teal)'"
            :stroke-width="bicepsTone > 65 ? 8 : 15"
            :stroke-dasharray="bicepsTone > 65 ? '5 3' : 'none'"
            stroke-linecap="round"
          />
          <text :x="elbow.x - 30" :y="(shoulder.y + elbow.y)/2" class="muscle-tag" :class="bicepsTone > 65 ? 'muted-tag' : 'teal-tag'" text-anchor="end">
            Triceps: {{ tricepsEffectiveTone }}% ({{ bicepsTone > 65 ? 'Inhibited' : 'Active' }})
          </text>

          <!-- Biceps Muscle (Anterior, Hypertonic / Pulling) -->
          <path
            :d="`M ${shoulder.x + 10} ${shoulder.y + 15} Q ${elbow.x + 18 + bicepsTone * 0.14} ${(shoulder.y + elbow.y)/2} ${bicepsInsertion.x} ${bicepsInsertion.y}`"
            fill="none"
            stroke="var(--coral)"
            :stroke-width="12 + bicepsTone * 0.16"
            stroke-linecap="round"
          />
          <text :x="elbow.x + 36" :y="(shoulder.y + elbow.y)/2" class="muscle-tag coral-tag">
            Biceps: {{ bicepsTone }}% ({{ bicepsTone > 65 ? 'Hypertonic' : 'Active' }})
          </text>

          <!-- Elbow Joint -->
          <circle :cx="elbow.x" :cy="elbow.y" r="8" fill="var(--card)" stroke="var(--heading)" stroke-width="2" />

          <!-- Forearm -->
          <line :x1="elbow.x" :y1="elbow.y" :x2="wrist.x" :y2="wrist.y" stroke="#d4d4d8" stroke-width="11" stroke-linecap="round" />
          <circle :cx="wrist.x" :cy="wrist.y" r="6" fill="var(--heading)" />

          <!-- Joint Angle Arc & Readout -->
          <text :x="elbow.x + 22" :y="elbow.y + 30" class="angle-badge">
            Resting: {{ restingAngle }}°
          </text>
        </svg>
      </div>
    </div>

    <!-- Sidebar Controls & Posture Bridge -->
    <div class="sim-sidebar">
      <!-- Biceps Tone Slider -->
      <div class="panel-section">
        <div class="section-title-row">
          <span class="section-label coral">Agonist Tension (Biceps Tone)</span>
          <span class="val-badge coral-val">{{ bicepsTone }}%</span>
        </div>
        <input
          v-model.number="bicepsTone"
          type="range"
          min="10"
          max="95"
          class="range-slider coral-slider"
        >
        <div class="tone-metric-row">
          <span class="tone-label">Triceps Reciprocal Inhibition:</span>
          <span class="tone-val" :class="bicepsTone > 65 ? 'text-coral' : ''">-{{ tricepsInhibition }}% Suppression</span>
        </div>
      </div>

      <!-- Diagnostic Card -->
      <div class="diagnostic-card" :class="status.color">
        <div class="diag-header">
          <span :class="status.icon" class="diag-icon" />
          <span class="diag-title">{{ status.title }}</span>
        </div>
        <p class="diag-text">{{ status.neurological }}</p>
      </div>

      <!-- BRIDGE TO ROUNDED SHOULDER POSTURE (Key clinical parallel) -->
      <div class="rsp-bridge-box">
        <div class="bridge-header">
          <span class="i-carbon:compare bridge-icon" />
          <span class="bridge-title">Direct Bridge to Rounded Shoulder Posture</span>
        </div>
        <div class="bridge-grid">
          <div class="bridge-item">
            <span class="bridge-sub coral">Tight Flexor (Biceps)</span>
            <span class="bridge-arrow">➔</span>
            <span class="bridge-target"><strong>Pectoralis Minor/Major</strong> (Shortened & hypertonic, pulling shoulder forward)</span>
          </div>
          <div class="bridge-item">
            <span class="bridge-sub teal">Inhibited Extensor (Triceps)</span>
            <span class="bridge-arrow">➔</span>
            <span class="bridge-target"><strong>Trapezius & Rhomboids</strong> (Reciprocally suppressed, overstretched & weak)</span>
          </div>
        </div>
        <p class="bridge-takeaway">
          <strong>Clinical Takeaway:</strong> You cannot fix rounded shoulders just by contracting the back—you must first release anterior chest tightness to lift reciprocal inhibition.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inhibition-sim-wrapper {
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

.preset-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
}

.preset-tab {
  flex: 1;
  font-size: 0.62rem;
  font-weight: 650;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--secondary);
  color: var(--muted-foreground);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.preset-tab:hover {
  color: var(--heading);
}

.preset-tab.active {
  background: var(--card);
  color: var(--heading);
  border-color: var(--heading);
  font-weight: 750;
}

.preset-tab.active-alert {
  background: oklch(0.62 0.15 35 / 0.1);
  color: var(--coral);
  border-color: var(--coral);
  font-weight: 750;
}

.svg-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.inhibition-svg {
  width: 100%;
  height: 100%;
  max-height: 280px;
}

.svg-label-bold {
  font-size: 10px;
  font-weight: 750;
  fill: var(--heading);
}

.svg-label-sub {
  font-size: 8.5px;
  font-weight: 600;
  fill: var(--muted-foreground);
}

.nerve-text {
  font-size: 8.5px;
  font-weight: 750;
  letter-spacing: 0.02em;
}

.nerve-text.coral {
  fill: var(--coral);
}

.nerve-text.muted {
  fill: var(--muted-foreground);
}

.muscle-tag {
  font-size: 9px;
  font-weight: 750;
}

.coral-tag {
  fill: var(--coral);
}

.teal-tag {
  fill: var(--teal);
}

.muted-tag {
  fill: #a1a1aa;
}

.angle-badge {
  font-size: 11px;
  font-weight: 850;
  fill: var(--heading);
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
}

.section-label.coral {
  color: var(--coral);
}

.val-badge {
  font-size: 0.75rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.coral-val {
  color: var(--coral);
}

.range-slider {
  width: 100%;
  height: 5px;
  border-radius: 3px;
  background: var(--secondary);
  outline: none;
  cursor: pointer;
  margin: 3px 0 5px;
}

.range-slider.coral-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--coral);
  cursor: pointer;
}

.tone-metric-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.62rem;
  color: var(--muted-foreground);
}

.tone-val {
  font-weight: 750;
  color: var(--heading);
}

.text-coral {
  color: var(--coral);
}

/* Diagnostic Card */
.diagnostic-card {
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 8px 11px;
  transition: all 0.2s ease;
}

.diagnostic-card.coral {
  background: oklch(0.62 0.15 35 / 0.06);
  border-color: oklch(0.62 0.15 35 / 0.3);
}

.diagnostic-card.amber {
  background: oklch(0.62 0.10 75 / 0.08);
  border-color: oklch(0.62 0.10 75 / 0.3);
}

.diagnostic-card.sage {
  background: oklch(0.55 0.08 145 / 0.06);
  border-color: oklch(0.55 0.08 145 / 0.3);
}

.diag-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}

.diag-icon {
  font-size: 0.85rem;
}

.diagnostic-card.coral .diag-icon {
  color: var(--coral);
}

.diagnostic-card.amber .diag-icon {
  color: var(--amber);
}

.diagnostic-card.sage .diag-icon {
  color: var(--sage);
}

.diag-title {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--heading);
}

.diag-text {
  font-size: 0.61rem;
  line-height: 1.35;
  color: var(--muted-foreground);
  margin: 0;
}

/* RSP Bridge Box */
.rsp-bridge-box {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  padding: 8px 11px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bridge-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bridge-icon {
  font-size: 0.85rem;
  color: var(--accent);
}

.bridge-title {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--heading);
}

.bridge-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bridge-item {
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: 0.6rem;
  line-height: 1.3;
}

.bridge-sub {
  font-weight: 800;
  white-space: nowrap;
}

.bridge-sub.coral {
  color: var(--coral);
}

.bridge-sub.teal {
  color: var(--teal);
}

.bridge-arrow {
  color: var(--muted-foreground);
  font-size: 0.65rem;
}

.bridge-target {
  color: var(--heading);
}

.bridge-takeaway {
  font-size: 0.58rem;
  line-height: 1.35;
  color: var(--muted-foreground);
  margin: 2px 0 0;
  border-top: 1px dashed var(--border);
  padding-top: 5px;
}

.bridge-takeaway strong {
  color: var(--heading);
}
</style>
