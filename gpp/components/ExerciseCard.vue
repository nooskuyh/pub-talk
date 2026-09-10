<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  motion: {
    type: String,
    required: true,
  },
  prescription: {
    type: String,
    required: true,
  },
  exerciseId: {
    type: String,
    default: '',
  },
  gif: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'teal',
  },
})

const hasError = ref(false)

const base = import.meta.env.BASE_URL || '/'
const cleanBase = base.endsWith('/') ? base : `${base}/`

const imgSrc = computed(() => {
  if (props.gif) {
    if (props.gif.startsWith('/')) {
      return `${cleanBase}${props.gif.slice(1)}`
    }
    return props.gif
  }
  if (props.exerciseId) {
    return `${cleanBase}imgs/exercises/${props.exerciseId}.gif`
  }
  return ''
})
</script>

<template>
  <div class="card card-compact !p-2.5 flex flex-col justify-between border border-slate-200/80 bg-white/95 shadow-sm rounded-xl min-h-[175px] h-full">
    <!-- Top Meta Row -->
    <div class="flex items-center justify-between gap-1 mb-1">
      <span
        class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
        :class="{
          'bg-teal-50 text-teal-700 border border-teal-200': tone === 'teal',
          'bg-rose-50 text-rose-700 border border-rose-200': tone === 'rose',
          'bg-blue-50 text-blue-700 border border-blue-200': tone === 'blue',
          'bg-purple-50 text-purple-700 border border-purple-200': tone === 'purple',
          'bg-amber-50 text-amber-700 border border-amber-200': tone === 'amber',
          'bg-emerald-50 text-emerald-700 border border-emerald-200': tone === 'emerald',
        }"
      >
        {{ target }}
      </span>
      <span class="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
        {{ prescription }}
      </span>
    </div>

    <!-- Content: Left Visual Placeholder + Right Description -->
    <div class="grid grid-cols-12 gap-2.5 items-center flex-1">
      <!-- Visual / GIF Slot -->
      <div class="col-span-5 h-[115px] bg-slate-50/80 border border-slate-200 hover:border-teal-400 transition-colors rounded-lg flex flex-col items-center justify-center p-1 text-center overflow-hidden relative group">
        <template v-if="imgSrc && !hasError">
          <img
            :src="imgSrc"
            :alt="title"
            class="w-full h-full object-contain rounded"
            @error="hasError = true"
          />
        </template>
        <template v-else>
          <div class="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 mb-1 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
            <span class="icon i-carbon:video text-base" />
          </div>
          <span class="text-[11px] font-bold text-slate-600 tracking-wide">GIF / Video</span>
          <span class="text-[9px] text-slate-400 font-mono mt-0.5">{{ exerciseId ? `${exerciseId}.gif` : 'exercise.gif' }}</span>
        </template>
      </div>

      <!-- Right Column: Title + Key Motion -->
      <div class="col-span-7 flex flex-col justify-center space-y-0.5">
        <h4 class="font-bold text-[12px] text-slate-900 leading-tight">
          {{ title }}
        </h4>
        <p class="text-[10px] text-slate-600 leading-tight">
          <strong class="text-slate-800">Key Motion:</strong> {{ motion }}
        </p>
      </div>
    </div>
  </div>
</template>
