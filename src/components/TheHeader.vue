<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import { ref, watch, inject, onMounted, onUnmounted } from 'vue'
import { SCROLL_ALLOWING_TOOGLE_KEY } from '@/keys'
import type { ScrollAllowingToggle } from '@/types/provides'
const { t, locale } = useI18n()
const { isDark, toggleDark } = useTheme()
const isShowMobileMenu = ref(false)
const innerWidth = ref(window.innerWidth)
const { toggleLock, allowScroll, disallowScroll } = inject(
  SCROLL_ALLOWING_TOOGLE_KEY,
) as ScrollAllowingToggle

watch(isShowMobileMenu, () => {
  toggleLock()
})

watch(innerWidth, () => {
  console.log(innerWidth.value)
  if (innerWidth.value < 768 && isShowMobileMenu.value) {
    disallowScroll()
    isShowMobileMenu.value = false
  } else if (innerWidth.value >= 768 && isShowMobileMenu.value) {
    allowScroll()
  }
})

onMounted(() => {
  window.addEventListener('resize', () => {
    innerWidth.value = window.innerWidth
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    innerWidth.value = window.innerWidth
  })
})
</script>

<template>
  <nav
    class="sticky top-0 flex items-center justify-between p-5 bg-gray-200 dark:bg-gray-600 dark:text-white w-full z-10 h-16 shadow-md"
  >
    <RouterLink
      class="text-xl px-5 py-2 font-bold cursor-pointer transition hover:scale-110 active:scale-90"
      to="/"
      >{{ t('message.title') }}</RouterLink
    >
    <div class="flex-1"></div>
    <div
      :class="[
        isShowMobileMenu
          ? 'fixed top-16 left-0 w-full h-full bg-gray-300 dark:bg-gray-800 flex flex-col items-center pt-15 gap-5 z-50 md:block md:top-0 md:w-auto md:h-auto  md:block md:pt-0 gap-5 md:z-50 md:relative md:bg-transparent md:dark:bg-transparent'
          : 'hidden md:flex items-center justify-center gap-5 flex-1',
      ]"
    >
      <RouterLink
        class="text-xl px-5 py-2 cursor-pointer transition hover:scale-110 active:scale-90"
        to="/"
        @click="isShowMobileMenu = false"
        >{{ t('message.main') }}</RouterLink
      >
      <RouterLink
        class="text-xl px-5 py-2 cursor-pointer transition hover:scale-110 active:scale-90"
        to="/analytics"
        @click="isShowMobileMenu = false"
        >{{ t('message.analytics') }}</RouterLink
      >
      <RouterLink
        class="text-xl px-5 py-2 cursor-pointer transition hover:scale-110 active:scale-90"
        to="/favorites"
        @click="isShowMobileMenu = false"
        >{{ t('message.favorites') }}</RouterLink
      >
    </div>
    <div class="flex-1"></div>
    <div class="flex items-center justify-center gap-3">
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="locale === 'ukr' ? '/select-ukraine.png' : '/unselect-ukraine.png'"
        :alt="t('message.choice ukr')"
        @click="locale = 'ukr'"
      />
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="locale === 'eng' ? '/select-en.png' : '/unselect-en.png'"
        :alt="t('message.choice eng')"
        @click="locale = 'eng'"
      />
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="isDark ? '/dark-theme.png' : '/light-theme.png'"
        :alt="t('message.change theme')"
        @click="toggleDark()"
      />
    </div>
    <button class="md:hidden ml-5" @click="isShowMobileMenu = !isShowMobileMenu">
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="isDark ? '/dark-burger.png' : '/light-burger.png'"
      />
    </button>
  </nav>
</template>
