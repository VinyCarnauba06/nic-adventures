// src/player.js

const GRAVITY     = 1800
const WALK_ACCEL  = 2000
const FRICTION    = 0.80
const AIR_RESIST  = 0.94
const MAX_VX      = 420
const JUMP_VY     = -620
const COYOTE_TIME = 0.10
const JUMP_BUFFER = 0.10

/**
 * @typedef {Object} Player
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 * @property {number} vx
 * @property {number} vy
 * @property {boolean} onGround
 * @property {boolean} facingRight
 * @property {number} frameIndex
 * @property {number} frameTimer
 * @property {number} invTimer
 * @property {number} coyoteTimer
 * @property {number} jumpBuffer
 * @property {number} hp
 */

/** @type {Player} */
const player = {
  x: 80, y: 580,
  w: 48, h: 56,
  vx: 0, vy: 0,
  onGround: false,
  facingRight: true,
  frameIndex: 0,
  frameTimer: 0,
  invTimer: 0,
  coyoteTimer: 0,
  jumpBuffer: 0,
  hp: 3
}

let lastCheckpoint = { x: 80, y: 580, hp: 3 }
let idleTimer = 0

function initPlayer() {
  Object.assign(player, {
    x: 80, y: 580,
    vx: 0, vy: 0,
    onGround: false,
    facingRight: true,
    frameIndex: 0,
    frameTimer: 0,
    invTimer: 0,
    coyoteTimer: 0,
    jumpBuffer: 0,
    hp: 3
  })
  lastCheckpoint = { x: 80, y: 580, hp: 3 }
}

function respawnAtCheckpoint() {
  player.x   = lastCheckpoint.x
  player.y   = lastCheckpoint.y
  player.hp  = lastCheckpoint.hp
  player.vx  = 0
  player.vy  = 0
  player.invTimer = 1.5
}

/**
 * @param {number} dt
 * @param {Set<string>} keys
 */
function updatePlayer(dt, keys) {
  // 1. TIMERS
  player.invTimer    = Math.max(0, player.invTimer - dt)
  player.coyoteTimer = Math.max(0, player.coyoteTimer - dt)
  player.jumpBuffer  = Math.max(0, player.jumpBuffer - dt)

  // 2. INPUT — jump buffer
  if (keys.has('Space') || keys.has('ArrowUp') || keys.has('KeyW')) {
    player.jumpBuffer = JUMP_BUFFER
  }

  // 3. HORIZONTAL MOVEMENT
  const prevOnGround = player.onGround
  if (keys.has('ArrowLeft') || keys.has('KeyA')) {
    player.vx -= WALK_ACCEL * dt
    player.facingRight = false
  }
  if (keys.has('ArrowRight') || keys.has('KeyD')) {
    player.vx += WALK_ACCEL * dt
    player.facingRight = true
  }
  player.vx = Math.max(-MAX_VX, Math.min(MAX_VX, player.vx))
  if (player.onGround) {
    player.vx *= Math.pow(FRICTION, dt * 60)
  } else {
    player.vx *= Math.pow(AIR_RESIST, dt * 60)
  }

  // 4. JUMP EXECUTION
  if (player.jumpBuffer > 0 && (player.onGround || player.coyoteTimer > 0)) {
    player.vy = JUMP_VY
    player.jumpBuffer  = 0
    player.coyoteTimer = 0
    playSound('jump')
  }

  // 5. GRAVITY
  player.vy += GRAVITY * dt

  // 6. MOVE + COLLIDE (axis-separated)
  player.onGround = false
  player.x += player.vx * dt
  resolveAxisX(player, getPlatforms())
  player.y += player.vy * dt
  resolveAxisY(player, getPlatforms())

  // coyote time: if was on ground last frame but not now
  if (prevOnGround && !player.onGround && player.vy > 0) {
    player.coyoteTimer = COYOTE_TIME
  }

  // 7. ANIMATION FRAMES
  if (!player.onGround) {
    player.frameIndex = 2
  } else if (Math.abs(player.vx) < 10) {
    player.frameIndex = 0
  } else {
    player.frameTimer += dt
    if (player.frameTimer > 0.12) {
      player.frameTimer = 0
      player.frameIndex = player.frameIndex === 0 ? 1 : 0
    }
  }

  // 8. WORLD BOUNDS
  if (player.x < 0) player.x = 0
  if (player.y > CANVAS_H + 100) respawnAtCheckpoint()

  // 9. CHECKPOINTS
  for (const cpX of CHECKPOINT_XS) {
    if (player.x >= cpX && lastCheckpoint.x < cpX) {
      lastCheckpoint = { x: cpX, y: player.y, hp: player.hp }
    }
  }

  // Detecta idle
  if (Math.abs(player.vx) < 5 && player.onGround) {
    idleTimer += dt
  } else {
    idleTimer = 0
  }

  // Trail quando correndo rápido
  if (Math.abs(player.vx) > 200 && player.onGround) {
    spawnTrailHeart(player.x + player.w / 2, player.y + player.h - 4)
  }
}

/**
 * @param {Player} p
 * @param {Array} platforms
 */
function resolveAxisX(p, platforms) {
  for (const plat of platforms) {
    if (aabbOverlap(p, plat)) {
      const pCenterX = p.x + p.w / 2
      const platCenterX = plat.x + plat.w / 2
      if (pCenterX < platCenterX) {
        p.x = plat.x - p.w
      } else {
        p.x = plat.x + plat.w
      }
      p.vx = 0
    }
  }
}

/**
 * @param {Player} p
 * @param {Array} platforms
 */
function resolveAxisY(p, platforms) {
  for (const plat of platforms) {
    if (aabbOverlap(p, plat)) {
      const overlapTop    = (p.y + p.h) - plat.y
      const overlapBottom = (plat.y + plat.h) - p.y
      if (overlapTop <= overlapBottom && p.vy >= 0) {
        p.y = plat.y - p.h
        p.vy = 0
        p.onGround = true
        p.coyoteTimer = COYOTE_TIME
      } else if (overlapBottom < overlapTop && p.vy < 0) {
        p.y = plat.y + plat.h
        p.vy = 0
      }
    }
  }
}

/**
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
function aabbOverlap(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y
}
