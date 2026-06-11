// src/particles.js

/** @type {Array<{x,y,vx,vy,life,maxLife,type,color,size,angle,va}>} */
const particles = []

const HEART_COLORS = ['#E91E8C','#FF91A4','#FFB6C1','#FF6B9D','#C2185B']
const PASTEL_COLORS = ['#FFB6C1','#C9B1E8','#B5EAD7','#FFE4EC','#FFD700']

function resetParticles() {
  particles.length = 0
}

/**
 * @param {number} x
 * @param {number} y
 * @param {'heart'|'star'|'confetti'} type
 * @param {number} count
 */
function spawnParticles(x, y, type, count) {
  for (let i = 0; i < count; i++) {
    const angle  = Math.random() * Math.PI * 2
    const speed  = 80 + Math.random() * 220
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 80,
      life: 0.9 + Math.random() * 0.5,
      maxLife: 1.4,
      type,
      color: type === 'star'
        ? '#FFD700'
        : type === 'heart'
          ? HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]
          : PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
      size: 7 + Math.random() * 9,
      angle: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 4
    })
  }
}

/**
 * @param {number} dt
 */
function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.vy += 400 * dt
    p.x  += p.vx * dt
    p.y  += p.vy * dt
    p.angle += p.va * dt
    p.life  -= dt
    if (p.life <= 0) particles.splice(i, 1)
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cameraX
 */
function renderParticles(ctx, cameraX = 0) {
  for (const p of particles) {
    const alpha = Math.max(0, p.life / p.maxLife)
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(p.x - cameraX, p.y)
    ctx.rotate(p.angle)

    if (p.type === 'heart') {
      drawParticleHeart(ctx, p.size, p.color)
    } else if (p.type === 'star') {
      drawParticleStar(ctx, p.size, p.color)
    } else if (p.type === 'confetti') {
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
    }

    ctx.restore()
  }
  ctx.globalAlpha = 1
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} size
 * @param {string} color
 */
function drawParticleHeart(ctx, size, color) {
  const s = size / 10
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, s * 3)
  ctx.bezierCurveTo(-s * 5, -s * 2, -s * 10, s * 2, 0,    s * 8)
  ctx.bezierCurveTo( s * 10, s * 2,  s * 5, -s * 2, 0,    s * 3)
  ctx.fill()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} size
 * @param {string} color
 */
function drawParticleStar(ctx, size, color) {
  const outer = size / 2
  const inner = outer * 0.42
  ctx.fillStyle = color
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const r     = i % 2 === 0 ? outer : inner
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2
    if (i === 0) {
      ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
    } else {
      ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
    }
  }
  ctx.closePath()
  ctx.fill()
}

/**
 * @param {number} canvasW
 */
function spawnTrailHeart(x, y) {
  if (Math.random() > 0.35) return
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 40,
    vy: -(20 + Math.random() * 40),
    life: 0.5 + Math.random() * 0.3,
    maxLife: 0.8,
    type: 'heart',
    color: Math.random() > 0.5 ? '#FFB6C1' : '#FF91A4',
    size: 4 + Math.random() * 5,
    angle: Math.random() * Math.PI * 2,
    va: (Math.random() - 0.5) * 2
  })
}

function spawnWinRain(canvasW) {
  if (Math.random() < 0.4) {
    particles.push({
      x: Math.random() * canvasW, y: -10,
      vx: (Math.random() - 0.5) * 60, vy: 60 + Math.random() * 80,
      life: 4, maxLife: 4,
      type: 'heart',
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      size: 10 + Math.random() * 14,
      angle: Math.random() * Math.PI * 2, va: (Math.random() - 0.5) * 1.5
    })
  }
}
