<template>
  <div class="slidev-layout center-photo-layout">
    <div class="center-photo-title">
      <slot name="title" />
    </div>
    <div class="center-photo-media">
      <slot name="image" />
    </div>
    <div class="center-photo-caption">
      <slot name="caption" />
    </div>
  </div>
</template>
