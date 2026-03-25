<script setup lang="ts">
import { ref } from 'vue'
import FurnitureCanvas from './components/FurnitureCanvas.vue'
import PromptInput from './components/PromptInput.vue'
import { askLLM } from './composables/useLLM'
import { MAX_SESSION_REQUESTS, SESSION_DURATION_MS } from '#shared/config'

function loadRequestCount(): number {
  const expiry = Number(localStorage.getItem('requestCountExpiry') ?? 0)
  if (Date.now() > expiry) {
    localStorage.removeItem('requestCount')
    localStorage.removeItem('requestCountExpiry')
    return 0
  }
  return Number(localStorage.getItem('requestCount') ?? 0)
}

const sessionDurationHours = SESSION_DURATION_MS / 1000 / 60 / 60

const canvasCode = ref('')
const isLoading = ref(false)
const error = ref('')
const isProduction = !import.meta.env.VITE_OLLAMA_URL
const requestCount = ref(loadRequestCount())
const isLimitReached = ref(isProduction && requestCount.value >= MAX_SESSION_REQUESTS)

async function onSubmit(prompt: string) {
  if (isLimitReached.value) return
  isLoading.value = true
  error.value = ''
  canvasCode.value = ''

  try {
    canvasCode.value = await askLLM(prompt)
    if (requestCount.value === 0) {
      localStorage.setItem('requestCountExpiry', String(Date.now() + SESSION_DURATION_MS))
    }
    requestCount.value++
    localStorage.setItem('requestCount', String(requestCount.value))
    if (isProduction && requestCount.value >= MAX_SESSION_REQUESTS) isLimitReached.value = true
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
    <FurnitureCanvas :code="canvasCode" />
  </section>
  <section>
    <p>Describe a piece of furniture and Master Eder will build it for you.</p>
  </section>
  <section>
    <PromptInput :disabled="isLoading || isLimitReached" @submit="onSubmit" />
  </section>
  <section aria-live="polite" aria-atomic="true">
    <p v-if="isLoading" class="loading">Building …</p>
    <p v-if="isLimitReached" class="error" role="alert">Session limit reached. Please try again in {{ sessionDurationHours }} hour{{ sessionDurationHours === 1 ? '' : 's' }}.</p>
    <p v-else-if="error" class="error" role="alert">{{ error }}</p>
  </section>
</template>
