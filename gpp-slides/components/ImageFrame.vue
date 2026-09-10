<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <figure class="image-frame">
    <img :src="src" :alt="alt">
    <figcaption v-if="caption" class="photo-caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>
