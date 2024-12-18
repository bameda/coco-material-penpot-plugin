<script setup lang="ts">
import { ref, onMounted, defineModel } from "vue";
import api, {CocoImage} from "../services/api.ts";

let currentCall = api.getLatestCocoImages

const text = defineModel<string>("");
const currentPage = ref<int>(1);
const hasMorePages = ref<boolean>(false);
const results = ref<CocoImage[]>([]);

onMounted(async () => {
  const data = await currentCall({page: 1});
  currentPage.value = 1;
  results.value = results.value.concat(data.results);
  hasMorePages.value = data.next !== null;
});

function getImageAsStyleBackgroundAttr(cocoImage: CocoImage) {
  if (cocoImage.gif !== null || cocoImage.coloredGif !== null) {
    const gifUrl = cocoImage.coloredGif || cocoImage.gif;
    return {
      backgroundImage: `url('${gifUrl}')`
    };
  } else {
    const svg64 = window.btoa(
      cocoImage.coloredSvgContent || cocoImage.svgContent
    );
    return {
      backgroundImage: `url('data:image/svg+xml;base64,${svg64}')`
    };
  }
}

async function handleClickOnSearchButton () {
  currentCall = api.getCocoImagesByTags;
  currentPage.value = 1;
  const data = await currentCall({
    tags: text.value, page: currentPage.value
  });
  results.value = data.results;
  hasMorePages.value = data.next !== null;
}

async function handleClickOnShowMoreButton () {
  currentPage.value += 1;
  const data = await currentCall({
    tags: text.value, page: currentPage.value
  });
  results.value = results.value.concat(data.results);
  hasMorePages.value = data.next !== null;
}

function handleClickOnCocoImageButton(cocoImage: CocoImage) {
  if (cocoImage.gif !== null || cocoImage.coloredGif !== null) {
    parent.postMessage({
      type: "gif",
      content: cocoImage.coloredGif || cocoImage.gif,
      name: cocoImage.name,
    }, "*");
  }
  else {
    parent.postMessage({
      type: "svg",
      content: cocoImage.coloredSvgContent || cocoImage.svgContent,
      name: cocoImage.name,
    }, "*");
  }
}

</script>

<template>
<div class="host">
  <form class="search-form"
    v-on:submit.prevent="handleClickOnSearchButton()">
    <!-- <label for="search-text">Show images about</label> -->
    <input class="search-text"
      type="text" name="search-text"
      placeholder="type some tag or text here..."
      v-model="text"/>
    <button class="search-button"
      type="submit">
      Search
    </button>
  </form>

  <div class="result-list"
    v-if="results">
    <button class="item"
      v-for="item in results"
      :key="item.id"
      v-on:click="handleClickOnCocoImageButton(item)">
      <div class="coco-image"
        :alt="item.name"
        :style="getImageAsStyleBackgroundAttr(item)"></div>
    </button>
  </div>
  <div class="show-more"
    v-if="hasMorePages">
    <button
      class="show-more-button"
      v-on:click="handleClickOnShowMoreButton()">
      show more results
    </button>
  </div>
</div>
</template>

<style scoped>
.host {
  display: flex;
  flex-direction: column;
  justify-content: center;
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

    & .coco-image {
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      height: 100%;
      width: 100%;
      margin: auto;

      /* TODO: Maybe I can delete this piece of code
      * &.vertical {
      *   height: 125px;
      *
      *   @media (max-width: 1200px) {
      *     height: 100px;
      *   }
      * }
      *
      * &.horizontal {
      *   width: 125px;
      *
      *   @media (max-width: 1200px) {
      *     width: 100px;
      *   }
      * }
      */
    }
  }
}

.show-more {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  padding: 0.5rem;
}

</style>
