// src/main.js

const canvas = document.getElementById('gameCanvas')
const ctx    = canvas.getContext('2d')

let gameState  = STATE.START
let tick       = 0
let winTimer   = 0
let lastTime   = 0
let flashTimer = 0
let flashColor = '#FFFFFF'

function triggerFlash(color = '#FFFFFF', duration = 0.12) {
  flashTimer = duration
  flashColor = color
}

/** @type {Set<string>} */
const keys = new Set()

window.addEventListener('keydown', e => {
  keys.add(e.code)
  if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
    e.preventDefault()
  }
})
window.addEventListener('keyup', e => keys.delete(e.code))

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = CANVAS_W / rect.width
  const scaleY = CANVAS_H / rect.height
  const mx = (e.clientX - rect.left) * scaleX
  const my = (e.clientY - rect.top)  * scaleY

  // Clique no botão fullscreen (canto inferior direito)
  if (mx > CANVAS_W - 40 && my > CANVAS_H - 40) {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    return
  }

  if (gameState === STATE.START)    handleStartClick(mx, my)
  if (gameState === STATE.WIN)      handleWinClick(mx, my)
  if (gameState === STATE.GAMEOVER) handleGameOverClick(mx, my)

  // Mute button: top-right, ~32x32 at (CANVAS_W-60, 6) → center CANVAS_W-28
  if (gameState === STATE.PLAYING || gameState === STATE.GAMEOVER) {
    if (mx >= CANVAS_W - 60 && mx <= CANVAS_W - 4 && my >= 4 && my <= 40) {
      toggleMute()
    }
  }
})

function initGame() {
  initPlayer()
  initWorld()
  resetParticles()
  winTimer = 0
  tick     = 0
}

/**
 * @param {number} dt
 */
function update(dt) {
  tick += dt

  if (flashTimer > 0) flashTimer -= dt

  if (gameState === STATE.PLAYING) {
    if (!pauseScreen.active) {
      updatePlayer(dt, keys)
      updateEnemies(dt)
      updateCollectables()
      checkWinCondition()
    }
    updatePauseScreen(dt)
    updateParticles(dt)
    updateCamera(dt)
    updateToasts(dt)

    if (player.hp <= 0) {
      gameState = STATE.GAMEOVER
    }
  }

  if (gameState === STATE.WIN) {
    winTimer += dt
    updateParticles(dt)
    updateWinScreen(dt, winTimer)
  }
}

function render(dt = 0) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

  if (gameState === STATE.START) {
    renderStartScreen(ctx, tick)
    return
  }

  if (gameState === STATE.PLAYING || gameState === STATE.GAMEOVER) {
    renderBackground(ctx, camera, tick, dt)
    renderWorld(ctx, camera)
    renderEnemies(ctx, camera, tick)
    renderCollectables(ctx, camera, tick)
    renderPlayer(ctx, camera, tick)
    renderParticles(ctx, camera.x)
    renderPauseScreen(ctx, tick)
    renderHUD(ctx)
    renderToasts(ctx)
    if (gameState === STATE.GAMEOVER) renderGameOverOverlay(ctx, tick)
    if (flashTimer > 0) {
      ctx.save()
      ctx.globalAlpha = (flashTimer / 0.18) * 0.45
      ctx.fillStyle = flashColor
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      ctx.restore()
    }
    return
  }

  if (gameState === STATE.WIN) {
    renderWinScreen(ctx, winTimer, tick)
    renderParticles(ctx, 0)
    return
  }
}

function loop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
  lastTime = timestamp
  update(dt)
  render(dt)
  requestAnimationFrame(loop)
}

requestAnimationFrame(ts => {
  lastTime = ts
  requestAnimationFrame(loop)
})
