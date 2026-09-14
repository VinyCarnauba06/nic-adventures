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
    const y     = 88 + i * 44
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.font = 'bold 17px Georgia'
    const tw = ctx.measureText(t.text).width
    // pílula de vidro escuro
    ctx.fillStyle = 'rgba(18, 10, 36, 0.82)'
    roundRect(ctx, CANVAS_W / 2 - tw / 2 - 18, y - 20, tw + 36, 36, 18)
    ctx.fill()
    // borda brilhante na cor do toast
    ctx.shadowBlur = 10
    ctx.shadowColor = t.color
    ctx.strokeStyle = t.color
    ctx.lineWidth = 1.5
    roundRect(ctx, CANVAS_W / 2 - tw / 2 - 18, y - 20, tw + 36, 36, 18)
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.fillText(t.text, CANVAS_W / 2, y + 1)
    ctx.restore()
  })
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function renderHUD(ctx) {
  // 1. HUD glass bar
  ctx.fillStyle = 'rgba(14, 8, 30, 0.55)'
  ctx.fillRect(0, 0, CANVAS_W, 64)
  ctx.strokeStyle = 'rgba(255, 134, 162, 0.28)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, 64.5)
  ctx.lineTo(CANVAS_W, 64.5)
  ctx.stroke()

  // 2. Pitorro counter
  ctx.font = 'bold 16px Georgia'
  ctx.textAlign = 'left'
  ctx.shadowBlur = 10
  ctx.shadowColor = 'rgba(255, 107, 157, 0.85)'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(`🐾 ${collectedCount}/5`, 16, 28)
  ctx.shadowBlur = 0

  const dotStartX = 100
  const specials = collectables.filter(c => c.special)
  for (let i = 0; i < 5; i++) {
    const done = specials[i] && specials[i].collected
    ctx.beginPath()
    ctx.arc(dotStartX + i * 22, 22, 8, 0, Math.PI * 2)
    if (done) {
      ctx.shadowBlur = 12
      ctx.shadowColor = '#FF6B9D'
      ctx.fillStyle = '#FF85A2'
      ctx.fill()
      ctx.shadowBlur = 0
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.10)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 134, 162, 0.45)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }

  // 2b. Hater counter
  const defeated = enemies.filter(e => !e.alive).length
  const total    = enemies.length
  ctx.font = 'bold 14px Georgia'
  ctx.textAlign = 'left'
  ctx.shadowBlur = 8
  ctx.shadowColor = 'rgba(201, 177, 232, 0.8)'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(`👊 ${defeated}/${total} haters`, 16, 52)
  ctx.shadowBlur = 0

  // 3. HP hearts
  for (let i = 0; i < 3; i++) {
    drawHUDHeart(ctx, CANVAS_W / 2 - 36 + i * 36, 22, player.hp > i)
  }

  // 4. Name
  ctx.font = 'italic 16px Georgia'
  ctx.textAlign = 'right'
  ctx.shadowBlur = 8
  ctx.shadowColor = 'rgba(255, 107, 157, 0.8)'
  ctx.fillStyle = '#FFE4EC'
  ctx.fillText('Amor 💕', CANVAS_W - 56, 28)
  ctx.shadowBlur = 0

  // 5. Mute button
  ctx.font = '20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(muted ? '🔇' : '🔊', CANVAS_W - 28, 28)
}

function drawHUDHeart(ctx, x, y, alive) {
  const s = 10
  ctx.save()
  ctx.translate(x, y)
  if (alive) {
    ctx.shadowBlur = 10
    ctx.shadowColor = '#FF4D6D'
    ctx.fillStyle = '#FF4D6D'
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  }
  ctx.beginPath()
  ctx.moveTo(0, s * 0.3)
  ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.2, 0, s * 0.8)
  ctx.bezierCurveTo( s, s * 0.2,  s * 0.5, -s * 0.2, 0, s * 0.3)
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
  ctx.quadraticCurveTo(x,     y,     x + r, y)
  ctx.closePath()
}
