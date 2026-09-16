// src/sprites.js

function renderPlayer(ctx, camera, tick) {
  const sx = player.x - camera.x
  const sy = player.y

  if (player.invTimer > 0 && Math.floor(player.invTimer / 0.1) % 2 === 0) return

  ctx.save()

  const cx     = sx + player.w / 2
  const feetY  = sy + player.h - 10

  // squash & stretch (visual)
  let scaleX = 1
  let scaleY = 1
  if (!player.onGround) {
    const stretch = 1 + Math.min(Math.abs(player.vy) / 2400, 0.12)
    scaleY = stretch
    scaleX = 1 / (stretch * 0.92 + 0.08)
  } else if (player.landSquash > 0) {
    const k = player.landSquash / 0.18
    scaleY = 1 - 0.18 * k
    scaleX = 1 + 0.16 * k
  }

  ctx.translate(cx, feetY)
  ctx.scale(scaleX * (player.facingRight ? 1 : -1), scaleY)
  ctx.translate(-cx, -feetY)

  drawSnorlax(ctx, sx - 4, sy - 8, player.frameIndex, tick)

  ctx.restore()
}

function drawSnorlax(ctx, x, y, frame, tick) {
  const bob     = frame === 2 ? 0 : Math.sin(tick * 4) * 1.5
  const breathe = 1 + Math.sin(tick * 2) * 0.02
  ctx.save()

  // Aura quente (rim light)
  const aura = ctx.createRadialGradient(x + 28, y, 12, x + 28, y, 78)
  aura.addColorStop(0, 'rgba(255, 133, 162, 0.22)')
  aura.addColorStop(1, 'rgba(255, 133, 162, 0)')
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(x + 28, y, 78, 0, Math.PI * 2)
  ctx.fill()

  ctx.translate(x + 28, y + bob)

  const OUTLINE = 'rgba(186, 84, 124, 0.5)'

  // ── Orelhas
  const earGrad = ctx.createLinearGradient(0, -48, 0, -26)
  earGrad.addColorStop(0, '#FFB9CC')
  earGrad.addColorStop(1, '#F27DA0')
  ctx.fillStyle = earGrad
  ;[-18, 18].forEach(ex => {
    ctx.beginPath()
    ctx.arc(ex, -36, 10, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = '#D95F8C'
  ;[-18, 18].forEach(ex => {
    ctx.beginPath()
    ctx.arc(ex, -36, 5.5, 0, Math.PI * 2)
    ctx.fill()
  })

  // ── Corpo (gradiente + contorno)
  const body = ctx.createRadialGradient(-8, -12, 6, 0, 6, 44)
  body.addColorStop(0, '#FFC7D8')
  body.addColorStop(0.5, '#FF9DB4')
  body.addColorStop(1, '#F0779F')
  ctx.fillStyle = body
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(0, 2, 26, 30 * breathe, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // ── Barriga
  const belly = ctx.createRadialGradient(-4, 0, 4, 0, 8, 20)
  belly.addColorStop(0, '#FFF7FA')
  belly.addColorStop(1, '#FFDCE8')
  ctx.fillStyle = belly
  ctx.beginPath()
  ctx.ellipse(0, 8, 15, 17, 0, 0, Math.PI * 2)
  ctx.fill()

  // ── Brilho especular
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.beginPath()
  ctx.ellipse(-9, -15, 8, 5, -0.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.beginPath()
  ctx.ellipse(12, -18, 4, 2.5, 0.4, 0, Math.PI * 2)
  ctx.fill()

  // ── Olhos sonolentos com cilhinhos
  ctx.strokeStyle = '#B0496F'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ;[-1, 1].forEach(s => {
    const ex = 9 * s
    ctx.beginPath()
    ctx.arc(ex, -10, 5, Math.PI * 0.15, Math.PI * 0.85)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(ex - s * 4.5, -13)
    ctx.lineTo(ex - s * 7.5, -16)
    ctx.stroke()
  })

  // ZZZ se idle > 5s
  if (idleTimer > 5) {
    const zzz    = ['z', 'zz', 'zzz']
    const zIdx   = Math.floor(tick * 1.5) % 3
    const zAlpha = 0.4 + Math.sin(tick * 3) * 0.3
    ctx.save()
    ctx.globalAlpha = Math.max(0, zAlpha)
    ctx.font = `bold ${14 + zIdx * 3}px Georgia`
    ctx.fillStyle = '#D9C2F0'
    ctx.textAlign = 'left'
    ctx.fillText(zzz[zIdx], 22 + zIdx * 4, -38 - zIdx * 8)
    ctx.restore()
  }

  // ── Bochechas (blush suave)
  ;[-14, 14].forEach(bx => {
    const blush = ctx.createRadialGradient(bx, -4, 1, bx, -4, 8)
    blush.addColorStop(0, 'rgba(255, 90, 140, 0.5)')
    blush.addColorStop(1, 'rgba(255, 90, 140, 0)')
    ctx.fillStyle = blush
    ctx.beginPath()
    ctx.arc(bx, -4, 8, 0, Math.PI * 2)
    ctx.fill()
  })

  // ── Bracinhos com patinhas
  ctx.fillStyle = '#FF9DB4'
  ctx.strokeStyle = OUTLINE
  ctx.lineWidth = 1.5
  ;[[-30, 4, -0.35], [30, 4, 0.35]].forEach(([ax, ay, rot]) => {
    ctx.beginPath()
    ctx.ellipse(ax, ay, 7, 11, rot, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  })
  ctx.fillStyle = '#FFD3E0'
  ;[[-32, 11], [32, 11]].forEach(([px, py]) => {
    ctx.beginPath()
    ctx.ellipse(px, py, 3.5, 2.5, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  // ── Pernas com patinhas
  const legs = frame === 0
    ? [[-10, 28, -0.25], [10, 24, 0.25]]
    : frame === 1
      ? [[-10, 24, 0.25], [10, 28, -0.25]]
      : [[-10, 22, -0.5], [10, 22, 0.5]]
  legs.forEach(([lx, ly, rot]) => {
    ctx.fillStyle = '#FF9DB4'
    ctx.beginPath()
    ctx.ellipse(lx, ly, 8, 11, rot, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#FFD3E0'
    ctx.beginPath()
    ctx.ellipse(lx + rot * 4, ly + 5, 4, 2.5, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  // ── Laço com gradiente e nó
  const bowGrad = ctx.createLinearGradient(0, -50, 0, -38)
  bowGrad.addColorStop(0, '#FF8FB8')
  bowGrad.addColorStop(1, '#E3558B')
  ctx.fillStyle = bowGrad
  ctx.save()
  ctx.translate(0, -44)
  ctx.save(); ctx.rotate(-0.5)
  ctx.beginPath()
  ctx.ellipse(-7, 0, 10, 5.5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.save(); ctx.rotate(0.5)
  ctx.beginPath()
  ctx.ellipse(7, 0, 10, 5.5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
  ctx.fillStyle = '#C2185B'
  ctx.beginPath()
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.beginPath()
  ctx.arc(-1.2, -1.2, 1.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.restore()
}

function drawPitorro(ctx, x, y, name, tick, isLiam) {
  const yDraw     = y + Math.sin(tick * 2.5) * 5
  const glowR     = 38 + Math.sin(tick * 3) * 4
  const glowColor = isLiam ? '#FFD700' : '#FF91A4'
  const R         = 24

  // GLOW
  const grad = ctx.createRadialGradient(x, yDraw, 18, x, yDraw, glowR)
  grad.addColorStop(0, isLiam ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 145, 164, 0.45)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(x, yDraw, glowR, 0, Math.PI * 2)
  ctx.fill()

  // FUR — fluff arredondado
  ctx.fillStyle = '#F0D2A6'
  ctx.beginPath()
  const spikes = 22
  for (let i = 0; i < spikes; i++) {
    const a0 = (i / spikes) * Math.PI * 2
    const a1 = ((i + 0.5) / spikes) * Math.PI * 2
    const a2 = ((i + 1) / spikes) * Math.PI * 2
    const r0 = R - 4
    const tip = R + 7
    const x0 = x + Math.cos(a0) * r0, y0 = yDraw + Math.sin(a0) * r0
    const xT = x + Math.cos(a1) * tip, yT = yDraw + Math.sin(a1) * tip
    const x2 = x + Math.cos(a2) * r0, y2 = yDraw + Math.sin(a2) * r0
    if (i === 0) ctx.moveTo(x0, y0)
    ctx.quadraticCurveTo((x0 + xT) / 2, (y0 + yT) / 2, xT, yT)
    ctx.quadraticCurveTo((x2 + xT) / 2, (y2 + yT) / 2, x2, y2)
  }
  ctx.closePath()
  ctx.fill()

  // BODY (gradiente cremoso + glow)
  const body = ctx.createRadialGradient(x - 7, yDraw - 9, 5, x, yDraw, R + 2)
  body.addColorStop(0, '#FFFCF6')
  body.addColorStop(0.6, '#FBF0DF')
  body.addColorStop(1, '#EDD8B4')
  ctx.shadowBlur = 14
  ctx.shadowColor = glowColor
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(x, yDraw, R, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.strokeStyle = 'rgba(186, 138, 84, 0.4)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // EARS (triângulos arredondados)
  const earGrad = ctx.createLinearGradient(x, yDraw - 32, x, yDraw - 12)
  earGrad.addColorStop(0, '#F4D8AC')
  earGrad.addColorStop(1, '#D9A878')
  ctx.fillStyle = earGrad
  ctx.strokeStyle = 'rgba(170, 120, 70, 0.5)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x - 14, yDraw - 13)
  ctx.quadraticCurveTo(x - 22, yDraw - 20, x - 23, yDraw - 30)
  ctx.quadraticCurveTo(x - 16, yDraw - 27, x - 6, yDraw - 19)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + 14, yDraw - 13)
  ctx.quadraticCurveTo(x + 22, yDraw - 20, x + 23, yDraw - 30)
  ctx.quadraticCurveTo(x + 16, yDraw - 27, x + 6, yDraw - 19)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  // inner ears
  ctx.fillStyle = 'rgba(201, 143, 94, 0.45)'
  ctx.beginPath()
  ctx.moveTo(x - 14, yDraw - 15)
  ctx.quadraticCurveTo(x - 19, yDraw - 20, x - 20, yDraw - 26)
  ctx.quadraticCurveTo(x - 15, yDraw - 23, x - 9, yDraw - 18)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(x + 14, yDraw - 15)
  ctx.quadraticCurveTo(x + 19, yDraw - 20, x + 20, yDraw - 26)
  ctx.quadraticCurveTo(x + 15, yDraw - 23, x + 9, yDraw - 18)
  ctx.closePath()
  ctx.fill()

  // EYES (grandes e brilhantes com gloss duplo)
  ;[-9, 9].forEach(ex => {
    const eg = ctx.createRadialGradient(x + ex - 1, yDraw - 6, 1, x + ex, yDraw - 4, 6)
    eg.addColorStop(0, '#5A3416')
    eg.addColorStop(1, '#1F0E02')
    ctx.fillStyle = eg
    ctx.beginPath()
    ctx.arc(x + ex, yDraw - 4, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(x + ex - 2, yDraw - 6.5, 2.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.arc(x + ex + 2.5, yDraw - 1.5, 1.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
    // cilhinhos
    ctx.strokeStyle = '#3A2008'
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x + ex - 4, yDraw - 10)
    ctx.lineTo(x + ex - 6.5, yDraw - 12.5)
    ctx.moveTo(x + ex + 4, yDraw - 10)
    ctx.lineTo(x + ex + 6.5, yDraw - 12.5)
    ctx.stroke()
  })

  // NOSE
  ctx.fillStyle = '#4A2C0A'
  ctx.beginPath()
  ctx.ellipse(x, yDraw + 4, 5, 3.5, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.beginPath()
  ctx.ellipse(x - 1.5, yDraw + 3, 1.8, 1, 0, 0, Math.PI * 2)
  ctx.fill()

  // MOUTH + TONGUE
  ctx.strokeStyle = '#4A2C0A'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(x, yDraw + 5, 7, 0.15, Math.PI - 0.15)
  ctx.stroke()
  ctx.fillStyle = '#FF8FA0'
  ctx.beginPath()
  ctx.arc(x, yDraw + 12, 4, 0, Math.PI)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.beginPath()
  ctx.ellipse(x - 1, yDraw + 13, 1.5, 1, 0, 0, Math.PI * 2)
  ctx.fill()

  // Bochechas rosadas
  ;[-15, 15].forEach(cx2 => {
    const cg = ctx.createRadialGradient(x + cx2, yDraw + 2, 1, x + cx2, yDraw + 2, 6)
    cg.addColorStop(0, 'rgba(255, 130, 130, 0.4)')
    cg.addColorStop(1, 'rgba(255, 130, 130, 0)')
    ctx.fillStyle = cg
    ctx.beginPath()
    ctx.arc(x + cx2, yDraw + 2, 6, 0, Math.PI * 2)
    ctx.fill()
  })

  // NAME LABEL — vidro escuro com borda neon
  if (name) {
    ctx.font = '10px Arial'
    const tw = ctx.measureText(name).width
    ctx.fillStyle = 'rgba(18, 10, 36, 0.75)'
    roundRect(ctx, x - tw / 2 - 8, yDraw + 30, tw + 16, 20, 4)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 134, 162, 0.55)'
    ctx.lineWidth = 1
    roundRect(ctx, x - tw / 2 - 8, yDraw + 30, tw + 16, 20, 4)
    ctx.stroke()
    ctx.fillStyle = '#FFD9E3'
    ctx.textAlign = 'center'
    ctx.fillText(name, x, yDraw + 44)
  }

  // LIAM SPECIAL — orbiting stars
  if (isLiam) {
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + tick * 1.5
      const sx = x + Math.cos(angle) * 44
      const sy = yDraw + Math.sin(angle) * 44
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
  const squashed = e.squashTimer > 0
  const scaleY   = squashed ? 0.4 : 1.0
  const scaleX   = squashed ? 1.35 : 1.0
  const shakeX   = Math.sin((e.shakeTimer || 0) * 18) * 2.5
  const eyeScale = 1 + Math.sin(tick * 4) * 0.1
  const walkBob  = e.alive && !squashed ? Math.sin(tick * 9) * 1.2 : 0

  ctx.save()
  ctx.translate(e.x + e.w / 2, e.y + e.h)
  ctx.scale(scaleX, scaleY)
  ctx.translate(-(e.w / 2), -e.h)
  ctx.translate(shakeX, -walkBob)

  // Chifres
  ctx.fillStyle = '#3E2B5C'
  ;[[7, -1], [25, 1]].forEach(([hx, s]) => {
    ctx.beginPath()
    ctx.moveTo(hx - 3, 5)
    ctx.lineTo(hx + s * 5, -5)
    ctx.lineTo(hx + 4, 6)
    ctx.closePath()
    ctx.fill()
  })

  // BODY (gradiente + glow + contorno)
  const g = ctx.createLinearGradient(0, 0, 0, 32)
  g.addColorStop(0, '#B08CD8')
  g.addColorStop(0.55, '#9B7FBF')
  g.addColorStop(1, '#6F5492')
  ctx.shadowBlur = 10
  ctx.shadowColor = '#B58BE0'
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.roundRect(0, 2, 32, 30, 7)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.strokeStyle = 'rgba(46, 26, 68, 0.6)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Brilho
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)'
  ctx.beginPath()
  ctx.roundRect(4, 5, 24, 6, 3)
  ctx.fill()

  // Sobrancelhas grossas
  ctx.strokeStyle = '#2E1A44'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(5, 11);  ctx.lineTo(13, 15); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(27, 11); ctx.lineTo(19, 15); ctx.stroke()

  // Olhos brilhantes com pupilas
  ctx.fillStyle = '#FF5E8A'
  ctx.shadowBlur = 6
  ctx.shadowColor = '#FF5E8A'
  ;[9, 23].forEach(ex => {
    ctx.save()
    ctx.translate(ex, 18)
    ctx.scale(eyeScale, eyeScale)
    ctx.beginPath()
    ctx.arc(0, 0, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })
  ctx.shadowBlur = 0
  ctx.fillStyle = '#2A1030'
  ;[9, 23].forEach(ex => {
    ctx.beginPath()
    ctx.arc(ex - 0.8, 18, 1.6, 0, Math.PI * 2)
    ctx.fill()
  })

  // Boca — dentes cerrados
  ctx.strokeStyle = '#2E1A44'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(10, 25)
  ctx.lineTo(13, 23.5)
  ctx.lineTo(16, 25)
  ctx.lineTo(19, 23.5)
  ctx.lineTo(22, 25)
  ctx.stroke()

  // Pés
  ctx.fillStyle = '#3E2B5C'
  ctx.beginPath(); ctx.ellipse(8, 31, 4.5, 3, 0, 0, Math.PI * 2);  ctx.fill()
  ctx.beginPath(); ctx.ellipse(24, 31, 4.5, 3, 0, 0, Math.PI * 2); ctx.fill()

  ctx.restore()

  // LABEL (fora do transform de squash)
  ctx.fillStyle = 'rgba(255, 228, 236, 0.8)'
  ctx.font = '7px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('HATER', e.x + 16, e.y + e.h + 10)
}
