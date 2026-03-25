<script setup lang="ts">
import { ref } from 'vue'
import { MAX_PROMPT_LENGTH } from '#shared/config'

defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ submit: [prompt: string] }>()
const input = ref('')

function onSubmit() {
  if (input.value.trim()) {
    emit('submit', input.value.trim())
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label for="furniture-input" class="sr-only">Furniture description</label>
    <textarea
      id="furniture-input"
      v-model="input"
      placeholder="e.g. “A round table with four legs”"
      rows="3"
      :maxlength="MAX_PROMPT_LENGTH"
      :disabled="disabled"
    />
    <button type="submit" :disabled="disabled">Build</button>
  </form>
</template>
