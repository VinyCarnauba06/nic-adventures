// src/sprites.js

function renderPlayer(ctx, camera, tick) {
  const sx = player.x - camera.x
  const sy = player.y

  if (player.invTimer > 0 && Math.floor(player.invTimer / 0.1) % 2 === 0) return

  ctx.save()

  if (!player.facingRight) {
    ctx.translate(sx + player.w / 2, 0)
    ctx.scale(-1, 1)
    ctx.translate(-(sx + player.w / 2), 0)
  }

  drawSnorlax(ctx, sx - 4, sy - 8, player.frameIndex, tick)

  ctx.restore()
}

function drawSnorlax(ctx, x, y, frame, tick) {
  const bob = frame === 2 ? 0 : Math.sin(tick * 4) * 1.5
  ctx.save()
  ctx.translate(x + 28, y + bob)

  ctx.shadowBlur = 12
  ctx.shadowColor = 'rgba(200, 80, 120, 0.25)'

  // Orelhas
  ctx.fillStyle = '#FF91A4'
  ctx.beginPath(); ctx.arc(-18, -36, 10, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc( 18, -36, 10, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#FF6B9D'
  ctx.beginPath(); ctx.arc(-18, -36, 6, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc( 18, -36, 6, 0, Math.PI * 2); ctx.fill()

  // Corpo
  ctx.fillStyle = '#FF91A4'
  ctx.beginPath()
  ctx.ellipse(0, 0, 26, 30, 0, 0, Math.PI * 2)
  ctx.fill()

  // Barriga
  ctx.fillStyle = '#FFE4EC'
  ctx.beginPath()
  ctx.ellipse(0, 6, 16, 18, 0, 0, Math.PI * 2)
  ctx.fill()

  // Brilho
  ctx.fillStyle = 'rgba(255,255,255,0.28)'
  ctx.beginPath()
  ctx.ellipse(-8, -14, 8, 5, -0.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.shadowBlur = 0

  // Olhos fechados sonolentos
  ctx.strokeStyle = '#CC6080'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath(); ctx.arc(-9, -10, 5, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke()
  ctx.beginPath(); ctx.arc( 9, -10, 5, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke()

  // ZZZ se idle > 5s
  if (idleTimer > 5) {
    const zzz    = ['z', 'zz', 'zzz']
    const zIdx   = Math.floor(tick * 1.5) % 3
    const zAlpha = 0.4 + Math.sin(tick * 3) * 0.3
    ctx.save()
    ctx.globalAlpha = Math.max(0, zAlpha)
    ctx.font = `bold ${14 + zIdx * 3}px Georgia`
    ctx.fillStyle = '#C9B1E8'
    ctx.textAlign = 'left'
    ctx.fillText(zzz[zIdx], 22 + zIdx * 4, -38 - zIdx * 8)
    ctx.restore()
  }

  // Bochechas
  ctx.fillStyle = 'rgba(255, 107, 157, 0.45)'
  ctx.beginPath(); ctx.arc(-14, -4, 7, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc( 14, -4, 7, 0, Math.PI * 2); ctx.fill()

  // Bracinhos
  ctx.fillStyle = '#FF91A4'
  ctx.beginPath(); ctx.ellipse(-30, 2, 7, 10, -0.3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse( 30, 2, 7, 10,  0.3, 0, Math.PI * 2); ctx.fill()

  // Pernas
  ctx.fillStyle = '#FF91A4'
  if (frame === 0) {
    ctx.beginPath(); ctx.ellipse(-10, 28, 8, 11, -0.25, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse( 10, 24, 8, 11,  0.25, 0, Math.PI * 2); ctx.fill()
  } else if (frame === 1) {
    ctx.beginPath(); ctx.ellipse(-10, 24, 8, 11,  0.25, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse( 10, 28, 8, 11, -0.25, 0, Math.PI * 2); ctx.fill()
  } else {
    ctx.beginPath(); ctx.ellipse(-10, 22, 8, 10, -0.5, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse( 10, 22, 8, 10,  0.5, 0, Math.PI * 2); ctx.fill()
  }

  // Laço rosa
  ctx.fillStyle = '#E91E8C'
  ctx.save()
  ctx.translate(0, -44)
  ctx.save(); ctx.rotate(-0.5)
  ctx.beginPath(); ctx.ellipse(-6, 0, 9, 5, 0, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
  ctx.save(); ctx.rotate(0.5)
  ctx.beginPath(); ctx.ellipse( 6, 0, 9, 5, 0, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
  ctx.fillStyle = '#C2185B'
  ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  ctx.restore()
}

function drawPitorro(ctx, x, y, name, tick, isLiam) {
  const yDraw = y + Math.sin(tick * 2.5) * 5
  const glowR = 34 + Math.sin(tick * 3) * 4
  const glowColor = isLiam ? '#FFD700' : '#FF91A4'

  // GLOW
  const grad = ctx.createRadialGradient(x, yDraw, 20, x, yDraw, glowR)
  grad.addColorStop(0, glowColor + '80')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(x, yDraw, glowR, 0, Math.PI * 2)
  ctx.fill()

  // FUR SPIKES
  ctx.fillStyle = '#F5D5A8'
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2
    const baseX = x + Math.cos(angle) * 24
    const baseY = yDraw + Math.sin(angle) * 24
    const tipX  = x + Math.cos(angle) * 32
    const tipY  = yDraw + Math.sin(angle) * 32
    const perpAngle = angle + Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(baseX + Math.cos(perpAngle) * 3, baseY + Math.sin(perpAngle) * 3)
    ctx.lineTo(baseX - Math.cos(perpAngle) * 3, baseY - Math.sin(perpAngle) * 3)
    ctx.lineTo(tipX, tipY)
    ctx.closePath()
    ctx.fill()
  }

  // BODY
  ctx.shadowBlur = 12
  ctx.shadowColor = glowColor
  ctx.fillStyle = '#FFF8F0'
  ctx.beginPath()
  ctx.arc(x, yDraw, 24, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // EARS
  ctx.fillStyle = '#F5D5A8'
  ctx.strokeStyle = '#D4A87A'
  ctx.lineWidth = 1.5
  // left ear (10 o'clock)
  ctx.beginPath()
  ctx.moveTo(x - 16, yDraw - 16)
  ctx.lineTo(x - 24, yDraw - 32)
  ctx.lineTo(x - 6,  yDraw - 20)
  ctx.closePath(); ctx.fill(); ctx.stroke()
  // right ear (2 o'clock)
  ctx.beginPath()
  ctx.moveTo(x + 16, yDraw - 16)
  ctx.lineTo(x + 24, yDraw - 32)
  ctx.lineTo(x + 6,  yDraw - 20)
  ctx.closePath(); ctx.fill(); ctx.stroke()

  // EYES
  ctx.fillStyle = '#1A0A00'
  ctx.beginPath(); ctx.arc(x - 9, yDraw - 4, 6, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + 9, yDraw - 4, 6, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath(); ctx.arc(x - 7, yDraw - 6, 2, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(x + 11, yDraw - 6, 2, 0, Math.PI * 2); ctx.fill()

  // NOSE
  ctx.fillStyle = '#4A2C0A'
  ctx.beginPath()
  ctx.ellipse(x, yDraw + 4, 5, 3.5, 0, 0, Math.PI * 2)
  ctx.fill()

  // MOUTH + TONGUE
  ctx.strokeStyle = '#4A2C0A'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(x, yDraw + 5, 7, 0.1, Math.PI - 0.1)
  ctx.stroke()
  ctx.fillStyle = '#FF9999'
  ctx.beginPath()
  ctx.arc(x, yDraw + 12, 4, 0, Math.PI)
  ctx.fill()

  // NAME LABEL
  ctx.font = '10px Arial'
  const tw = ctx.measureText(name).width
  ctx.globalAlpha = 0.85
  ctx.fillStyle = '#FFFFFF'
  roundRect(ctx, x - tw / 2 - 8, yDraw + 30, tw + 16, 20, 4)
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.fillStyle = '#CC6080'
  ctx.textAlign = 'center'
  ctx.fillText(name, x, yDraw + 44)

  // LIAM SPECIAL — orbiting stars
  if (isLiam) {
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + tick * 1.5
      const sx = x + Math.cos(angle) * 42
      const sy = yDraw + Math.sin(angle) * 42
      drawStar(ctx, sx, sy, 5, '#FFD700', '#FFF0A0')
    }
  }
}

function drawStar(ctx, x, y, outerR, color, highlightColor) {
  const innerR = outerR * 0.5
  ctx.fillStyle = color
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const r     = i % 2 === 0 ? outerR : innerR
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2
    if (i === 0) ctx.moveTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
    else ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
  }
  ctx.closePath()
  ctx.fill()
}

function drawEnemy(ctx, e, tick) {
  const scaleY  = e.squashTimer > 0 ? 0.4 : 1.0
  const shakeX  = Math.sin((e.shakeTimer || 0) * 18) * 2.5
  const eyeScale = 1 + Math.sin(tick * 4) * 0.12

  ctx.save()
  ctx.translate(e.x + e.w / 2, e.y + e.h)
  ctx.scale(1, scaleY)
  ctx.translate(-(e.w / 2), -e.h)
  ctx.translate(shakeX, 0)

  // BODY
  ctx.shadowBlur = 6
  ctx.shadowColor = '#7B5FA0'
  ctx.fillStyle = '#9B7FBF'
  ctx.beginPath()
  ctx.roundRect(0, 0, 32, 32, 5)
  ctx.fill()
  ctx.shadowBlur = 0

  // EYEBROWS
  ctx.strokeStyle = '#FFE4EC'
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(4, 8);   ctx.lineTo(12, 12); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(20, 12); ctx.lineTo(28, 8);  ctx.stroke()

  // EYES (pulsing)
  ctx.fillStyle = '#FF6B9D'
  ctx.save()
  ctx.translate(8, 16); ctx.scale(eyeScale, eyeScale)
  ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
  ctx.save()
  ctx.translate(24, 16); ctx.scale(eyeScale, eyeScale)
  ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // MOUTH
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(16, 26, 5, 0.1, Math.PI - 0.1, true)
  ctx.stroke()

  ctx.restore()

  // LABEL (outside squash transform)
  ctx.fillStyle = '#FFE4EC'
  ctx.font = '7px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('HATER', e.x + 16, e.y + e.h + 10)
}
