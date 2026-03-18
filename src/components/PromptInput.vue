<script setup lang="ts">
import { ref } from 'vue'

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
    <label for="furniture-input" class="sr-only">Möbelbeschreibung</label>
    <textarea
      id="furniture-input"
      v-model="input"
      placeholder="z.B. „Ein runder Holztisch mit vier Beinen"
      rows="3"
      :disabled="disabled"
    />
    <button type="submit" class="button" :disabled="disabled">Zeichnen</button>
  </form>
</template>
