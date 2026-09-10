<script setup>
defineProps({
  number: {
    type: [Number, String],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="step">
    <div class="step-num">{{ number }}</div>
    <div class="step-copy">
      <h3>{{ title }}</h3>
      <slot />
    </div>
  </div>
</template>
