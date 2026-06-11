// src/screens.js

let letterTimer = 0
let letterIndex = 0
const LETTER_TEXT = 'Oi Amor, fiz esse joguinho especialmente pra você. Colete os 5 pitorros e descubra seu presente! 💕 — Viny'
let letterDone = false

let winTypewriterIndex = 0
let winTypewriterTimer = 0
let winCardY = -300
let winLine2Started = false
let winLine2Index = 0
let winLine2Timer = 0
let winShowButton = false
let winShowButtonTimer = 0

// ─── PAUSE SCREEN (collect moment) ───────────────────────────────────────────
let pauseScreen = {
  active: false,
  timer: 0,
  duration: 2.2,
  name: '',
  index: 0,
  isLiam: false
}

function showCollectPause(name, index, isLiam) {
  pauseScreen.active = true
  pauseScreen.timer = 0
  pauseScreen.name = name
  pauseScreen.index = index
  pauseScreen.isLiam = isLiam
}

function updatePauseScreen(dt) {
  if (!pauseScreen.active) return
  pauseScreen.timer += dt
  if (pauseScreen.timer >= pauseScreen.duration) {
    pauseScreen.active = false
  }
}

function renderPauseScreen(ctx, tick) {
  if (!pauseScreen.active) return

  const alpha = Math.min(pauseScreen.timer * 4, 1) * 0.72
  ctx.save()
  ctx.fillStyle = pauseScreen.isLiam
    ? `rgba(20, 10, 0, ${alpha})`
    : `rgba(180, 20, 80, ${alpha})`
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  const progress = pauseScreen.timer / pauseScreen.duration
  const fadeIn = Math.min(pauseScreen.timer * 5, 1)
  const fadeOut = progress > 0.75 ? 1 - ((progress - 0.75) / 0.25) : 1
  const opacity = fadeIn * fadeOut

  ctx.globalAlpha = opacity

  // Pitorro grande centralizado
  drawPitorro(ctx, CANVAS_W / 2, CANVAS_H / 2 - 80, pauseScreen.name, tick, pauseScreen.isLiam)

  // Nome do membro
  ctx.textAlign = 'center'
  ctx.font = 'bold 32px Georgia'
  ctx.fillStyle = pauseScreen.isLiam ? '#FFD700' : '#FFFFFF'
  ctx.shadowBlur = 20
  ctx.shadowColor = pauseScreen.isLiam ? '#FFD700' : '#FF91A4'
  ctx.fillText(pauseScreen.name, CANVAS_W / 2, CANVAS_H / 2 + 20)

  // Contador
  ctx.font = 'italic 18px Georgia'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.shadowBlur = 0
  ctx.fillText(`${pauseScreen.index}/5 encontrados`, CANVAS_W / 2, CANVAS_H / 2 + 52)

  // Frase inspirada nas músicas
  const phrases = [
    '"Walk in your rainbow paradise..." 🌈\n— Adore You, Harry Styles',
    '"Climbing up the walls just to get to you..." 🖤\n— PILLOWTALK, Zayn Malik',
    '"You\'re the only one I need to put a little love on me..." 🍀\n— Put A Little Love On Me, Niall Horan',
    '"Nothing can come between you and I..." 🌟\n— You & I, One Direction',
    '"Forever in our hearts." ⭐\n— Liam Payne, 1993–2024',
  ]

  const lines = phrases[pauseScreen.index - 1].split('\n')
  ctx.shadowBlur = 8
  ctx.shadowColor = pauseScreen.isLiam ? 'rgba(255,215,0,0.5)' : 'rgba(255,145,164,0.5)'
  ctx.font = 'italic 16px Georgia'
  ctx.fillStyle = pauseScreen.isLiam ? '#FFD700' : '#FFE4EC'
  ctx.fillText(lines[0], CANVAS_W / 2, CANVAS_H / 2 + 90)
  ctx.font = '13px Arial'
  ctx.fillStyle = pauseScreen.isLiam ? 'rgba(255,215,0,0.8)' : 'rgba(255,228,236,0.7)'
  ctx.fillText(lines[1], CANVAS_W / 2, CANVAS_H / 2 + 114)

  // Barra de progresso na base
  const barW = 300
  const barX = CANVAS_W / 2 - barW / 2
  const barY = CANVAS_H - 60
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.beginPath()
  roundRect(ctx, barX, barY, barW, 6, 3)
  ctx.fill()
  ctx.fillStyle = pauseScreen.isLiam ? '#FFD700' : '#FF91A4'
  ctx.beginPath()
  roundRect(ctx, barX, barY, barW * progress, 6, 3)
  ctx.fill()

  ctx.restore()
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
}

const WIN_LINE1 = 'Amor, você ganhou um Gift Card na Sephora! 💄✨'
const WIN_LINE2 = 'Feliz Dia dos Namorados, mi amor você merece muito mais! 🩷'

function resetWinScreen() {
  winTypewriterIndex = 0
  winTypewriterTimer = 0
  winCardY = -300
  winLine2Started = false
  winLine2Index = 0
  winLine2Timer = 0
  winShowButton = false
  winShowButtonTimer = 0
}

/**
 * @param {number} dt
 * @param {number} winTimer
 */
function updateWinScreen(dt, winTimer) {
  // slide gift card in after 1.5s
  if (winTimer > 1.5) {
    const targetCardY = 180
    winCardY += (targetCardY - winCardY) * 6 * dt
  }

  // typewriter line 1 after 2.5s
  if (winTimer > 2.5 && winTypewriterIndex < WIN_LINE1.length) {
    winTypewriterTimer += dt
    if (winTypewriterTimer > 0.04) {
      winTypewriterTimer = 0
      winTypewriterIndex++
    }
  }

  // line 2 starts after line 1 complete + 0.5s
  const line1DoneTime = 2.5 + WIN_LINE1.length * 0.04 + 0.5
  if (winTypewriterIndex >= WIN_LINE1.length && winTimer > line1DoneTime) {
    winLine2Started = true
    if (winLine2Index < WIN_LINE2.length) {
      winLine2Timer += dt
      if (winLine2Timer > 0.04) {
        winLine2Timer = 0
        winLine2Index++
      }
    }
  }

  // show button after line 2 complete + 0.3s
  if (winLine2Started && winLine2Index >= WIN_LINE2.length) {
    winShowButtonTimer += dt
    if (winShowButtonTimer > 0.3) winShowButton = true
  }

  // heart rain
  if (winTimer > 1.2) spawnWinRain(CANVAS_W)

  // gold star particles from card
  if (winTimer > 1.5 && Math.random() < 0.15) {
    const cX = CANVAS_W / 2 - 180
    spawnParticles(
      cX + Math.random() * 360,
      winCardY + Math.random() * 220,
      'star', 1
    )
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} winTimer
 * @param {number} tick
 */
function renderWinScreen(ctx, winTimer, tick) {
  // 1. FADE OVERLAY
  if (winTimer < 1.0) {
    ctx.fillStyle = `rgba(0,0,0,${winTimer})`
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    return
  }

  // 2. BACKGROUND
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
  bg.addColorStop(0, '#C2185B')
  bg.addColorStop(1, '#E91E8C')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // shimmer stars
  for (let i = 0; i < 50; i++) {
    const sx = ((i * 137 + 50) % CANVAS_W)
    const sy = ((i * 83 + 30) % CANVAS_H)
    const alpha = 0.3 + 0.4 * Math.sin(tick * 2 + i)
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // 3. PARTICLES drawn from main.js

  // Bear with heart — appears before card slides in
  if (winTimer >= 1.0 && winTimer < 2.5) {
    const appearAlpha = Math.min((winTimer - 1.0) * 2, 1)
    const bearScale = 0.8 + Math.min((winTimer - 1.0) * 0.5, 0.4)
    const heartBeat = 1 + Math.sin(tick * 6) * 0.15

    ctx.save()
    ctx.globalAlpha = appearAlpha

    ctx.translate(CANVAS_W / 2, 180)
    ctx.scale(bearScale, bearScale)
    ctx.translate(-CANVAS_W / 2, -180)
    drawSnorlax(ctx, CANVAS_W / 2 - 28, 150, 0, tick)

    ctx.translate(CANVAS_W / 2, 130)
    ctx.scale(heartBeat, heartBeat)
    ctx.fillStyle = '#FF91A4'
    ctx.shadowBlur = 16
    ctx.shadowColor = '#FF91A4'
    ctx.beginPath()
    ctx.arc(-8, 0, 10, Math.PI, 0)
    ctx.arc(8, 0, 10, Math.PI, 0)
    ctx.bezierCurveTo(18, 6, 0, 22, 0, 22)
    ctx.bezierCurveTo(0, 22, -18, 6, -18, 0)
    ctx.fill()
    ctx.shadowBlur = 0

    ctx.restore()
  }

  // 4. GIFT CARD
  const cardX = CANVAS_W / 2 - 180
  const cardY = winCardY
  ctx.shadowBlur = 30
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.fillStyle = '#111111'
  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 2
  roundRect(ctx, cardX, cardY, 360, 220, 12)
  ctx.fill()
  ctx.stroke()
  ctx.shadowBlur = 0

  // ribbon horizontal
  ctx.globalAlpha = 0.9
  ctx.fillStyle = '#E91E8C'
  ctx.fillRect(cardX, cardY + 95, 360, 30)

  // ribbon vertical
  ctx.fillRect(cardX + 155, cardY, 50, 220)
  ctx.globalAlpha = 1

  // ribbon bow
  ctx.fillStyle = '#FF91A4'
  ctx.beginPath()
  ctx.arc(cardX + 180, cardY + 110, 18, Math.PI, 0)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cardX + 180, cardY + 110, 18, 0, Math.PI)
  ctx.fill()
  ctx.fillStyle = '#E91E8C'
  ctx.beginPath()
  ctx.arc(cardX + 180, cardY + 110, 8, 0, Math.PI * 2)
  ctx.fill()

  // SHINE SWEEP
  const shineX = ((winTimer * 0.4) % 1.4) * 500 - 100
  ctx.save()
  roundRect(ctx, cardX, cardY, 360, 220, 12)
  ctx.clip()
  const shineGrad = ctx.createLinearGradient(cardX + shineX - 40, 0, cardX + shineX + 40, 0)
  shineGrad.addColorStop(0, 'rgba(255,255,255,0)')
  shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.18)')
  shineGrad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = shineGrad
  ctx.fillRect(cardX, cardY, 360, 220)
  ctx.restore()

  // SEPHORA text
  ctx.font = '36px Georgia'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '8px'
  ctx.fillText('SEPHORA', CANVAS_W / 2, cardY + 70)
  ctx.letterSpacing = '0px'

  ctx.font = '13px Georgia'
  ctx.fillStyle = 'rgba(255,215,0,0.6)'
  ctx.fillText('Gift Card', CANVAS_W / 2, cardY + 165)

  // 5. TYPEWRITER TEXTS
  ctx.shadowBlur = 8
  ctx.shadowColor = '#C2185B'
  ctx.font = 'bold 22px Georgia'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.fillText(WIN_LINE1.slice(0, winTypewriterIndex), CANVAS_W / 2, 450)

  if (winLine2Started) {
    ctx.fillText(WIN_LINE2.slice(0, winLine2Index), CANVAS_W / 2, 490)
  }
  ctx.shadowBlur = 0

  // 6. PLAY AGAIN BUTTON
  if (winShowButton) {
    const btnX = CANVAS_W / 2 - 120
    const btnY = 580
    const btnW = 240
    const btnH = 52
    const pulse = 1 + Math.sin(tick * 3) * 0.03

    ctx.save()
    ctx.translate(CANVAS_W / 2, btnY + btnH / 2)
    ctx.scale(pulse, pulse)
    ctx.translate(-CANVAS_W / 2, -(btnY + btnH / 2))

    ctx.shadowBlur = 20
    ctx.shadowColor = 'rgba(194, 24, 91, 0.5)'

    ctx.fillStyle = '#FFFFFF'
    roundRect(ctx, btnX, btnY, btnW, btnH, 26)
    ctx.fill()

    ctx.strokeStyle = '#E91E8C'
    ctx.lineWidth = 2.5
    roundRect(ctx, btnX, btnY, btnW, btnH, 26)
    ctx.stroke()

    ctx.shadowBlur = 0
    ctx.font = 'bold 18px Georgia'
    ctx.fillStyle = '#E91E8C'
    ctx.textAlign = 'center'
    ctx.fillText('Jogar de novo 💕', CANVAS_W / 2, btnY + 33)

    ctx.restore()
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} tick
 */
function renderGameOverOverlay(ctx, tick) {
  ctx.fillStyle = 'rgba(0,0,0,0.62)'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  ctx.font = '44px Georgia'
  ctx.fillStyle = '#FFB6C1'
  ctx.textAlign = 'center'
  ctx.fillText('Game Over 💔', CANVAS_W / 2 + Math.sin(tick * 20) * 2, 300)

  ctx.font = '20px Georgia'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText('Tente de novo, mi amor! 💕', CANVAS_W / 2, 360)

  ctx.fillStyle = '#E91E8C'
  roundRect(ctx, CANVAS_W / 2 - 100, 400, 200, 48, 24)
  ctx.fill()
  ctx.font = 'bold 17px Georgia'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText('Tentar de novo', CANVAS_W / 2, 430)
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} tick
 */
function renderStartScreen(ctx, tick) {
  // Atualiza o typewriter do bilhetinho
  if (!letterDone) {
    letterTimer += 0.016
    if (letterTimer > 0.045) {
      letterTimer = 0
      if (letterIndex < LETTER_TEXT.length) letterIndex++
      else letterDone = true
    }
  }

  // 1. Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
  bg.addColorStop(0, '#FFE4EC')
  bg.addColorStop(1, '#E8D5F5')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // 2. Heart-cloud decoration
  drawHeartCloud(ctx, 150, 120, 0.6)
  drawHeartCloud(ctx, 1100, 90, 0.5)
  drawHeartCloud(ctx, 600, 60, 0.7)
  drawHeartCloud(ctx, 900, 200, 0.4)

  // 3. Snorlax idle
  const frame = Math.floor(tick / 0.4) % 2
  const bobY = Math.sin(tick * 2) * 4
  ctx.save()
  ctx.translate(CANVAS_W / 2, 300)
  ctx.scale(1.6, 1.6)
  ctx.translate(-CANVAS_W / 2, -300)
  drawSnorlax(ctx, CANVAS_W / 2 - 28, 260, frame, tick)
  ctx.restore()

  // 4. Title
  ctx.shadowBlur = 16
  ctx.shadowColor = '#FF91A4'
  ctx.font = 'bold 52px Georgia'
  ctx.fillStyle = '#C2185B'
  ctx.textAlign = 'center'
  ctx.fillText('💕 Nic Adventure 💕', CANVAS_W / 2, 160)
  ctx.shadowBlur = 0

  // 5. Subtitle
  ctx.font = '18px Georgia'
  ctx.fillStyle = '#8B3A62'
  ctx.fillText('Colete os 5 pitorros de coco para descobrir seu presente, Amor!', CANVAS_W / 2, 220)

  // Bilhetinho
  const noteX = CANVAS_W / 2 - 280
  const noteY = 390
  ctx.save()
  ctx.translate(CANVAS_W / 2, noteY + 36)
  ctx.rotate(-0.012)
  ctx.translate(-CANVAS_W / 2, -(noteY + 36))
  ctx.shadowBlur = 16
  ctx.shadowColor = 'rgba(180,40,100,0.15)'
  ctx.fillStyle = '#FFF0F5'
  roundRect(ctx, noteX, noteY, 560, 72, 8)
  ctx.fill()
  ctx.fillStyle = '#FFB6C1'
  roundRect(ctx, noteX, noteY, 560, 6, 8)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.font = 'italic 15px Georgia'
  ctx.fillStyle = '#8B3A62'
  ctx.textAlign = 'left'
  const fullText = LETTER_TEXT.slice(0, letterIndex)
  const breakAt = 62
  const line1 = fullText.slice(0, breakAt)
  const line2 = fullText.length > breakAt ? fullText.slice(breakAt) : ''
  ctx.fillText(line1, noteX + 16, noteY + 28)
  ctx.fillText(line2, noteX + 16, noteY + 50)
  ctx.restore()

  // 6. Controls hint
  ctx.font = '14px Arial'
  ctx.fillStyle = '#AA6688'
  ctx.fillText('⬅️ ➡️  mover  ·  Espaço pular', CANVAS_W / 2, 580)

  // 7. Start button
  const scale = 1 + Math.sin(tick * 3) * 0.03
  ctx.save()
  ctx.translate(CANVAS_W / 2, 470)
  ctx.scale(scale, scale)
  ctx.shadowBlur = 20
  ctx.shadowColor = '#FF91A4'
  ctx.fillStyle = '#E91E8C'
  roundRect(ctx, -100, -24, 200, 48, 24)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.font = 'bold 20px Georgia'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.fillText('Começar 💕', 0, 8)
  ctx.restore()
}

const START_BTN = { x: CANVAS_W / 2 - 100, y: 416, w: 200, h: 48 }

function handleStartClick(mx, my) {
  if (mx >= START_BTN.x && mx <= START_BTN.x + START_BTN.w &&
    my >= START_BTN.y && my <= START_BTN.y + START_BTN.h) {
    initAudio()
    initGame()
    gameState = STATE.PLAYING
  }
}

function handleWinClick(mx, my) {
  if (!winShowButton) return
  const bx = CANVAS_W / 2 - 120
  const by = 580
  if (mx >= bx && mx <= bx + 240 && my >= by && my <= by + 52) {
    resetWinScreen()
    resetParticles()
    initGame()
    gameState = STATE.PLAYING
  }
}

function handleGameOverClick(mx, my) {
  const bx = CANVAS_W / 2 - 100
  const by = 400
  if (mx >= bx && mx <= bx + 200 && my >= by && my <= by + 48) {
    respawnAtCheckpoint()
    gameState = STATE.PLAYING
  }
}
