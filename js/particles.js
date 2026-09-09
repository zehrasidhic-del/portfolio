/**
 * Interactive Neural / Constellation Particle Canvas
 * Engineered for 60fps performance and futuristic aesthetics
 * Palette: Bloodstone (#5D0D18), Misty Sage (#9FB2AC), Vanilla Custard (#FFF9EB)
 */
class NeuralNetworkCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.mouse = {
      x: null,
      y: null,
      radius: 140
    };
    
    this.animationFrameId = null;
    this.isPaused = false;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.attachEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    // Calculate particle count proportionally, with responsive limit
    const area = this.width * this.height;
    const baseCount = Math.floor(area / 14000);
    const particleCount = Math.min(Math.max(baseCount, 35), 90);

    const colors = [
      'rgba(159, 178, 172, ', // Misty Sage (#9FB2AC)
      'rgba(255, 249, 235, ', // Vanilla Custard (#FFF9EB)
      'rgba(143, 25, 41, ',   // Bloodstone Light
      'rgba(194, 209, 204, '  // Misty Sage Light
    ];

    for (let i = 0; i < particleCount; i++) {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.2,
        colorBase: colorBase,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }
  }

  attachEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Touch support for mobile interaction
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Visibility change optimization
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPaused = true;
        cancelAnimationFrame(this.animationFrameId);
      } else {
        this.isPaused = false;
        this.animate();
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const maxDistance = 135;

    // Connect particles
    for (let i = 0; i < this.particles.length; i++) {
      const p1 = this.particles[i];

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const lineAlpha = (1 - dist / maxDistance) * 0.18;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(159, 178, 172, ${lineAlpha})`;
          this.ctx.lineWidth = 0.85;
          this.ctx.stroke();
        }
      }

      // Mouse interactive connections
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const mdx = p1.x - this.mouse.x;
        const mdy = p1.y - this.mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < this.mouse.radius) {
          const force = (1 - mdist / this.mouse.radius);
          // Gently repel/attract
          p1.x += (mdx / mdist) * force * 0.8;
          p1.y += (mdy / mdist) * force * 0.8;

          const mouseLineAlpha = (1 - mdist / this.mouse.radius) * 0.35;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(255, 249, 235, ${mouseLineAlpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    // Draw individual nodes
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.pulseAngle += p.pulseSpeed;
      const currentAlpha = p.alpha + Math.sin(p.pulseAngle) * 0.15;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorBase}${Math.max(0.1, currentAlpha)})`;
      this.ctx.shadowColor = '#9FB2AC';
      this.ctx.shadowBlur = 6;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // reset

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce boundaries
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;
    }
  }

  animate() {
    if (this.isPaused) return;
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Instantiate upon DOM load
document.addEventListener('DOMContentLoaded', () => {
  new NeuralNetworkCanvas('particle-canvas');
});
