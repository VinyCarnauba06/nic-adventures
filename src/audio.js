// src/audio.js

// ─── SHARED CONSTANTS (declared first so all modules can read them) ───────────
const CANVAS_W = 1280
const CANVAS_H = 720
const WORLD_W  = 5500
const STATE    = { START: 0, PLAYING: 1, WIN: 2, GAMEOVER: 3 }

/** @type {AudioContext|null} */
let audioCtx    = null
let masterGain  = null
let bgmPlaying  = false
let muted       = false
let bgmTimeouts = []

const BGM_NOTES     = [440, 440, 392, 440, 494, 440, 392, 330, 294, 330, 392, 440, 392, 330, 294]
const BGM_DURATIONS = [0.2, 0.1, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.1, 0.1, 0.2, 0.3, 0.1, 0.2, 0.4]

function initAudio() {
  if (audioCtx) return
  audioCtx   = new (window.AudioContext || window.webkitAudioContext)()
  masterGain = audioCtx.createGain()
  masterGain.gain.value = 1
  masterGain.connect(audioCtx.destination)
  startBGM()
}

function startBGM() {
  function scheduleNote(step) {
    const dur = BGM_DURATIONS[step]
    if (!audioCtx || muted) {
      bgmTimeouts.push(setTimeout(() => scheduleNote(step), dur * 1000))
      return
    }
    const freq = BGM_NOTES[step]
    const osc  = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.07, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur * 0.9)
    osc.connect(gain)
    gain.connect(masterGain)
    osc.start()
    osc.stop(audioCtx.currentTime + dur)
    const nextStep = (step + 1) % BGM_NOTES.length
    bgmTimeouts.push(setTimeout(() => scheduleNote(nextStep), dur * 1000))
  }
  scheduleNote(0)
  bgmPlaying = true
}

function stopBGM() {
  bgmTimeouts.forEach(clearTimeout)
  bgmTimeouts = []
  bgmPlaying  = false
}

function toggleMute() {
  muted = !muted
  if (masterGain) masterGain.gain.value = muted ? 0 : 1
  return muted
}

/**
 * @param {'jump'|'collect'|'hurt'|'stomp'|'win'} name
 */
function playSound(name) {
  if (!audioCtx || muted) return

  function oneShot(type, freqStart, freqEnd, duration, gainVal) {
    const osc  = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    const now  = audioCtx.currentTime
    osc.type = type
    osc.frequency.setValueAtTime(freqStart, now)
    osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration)
    gain.gain.setValueAtTime(gainVal, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    osc.connect(gain)
    gain.connect(masterGain)
    osc.start(now)
    osc.stop(now + duration + 0.01)
  }

  switch (name) {
    case 'jump':    oneShot('sine',      200, 600, 0.15, 0.15); break
    case 'collect': oneShot('triangle', 523, 784, 0.20, 0.20); break
    case 'hurt':    oneShot('sawtooth', 200,  80, 0.30, 0.20); break
    case 'stomp':   oneShot('square',   300, 150, 0.10, 0.25); break
    case 'win': {
      const notes = [261.63, 329.63, 392.00, 523.25]
      notes.forEach((freq, i) => {
        setTimeout(() => oneShot('triangle', freq, freq, 0.15, 0.25), i * 150)
      })
      break
    }
  }
}
