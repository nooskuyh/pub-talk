<template>
  <footer class="deck-page-number">
    <span>{{ String($nav.currentPage).padStart(2, '0') }}</span>
    <span class="deck-page-divider">/</span>
    <span>{{ String($nav.total).padStart(2, '0') }}</span>
  </footer>
</template>
