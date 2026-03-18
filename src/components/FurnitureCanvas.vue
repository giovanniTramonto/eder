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

  try {
    const iso = (x: number, y: number, z: number) => ({
      x: 300 + (x - z) * 0.866,
      y: 200 + (x + z) * 0.5 - y,
    })
    function poly(points: [number, number, number][]) {
      const pts = points.map(([x, y, z]) => iso(x, y, z))
      ctx.beginPath()
      ctx.moveTo(pts[0].x, pts[0].y)
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.closePath()
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
    new Function('ctx', 'poly', code)(ctx, poly)
  } catch (e) {
    error.value = `Fehler beim Ausführen des Codes: ${(e as Error).message}`
  }
}

onMounted(() => render(props.code))
watch(() => props.code, render)
</script>

<template>
  <div>
    <canvas ref="canvasRef" width="600" height="400" role="img" aria-label="Isometrische Möbelzeichnung" />
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </div>
</template>
