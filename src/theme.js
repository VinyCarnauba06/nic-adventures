// src/theme.js — Paleta "Crepúsculo Mágico" e helpers de render compartilhados

const THEME = {
  skyTop:    '#160B26',
  skyMid:    '#2A1A4A',
  skyBottom: '#22305C',
  pink:      '#FF6B9D',
  pinkDeep:  '#E9638B',
  pinkSoft:  '#FF85A2',
  gold:      '#FFD9A0',
  glass:     'rgba(20, 12, 40, 0.62)',
  glassBorder:     'rgba(255, 134, 162, 0.38)',
  glassBorderGold: 'rgba(255, 217, 160, 0.45)',
  textSub: 'rgba(255, 226, 236, 0.75)',
}

/**
 * Estrela cintilante de 4 pontas com brilho suave.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @param {number} alpha
 */
function drawTwinkle(ctx, x, y, size, alpha) {
  ctx.save()
  ctx.globalAlpha = Math.max(0, alpha)
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowBlur = 6
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.quadraticCurveTo(x, y, x + size, y)
  ctx.quadraticCurveTo(x, y, x, y + size)
  ctx.quadraticCurveTo(x, y, x - size, y)
  ctx.quadraticCurveTo(x, y, x, y - size)
  ctx.fill()
  ctx.restore()
}

/**
 * Painel de vidro escuro com borda fina brilhante (estilo Crepúsculo).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 * @param {{alpha?:number, border?:string, blur?:number}} [opts]
 */
function drawGlassPanel(ctx, x, y, w, h, r, opts = {}) {
  const { alpha = 0.62, border = THEME.glassBorder, blur = 0 } = opts
  ctx.save()
  ctx.fillStyle = `rgba(20, 12, 40, ${alpha})`
  roundRect(ctx, x, y, w, h, r)
  ctx.fill()
  ctx.shadowBlur = blur
  ctx.shadowColor = border
  ctx.strokeStyle = border
  ctx.lineWidth = 1.5
  roundRect(ctx, x + 0.75, y + 0.75, w - 1.5, h - 1.5, r)
  ctx.stroke()
  ctx.restore()
}
