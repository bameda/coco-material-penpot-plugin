<script setup lang="ts">
import { onMounted, ref } from 'vue';

import CocoPanel from "./components/CocoPanel.vue";

const theme = ref<string | null>(null);

onMounted(() => {
  const url = new URL(window.location.href);

  const initialTheme = url.searchParams.get("theme");

  if (initialTheme) {
    theme.value = initialTheme as string;
  }

  window.addEventListener("message", (event) => {
    if (event.data.type === "theme") {
      theme.value = event.data.content;
    }
  });
});
</script>

<template>
  <main :data-theme="theme"><CocoPanel /></main>
</template>
