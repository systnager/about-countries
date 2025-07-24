<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  name: string
  region: string
  population: number
  area: number
  lang: string
  flagUrl: string
  isFavorite: boolean
  ccn3: string
}>()

const emit = defineEmits<{
  (e: 'toggleFavorite', value: void): void
}>()

const _isFavorite = ref(props.isFavorite)

const { t } = useI18n()

function toggleFavorite() {
  _isFavorite.value = !_isFavorite.value
  emit('toggleFavorite')
}
</script>

<template>
  <div
    class="flex flex-col bg-neutral-200 dark:bg-neutral-600 dark:text-white p-5 rounded-md hover:shadow-md"
  >
    <a
      :href="`/country/${ccn3}`"
      class="flex justify-center gap-3 transition hover:scale-105 active:scale-95 cursor-pointer mx-auto"
    >
      <img class="max-w-16 max-h-8 w-auto h-auto my-auto" :src="flagUrl" :alt="name" />
      <span class="font-bold text-2xl text-center flex-1">{{ name }}</span>
    </a>
    <div class="flex justify-between relative flex-1 mt-5">
      <div class="flex flex-col flex-1">
        <div class="flex-1"></div>
        <div class="flex flex-col mr-5">
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
      </div>
      <div class="flex flex-col">
        <div class="flex-1"></div>
        <img
          class="w-8 h-8 cursor-pointer transition hover:scale-110 active:scale-90"
          :src="_isFavorite ? '/favorite.png' : '/unfavorite.png'"
          :alt="_isFavorite ? t('message.unfavorite') : t('message.favorite')"
          @click="toggleFavorite"
        />
      </div>
    </div>
  </div>
</template>
