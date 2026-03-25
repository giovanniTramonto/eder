<script setup lang="ts">
import { ref } from "vue";

defineProps<{ disabled?: boolean }>();
const emit = defineEmits<{ submit: [prompt: string] }>();
const input = ref("");

function onSubmit() {
  if (input.value.trim()) {
    emit("submit", input.value.trim());
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label for="furniture-input" class="sr-only">Furniture description</label>
    <textarea
      id="furniture-input"
      v-model="input"
      placeholder="e.g. “A round wooden table with four legs”"
      rows="3"
      :disabled="disabled"
    />
    <button type="submit" class="button" :disabled="disabled">Build</button>
  </form>
</template>
