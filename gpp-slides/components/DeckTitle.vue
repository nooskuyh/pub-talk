<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  kicker: {
    type: String,
    default: '',
  },
  presenter: {
    type: String,
    default: '',
  },
  affiliation: {
    type: String,
    default: '',
  },
  context: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: '',
  },
  logos: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="deck-title">
    <div v-if="kicker" class="kicker">{{ kicker }}</div>
    <h1>{{ title }}</h1>
    <div class="deck-title-copy">
      <slot />
    </div>
    <div v-if="presenter || affiliation" class="title-person">
      <span v-if="presenter">{{ presenter }}</span>
      <span v-if="affiliation">{{ affiliation }}</span>
    </div>
    <div v-if="context || date" class="meta-row">
      <span v-if="context">{{ context }}</span>
      <span v-if="date">{{ date }}</span>
    </div>
    <div v-if="logos" class="logo-strip">
      <div v-for="logo in logos.split(',').map(item => item.trim()).filter(Boolean)" :key="logo" class="logo-slot">
        {{ logo }}
      </div>
    </div>
  </div>
</template>
