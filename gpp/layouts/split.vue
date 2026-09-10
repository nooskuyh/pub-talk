<script setup>
import { computed } from 'vue'

const props = defineProps({
  ratio: {
    type: [String, Array],
    default: '1:1',
  },
  left: {
    type: [String, Number],
    default: '',
  },
  right: {
    type: [String, Number],
    default: '',
  },
  align: {
    type: String,
    default: 'center',
  },
})

function toPositiveNumber(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

const columns = computed(() => {
  if (props.left || props.right) {
    return [
      toPositiveNumber(props.left, 1),
      toPositiveNumber(props.right, 1),
    ]
  }

  const parts = Array.isArray(props.ratio)
    ? props.ratio
    : String(props.ratio).split(/[:/]/)

  return [
    toPositiveNumber(parts[0], 1),
    toPositiveNumber(parts[1], 1),
  ]
})

const layoutStyle = computed(() => ({
  '--split-left': `${columns.value[0]}fr`,
  '--split-right': `${columns.value[1]}fr`,
  '--split-align': props.align,
}))
</script>

<template>
  <div class="slidev-layout split-layout" :style="layoutStyle">
    <div class="split-pane">
      <slot name="left" />
    </div>
    <div class="split-pane">
      <slot name="right" />
    </div>
  </div>
</template>
