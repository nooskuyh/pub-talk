<script setup>
import Split from './split.vue'
</script>

<template>
  <Split ratio="4.6:5.4">
    <template #left>
      <slot name="left" />
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </Split>
</template>
