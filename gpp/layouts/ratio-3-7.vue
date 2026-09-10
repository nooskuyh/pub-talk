<script setup>
import Split from './split.vue'
</script>

<template>
  <Split ratio="3.6:6.4">
    <template #left>
      <slot name="left" />
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </Split>
</template>
