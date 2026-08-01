const TEXT_STATES = ['AI', 'PRODUCT', 'MEHDI']
const STATE_W = 256
const STATE_H = 64
const CANVAS_W = STATE_W * TEXT_STATES.length
const CANVAS_H = STATE_H

function chamferDistance(grid: Float32Array, w: number, h: number): Float32Array {
  const d = new Float32Array(grid.length)
  for (let i = 0; i < grid.length; i++) d[i] = grid[i]

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (x > 0) d[i] = Math.min(d[i], d[i - 1] + 1)
      if (y > 0) d[i] = Math.min(d[i], d[(y - 1) * w + x] + 1)
      if (x > 0 && y > 0) d[i] = Math.min(d[i], d[(y - 1) * w + (x - 1)] + 1.414)
      if (x < w - 1 && y > 0) d[i] = Math.min(d[i], d[(y - 1) * w + (x + 1)] + 1.414)
    }
  }

  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x
      if (x < w - 1) d[i] = Math.min(d[i], d[i + 1] + 1)
      if (y < h - 1) d[i] = Math.min(d[i], d[(y + 1) * w + x] + 1)
      if (x < w - 1 && y < h - 1) d[i] = Math.min(d[i], d[(y + 1) * w + (x + 1)] + 1.414)
      if (x > 0 && y < h - 1) d[i] = Math.min(d[i], d[(y + 1) * w + (x - 1)] + 1.414)
    }
  }

  return d
}

export function generateTextSDF(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < TEXT_STATES.length; i++) {
    const text = TEXT_STATES[i]
    const fontSize = text === 'PRODUCT' ? 40 : 50
    ctx.font = `bold ${fontSize}px "Space Grotesk", system-ui, sans-serif`
    const cx = i * STATE_W + STATE_W / 2
    const cy = STATE_H / 2
    ctx.fillText(text, cx, cy)
  }

  const imageData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H)
  const pixels = new Float32Array(CANVAS_W * CANVAS_H)
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = imageData.data[i * 4] / 255
  }

  const initInside = new Float32Array(pixels.length)
  const initOutside = new Float32Array(pixels.length)
  for (let i = 0; i < pixels.length; i++) {
    initInside[i] = pixels[i] > 0.5 ? 0 : Infinity
    initOutside[i] = pixels[i] <= 0.5 ? 0 : Infinity
  }

  const dInside = chamferDistance(initInside, CANVAS_W, CANVAS_H)
  const dOutside = chamferDistance(initOutside, CANVAS_W, CANVAS_H)

  const signed = new Float32Array(pixels.length)
  for (let i = 0; i < pixels.length; i++) {
    signed[i] = pixels[i] > 0.5 ? dInside[i] : -dOutside[i]
  }

  let maxDist = 0
  for (let i = 0; i < signed.length; i++) {
    const abs = Math.abs(signed[i])
    if (abs > maxDist) maxDist = abs
  }

  const outImageData = ctx.createImageData(CANVAS_W, CANVAS_H)
  for (let i = 0; i < signed.length; i++) {
    const normalized = signed[i] / maxDist * 0.5 + 0.5
    const v = Math.max(0, Math.min(1, normalized)) * 255
    outImageData.data[i * 4] = v
    outImageData.data[i * 4 + 1] = v
    outImageData.data[i * 4 + 2] = v
    outImageData.data[i * 4 + 3] = 255
  }

  const outCanvas = document.createElement('canvas')
  outCanvas.width = CANVAS_W
  outCanvas.height = CANVAS_H
  outCanvas.getContext('2d')!.putImageData(outImageData, 0, 0)
  return outCanvas
}
