<script setup lang="ts">
import { ref, provide, readonly, onMounted, watch } from 'vue'
import { LOADER_PROVIDER_KEY, SCROLL_ALLOWING_TOOGLE_KEY } from '@/keys'
import TheHeader from '@/components/TheHeader.vue'
import WaitLoader from '@/components/WaitLoader.vue'
import { useScrollLock, useToggle } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const isLoading = ref(false)
const loaderOnCount = ref(0)
const isLocked = useScrollLock(document.body)
const toggleLock = useToggle(isLocked)

function showLoader() {
  isLoading.value = true
  loaderOnCount.value++
  disallowScroll()
}

function hideLoader() {
  loaderOnCount.value--
  if (loaderOnCount.value > 0) return
  setTimeout(() => {
    isLoading.value = false
    allowScroll()
  }, 250)
}

function allowScroll() {
  if (isLocked.value) {
    isLocked.value = false
  }
}

function disallowScroll() {
  if (!isLocked.value) {
    isLocked.value = true
  }
}

provide(LOADER_PROVIDER_KEY, {
  showLoader,
  hideLoader,
  isLoading: readonly(isLoading),
})

provide(SCROLL_ALLOWING_TOOGLE_KEY, {
  allowScroll,
  disallowScroll,
  toggleLock,
})

onMounted(() => {
  document.title = t('message.title')
})

watch(locale, () => {
  document.title = t('message.title')
})
</script>

<template>
  <div>
    <WaitLoader v-if="isLoading" />
    <TheHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>
