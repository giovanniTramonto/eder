<script setup lang="ts">
import { ref } from 'vue'
import FurnitureCanvas from './components/FurnitureCanvas.vue'
import PromptInput from './components/PromptInput.vue'
import { askLLM } from './composables/useLLM'

const canvasCode = ref('')
const isLoading = ref(false)
const error = ref('')

async function onSubmit(prompt: string) {
  isLoading.value = true
  error.value = ''
  canvasCode.value = ''

  try {
    canvasCode.value = await askLLM(prompt)
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
    <PromptInput :disabled="isLoading" @submit="onSubmit" />
  </section>
  <section aria-live="polite" aria-atomic="true">
    <p v-if="isLoading" class="loading">Building …</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </section>
  <section v-if="canvasCode">
    <FurnitureCanvas :code="canvasCode" />
  </section>
</template>
