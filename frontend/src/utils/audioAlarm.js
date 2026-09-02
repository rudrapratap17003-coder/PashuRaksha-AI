/**
 * Web Audio API Police Emergency Siren Synthesizer
 * Generates an authentic, dual-oscillator police cruiser siren (Wail & Yelp) directly in the browser.
 */

let audioCtx = null
let oscMain = null
let oscSub = null
let gainNode = null
let isPlaying = false
let sirenInterval = null

export const playEmergencySiren = (durationSeconds = 8) => {
  try {
    if (isPlaying) return

    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    // Main Police Siren Oscillator
    oscMain = audioCtx.createOscillator()
    oscSub = audioCtx.createOscillator()
    gainNode = audioCtx.createGain()

    oscMain.type = 'sawtooth'
    oscSub.type = 'sine'

    // Master volume (comfortable yet clear)
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime)

    oscMain.connect(gainNode)
    oscSub.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    const now = audioCtx.currentTime
    oscMain.frequency.setValueAtTime(650, now)
    oscSub.frequency.setValueAtTime(650 * 0.5, now)

    oscMain.start(now)
    oscSub.start(now)
    isPlaying = true

    // Real Police Siren Wail Cycle (Glides 650Hz -> 1350Hz -> 650Hz smoothly over 1.2s)
    let cyclePhase = 0
    sirenInterval = setInterval(() => {
      if (!isPlaying || !oscMain || !audioCtx) return
      const t = audioCtx.currentTime
      if (cyclePhase % 2 === 0) {
        // Sweep UP to High Pitch
        oscMain.frequency.cancelScheduledValues(t)
        oscMain.frequency.linearRampToValueAtTime(1380, t + 0.6)
        if (oscSub) {
          oscSub.frequency.cancelScheduledValues(t)
          oscSub.frequency.linearRampToValueAtTime(690, t + 0.6)
        }
      } else {
        // Sweep DOWN to Low Pitch
        oscMain.frequency.cancelScheduledValues(t)
        oscMain.frequency.linearRampToValueAtTime(620, t + 0.6)
        if (oscSub) {
          oscSub.frequency.cancelScheduledValues(t)
          oscSub.frequency.linearRampToValueAtTime(310, t + 0.6)
        }
      }
      cyclePhase++
    }, 600)

    // Auto-stop after duration
    if (durationSeconds > 0) {
      setTimeout(() => {
        stopEmergencySiren()
      }, durationSeconds * 1000)
    }
  } catch (err) {
    console.warn('Police siren synthesis prevented by browser autoplay policy:', err)
  }
}

export const stopEmergencySiren = () => {
  try {
    if (sirenInterval) {
      clearInterval(sirenInterval)
      sirenInterval = null
    }
    if (oscMain) {
      oscMain.stop()
      oscMain.disconnect()
      oscMain = null
    }
    if (oscSub) {
      oscSub.stop()
      oscSub.disconnect()
      oscSub = null
    }
    if (gainNode) {
      gainNode.disconnect()
      gainNode = null
    }
    if (audioCtx && audioCtx.state !== 'closed') {
      audioCtx.close()
      audioCtx = null
    }
    isPlaying = false
  } catch {
    isPlaying = false
  }
}

export const isSirenPlaying = () => isPlaying
