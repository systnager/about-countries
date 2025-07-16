<script setup lang="ts">
import { ref, provide, readonly } from 'vue'
import { LOADER_PROVIDER_KEY } from '@/keys'
import TheHeader from '@/components/TheHeader.vue'
import WaitLoader from '@/components/WaitLoader.vue'

const isLoading = ref(false)
const loaderOnCount = ref(0)

function showLoader() {
  isLoading.value = true
  loaderOnCount.value++
}

function hideLoader() {
  loaderOnCount.value--
  if (loaderOnCount.value > 0) return
  setTimeout(() => {
    isLoading.value = false
  }, 250)
}

provide(LOADER_PROVIDER_KEY, {
  showLoader,
  hideLoader,
  isLoading: readonly(isLoading),
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
