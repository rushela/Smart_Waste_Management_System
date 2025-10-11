import { useEffect, useRef } from 'react'
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let particles: any[] = []
    let animationFrameId: number

    // Debounced resize to avoid rapid reflows that cause jitter
    let resizeTimeout: number | undefined
    const resizeCanvas = () => {
      // Use clientWidth/clientHeight to avoid scrollbar-caused size changes
      const w = document.documentElement.clientWidth
      const h = document.documentElement.clientHeight
      canvas.width = w
      canvas.height = h
      createParticles()
    }

    const createParticles = () => {
      particles = []
      // Lower particle density for stability and performance
      const area = document.documentElement.clientWidth * document.documentElement.clientHeight
      const numberOfParticles = Math.min(Math.floor(area / 25000), 40)
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8 + 0.4,
          color: i % 8 === 0 ? '#FF8C4233' : i % 2 === 0 ? '#2ECC7133' : '#2ECC7122',
          movement: {
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3,
          },
          // reduce pulsing to avoid visible jitter
          pulse: {
            active: Math.random() > 0.9,
            speed: Math.random() * 0.01 + 0.003,
            direction: Math.random() > 0.5 ? 1 : -1,
            current: 0,
          },
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        if (particle.pulse.active) {
          particle.pulse.current += particle.pulse.speed * particle.pulse.direction
          if (Math.abs(particle.pulse.current) > 0.3) particle.pulse.direction *= -1
        }
        const size = particle.radius * (1 + (particle.pulse.current || 0))
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
        particle.x += particle.movement.x
        particle.y += particle.movement.y
        // bounce with minimal randomness
        if (particle.x < 0) particle.x = 0
        if (particle.y < 0) particle.y = 0
        if (particle.x > canvas.width) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = canvas.height
      })
      // draw sparse connections
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const p1 = particles[a]
          const p2 = particles[b]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const opacity = 0.12 * (1 - dist / 120)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(46,204,113,${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
      animationFrameId = requestAnimationFrame(drawParticles)
    }

    const onResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout)
      // debounce resize to 150ms
      resizeTimeout = window.setTimeout(() => resizeCanvas(), 150)
    }

    window.addEventListener('resize', onResize)
    resizeCanvas()
    drawParticles()
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationFrameId)
      if (resizeTimeout) window.clearTimeout(resizeTimeout)
    }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen -z-10 opacity-40 pointer-events-none"
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    />
  )
}
