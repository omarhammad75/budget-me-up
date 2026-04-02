## Generate PWA Icons

Run this to create properly sized icons from your design tool, or use a service like:
- https://realfavicongenerator.net
- https://maskable.app

Required files:
- icon-192.png (192×192)
- icon-512.png (512×512)
- apple-touch-icon.png (180×180)

Quick option — create a simple gradient icon with Node:

```js
// scripts/generate-icons.mjs
import { createCanvas } from 'canvas'
import fs from 'fs'

function createIcon(size, path) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, size, size)
  grad.addColorStop(0, '#7C3AED')
  grad.addColorStop(1, '#06B6D4')
  ctx.fillStyle = grad
  ctx.roundRect(0, 0, size, size, size * 0.2)
  ctx.fill()
  ctx.font = `bold ${size * 0.5}px serif`
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('💰', size / 2, size / 2)
  fs.writeFileSync(path, canvas.toBuffer('image/png'))
}

createIcon(192, 'public/icons/icon-192.png')
createIcon(512, 'public/icons/icon-512.png')
createIcon(180, 'public/icons/apple-touch-icon.png')
```

npm install canvas, then node scripts/generate-icons.mjs
