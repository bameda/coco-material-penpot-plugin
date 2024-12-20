<script setup lang="ts">
import { onMounted, ref } from 'vue'

import CocoPanel from './components/CocoPanel.vue'

const theme = ref<string | null>(null)

onMounted(() => {
  const url = new URL(window.location.href)
  console.log(url.searchParams)
  const initialTheme = url.searchParams.get('theme')

  if (initialTheme && initialTheme !== 'undefined') {
    theme.value = initialTheme as string
  }
  // FIX: when theme is not set, it should be the default

  window.addEventListener('message', (event) => {
    if (event.data.type === 'theme') {
      theme.value = event.data.content || 'dark'
    }
  })
})
</script>

<template>
  <main :data-theme="theme || 'dark'">
    <CocoPanel />
  </main>
</template>
