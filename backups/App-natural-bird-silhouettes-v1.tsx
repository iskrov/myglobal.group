import React, { useEffect, useRef } from 'react';

// OPTIMIZED MURMURATION - Fewer Birds, Better Performance, Wing Animation
const FlockAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    let birds: Bird[] = [];
    let time = 0;
    let currentPhase = 'flow'; // 'flow', 'forming', 'holding', 'dispersing'
    let phaseTimer = 0;
    let formationStrength = 0;

    class Vector {
      x: number;
      y: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
      }

      add(v: Vector): Vector {
        this.x += v.x;
        this.y += v.y;
        return this;
      }

      sub(v: Vector): Vector {
        this.x -= v.x;
        this.y -= v.y;
        return this;
      }

      mult(n: number): Vector {
        this.x *= n;
        this.y *= n;
        return this;
      }

      div(n: number): Vector {
        this.x /= n;
        this.y /= n;
        return this;
      }

      mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }

      normalize(): Vector {
        const m = this.mag();
        if (m > 0) this.div(m);
        return this;
      }

      limit(max: number): Vector {
        if (this.mag() > max) {
          this.normalize();
          this.mult(max);
        }
        return this;
      }

      dist(v: Vector): number {
        return Math.hypot(this.x - v.x, this.y - v.y);
      }

      static random(): Vector {
        const angle = Math.random() * 2 * Math.PI;
        return new Vector(Math.cos(angle), Math.sin(angle));
      }

      clone(): Vector {
        return new Vector(this.x, this.y);
      }
    }

    class Bird {
      position: Vector;
      velocity: Vector;
      acceleration: Vector;
      maxSpeed: number;
      maxForce: number;
      size: number;
      alpha: number;
      targetPosition: Vector | null;
      letterType: string | null;
      wingPhase: number;
      wingSpeed: number;
      trail: {x: number, y: number, alpha: number}[];

      constructor(x: number, y: number) {
        this.position = new Vector(x, y);
        this.velocity = Vector.random().mult(2);
        this.acceleration = new Vector(0, 0);
        this.maxSpeed = 3.0;
        this.maxForce = 0.05;
        
        // LARGER birds for visibility with fewer count
        this.size = 3 + Math.random() * 2; // 3-5px - much bigger!
        this.alpha = 0.9; // More opaque for visibility
        this.targetPosition = null;
        this.letterType = null;
        
        // Wing animation
        this.wingPhase = Math.random() * Math.PI * 2;
        this.wingSpeed = 0.1 + Math.random() * 0.05;
        
        // Trail for visual impact
        this.trail = [];
      }

      edges() {
        const canvasWidth = canvas?.width || 0;
        const canvasHeight = canvas?.height || 0;
        const margin = 50;
        
        if (this.position.x < margin) {
          this.velocity.x += 0.8;
        }
        if (this.position.x > canvasWidth - margin) {
          this.velocity.x -= 0.8;
        }
        if (this.position.y < margin) {
          this.velocity.y += 0.8;
        }
        if (this.position.y > canvasHeight - margin) {
          this.velocity.y -= 0.8;
        }
      }

      align(birds: Bird[]): Vector {
        const perception = 40;
        let steering = new Vector(0, 0);
        let total = 0;
        
        for (let other of birds) {
          const d = this.position.dist(other.position);
          if (other !== this && d < perception) {
            if (this.letterType === other.letterType) {
              steering.add(other.velocity);
              total++;
            }
          }
        }
        
        if (total > 0) {
          steering.div(total);
          steering.normalize().mult(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
        }
        return steering;
      }

      cohesion(birds: Bird[]): Vector {
        const perception = 50;
        let steering = new Vector(0, 0);
        let total = 0;
        
        for (let other of birds) {
          const d = this.position.dist(other.position);
          if (other !== this && d < perception) {
            steering.add(other.position);
            total++;
          }
        }
        
        if (total > 0) {
          steering.div(total);
          steering.sub(this.position);
          steering.normalize().mult(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
        }
        return steering;
      }

      separation(birds: Bird[]): Vector {
        const perception = 25;
        let steering = new Vector(0, 0);
        let total = 0;
        
        for (let other of birds) {
          const d = this.position.dist(other.position);
          if (other !== this && d < perception && d > 0) {
            let diff = this.position.clone().sub(other.position);
            diff.div(d);
            steering.add(diff);
            total++;
          }
        }
        
        if (total > 0) {
          steering.div(total);
          steering.normalize().mult(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
        }
        return steering;
      }

      seekTarget(): Vector {
        if (!this.targetPosition) return new Vector(0, 0);
        
        const desired = this.targetPosition.clone().sub(this.position);
        const d = desired.mag();
        
        if (d < 5) {
          const m = (d / 5) * this.maxSpeed * 0.2;
          desired.normalize().mult(m);
        } else if (d < 50) {
          const m = (d / 50) * this.maxSpeed;
          desired.normalize().mult(m);
        } else {
          desired.normalize().mult(this.maxSpeed);
        }
        
        const steer = desired.sub(this.velocity);
        steer.limit(this.maxForce * 3);
        return steer;
      }

      flock(birds: Bird[]): void {
        const alignment = this.align(birds);
        const cohesion = this.cohesion(birds);
        const separation = this.separation(birds);
        const target = this.seekTarget();

        if (currentPhase === 'forming' || currentPhase === 'holding') {
          alignment.mult(0.2);
          cohesion.mult(0.3);
          separation.mult(1.0);
          target.mult(5 * formationStrength);
        } else if (currentPhase === 'dispersing') {
          alignment.mult(1.5);
          cohesion.mult(1.0);
          separation.mult(2.5);
          target.mult(0.5);
        } else {
          alignment.mult(1.2);
          cohesion.mult(1.5);
          separation.mult(2.0);
        }

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
        this.acceleration.add(target);
      }

      update(): void {
        // Update trail
        this.trail.push({
          x: this.position.x,
          y: this.position.y,
          alpha: this.alpha * 0.3
        });
        if (this.trail.length > 8) {
          this.trail.shift();
        }
        
        // Update position
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
        
        // Update wing animation
        this.wingPhase += this.wingSpeed;
      }

      draw(): void {
        // Draw trail first
        ctx!.save();
        this.trail.forEach((point, i) => {
          ctx!.globalAlpha = point.alpha * (i / this.trail.length) * 0.3;
          ctx!.fillStyle = 'rgba(47, 127, 255, 0.2)';
          ctx!.beginPath();
          ctx!.arc(point.x, point.y, this.size * 0.3, 0, Math.PI * 2);
          ctx!.fill();
        });
        ctx!.restore();
        
        // Draw classic bird silhouette
        ctx!.save();
        ctx!.translate(this.position.x, this.position.y);
        
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        ctx!.rotate(angle);
        
        ctx!.globalAlpha = this.alpha;
        
        // Natural wing flapping
        const wingFlap = Math.sin(this.wingPhase);
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        const gliding = speed > 2; // Birds glide at higher speeds
        
        // Wing angles - more natural movement
        const wingAngle = gliding ? 
          -0.1 + wingFlap * 0.1 : // Gentle movement when gliding
          -0.2 + wingFlap * 0.6;   // More flapping when slow
        
        ctx!.strokeStyle = 'rgba(11, 21, 38, 0.9)'; // Dark silhouette
        ctx!.fillStyle = 'rgba(11, 21, 38, 0.9)';
        ctx!.lineWidth = this.size * 0.4;
        ctx!.lineCap = 'round';
        ctx!.lineJoin = 'round';
        
        // Classic bird shape - like the seagull silhouettes
        const wingspan = this.size * 3;
        const wingCurve = this.size * 1.2;
        
        ctx!.beginPath();
        
        // Left wing - curved like real bird
        ctx!.moveTo(0, 0);
        ctx!.quadraticCurveTo(
          -wingspan * 0.4, 
          -wingCurve * (1 + wingAngle),
          -wingspan,
          -wingCurve * (0.5 + wingAngle * 0.8)
        );
        
        // Body connection
        ctx!.moveTo(0, 0);
        
        // Right wing - mirrored curve
        ctx!.quadraticCurveTo(
          -wingspan * 0.4,
          wingCurve * (1 + wingAngle),
          -wingspan,
          wingCurve * (0.5 + wingAngle * 0.8)
        );
        
        ctx!.stroke();
        
        // Small body/head
        ctx!.beginPath();
        ctx!.arc(this.size * 0.3, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx!.fill();
        
        // Tiny tail
        ctx!.beginPath();
        ctx!.moveTo(-this.size * 0.5, 0);
        ctx!.lineTo(-this.size * 1.2, 0);
        ctx!.strokeStyle = 'rgba(11, 21, 38, 0.7)';
        ctx!.lineWidth = this.size * 0.2;
        ctx!.stroke();
        
        ctx!.restore();
      }
    }

    // M formation - adjusted for fewer birds
    const getLetterMPosition = (index: number, total: number): Vector => {
      const canvasWidth = canvas?.width || 0;
      const canvasHeight = canvas?.height || 0;
      const centerX = canvasWidth * 0.25;
      const centerY = canvasHeight * 0.5;
      const letterHeight = 150;
      const letterWidth = 120;
      
      const progress = index / Math.max(1, total - 1);
      
      if (progress <= 0.25) {
        const t = progress * 4;
        return new Vector(
          centerX - letterWidth/2,
          centerY + letterHeight/2 - t * letterHeight
        );
      } else if (progress <= 0.5) {
        const t = (progress - 0.25) * 4;
        return new Vector(
          centerX - letterWidth/2 + t * (letterWidth/2),
          centerY - letterHeight/2 + t * (letterHeight/2)
        );
      } else if (progress <= 0.75) {
        const t = (progress - 0.5) * 4;
        return new Vector(
          centerX + t * (letterWidth/2),
          centerY - t * (letterHeight/2)
        );
      } else {
        const t = (progress - 0.75) * 4;
        return new Vector(
          centerX + letterWidth/2,
          centerY - letterHeight/2 + t * letterHeight
        );
      }
    };

    // G formation - adjusted for fewer birds
    const getLetterGPosition = (index: number, total: number): Vector => {
      const canvasWidth = canvas?.width || 0;
      const canvasHeight = canvas?.height || 0;
      const centerX = canvasWidth * 0.75;
      const centerY = canvasHeight * 0.5;
      const radius = 75;
      
      const arcBirdCount = Math.floor(total * 0.8);
      const arrowBirdCount = total - arcBirdCount;
      
      if (index < arcBirdCount) {
        const progress = index / Math.max(1, arcBirdCount - 1);
        const startAngle = -Math.PI * 0.1;
        const arcLength = Math.PI * 1.6;
        const angle = startAngle - progress * arcLength;
        
        return new Vector(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        );
      } else {
        const arrowIndex = index - arcBirdCount;
        const arrowTipX = centerX + radius * 0.5;
        const arrowTipY = centerY;
        const arrowLength = -40;
        const arrowSpread = 35;
        
        const halfArrowBirds = Math.floor(arrowBirdCount / 2);
        
        if (arrowIndex < halfArrowBirds) {
          const t = halfArrowBirds > 1 ? arrowIndex / (halfArrowBirds - 1) : 0;
          return new Vector(
            arrowTipX + t * arrowLength,
            arrowTipY - t * arrowSpread
          );
        } else {
          const t = halfArrowBirds > 1 ? (arrowIndex - halfArrowBirds) / (halfArrowBirds - 1) : 0;
          return new Vector(
            arrowTipX + t * arrowLength,
            arrowTipY + t * arrowSpread
          );
        }
      }
    };

    const init = () => {
      birds = [];
      const canvasWidth = canvas?.width || 0;
      const canvasHeight = canvas?.height || 0;
      
      // MUCH FEWER birds for performance!
      const numberOfBirds = Math.min(300, Math.max(200, Math.floor(canvasWidth / 6)));
      
      console.log(`Optimized murmuration with only ${numberOfBirds} birds for better performance`);
      
      for (let i = 0; i < numberOfBirds; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        birds.push(new Bird(x, y));
      }
    };

    const updatePhase = () => {
      phaseTimer++;
      
      if (currentPhase === 'flow') {
        const isFirstFormation = time < 200;
        const flowDuration = isFirstFormation ? 100 : 300 + Math.random() * 120;
        
        if (phaseTimer > flowDuration) {
          currentPhase = 'forming';
          phaseTimer = 0;
          
          const halfBirds = Math.floor(birds.length / 2);
          
          birds.forEach((bird, index) => {
            if (index < halfBirds) {
              bird.letterType = 'M';
              bird.targetPosition = getLetterMPosition(index, halfBirds);
            } else {
              bird.letterType = 'G';
              bird.targetPosition = getLetterGPosition(index - halfBirds, birds.length - halfBirds);
            }
          });
        }
      } else if (currentPhase === 'forming' && phaseTimer > 60) {
        currentPhase = 'holding';
        phaseTimer = 0;
      } else if (currentPhase === 'holding' && phaseTimer > 60 + Math.random() * 60) {
        currentPhase = 'dispersing';
        phaseTimer = 0;
        
        birds.forEach(bird => {
          bird.targetPosition = null;
          bird.letterType = null;
        });
      } else if (currentPhase === 'dispersing' && phaseTimer > 60) {
        currentPhase = 'flow';
        phaseTimer = 0;
      }
      
      if (currentPhase === 'forming') {
        formationStrength = Math.min(1, formationStrength + 0.05);
      } else if (currentPhase === 'holding') {
        formationStrength = 1;
      } else if (currentPhase === 'dispersing') {
        formationStrength = Math.max(0, formationStrength - 0.03);
      } else {
        formationStrength = Math.max(0, formationStrength - 0.02);
      }
    };

    const animate = () => {
      const canvasWidth = canvas?.width || 0;
      const canvasHeight = canvas?.height || 0;
      
      // More fade for cleaner look with fewer birds
      ctx!.fillStyle = 'rgba(11, 21, 38, 0.08)';
      ctx!.fillRect(0, 0, canvasWidth, canvasHeight);
      
      updatePhase();
      
      birds.forEach(bird => {
        bird.edges();
        bird.flock(birds);
        bird.update();
        bird.draw();
      });
      
      time++;
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      init();
    };
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(resizeCanvas, 200);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1,
        pointerEvents: 'none'
      }} 
    />
  );
};

// LinkedIn Icon Component
const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V8h3v11ZM6.5 6.73c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764ZM19 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759Z"/>
  </svg>
);

// Enhanced PlexusBackground Component with Better Visibility
const PlexusBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let timeoutId: ReturnType<typeof setTimeout>;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      init();
    };
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(resizeCanvas, 200);
    }

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      pulse: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() * 2 - 1) * 0.3;
        this.speedY = (Math.random() * 2 - 1) * 0.3;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
      }

      update() {
        const canvasWidth = canvas?.width || 0;
        const canvasHeight = canvas?.height || 0;
        if (this.x > canvasWidth || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvasHeight || this.y < 0) this.speedY = -this.speedY;
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
      }

      draw() {
        const pulseSize = Math.sin(this.pulse) * 0.5 + 1;
        const alpha = (Math.sin(this.pulse) * 0.3 + 0.7);
        ctx!.fillStyle = `rgba(47, 107, 255, ${alpha})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size * pulseSize, 0, Math.PI * 2);
        ctx!.fill();
        
        // Add glow effect
        ctx!.shadowColor = 'rgba(47, 107, 255, 0.5)';
        ctx!.shadowBlur = 10;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = Math.floor((canvas?.width || 0) * (canvas?.height || 0) / 15000);
      for (let i = 0; i < Math.max(25, numberOfParticles); i++) {
        particles.push(new Particle());
      }
    };

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance = Math.sqrt(
            (particles[a].x - particles[b].x) ** 2 +
            (particles[a].y - particles[b].y) ** 2
          );
          const maxDistance = 150;
          if (distance < maxDistance) {
            opacityValue = 1 - distance / maxDistance;
            ctx!.strokeStyle = `rgba(47, 107, 255, ${opacityValue * 0.4})`;
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1,
        pointerEvents: 'none'
      }} 
    />
  );
};

// Enhanced FloatingElements Component with Better Visibility
const FloatingElements: React.FC = () => (
  <div style={{ 
    position: 'fixed', 
    inset: 0, 
    pointerEvents: 'none', 
    overflow: 'hidden', 
    zIndex: 0 
  }}>
    {/* Large floating orbs with enhanced visibility */}
    <div 
      className="floating-orb-1" 
      style={{ 
        position: 'absolute', 
        top: '15%', 
        left: '8%', 
        width: '300px', 
        height: '300px', 
        background: 'radial-gradient(circle, rgba(47,107,255,0.08) 0%, rgba(0,195,137,0.06) 50%, transparent 100%)', 
        borderRadius: '50%', 
        filter: 'blur(60px)',
        opacity: 0.8
      }} 
    />
    <div 
      className="floating-orb-2" 
      style={{ 
        position: 'absolute', 
        top: '50%', 
        right: '10%', 
        width: '400px', 
        height: '400px', 
        background: 'radial-gradient(circle, rgba(0,195,137,0.08) 0%, rgba(47,107,255,0.06) 50%, transparent 100%)', 
        borderRadius: '50%', 
        filter: 'blur(80px)',
        opacity: 0.7
      }} 
    />
    <div 
      className="floating-orb-3" 
      style={{ 
        position: 'absolute', 
        bottom: '25%', 
        left: '25%', 
        width: '250px', 
        height: '250px', 
        background: 'radial-gradient(circle, rgba(255,176,32,0.06) 0%, rgba(47,107,255,0.08) 50%, transparent 100%)', 
        borderRadius: '50%', 
        filter: 'blur(50px)',
        opacity: 0.9
      }} 
    />
    
    {/* Enhanced floating dots with glow */}
    <div 
      className="floating-dot-1" 
      style={{ 
        position: 'absolute', 
        top: '20%', 
        right: '20%', 
        width: '12px', 
        height: '12px', 
        background: 'rgba(47,107,255,0.8)', 
        borderRadius: '50%',
        boxShadow: '0 0 20px rgba(47,107,255,0.6), 0 0 40px rgba(47,107,255,0.4)'
      }} 
    />
    <div 
      className="floating-dot-2" 
      style={{ 
        position: 'absolute', 
        top: '65%', 
        left: '18%', 
        width: '8px', 
        height: '8px', 
        background: 'rgba(0,195,137,0.9)', 
        borderRadius: '50%',
        boxShadow: '0 0 15px rgba(0,195,137,0.7), 0 0 30px rgba(0,195,137,0.5)'
      }} 
    />
    <div 
      className="floating-dot-3" 
      style={{ 
        position: 'absolute', 
        bottom: '35%', 
        right: '30%', 
        width: '10px', 
        height: '10px', 
        background: 'rgba(255,176,32,0.8)', 
        borderRadius: '50%',
        boxShadow: '0 0 18px rgba(255,176,32,0.6), 0 0 35px rgba(255,176,32,0.4)'
      }} 
    />
    
    {/* Additional animated particles */}
    <div 
      className="floating-particle-large" 
      style={{ 
        position: 'absolute', 
        top: '40%', 
        left: '70%', 
        width: '6px', 
        height: '6px', 
        background: 'rgba(47,107,255,0.6)', 
        borderRadius: '50%',
        boxShadow: '0 0 12px rgba(47,107,255,0.4)'
      }} 
    />
    <div 
      className="floating-particle-medium" 
      style={{ 
        position: 'absolute', 
        top: '80%', 
        left: '60%', 
        width: '4px', 
        height: '4px', 
        background: 'rgba(0,195,137,0.7)', 
        borderRadius: '50%',
        boxShadow: '0 0 10px rgba(0,195,137,0.5)'
      }} 
    />
  </div>
);

// SectionTransition Component
const SectionTransition: React.FC<{ 
  variant?: 'gradient' | 'wave' | 'dots' | 'zigzag';
  color?: 'blue' | 'teal' | 'purple';
}> = ({ variant = 'gradient', color = 'blue' }) => {
  const colorClasses = {
    blue: 'rgba(47,107,255,0.1)',
    teal: 'rgba(0,195,137,0.1)', 
    purple: 'rgba(255,176,32,0.1)'
  };

  if (variant === 'wave') {
    return (
      <div style={{ position: 'relative', height: '80px', overflow: 'hidden' }}>
        <svg 
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%' }}
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill={colorClasses[color]}
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="rgba(47,107,255,0.05)"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="section-transition-dots" style={{ 
        position: 'relative', 
        height: '60px', 
        overflow: 'hidden', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className={`transition-dot-${i}`}
              style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: colorClasses[color],
                boxShadow: `0 0 10px ${colorClasses[color]}`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100px', overflow: 'hidden' }}>
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: `linear-gradient(to bottom, ${colorClasses[color]}, transparent)`
      }}>
        <div className="floating-particle-1" style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '20%', 
          width: '6px', 
          height: '6px', 
          background: 'rgba(47,107,255,0.6)', 
          borderRadius: '50%',
          boxShadow: '0 0 8px rgba(47,107,255,0.4)'
        }} />
        <div className="floating-particle-2" style={{ 
          position: 'absolute', 
          top: '30%', 
          right: '30%', 
          width: '8px', 
          height: '8px', 
          background: 'rgba(0,195,137,0.5)', 
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(0,195,137,0.3)'
        }} />
      </div>
    </div>
  );
};

// Team data with exact copy from the prompt.md
const leadership = [
  { 
    name: "Igor Kolos", 
    role: "Co-Founder", 
    imageUrl: "/images/igor.jpg", 
    description: "Defense-grade AI specialist with 10+ years deploying artificial intelligence at scale across military, construction, mining, and energy sectors (projects valued at $50M+). Expert in privacy-first automation with a focus on measurable ROI.", 
    linkedin: "https://www.linkedin.com/in/igor-kolos-a412a377" 
  },
  { 
    name: "Alexey Iskrov", 
    role: "Co-Founder", 
    imageUrl: "/images/alexey.jpg", 
    description: "Senior data engineer with 20+ years in edge AI systems and education. Specializes in privacy-centric video analytics, edge computing, and large-scale infrastructure data solutions.", 
    linkedin: "https://www.linkedin.com/in/iskrov" 
  },
  { 
    name: "Sergii Vlas", 
    role: "Co-Founder", 
    imageUrl: "/images/sergii.jpg", 
    description: "AI strategist with 15+ years leading high-impact national-scale projects, including military-grade counter-propaganda, cognitive warfare analytics, and smart-city platforms serving over 20M users. Honored for exceptional contributions to national security innovation.", 
    linkedin: "https://www.linkedin.com/in/sergii-vlas" 
  }
];

// Enhanced Leadership Card with 3D effects
const LeadershipCard: React.FC<{ member: typeof leadership[0]; index: number }> = ({ member, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const rotateX = ((y / height) - 0.5) * -20;
      const rotateY = ((x / width) - 0.5) * 20;
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.08, 1.08, 1.08)`;
      element.style.boxShadow = '0 25px 50px -12px rgba(47, 107, 255, 0.3)';
    };

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      element.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="card scroll-animate team-card"
      style={{ 
        padding: '32px', 
        textAlign: 'center', 
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        transitionDelay: `${300 + index * 150}ms`,
        willChange: 'transform',
        transformStyle: 'preserve-3d'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <img 
          src={member.imageUrl} 
          alt={`Headshot of ${member.name}, ${member.role}`} 
          style={{ 
            width: '100px', 
            height: '100px', 
            margin: '0 auto 20px', 
            borderRadius: '50%', 
            objectFit: 'cover', 
            border: '3px solid var(--stroke)',
            transition: 'all 0.4s ease',
            position: 'relative',
            zIndex: 2
          }} 
        />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <h3 style={{ 
            fontFamily: 'Newsreader, serif', 
            fontSize: '22px', 
            fontWeight: 600, 
            color: 'var(--ink)', 
            margin: 0 
          }}>
            {member.name}
          </h3>
          <a 
            href={member.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label={`LinkedIn profile of ${member.name}`} 
            style={{ 
              color: 'var(--ink-muted)', 
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              zIndex: 3,
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-1)';
              e.currentTarget.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--ink-muted)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <LinkedInIcon style={{ width: '22px', height: '22px' }} />
          </a>
        </div>
        <p style={{ color: 'var(--accent-2)', fontWeight: 500, marginBottom: '20px', fontSize: '17px' }}>
          {member.role}
        </p>
        <p style={{ 
          color: 'var(--ink-muted)', 
          textAlign: 'left', 
          fontSize: '14px', 
          lineHeight: 1.6,
          margin: 0 
        }}>
          {member.description}
        </p>
      </div>
    </div>
  );
};

function App() {
  // Enhanced scroll animations with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: 'var(--bg-1)', minHeight: '100vh', color: 'var(--ink)', position: 'relative' }}>
      <style>{`
        /* Enhanced animations */
        .scroll-animate {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .scroll-animate.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Enhanced floating animations with better visibility */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-25px) translateX(20px) rotate(3deg); }
          50% { transform: translateY(-15px) translateX(-12px) rotate(-2deg); }
          75% { transform: translateY(-35px) translateX(15px) rotate(2deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          25% { transform: translateY(-20px) translateX(-18px) scale(1.15); }
          50% { transform: translateY(-40px) translateX(25px) scale(0.85); }
          75% { transform: translateY(-12px) translateX(-8px) scale(1.1); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          33% { transform: translateY(-18px) translateX(12px) scale(1.2); }
          66% { transform: translateY(-30px) translateX(-15px) scale(0.8); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes particle-dance {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); }
          25% { transform: translateY(-15px) translateX(10px) scale(1.3) rotate(90deg); }
          50% { transform: translateY(-25px) translateX(-8px) scale(0.8) rotate(180deg); }
          75% { transform: translateY(-10px) translateX(12px) scale(1.1) rotate(270deg); }
        }
        
        /* Apply enhanced floating animations */
        .floating-orb-1 { animation: float-slow 18s ease-in-out infinite; }
        .floating-orb-2 { animation: float-medium 14s ease-in-out infinite; }
        .floating-orb-3 { animation: float-fast 10s ease-in-out infinite; }
        
        .floating-dot-1 { animation: pulse-glow 3s ease-in-out infinite, particle-dance 8s ease-in-out infinite; }
        .floating-dot-2 { animation: pulse-glow 4s ease-in-out infinite 1s, particle-dance 6s ease-in-out infinite 2s; }
        .floating-dot-3 { animation: pulse-glow 2.5s ease-in-out infinite 0.5s, particle-dance 7s ease-in-out infinite 1s; }
        
        .floating-particle-large { animation: particle-dance 9s ease-in-out infinite, pulse-glow 3.5s ease-in-out infinite; }
        .floating-particle-medium { animation: particle-dance 7s ease-in-out infinite 1.5s, pulse-glow 4s ease-in-out infinite 0.8s; }
        
        .floating-particle-1 { animation: float-fast 6s ease-in-out infinite, pulse-glow 2.8s ease-in-out infinite; }
        .floating-particle-2 { animation: float-medium 8s ease-in-out infinite 2s, pulse-glow 3.2s ease-in-out infinite 1.2s; }
        
        .transition-dot-0 { animation: pulse-glow 2s ease-in-out infinite; }
        .transition-dot-1 { animation: pulse-glow 2s ease-in-out infinite 0.3s; }
        .transition-dot-2 { animation: pulse-glow 2s ease-in-out infinite 0.6s; }
        .transition-dot-3 { animation: pulse-glow 2s ease-in-out infinite 0.9s; }
        .transition-dot-4 { animation: pulse-glow 2s ease-in-out infinite 1.2s; }
        
        /* Team card enhancements */
        .team-card:hover {
          border-color: var(--accent-1);
        }
        
        .team-card:hover img {
          border-color: var(--accent-2);
          box-shadow: 0 0 20px rgba(47, 107, 255, 0.4);
        }
        
        /* Header hover effects */
        nav a:hover {
          color: var(--accent-1) !important;
          transform: translateY(-2px);
        }
        
        /* Button enhancements */
        .btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 25px rgba(47, 107, 255, 0.3);
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Global floating elements - NOW VISIBLE */}
      <FloatingElements />

      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        background: 'rgba(11, 21, 38, 0.95)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--stroke)',
        zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
          <div style={{ fontFamily: 'Newsreader, serif', fontSize: '22px', fontWeight: 600, color: 'var(--ink)' }}>
            MyGlobal Group
          </div>
          <nav style={{ display: 'flex', gap: '40px' }}>
            <a href="/" style={{ color: 'var(--ink)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)', position: 'relative' }}>Home</a>
            <a href="/crowd-analytics" style={{ color: 'var(--ink)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)', position: 'relative' }}>Crowd Analytics</a>
            <a href="/team" style={{ color: 'var(--ink)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)', position: 'relative' }}>Team</a>
            <a href="/contact" style={{ color: 'var(--ink)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)', position: 'relative' }}>Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section with Flock Animation */}
      <section style={{ 
        background: `
          radial-gradient(1200px at 20% 10%, rgba(47,107,255,0.15), transparent 60%), 
          linear-gradient(180deg, #0C1729 0%, #0A1322 100%)
        `,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Flock of Birds Animation - Behind Text */}
        <FlockAnimation />
        
        <div className="container scroll-animate" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
          <h1 style={{ 
            fontFamily: 'Newsreader, serif', 
            fontSize: 'clamp(42px, 6vw, 76px)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '32px',
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
            position: 'relative',
            zIndex: 10
          }}>
            Dual-Use Strategy and AI Execution for Complex Environments.
          </h1>
          <p className="scroll-animate" style={{ 
            fontSize: 'clamp(19px, 2.5vw, 26px)', 
            color: 'var(--ink-muted)', 
            marginBottom: '56px',
            maxWidth: '650px',
            margin: '0 auto 56px',
            transitionDelay: '300ms',
            lineHeight: 1.5,
            position: 'relative',
            zIndex: 10
          }}>
            Strategic consulting services bridging defense innovation and civilian applications through AI-powered solutions and battlefield-validated technologies.
          </p>
          <div className="scroll-animate" style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', transitionDelay: '600ms', position: 'relative', zIndex: 10 }}>
            <a href="#contact" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>Book a briefing</a>
            <a href="#contact" className="btn btn-secondary" style={{ fontSize: '18px', padding: '16px 32px' }}>Contact us</a>
          </div>
        </div>
      </section>

      {/* Section Transition */}
      <SectionTransition variant="wave" color="blue" />

      {/* Who we are Section */}
      <section style={{ padding: '140px 0', background: 'var(--bg-1)', position: 'relative' }}>
        <div className="container">
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ 
              fontFamily: 'Newsreader, serif', 
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 600,
              marginBottom: '20px',
              color: 'var(--ink)',
              letterSpacing: '-0.01em'
            }}>
              Who we are
            </h2>
            <p style={{ color: 'var(--ink-muted)', fontSize: '20px', lineHeight: 1.4 }}>
              An unparalleled team of battle-hardened technologists and strategists.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '40px' }}>
            {/* All 6 service pillars with enhanced styling */}
            {[
              { title: "Defense & Security", delay: 100, items: [
                "Battlefield Validation & TRL Acceleration — live-combat trials that push dual-use tech from prototype to TRL 7+.",
                "Combat Trend Intelligence — data-driven briefs on how drones, AI, and EW reshape force composition and platform relevance.",
                "Dual-Use Tech Scouting & Integration — source frontline innovations and adapt them for civilian markets."
              ]},
              { title: "Enterprise & Industry", delay: 200, items: [
                "Industry AI Horizon Scanning & ROI Roadmaps — map emerging trends, size value pools, and build multi-year investment strategies.",
                "Industry Transformation Programs — end-to-end AI-adoption playbooks covering budgeting, vendor selection, and change management.",
                "Implementation PMO & Change Acceleration — orchestrate pilots, vendor partnerships, and talent upskilling to embed AI at speed and scale."
              ]},
              { title: "Education & Training", delay: 300, items: [
                "Executive War-Room Workshops — red-team scenarios and crisis simulations translating frontline insight into boardroom action.",
                "Executive AI Education — targeted workshops and briefings that turn technical advances into decisive strategy."
              ]},
              { title: "Healthcare", delay: 400, items: [
                "AI-Powered Support for Autistic Children — Smart Room sensor-AI kit deciphers each child's stress and engagement cues in real time, giving families and clinicians instant guidance and restoring up to ten calm hours weekly."
              ]},
              { title: "AI Behavioral Analysis", delay: 500, items: [
                "Privacy-First Crowd-Analytics Layer — converts ordinary cameras into live dashboards of audience mood and engagement, clustering people by real-time stance without storing personal identities."
              ]},
              { title: "Logistics & Supply Chain", delay: 600, items: [
                "Ukraine Grain Corridor Risk-Free Route Optimisation — AI blends satellite AIS feeds, conflict-zone intelligence, and other data to chart dynamic, low-risk maritime corridors that let grain convoys sidestep Russian interdiction."
              ]}
            ].map((service, idx) => (
              <div key={service.title} className="card scroll-animate" style={{ 
                padding: '40px', 
                transitionDelay: `${service.delay}ms`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: '26px', fontWeight: 600, marginBottom: '24px', color: 'var(--ink)' }}>
                    {service.title}
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {service.items.map((item, itemIdx) => (
                      <li key={itemIdx} style={{ marginBottom: '16px', paddingLeft: '20px', position: 'relative', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--accent-2)', fontSize: '18px' }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Transition */}
      <SectionTransition variant="dots" color="teal" />

      {/* Enhanced Team Section */}
      <section style={{ padding: '140px 0', background: 'var(--bg-2)', position: 'relative' }}>
        <div className="container">
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h3 style={{ 
              fontFamily: 'Newsreader, serif', 
              fontSize: 'clamp(28px, 3vw, 36px)',
              fontWeight: 600,
              marginBottom: '20px',
              color: 'var(--ink)'
            }}>
              Leadership Team
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            {leadership.map((member, index) => (
              <LeadershipCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Transition */}
      <SectionTransition variant="wave" color="purple" />

      {/* Trust Strip */}
      <section className="scroll-animate" style={{ padding: '80px 0', background: 'var(--bg-1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '40px', fontSize: '16px' }}>
            Selected projects & partners
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', opacity: 0.6 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ 
                width: '140px', 
                height: '70px', 
                background: 'var(--stroke)', 
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}></div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Transition */}
      <SectionTransition variant="gradient" color="blue" />

      {/* CTA Section */}
      <section className="scroll-animate" style={{ padding: '100px 0', background: 'var(--bg-2)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontFamily: 'Newsreader, serif', 
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 600,
            marginBottom: '28px',
            color: 'var(--ink)'
          }}>
            Work with us
          </h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '20px', marginBottom: '40px', lineHeight: 1.4 }}>
            Strategic consulting for defense, enterprise, and government clients
          </p>
          <a href="#contact" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 40px' }}>Book a briefing</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 0', background: 'var(--bg-1)', borderTop: '1px solid var(--stroke)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: 'Newsreader, serif', fontSize: '20px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px' }}>
              MyGlobal Group
            </div>
            <p style={{ color: 'var(--ink-muted)', fontSize: '16px', marginBottom: '20px' }}>
              Strategic consulting at the intersection of defense, enterprise, and AI innovation
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
              {['Home', 'Crowd Analytics', 'Team', 'Contact', 'Privacy', 'Terms'].map((link) => (
                <a key={link} href={`/${link.toLowerCase().replace(' ', '-')}`} style={{ 
                  color: 'var(--ink-muted)', 
                  fontSize: '15px', 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}>{link}</a>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: '28px', borderTop: '1px solid var(--stroke)', color: 'var(--ink-muted)', fontSize: '14px' }}>
            © {new Date().getFullYear()} MyGlobal Group • myglobal.group
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 