<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
  name: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  population: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
  flagUrl: {
    type: String,
    required: true,
  },
})

const isFavorite = ref(false)

const { t } = useI18n()

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
}
</script>

<template>
  <div
    class="flex flex-col bg-gray-200 dark:bg-gray-600 dark:text-white p-5 rounded-md hover:shadow-md"
  >
    <div
      class="flex justify-center px-5 gap-5 transition hover:scale-105 active:scale-95 cursor-pointer"
    >
      <img class="max-w-32 max-h-16 w-auto h-auto my-auto" :src="flagUrl" :alt="name" />
      <span class="font-bold text-2xl my-auto">{{ name }}</span>
    </div>
    <div class="flex justify-between relative">
      <div class="flex flex-col px-5 mt-5 flex-1">
        <span
          >{{ t('message.region') }}: <span class="italic">{{ region }}</span></span
        >
        <span
          >{{ t('message.area') }}: <span class="italic">{{ area }}</span></span
        >
        <span
          >{{ t('message.population') }}: <span class="italic">{{ population }}</span></span
        >
        <span
          >{{ t('message.language') }}: <span class="italic">{{ lang }}</span></span
        >
      </div>
      <img
        class="absolute bottom-0 right-0 w-12 h-12 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="isFavorite ? '/favorite.png' : '/unfavorite.png'"
        :alt="isFavorite ? t('message.unfavorite') : t('message.favorite')"
        @click="toggleFavorite"
      />
    </div>
  </div>
</template>
