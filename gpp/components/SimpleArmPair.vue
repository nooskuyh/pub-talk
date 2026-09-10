<script setup>
import { ref, computed } from 'vue'

// 0 = Full Flexion (Biceps fully contracted, 45 deg)
// 100 = Full Extension (Triceps fully contracted, 155 deg)
const balance = ref(50)

const elbowAngle = computed(() => Math.round(45 + (balance.value / 100) * 110))
const rad = computed(() => ((180 - elbowAngle.value) * Math.PI) / 180)

// Fixed upper bar: (170, 25) to (170, 125)
const shoulder = { x: 170, y: 25 }
const elbow = { x: 170, y: 125 }
const armLen = 95

// Forearm bar end (wrist)
const wrist = computed(() => ({
  x: elbow.x + armLen * Math.sin(rad.value),
  y: elbow.y + armLen * Math.cos(rad.value),
}))

// Olecranon spur (rear lever behind elbow pivot)
const rearSpur = computed(() => ({
  x: elbow.x - 20 * Math.sin(rad.value),
  y: elbow.y - 20 * Math.cos(rad.value),
}))

// Biceps attachments (front)
const bicepOrigin = { x: 180, y: 45 }
const bicepInsertion = computed(() => ({
  x: elbow.x + 28 * Math.sin(rad.value) + 7 * Math.cos(rad.value),
  y: elbow.y + 28 * Math.cos(rad.value) - 7 * Math.sin(rad.value),
}))

const bicepPower = computed(() => Math.round(100 - balance.value))
const bicepMid = computed(() => {
  const mx = (bicepOrigin.x + bicepInsertion.value.x) / 2
  const my = (bicepOrigin.y + bicepInsertion.value.y) / 2
  const bulge = 6 + 20 * (bicepPower.value / 100)
  return {
    x: mx + bulge,
    y: my,
    thickness: 7 + 13 * (bicepPower.value / 100),
  }
})

// Triceps attachments (back)
const tricepOrigin = { x: 160, y: 45 }
const tricepInsertion = computed(() => rearSpur.value)

const tricepPower = computed(() => balance.value)
const tricepMid = computed(() => {
  const mx = (tricepOrigin.x + tricepInsertion.value.x) / 2
  const my = (tricepOrigin.y + tricepInsertion.value.y) / 2
  const bulge = 6 + 20 * (tricepPower.value / 100)
  return {
    x: mx - bulge,
    y: my,
    thickness: 7 + 13 * (tricepPower.value / 100),
  }
})
</script>

<template>
  <div class="minimal-wrapper">
    <!-- Centered Visual Box -->
    <div class="svg-box">
      <svg viewBox="0 0 340 220" class="minimal-svg">
        <defs>
          <marker id="arrow-bicep" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--coral)" />
          </marker>
          <marker id="arrow-tricep" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--teal)" />
          </marker>
        </defs>

        <!-- Shoulder Anchor -->
        <circle :cx="shoulder.x" :cy="shoulder.y" r="8" fill="#94a3b8" />
        <circle :cx="shoulder.x" :cy="shoulder.y" r="3.5" fill="#ffffff" />
        <text :x="shoulder.x" :y="shoulder.y - 12" class="bone-label" text-anchor="middle">Shoulder</text>

        <!-- Upper Arm Bar -->
        <line
          :x1="shoulder.x"
          :y1="shoulder.y"
          :x2="elbow.x"
          :y2="elbow.y"
          stroke="#cbd5e1"
          stroke-width="16"
          stroke-linecap="round"
        />

        <!-- TRICEPS MUSCLE (Back Band) -->
        <path
          :d="`M ${tricepOrigin.x} ${tricepOrigin.y} Q ${tricepMid.x} ${tricepMid.y} ${tricepInsertion.x} ${tricepInsertion.y}`"
          fill="none"
          stroke="var(--teal)"
          :stroke-width="tricepMid.thickness"
          stroke-linecap="round"
        />
        <circle :cx="tricepOrigin.x" :cy="tricepOrigin.y" r="4" fill="#ffffff" stroke="var(--teal)" stroke-width="2" />
        <circle :cx="tricepInsertion.x" :cy="tricepInsertion.y" r="4" fill="#ffffff" stroke="var(--teal)" stroke-width="2" />

        <!-- Tricep Pull Arrow -->
        <line
          v-if="tricepPower > 30"
          :x1="tricepInsertion.x"
          :y1="tricepInsertion.y"
          :x2="tricepInsertion.x - (tricepInsertion.x - tricepOrigin.x) * 0.45"
          :y2="tricepInsertion.y - (tricepInsertion.y - tricepOrigin.y) * 0.45"
          stroke="var(--teal)"
          stroke-width="2.5"
          marker-end="url(#arrow-tricep)"
        />
        <text :x="tricepMid.x - 10" :y="tricepMid.y + 4" class="muscle-label teal" text-anchor="end">
          Triceps ({{ tricepPower }}%)
        </text>

        <!-- BICEPS MUSCLE (Front Band) -->
        <path
          :d="`M ${bicepOrigin.x} ${bicepOrigin.y} Q ${bicepMid.x} ${bicepMid.y} ${bicepInsertion.x} ${bicepInsertion.y}`"
          fill="none"
          stroke="var(--coral)"
          :stroke-width="bicepMid.thickness"
          stroke-linecap="round"
        />
        <circle :cx="bicepOrigin.x" :cy="bicepOrigin.y" r="4" fill="#ffffff" stroke="var(--coral)" stroke-width="2" />
        <circle :cx="bicepInsertion.x" :cy="bicepInsertion.y" r="4" fill="#ffffff" stroke="var(--coral)" stroke-width="2" />

        <!-- Bicep Pull Arrow -->
        <line
          v-if="bicepPower > 30"
          :x1="bicepInsertion.x"
          :y1="bicepInsertion.y"
          :x2="bicepInsertion.x - (bicepInsertion.x - bicepOrigin.x) * 0.45"
          :y2="bicepInsertion.y - (bicepInsertion.y - bicepOrigin.y) * 0.45"
          stroke="var(--coral)"
          stroke-width="2.5"
          marker-end="url(#arrow-bicep)"
        />
        <text :x="bicepMid.x + 10" :y="bicepMid.y + 4" class="muscle-label coral">
          Biceps ({{ bicepPower }}%)
        </text>

        <!-- Elbow Hinge Pivot -->
        <circle :cx="elbow.x" :cy="elbow.y" r="10" fill="#ffffff" stroke="#475569" stroke-width="2.5" />
        <circle :cx="elbow.x" :cy="elbow.y" r="4" fill="#475569" />

        <!-- Rear Lever (Olecranon) -->
        <line
          :x1="elbow.x"
          :y1="elbow.y"
          :x2="rearSpur.x"
          :y2="rearSpur.y"
          stroke="#64748b"
          stroke-width="10"
          stroke-linecap="round"
        />

        <!-- Forearm Bar -->
        <line
          :x1="elbow.x"
          :y1="elbow.y"
          :x2="wrist.x"
          :y2="wrist.y"
          stroke="#94a3b8"
          stroke-width="14"
          stroke-linecap="round"
        />
        <circle :cx="wrist.x" :cy="wrist.y" r="5" fill="#475569" />

        <!-- Joint Angle Text -->
        <text :x="elbow.x + 24" :y="elbow.y + 28" class="angle-text">
          {{ elbowAngle }}°
        </text>
      </svg>
    </div>

    <!-- Centered Minimal Controls -->
    <div class="controls-box">
      <div class="slider-row">
        <span class="label-end font-bold coral">◀ Pull Biceps (Bend)</span>
        <input
          v-model.number="balance"
          type="range"
          min="0"
          max="100"
          class="minimal-slider balance-slider"
        >
        <span class="label-end font-bold teal">Pull Triceps (Straighten) ▶</span>
      </div>

      <!-- Single Clear Takeaway Message -->
      <div class="message-banner">
        <p class="main-msg">
          <strong>The Solution: Opposing Muscle Pairs (Antagonists)</strong>
        </p>
        <p class="sub-msg">
          Biceps pulls the front lever to <strong>bend</strong>. Triceps pulls the back lever to <strong>straighten</strong>. 
          Every joint in your body relies on this counter-pull dynamic.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.minimal-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 385px;
  max-width: 640px;
  margin: 0 auto;
}

.svg-box {
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  padding: 10px;
}

.minimal-svg {
  width: 100%;
  height: 100%;
  max-height: 210px;
}

.bone-label {
  font-size: 10px;
  font-weight: 700;
  fill: #64748b;
}

.muscle-label {
  font-size: 11px;
  font-weight: 800;
}

.muscle-label.coral {
  fill: var(--coral);
}

.muscle-label.teal {
  fill: var(--teal);
}

.angle-text {
  font-size: 13px;
  font-weight: 850;
  fill: var(--heading);
}

/* Controls */
.controls-box {
  width: 100%;
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.slider-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
}

.label-end {
  font-size: 0.72rem;
  white-space: nowrap;
}

.label-end.coral {
  color: var(--coral);
}

.label-end.teal {
  color: var(--teal);
}

.minimal-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.balance-slider {
  background: linear-gradient(to right, var(--coral), #e2e8f0, var(--teal));
}

.balance-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  border: 2.5px solid #475569;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.message-banner {
  text-align: center;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 8px 16px;
  width: 100%;
}

.main-msg {
  font-size: 0.82rem;
  color: var(--heading);
  margin: 0 0 2px;
}

.sub-msg {
  font-size: 0.7rem;
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1.35;
}
</style>
