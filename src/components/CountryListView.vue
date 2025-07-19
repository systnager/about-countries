<script setup lang="ts">
import { ref, inject, readonly } from 'vue'
import { useI18n } from 'vue-i18n'
import { watchDebounced, useInfiniteScroll } from '@vueuse/core'
import { LOADER_PROVIDER_KEY } from '@/keys'
import { type Country } from '@/types/Countries'
import { type loaderProvide } from '@/types/Loader'
import CountryCardList from '@/components/CountryCardList.vue'

const { t } = useI18n()
const { showLoader, hideLoader, isLoading } = <loaderProvide>inject(LOADER_PROVIDER_KEY)

const filterByNameInput = ref<string>('')
const filterByRegionInput = ref<string>('')
const filterByLanguageInput = ref<string>('')

const props = defineProps({
  countries: {
    type: Array<Country>,
    required: true,
  },
  onLoadMore: {
    type: Function,
    required: true,
  },
  canLoadMore: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['sortCountries', 'filterCountries', 'toggleFavoriteCountry'])

defineExpose({
  filterByNameInput: readonly(filterByNameInput),
  filterByRegionInput: readonly(filterByRegionInput),
  filterByLanguageInput: readonly(filterByLanguageInput),
})

function onSortCountries(value: string) {
  showLoader()
  if (value === 'byPopulation') {
    emit('sortCountries', 'byPopulation')
  } else if (value === 'byArea') {
    emit('sortCountries', 'byArea')
  } else if (value === 'byPopulationDensity') {
    emit('sortCountries', 'byPopulationDensity')
  }
  hideLoader()
}

function toggleFavoriteCountry(officialName: string) {
  emit('toggleFavoriteCountry', officialName)
}

useInfiniteScroll(
  window,
  () => {
    if (!isLoading.value && props.canLoadMore()) {
      props.onLoadMore()
    }
  },
  { distance: 200 },
)

watchDebounced(
  [filterByNameInput, filterByRegionInput, filterByLanguageInput],
  () => {
    showLoader()
    emit('filterCountries')
    hideLoader()
  },
  { debounce: 250 },
)
</script>

<template>
  <div>
    <div class="flex justify-between m-5">
      <div class="flex gap-3">
        <select
          class="w-52 h-10 bg-while dark:bg-gray-600 px-5 px-2 rounded-md text-black dark:text-white shadow-md cursor-pointer truncate"
          @change="onSortCountries(($event.target as HTMLSelectElement).value || '')"
        >
          <option value="" disabled selected>{{ t('message.sort by') }}</option>
          <option value="byPopulation">{{ t('message.by population') }}</option>
          <option value="byArea">{{ t('message.by area') }}</option>
          <option value="byPopulationDensity">{{ t('message.by population density') }}</option>
        </select>
        <input
          class="w-52 h-10 bg-while dark:bg-gray-600 px-5 px-2 rounded-md text-black dark:text-white shadow-md"
          :placeholder="t('message.by name')"
          v-model="filterByNameInput"
        />
      </div>
      <div class="flex gap-3">
        <input
          class="w-52 h-10 bg-while dark:bg-gray-600 px-5 px-2 rounded-md text-black dark:text-white shadow-md"
          :placeholder="t('message.by continent')"
          v-model="filterByRegionInput"
        />
        <input
          class="w-52 h-10 bg-while dark:bg-gray-600 px-5 px-2 rounded-md text-black dark:text-white shadow-md"
          :placeholder="t('message.by language')"
          v-model="filterByLanguageInput"
        />
      </div>
    </div>
    <CountryCardList :countries="countries" @toggle-favorite-country="toggleFavoriteCountry" />
  </div>
</template>
