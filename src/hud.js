// src/hud.js

/** @type {Array<{text:string, timer:number, maxTimer:number, color:string}>} */
const toasts = []

/**
 * @param {string} text
 * @param {string} [color='#FF91A4']
 * @param {number} [duration=2.5]
 */
function showToast(text, color = '#FF91A4', duration = 2.5) {
  toasts.push({ text, timer: duration, maxTimer: duration, color })
}

function updateToasts(dt) {
  for (let i = toasts.length - 1; i >= 0; i--) {
    toasts[i].timer -= dt
    if (toasts[i].timer <= 0) toasts.splice(i, 1)
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function renderToasts(ctx) {
  toasts.forEach((t, i) => {
    const alpha = t.timer < 0.5 ? t.timer / 0.5 : 1
    const y     = 80 + i * 44
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.font = 'bold 17px Georgia'
    const tw = ctx.measureText(t.text).width
    ctx.fillStyle = t.color
    roundRect(ctx, CANVAS_W / 2 - tw / 2 - 16, y - 20, tw + 32, 34, 17)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.fillText(t.text, CANVAS_W / 2, y)
    ctx.restore()
  })
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function renderHUD(ctx) {
  // 1. HUD background bar
  ctx.fillStyle = 'rgba(255,255,255,0.72)'
  ctx.fillRect(0, 0, CANVAS_W, 44)

  // 2. Pitorro counter
  ctx.font = 'bold 16px Georgia'
  ctx.fillStyle = '#C2185B'
  ctx.textAlign = 'left'
  ctx.fillText(`🐾 ${collectedCount}/5`, 16, 28)
  const dotStartX = 90
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(dotStartX + i * 22, 22, 8, 0, Math.PI * 2)
    ctx.fillStyle = collectables[i].collected ? '#FF91A4' : '#DDDDDD'
    ctx.fill()
  }

  // 3. HP hearts
  for (let i = 0; i < 3; i++) {
    drawHUDHeart(ctx, CANVAS_W / 2 - 36 + i * 36, 22, player.hp > i)
  }

  // 4. Name
  ctx.font = 'italic 16px Georgia'
  ctx.fillStyle = '#C2185B'
  ctx.textAlign = 'right'
  ctx.fillText('Amor 💕', CANVAS_W - 56, 28)

  // 5. Mute button
  ctx.font = '20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(muted ? '🔇' : '🔊', CANVAS_W - 28, 28)
}

function drawHUDHeart(ctx, x, y, alive) {
  const s = 10
  ctx.fillStyle = alive ? '#E91E8C' : '#777777'
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(0, s * 0.3)
  ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.2, 0, s * 0.8)
  ctx.bezierCurveTo( s, s * 0.2, s * 0.5, -s * 0.2, 0, s * 0.3)
  ctx.fill()
  ctx.restore()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x,     y + h, x,         y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x,     y,     x + r,     y)
  ctx.closePath()
}
