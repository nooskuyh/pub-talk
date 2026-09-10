<script setup>
defineProps({
  file: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="template-code">
    <div v-if="file" class="code-title">{{ file }}</div>
    <div class="template-code-body">
      <slot />
    </div>
  </div>
</template>
