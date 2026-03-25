<script setup lang="ts">
import { ref } from 'vue'
import FurnitureCanvas from './components/FurnitureCanvas.vue'
import PromptInput from './components/PromptInput.vue'
import { askLLM } from './composables/useLLM'
import { MAX_SESSION_REQUESTS } from '#shared/config'

const canvasCode = ref('')
const isLoading = ref(false)
const error = ref('')
const requestCount = ref(Number(sessionStorage.getItem('requestCount') ?? 0))
const isLimitReached = ref(requestCount.value >= MAX_SESSION_REQUESTS)

async function onSubmit(prompt: string) {
  if (isLimitReached.value) return
  isLoading.value = true
  error.value = ''
  canvasCode.value = ''

  try {
    canvasCode.value = await askLLM(prompt)
    requestCount.value++
    sessionStorage.setItem('requestCount', String(requestCount.value))
    if (requestCount.value >= MAX_SESSION_REQUESTS) isLimitReached.value = true
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <h1>Eder</h1>
  <section>
    <p>Describe a piece of furniture and Master Eder will build it for you.</p>
  </section>
  <section>
    <PromptInput :disabled="isLoading || isLimitReached" @submit="onSubmit" />
  </section>
  <section aria-live="polite" aria-atomic="true">
    <p v-if="isLoading" class="loading">Building …</p>
    <p v-if="isLimitReached" class="error" role="alert">Session limit reached.</p>
    <p v-else-if="error" class="error" role="alert">{{ error }}</p>
  </section>
  <section v-if="canvasCode">
    <FurnitureCanvas :code="canvasCode" />
  </section>
</template>
