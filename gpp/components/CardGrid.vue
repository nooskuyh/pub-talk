<script setup>
const props = defineProps({
  columns: {
    type: [Number, String],
    default: 2,
  },
  density: {
    type: String,
    default: '',
  },
})

const columnClass = Number(props.columns) === 3 ? 'grid-3' : 'grid-2'
const densityClass = props.density ? `card-grid-${props.density}` : ''
</script>

<template>
  <div :class="['card-grid', columnClass, densityClass]">
    <slot />
  </div>
</template>
