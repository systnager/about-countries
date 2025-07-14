<script setup lang="ts">
import CountryCard from '@/components/CountryCard.vue'
</script>
<template>
  <div class="grid col-auto gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-5">
    <CountryCard
      v-for="i in 30"
      :key="i"
      :area="123465"
      flagUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/1280px-Flag_of_Ukraine.svg.png"
      lang="lang"
      name="name"
      :population="12345"
      region="region"
    />
  </div>
</template>
