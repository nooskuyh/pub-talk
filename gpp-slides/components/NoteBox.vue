<script setup>
defineProps({
  tone: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div :class="['note', tone]">
    <slot />
  </div>
</template>
