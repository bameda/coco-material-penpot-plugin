<script setup lang="ts">
import { ref, onMounted, defineModel } from "vue";
import api from "../services/api";
import type { CocoImage } from "../services/api/model";

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

/*
 * DDraw functions
 */
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

/*
* Handle functions
*/
async function handleClickOnSearchButton () {
  if (!text.value) return;
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
    <div class="form-group">
      <label class="input-label-hidden" for="search-text">Show images about</label>
      <input class="input"
        type="text" name="search-text" id="search-text"
        placeholder="type something here..."
        v-model="text" />
    </div>
    <button type="submit" data-appearance="primary">
      Search
    </button>
  </form>

  <div class="result-container">
    <div class="result-list"
      v-if="results">
      <button class="item"
        v-for="item in results"
        :key="item.id"
        :title="'Name: ' + item.name + '\nTags: ' + item.tags"
        v-on:click="handleClickOnCocoImageButton(item)">
        <div class="coco-image"
          :alt="item.name"
          :style="getImageAsStyleBackgroundAttr(item)"></div>
      </button>
    </div>

    <div class="show-more"
      v-if="hasMorePages">
      <button
        type="button" data-appearance="secondary"
        v-on:click="handleClickOnShowMoreButton()">
        show more results
      </button>
    </div>

    <div class="no-results"
      v-if="results.length === 0 && text">
        <p class="body-m">
          There is nothing for your search.<br />Try something else.
        </p>
    </div>
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
  justify-content: center;
  gap: var(--spacing-8);
  padding: var(--spacing-20) var(--spacing-12);
  position: sticky;
  top: 0;
  left: 0;
}

.result-container {
  overflow-y: scroll;
  max-height: 640px;

  & .result-list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--spacing-8);

    & .item {
      border: 2px solid var(--app-white);
      border-radius: 0.5rem;
      width: 5rem;
      height: 5rem;
      padding: 0.1rem;
      background: var(--app-white);

      & .coco-image {
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
        margin: auto;
      }
    }
  }

  & .show-more {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    margin: var(--spacing-12) 0;
  }

  & .no-results {
    text-align: center;
    margin: var(--spacing-12) 0;
  }
}


[data-theme="dark"] {
  &.search-form {
    background: var(--db-primary);
  }

  & .item {
    &:hover {
      border-color: var(--da-tertiary);
    }
  }
}

[data-theme="light"] {
  &.search-form {
    background: var(--lb-primary);
  }

  & .item {
    &:hover {
      border-color: var(--la-tertiary);
    }
  }
}

</style>
