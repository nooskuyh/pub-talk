<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: '',
  },
  density: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div :class="['card', density ? `card-${density}` : '']">
    <h3>
      <span v-if="icon" :class="['icon', tone, icon]" />
      {{ title }}
    </h3>
    <slot />
  </div>
</template>
