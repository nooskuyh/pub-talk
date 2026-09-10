<script setup>
defineProps({
  icon: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <span :class="['badge', tone]">
    <span v-if="icon" :class="['icon', tone, icon]" />
    <slot />
  </span>
</template>
