<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const countryCode = route.params.code
</script>

<template>{{ countryCode }}</template>
