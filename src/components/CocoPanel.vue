<script setup lang="ts">
import { ref, onMounted } from "vue";
import api, {} from "../services/api.ts";

const text = ref<string>("");
const results = ref<CocoImage[]>([]);

onMounted(async () => {
  const data = await api.getLatestCocoImages();
  results.value = data.results;
});

function getImageAsStyleBackgroundAttr(vector) {
  if (vector.gif !== null || vector.coloredGif !== null) {
    return {
      backgroundImage: `url('${vector.coloredGif || vector.gif}')`
    }
  } else {
    const svg64 = window.btoa(vector.coloredSvgContent || vector.svgContent)
    return {
      backgroundImage: `url('data:image/svg+xml;base64,${svg64}')`
    }
  }
}
</script>

<template>
<div class="host">
  <form class="search-form">
    <!-- <label for="search-text">Show images about</label> -->
    <input class="search-text"
      type="text" name="search-text"
      placeholder="type some tag or text here..." />
    <button class="search-button"
      type="submit">
      Search
    </button>
  </form>

  <div class="result-list"
    v-if="results">
    <button class="item"
      v-for="item in results"
      :key="item.id">
      <div class="coco-image"
        :alt="item.name"
        :style="getImageAsStyleBackgroundAttr(item)"></div>
    </button>
  </div>
</div>
</template>

<style scoped>
.host {
  display: flex;
  flex-direction: column;
  align-content: center;
}

.search-form {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  background: var(--db-primary);
  padding: 1rem;

  position: sticky;
  top: 0;
  left: 0;

  & .search-text {
    flex-grow: 2;
    padding: 0.3rem 0.5rem;
  }

  & .search-button {
    padding: 0.3rem 0.5rem;
  }
}

.result-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  overflow: scroll;

  & .item {
    border: 1px solid white;
    border-radius: 0.5rem;
    width: 5rem;
    height: 5rem;
    padding: 0.1rem;
    background: white;
  }
}

.coco-image {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  margin: auto;

  &.vertical {
    height: 125px;

    @media (max-width: 1200px) {
      height: 100px;
    }
  }

  &.horizontal {
    width: 125px;

    @media (max-width: 1200px) {
      width: 100px;
    }
  }
}
</style>
