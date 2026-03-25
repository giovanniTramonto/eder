<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{ code: string }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const error = ref('')

function render(code: string | undefined) {
  error.value = ''
  if (!code || !canvasRef.value) return

  const ctx = canvasRef.value.getContext('2d')!
  ctx.clearRect(0, 0, 600, 400)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'

  try {
    new Function('ctx', code)(ctx)
  } catch (e) {
    error.value = `Error executing code: ${(e as Error).message}`
  }
}

onMounted(() => render(props.code))
watch(() => props.code, render)
</script>

<template>
  <div>
    <canvas ref="canvasRef" width="600" height="400" role="img" aria-label="Eder's blueprint" />
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </div>
</template>
