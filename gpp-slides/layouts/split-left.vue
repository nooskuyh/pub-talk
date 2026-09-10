<script setup>
import Split from './split.vue'
</script>

<template>
  <Split ratio="5.4:4.6">
    <template #left>
      <slot name="left" />
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </Split>
</template>
