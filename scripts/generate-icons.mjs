// Run: node scripts/generate-icons.mjs
// Requires: npm install canvas

import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'

function createIcon(size, outputPath) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Rounded rect background
  const radius = size * 0.22
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(size - radius, 0)
  ctx.quadraticCurveTo(size, 0, size, radius)
  ctx.lineTo(size, size - radius)
  ctx.quadraticCurveTo(size, size, size - radius, size)
  ctx.lineTo(radius, size)
  ctx.quadraticCurveTo(0, size, 0, size - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, size, size)
  grad.addColorStop(0, '#4C1D95')
  grad.addColorStop(0.5, '#1E3A5F')
  grad.addColorStop(1, '#0D0D1A')
  ctx.fillStyle = grad
  ctx.fill()

  // Glow effect
  const glowGrad = ctx.createRadialGradient(size * 0.35, size * 0.35, 0, size * 0.35, size * 0.35, size * 0.5)
  glowGrad.addColorStop(0, 'rgba(124,58,237,0.4)')
  glowGrad.addColorStop(1, 'rgba(124,58,237,0)')
  ctx.fillStyle = glowGrad
  ctx.fill()

  // Dollar sign text
  ctx.font = `bold ${size * 0.45}px -apple-system, sans-serif`
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(167,139,250,0.8)'
  ctx.shadowBlur = size * 0.08
  ctx.fillText('$', size / 2, size / 2)

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, canvas.toBuffer('image/png'))
  console.log(`✓ Generated ${outputPath} (${size}x${size})`)
}

createIcon(192, 'public/icons/icon-192.png')
createIcon(512, 'public/icons/icon-512.png')
createIcon(180, 'public/icons/apple-touch-icon.png')
console.log('\nAll icons generated!')
