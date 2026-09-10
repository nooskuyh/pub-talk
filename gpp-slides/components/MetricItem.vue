<script setup>
defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="stat">
    <b>{{ value }}</b>
    <span>{{ label }}</span>
  </div>
</template>
