// src/world.js

const CHECKPOINT_XS = [1400, 2800]

// ─── CAMERA ───────────────────────────────────────────────────────────────────
const camera = { x: 0 }

function updateCamera(dt) {
  const targetX = player.x - 400
  camera.x += (targetX - camera.x) * 8 * dt
  camera.x = Math.max(0, Math.min(camera.x, WORLD_W - CANVAS_W))
}

// ─── PLATFORMS ────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} Platform
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 * @property {string} color
 */

/** @type {Platform[]} */
const platforms = [
  { x: 0,    y: 660, w: 4200, h: 60,  color: '#FF91A4' },

  // Zone 1 (0–1000)
  { x: 180,  y: 570, w: 150, h: 20, color: '#FFB6C1' },
  { x: 380,  y: 510, w: 140, h: 20, color: '#C9B1E8' },
  { x: 580,  y: 550, w: 160, h: 20, color: '#B5EAD7' },
  { x: 780,  y: 480, w: 140, h: 20, color: '#FFB6C1' },
  { x: 950,  y: 530, w: 130, h: 20, color: '#C9B1E8' },

  // Zone 2 (1000–2000)
  { x: 1100, y: 470, w: 160, h: 20, color: '#B5EAD7' },
  { x: 1300, y: 420, w: 140, h: 20, color: '#FFB6C1' },
  { x: 1480, y: 480, w: 150, h: 20, color: '#C9B1E8' },
  { x: 1660, y: 400, w: 160, h: 20, color: '#B5EAD7' },
  { x: 1840, y: 450, w: 130, h: 20, color: '#FFB6C1' },
  { x: 2000, y: 380, w: 150, h: 20, color: '#C9B1E8' },

  // Zone 3 (2000–3100)
  { x: 2160, y: 430, w: 140, h: 20, color: '#B5EAD7' },
  { x: 2340, y: 360, w: 160, h: 20, color: '#FFB6C1' },
  { x: 2520, y: 400, w: 130, h: 20, color: '#C9B1E8' },
  { x: 2700, y: 330, w: 150, h: 20, color: '#B5EAD7' },
  { x: 2880, y: 370, w: 140, h: 20, color: '#FFB6C1' },
  { x: 3060, y: 300, w: 160, h: 20, color: '#C9B1E8' },

  // Zone 4 (3100–4200) — reta final
  { x: 3220, y: 350, w: 130, h: 20, color: '#B5EAD7' },
  { x: 3380, y: 290, w: 150, h: 20, color: '#FFB6C1' },
  { x: 3540, y: 330, w: 120, h: 20, color: '#C9B1E8' },
  { x: 3700, y: 270, w: 140, h: 20, color: '#B5EAD7' },
  { x: 3860, y: 300, w: 120, h: 20, color: '#FFB6C1' },
  { x: 4000, y: 240, w: 140, h: 20, color: '#C9B1E8' },
  // Pedestal final dourado — Liam Payne
  { x: 4080, y: 210, w: 100, h: 20, color: '#FFD700' },
]

function getPlatforms() { return platforms }

// ─── COLLECTABLES ─────────────────────────────────────────────────────────────
/**
 * @typedef {Object} Collectable
 * @property {number}  x
 * @property {number}  y
 * @property {string}  name
 * @property {boolean} collected
 * @property {boolean} isLiam
 */

/** @type {Collectable[]} */
const collectables = [
  // ── Pitorros normais (não contam pro win)
  { x: 280,  y: 620, name: '',                collected: false, isLiam: false, special: false },
  { x: 590,  y: 510, name: '',                collected: false, isLiam: false, special: false },
  { x: 960,  y: 490, name: '',                collected: false, isLiam: false, special: false },
  { x: 1310, y: 380, name: '',                collected: false, isLiam: false, special: false },
  { x: 1850, y: 410, name: '',                collected: false, isLiam: false, special: false },
  { x: 2530, y: 360, name: '',                collected: false, isLiam: false, special: false },
  { x: 3070, y: 260, name: '',                collected: false, isLiam: false, special: false },
  { x: 3710, y: 230, name: '',                collected: false, isLiam: false, special: false },

  // ── Pitorros especiais (contam pro win condition)
  { x: 450,  y: 470, name: 'Harry Styles',    collected: false, isLiam: false, special: true  },
  { x: 1170, y: 430, name: 'Zayn Malik',      collected: false, isLiam: false, special: true  },
  { x: 1960, y: 340, name: 'Niall Horan',     collected: false, isLiam: false, special: true  },
  { x: 2870, y: 330, name: 'Louis Tomlinson', collected: false, isLiam: false, special: true  },
  { x: 4110, y: 160, name: 'Liam Payne',      collected: false, isLiam: true,  special: true  },
]

let collectedCount = 0

function getCollectedCount() { return collectedCount }

function updateCollectables() {
  collectables.forEach(c => {
    if (c.collected) return
    if (!aabbOverlap(player, { x: c.x - 28, y: c.y - 28, w: 56, h: 56 })) return

    c.collected = true
    spawnParticles(c.x, c.y, 'heart', c.special ? 20 : 8)
    playSound('collect')

    if (c.special) {
      collectedCount++
      showToast(
        c.isLiam
          ? 'Forever in our hearts ⭐'
          : `Você encontrou ${c.name}! 🎤`,
        c.isLiam ? '#FFD700' : '#FF91A4',
        2.5
      )
      showCollectPause(c.name, collectedCount, c.isLiam)
      triggerFlash('#FFFFFF', 0.12)
      if (collectedCount >= 5) {
        gameState = STATE.WIN
        winTimer  = 0
        playSound('win')
      }
    } else {
      showToast('Pitorro coletado! 🐾', '#FFB6C1', 1.2)
      triggerFlash('#FFFFFF', 0.08)
    }
  })
}

// ─── ENEMIES ──────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} Enemy
 * @property {number}  x
 * @property {number}  y
 * @property {number}  w
 * @property {number}  h
 * @property {number}  vx
 * @property {number}  patrolLeft
 * @property {number}  patrolRight
 * @property {boolean} alive
 * @property {number}  squashTimer
 */

/** @type {Enemy[]} */
const enemies = [
  { x: 390,  y: 620, w: 32, h: 32, vx:  80, patrolLeft: 310,  patrolRight: 520,  alive: true, squashTimer: 0, shakeTimer: 0 },
  { x: 800,  y: 620, w: 32, h: 32, vx: -80, patrolLeft: 700,  patrolRight: 900,  alive: true, squashTimer: 0, shakeTimer: 0 },
  { x: 1120, y: 430, w: 32, h: 32, vx:  80, patrolLeft: 1040, patrolRight: 1220, alive: true, squashTimer: 0, shakeTimer: 0 },
  { x: 1670, y: 440, w: 32, h: 32, vx: -80, patrolLeft: 1580, patrolRight: 1780, alive: true, squashTimer: 0, shakeTimer: 0 },
  { x: 2350, y: 320, w: 32, h: 32, vx:  80, patrolLeft: 2260, patrolRight: 2460, alive: true, squashTimer: 0, shakeTimer: 0 },
  { x: 3070, y: 260, w: 32, h: 32, vx: -80, patrolLeft: 2980, patrolRight: 3180, alive: true, squashTimer: 0, shakeTimer: 0 },
  { x: 3870, y: 260, w: 32, h: 32, vx:  80, patrolLeft: 3780, patrolRight: 3960, alive: true, squashTimer: 0, shakeTimer: 0 },
]

function updateEnemies(dt) {
  for (const e of enemies) {
    if (e.squashTimer > 0) e.squashTimer -= dt
    e.shakeTimer += dt

    if (!e.alive) continue

    // 1. Move
    e.x += e.vx * dt

    // 2. Patrol flip
    if (e.x < e.patrolLeft || e.x > e.patrolRight) e.vx *= -1

    // 3. Collision with player
    const stomped = player.vy > 0 && (player.y + player.h) < (e.y + 16)
    if (stomped && aabbOverlap(player, e)) {
      e.alive = false
      e.squashTimer = 0.4
      player.vy = -350
      spawnParticles(e.x + 16, e.y + 16, 'star', 8)
      playSound('stomp')
    } else if (aabbOverlap(player, e) && player.invTimer === 0) {
      player.hp--
      player.invTimer = 1.0
      player.vx = player.x < e.x ? -300 : 300
      playSound('hurt')
      triggerFlash('#FF0000', 0.18)
    }
  }
}

// ─── BACKGROUND ──────────────────────────────────────────────────────────────

const CLOUD_SCALES = [0.7, 1.0, 0.55, 1.2, 0.8, 0.65, 1.1, 0.9, 0.75, 1.3, 0.6, 0.85, 1.0, 0.7]

/** @type {{x:number, y:number, layer:number, scale:number}[]} */
const heartClouds = Array.from({ length: 14 }, (_, i) => ({
  x: i * 240 + Math.random() * 100,
  y: 60 + Math.random() * 160,
  layer: i % 2,
  scale: CLOUD_SCALES[i]
}))

const bgStars = Array.from({ length: 40 }, () => ({
  x: Math.random() * WORLD_W,
  y: Math.random() * 300,
  r: 1 + Math.random() * 2,
  phase: Math.random() * Math.PI * 2
}))

const musicElements = Array.from({ length: 18 }, (_, i) => ({
  x:     i * 190 + Math.random() * 80,
  y:     80 + Math.random() * 320,
  type:  i % 3,
  scale: 0.6 + Math.random() * 0.7,
  speed: 0.3 + Math.random() * 0.4,
  phase: Math.random() * Math.PI * 2,
  alpha: 0.12 + Math.random() * 0.18
}))

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x:number}} camera
 * @param {number} tick
 */
function renderBackground(ctx, camera, tick, dt = 0) {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
  grad.addColorStop(0, '#FFE4EC')
  grad.addColorStop(1, '#E8D5F5')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Stars
  for (const star of bgStars) {
    const sx = star.x - camera.x
    if (sx < -4 || sx > CANVAS_W + 4) continue
    const alpha = 0.4 + 0.4 * Math.sin(tick * 3 + star.phase)
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#CC88AA'
    ctx.beginPath()
    ctx.arc(sx, star.y, star.r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Heart-clouds parallax with drift
  for (const cloud of heartClouds) {
    cloud.x += (0.8 + cloud.layer * 0.6) * dt
    const offsetX = cloud.layer === 0 ? camera.x * 0.3 : camera.x * 0.6
    if (cloud.x - offsetX > CANVAS_W + 100) cloud.x = offsetX - 120
    const cx = cloud.x - offsetX
    if (cx < -120 || cx > CANVAS_W + 120) continue
    const opacity = 0.25 + cloud.scale * 0.3
    if (cloud.layer === 0) ctx.filter = 'blur(2px)'
    drawHeartCloud(ctx, cx, cloud.y, cloud.scale, opacity)
    if (cloud.layer === 0) ctx.filter = 'none'
  }

  // Music elements parallax
  musicElements.forEach(el => {
    const sx      = el.x - camera.x * 0.2
    const screenX = ((sx % (WORLD_W * 0.2)) + WORLD_W * 0.2) % (CANVAS_W + 200) - 100
    if (screenX < -60 || screenX > CANVAS_W + 60) return
    const sy = el.y + Math.sin(tick * el.speed + el.phase) * 8
    ctx.save()
    ctx.globalAlpha = el.alpha
    ctx.translate(screenX, sy)
    ctx.scale(el.scale, el.scale)
    if (el.type === 0)      drawMusicNote(ctx, tick)
    else if (el.type === 1) drawMicrophone(ctx)
    else                    drawFloatingStar(ctx, tick + el.phase)
    ctx.restore()
  })
}

function drawMusicNote(ctx, tick) {
  ctx.fillStyle = '#E91E8C'
  ctx.beginPath()
  ctx.ellipse(-5, 0, 8, 6, -0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(3, -30, 3, 32)
  ctx.beginPath()
  ctx.moveTo(6, -30)
  ctx.bezierCurveTo(22, -24, 20, -10, 6, -8)
  ctx.lineTo(6, -14)
  ctx.bezierCurveTo(16, -16, 18, -26, 6, -26)
  ctx.fill()
}

function drawMicrophone(ctx) {
  ctx.fillStyle = '#C9B1E8'
  ctx.beginPath()
  ctx.arc(0, -16, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(-3, -6, 6, 18)
  ctx.beginPath()
  ctx.arc(0, 14, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(-1, 12, 2, 6)
}

function drawFloatingStar(ctx, phase) {
  const outer = 12, inner = 5
  ctx.fillStyle  = '#FFD700'
  ctx.shadowBlur = 8
  ctx.shadowColor = '#FFD700'
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2 + phase * 0.5
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
    else         ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  ctx.closePath()
  ctx.fill()
  ctx.shadowBlur = 0
}

function drawHeartCloud(ctx, x, y, scale, opacity) {
  const s = 28
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowBlur = 18
  ctx.shadowColor = '#FFB6C1'
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.beginPath()
  ctx.arc(-s * 0.5, -s * 0.2, s * 0.5, Math.PI, 0)
  ctx.arc( s * 0.5, -s * 0.2, s * 0.5, Math.PI, 0)
  ctx.bezierCurveTo(s * 1.0, s * 0.3, 0, s * 1.1, 0, s * 1.0)
  ctx.bezierCurveTo(0, s * 1.1, -s * 1.0, s * 0.3, -s * 1.0, 0)
  ctx.fill()
  ctx.restore()
}

function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + percent))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + percent))
  const b = Math.min(255, Math.max(0, (num & 0xFF) + percent))
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x:number}} camera
 */
function renderWorld(ctx, camera) {
  for (const plat of platforms) {
    const sx = plat.x - camera.x
    if (sx + plat.w < 0 || sx > CANVAS_W) continue

    // 3D bottom border
    ctx.fillStyle = shadeColor(plat.color, -25)
    ctx.beginPath()
    ctx.roundRect(sx + 6, plat.y + plat.h, plat.w - 12, 6, [0, 0, 3, 3])
    ctx.fill()

    // Platform with shadow
    ctx.shadowBlur = 8
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.fillStyle = plat.color
    ctx.beginPath()
    ctx.roundRect(sx, plat.y, plat.w, plat.h, 6)
    ctx.fill()
    ctx.shadowBlur = 0

    // Decoração no topo da plataforma
    if (plat.h === 20) {
      const decorSpacing = 32
      const decorCount = Math.floor(plat.w / decorSpacing)
      for (let d = 0; d < decorCount; d++) {
        const dx = sx + 16 + d * decorSpacing
        if (d % 2 === 0) {
          ctx.save()
          ctx.translate(dx, plat.y - 8)
          ctx.fillStyle = shadeColor(plat.color, -20)
          ctx.globalAlpha = 0.7
          ctx.beginPath()
          ctx.arc(-3, 0, 3.5, Math.PI, 0)
          ctx.arc( 3, 0, 3.5, Math.PI, 0)
          ctx.bezierCurveTo(6, 2, 0, 8, 0, 8)
          ctx.bezierCurveTo(0, 8, -6, 2, -6, 0)
          ctx.fill()
          ctx.restore()
        } else {
          ctx.save()
          ctx.translate(dx, plat.y - 8)
          ctx.globalAlpha = 0.65
          const petalColor = shadeColor(plat.color, -15)
          ;[0, 90, 180, 270].forEach(deg => {
            const rad = deg * Math.PI / 180
            ctx.fillStyle = petalColor
            ctx.beginPath()
            ctx.ellipse(Math.cos(rad)*4, Math.sin(rad)*4, 3.5, 2.5, rad, 0, Math.PI*2)
            ctx.fill()
          })
          ctx.fillStyle = '#FFD700'
          ctx.beginPath()
          ctx.arc(0, 0, 2.5, 0, Math.PI*2)
          ctx.fill()
          ctx.restore()
        }
      }
      ctx.globalAlpha = 1
    }
  }

  ctx.shadowBlur = 0

  // Ground heart decorations
  const groundY = 660
  const startX = Math.floor(camera.x / 32) * 32
  const endX   = startX + CANVAS_W + 32
  const heartColors = ['#FF6B9D', '#FFB6C1']
  for (let wx = startX; wx < endX; wx += 32) {
    const sx = wx - camera.x
    const color = heartColors[Math.floor(wx / 32) % 2]
    drawTinyHeart(ctx, sx, groundY, 4, color)
  }
}

function drawTinyHeart(ctx, x, y, s, color) {
  ctx.fillStyle = color
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.moveTo(0, s * 0.3)
  ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.2, 0, s * 0.8)
  ctx.bezierCurveTo(s, s * 0.2, s * 0.5, -s * 0.2, 0, s * 0.3)
  ctx.fill()
  ctx.restore()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x:number}} camera
 * @param {number} tick
 */
function renderCollectables(ctx, camera, tick) {
  collectables.forEach(c => {
    if (c.collected) return
    const sx = c.x - camera.x
    if (sx < -60 || sx > CANVAS_W + 60) return

    if (c.special) {
      drawPitorro(ctx, sx, c.y, c.name, tick, c.isLiam)
    } else {
      ctx.save()
      ctx.scale(0.7, 0.7)
      drawPitorro(ctx, sx / 0.7, c.y / 0.7, '', tick, false)
      ctx.restore()
    }
  })
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x:number}} camera
 * @param {number} tick
 */
function renderEnemies(ctx, camera, tick) {
  for (const e of enemies) {
    if (!e.alive && e.squashTimer <= 0) continue
    const sx = e.x - camera.x
    if (sx < -40 || sx > CANVAS_W + 40) continue
    drawEnemy(ctx, { ...e, x: sx }, tick)
  }
}

function initWorld() {
  collectedCount = 0
  collectables.forEach(c => c.collected = false)
  enemies.forEach((e, i) => {
    const init = [
      { x: 390,  y: 620, vx:  80 },
      { x: 800,  y: 620, vx: -80 },
      { x: 1120, y: 430, vx:  80 },
      { x: 1670, y: 440, vx: -80 },
      { x: 2350, y: 320, vx:  80 },
      { x: 3070, y: 260, vx: -80 },
      { x: 3870, y: 260, vx:  80 },
    ]
    e.x           = init[i].x
    e.y           = init[i].y
    e.vx          = init[i].vx
    e.alive       = true
    e.squashTimer = 0
    e.shakeTimer  = 0
  })
  camera.x = 0
}
