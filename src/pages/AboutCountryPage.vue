<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
const countryCode = route.params.code
</script>

<template>
  {{ countryCode }}
  <div class="text-gray dark:text-white px-15 py-10">
    <div class="flex flex-col gap-3">
      <div class="flex justify-between gap-3 bg-gray-200 dark:bg-gray-600 p-5 rounded-md">
        <div class="flex flex-col my-auto">
          <h2>{{ t('message.name') }}: <i>Ukraine</i></h2>
          <span>{{ t('message.capital') }}: <i>Kyiv</i></span>
          <span>{{ t('message.population') }}: <i>44 000 000</i></span>
          <span>{{ t('message.area') }}: <i>603 628</i></span>
        </div>
        <div>
          <img
            class="max-w-42 max-h-42"
            src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg"
          />
        </div>
      </div>
      <div class="flex justify-between mt-15 bg-gray-200 dark:bg-gray-600 p-5 rounded-md">
        <span
          >{{ t('message.currencies') }}:
          <ul class="pl-5">
            <li>Hryvnia</li>
            <li>Hryvnia</li>
            <li>Hryvnia</li>
          </ul>
        </span>
        <span
          >{{ t('message.timezones') }}:
          <ul class="pl-5">
            <li>UTC+2</li>
            <li>UTC+2</li>
            <li>UTC+2</li>
          </ul></span
        >
        <span
          >{{ t('message.languages') }}:
          <ul class="pl-5">
            <li>English</li>
            <li>Ukrainian</li>
          </ul></span
        >
      </div>
    </div>
    <div class="mt-15">
      <h2>{{ t('message.related countries') }}:</h2>
      <div class="grid col-auto gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="i in 16"
          :key="i"
          class="flex justify-between bg-gray-200 dark:bg-gray-600 p-5 rounded-md hover:shadow-xl cursor-pointer transition hover:scale-105 active:scale-95"
        >
          <span>Ukraine</span>
          <img
            class="max-w-8 max-h-8"
            src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg"
          />
        </div>
      </div>
    </div>
    <div class="mt-15 w-128 h-64 m-auto bg-black">GOOGLE MAPS</div>
  </div>
</template>
