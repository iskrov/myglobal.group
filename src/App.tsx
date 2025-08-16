import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ConsultingPage from './pages/ConsultingPage';
import TeamPage from './pages/TeamPage';
import CommunityPage from './pages/CommunityPage';
import HomePage from './pages/HomePage';
import TeamSphere from './components/TeamSphere';
import { useScrollReveal } from './components/ScrollReveal';
import AnimatedNumber from './components/AnimatedNumber';

// NOTE: The flock animation is now a dedicated component used only inside the hero section (HomePage)
// Any global instance here would overlap sections, so the implementation was moved to components/FlockAnimation.tsx
const FlockAnimation = () => null;

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
const FloatingElements: React.FC = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  
  useEffect(() => {
    const updateTheme = () => {
      setIsLightMode(document.documentElement.getAttribute('data-theme') === 'light');
    };
    
    // Initial check
    updateTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
  <div style={{
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 0
  }}>
      {/* Large floating orbs with theme-aware visibility */}
    <div
      className="floating-orb-1"
      style={{
        position: 'absolute',
        top: '15%',
        left: '8%',
        width: '300px',
        height: '300px',
          background: isLightMode 
            ? 'radial-gradient(circle, rgba(47,107,255,0.06) 0%, rgba(0,195,137,0.04) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(47,107,255,0.08) 0%, rgba(0,195,137,0.06) 50%, transparent 100%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
          opacity: isLightMode ? 0.6 : 0.8
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
          background: isLightMode
            ? 'radial-gradient(circle, rgba(0,195,137,0.06) 0%, rgba(47,107,255,0.04) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(0,195,137,0.08) 0%, rgba(47,107,255,0.06) 50%, transparent 100%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
          opacity: isLightMode ? 0.5 : 0.7
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
          background: isLightMode
            ? 'radial-gradient(circle, rgba(255,176,32,0.04) 0%, rgba(47,107,255,0.06) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(255,176,32,0.06) 0%, rgba(47,107,255,0.08) 50%, transparent 100%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
          opacity: isLightMode ? 0.7 : 0.9
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
          background: isLightMode ? 'rgba(47,107,255,0.6)' : 'rgba(47,107,255,0.8)',
        borderRadius: '50%',
          boxShadow: isLightMode 
            ? '0 0 15px rgba(47,107,255,0.4), 0 0 30px rgba(47,107,255,0.2)'
            : '0 0 20px rgba(47,107,255,0.6), 0 0 40px rgba(47,107,255,0.4)'
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
          background: isLightMode ? 'rgba(0,195,137,0.7)' : 'rgba(0,195,137,0.9)',
        borderRadius: '50%',
          boxShadow: isLightMode
            ? '0 0 12px rgba(0,195,137,0.5), 0 0 25px rgba(0,195,137,0.3)'
            : '0 0 15px rgba(0,195,137,0.7), 0 0 30px rgba(0,195,137,0.5)'
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
          background: isLightMode ? 'rgba(255,176,32,0.6)' : 'rgba(255,176,32,0.8)',
        borderRadius: '50%',
          boxShadow: isLightMode
            ? '0 0 15px rgba(255,176,32,0.4), 0 0 30px rgba(255,176,32,0.2)'
            : '0 0 18px rgba(255,176,32,0.6), 0 0 35px rgba(255,176,32,0.4)'
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
          background: isLightMode ? 'rgba(47,107,255,0.4)' : 'rgba(47,107,255,0.6)',
        borderRadius: '50%',
          boxShadow: isLightMode ? '0 0 8px rgba(47,107,255,0.3)' : '0 0 12px rgba(47,107,255,0.4)'
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
          background: isLightMode ? 'rgba(0,195,137,0.5)' : 'rgba(0,195,137,0.7)',
        borderRadius: '50%',
          boxShadow: isLightMode ? '0 0 8px rgba(0,195,137,0.4)' : '0 0 10px rgba(0,195,137,0.5)'
      }}
    />
        </div>
);
};

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

// Use isolated TeamSphere component instead of inline version
import TeamSphere from './components/TeamSphere';

const ScrollIndicator: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a href={href} className="scroll-animate" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 36, color: 'var(--ink-muted)', textDecoration: 'none' }}>
    <span style={{ fontSize: 14 }}>{label}</span>
    <span style={{ fontSize: 22 }}>↓</span>
  </a>
);

const AnimatedNumber: React.FC<{ target: number; duration?: number; formatter?: (n: number) => string }> = ({ target, duration = 1400, formatter }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const value = target * p;
      const out = formatter ? formatter(value) : Math.round(value).toString();
      if (spanRef.current) spanRef.current.textContent = out;
      if (p < 1) requestAnimationFrame(step);
    };
    const r = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r);
  }, [target, duration, formatter]);
  return <span ref={spanRef}>0</span>;
};

const CredibilityStats: React.FC = () => (
  <section style={{ padding: '80px 0', background: 'var(--bg-1)', borderTop: '1px solid var(--stroke)', borderBottom: '1px solid var(--stroke)', position: 'relative', overflow: 'hidden' }}>
    {/* Subtle world grid lines */}
    <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }} viewBox="0 0 1200 600" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grid" x1="0" x2="1">
          <stop offset="0%" stopColor="#2F6BFF" />
          <stop offset="100%" stopColor="#00C389" />
        </linearGradient>
      </defs>
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`v-${i}`} x1={(i+1)*60} y1="0" x2={(i+1)*60} y2="600" stroke="url(#grid)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h-${i}`} x1="0" y1={(i+1)*60+60} x2="1200" y2={(i+1)*60+60} stroke="url(#grid)" strokeWidth="0.5" />
      ))}
    </svg>
    <div className="container" style={{ position: 'relative' }}>
      <div className="scroll-animate" style={{ textAlign: 'left', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--ink)' }}>Credibility</h2>
          </div>
      <div className="scroll-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        <div className="card card-hover" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 40, color: 'var(--accent-1)', marginBottom: 8 }}>📈</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>
            $<AnimatedNumber target={1000000000} formatter={(v) => `${(v/1e9).toFixed(1)}B+`} />
        </div>
          <div style={{ color: 'var(--ink-muted)' }}>Cumulative product revenue</div>
          </div>
        <div className="card card-hover" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 40, color: 'var(--accent-1)', marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>
            <AnimatedNumber target={20000000} formatter={(v) => `${(v/1e6).toFixed(1)}M+`} />
        </div>
          <div style={{ color: 'var(--ink-muted)' }}>Users</div>
          </div>
        <div className="card card-hover" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 40, color: 'var(--accent-1)', marginBottom: 8 }}>🌍</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>
            <AnimatedNumber target={20} formatter={(v) => `${Math.round(v)}+`} /> countries
                </div>
          <div style={{ color: 'var(--ink-muted)' }}>Project reach</div>
              </div>
          </div>
        </div>
      </section>
);

const StudioCTA: React.FC = () => (
  <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div className="container">
      <div className="scroll-animate" style={{ textAlign: 'left', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--ink)' }}>Join us right now</h2>
          </div>
      <div className="scroll-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
        {[
          { n: '1', text: '$1.5M — closing the Sigen AI round this fall.' },
          { n: '2', text: 'Smart Block Homes — opening a test round this fall.' },
          { n: '3', text: '10+ active AI projects in portfolio.' }
        ].map((c) => (
          <div key={c.n} className="card" style={{ padding: 24, background: 'rgba(47,107,255,0.08)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-2)', marginBottom: 10 }}>{c.n}</div>
            <div style={{ color: 'var(--ink)' }}>{c.text}</div>
          </div>
            ))}
          </div>
      <div className="scroll-animate" style={{ display: 'flex', gap: 16, marginTop: 28 }}>
        <a href="#contact" className="btn btn-primary" style={{ padding: '12px 22px' }}>Join Us</a>
        <a href="#projects" className="btn" style={{ padding: '12px 22px', border: '1px solid var(--stroke)', color: 'var(--ink)' }}>Explore Portfolio</a>
          </div>
        </div>
      </section>
);

const ConsultingSection: React.FC = () => (
  <section id="consulting" style={{ padding: '120px 0', background: 'var(--bg-1)' }}>
    <div className="container">
      <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: 'var(--ink)' }}>Consulting</h2>
        <p style={{ color: 'var(--ink-muted)', fontSize: 20, maxWidth: 900, margin: '12px auto 0' }}>
          AI-Powered Strategy for Complex Environments. Delivering mission-critical results for governments and industries through advanced AI solutions, precision data analytics, and rapid execution.
        </p>
      </div>
      <div className="scroll-animate" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>Success Stories</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
          {[
            'Digital Transformation of the City of Burnaby — modernizing municipal operations with AI-driven automation, integrated databases, and advanced data intelligence.',
            'AI-Enabled Transportation for the City of Ottawa — deploying predictive analytics to optimize mobility, enhance safety, and manage traffic flow in real time.',
            'AI-Powered Reconstruction for the Ministry of Infrastructure of Ukraine — applying AI analytics to accelerate national infrastructure recovery.',
            'Many other high-impact initiatives — spanning public safety, infrastructure resilience, and enterprise AI transformation.'
          ].map((t, i) => (
            <li key={i} className="card" style={{ padding: 18, borderLeft: '4px solid var(--accent-2)', background: 'var(--bg-2)' }}>{t}</li>
          ))}
        </ul>
          </div>
        </div>
      </section>
);

const CommunitySection: React.FC = () => (
  <section id="community" style={{ padding: '120px 0', background: 'var(--bg-2)' }}>
        <div className="container">
      <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: 'var(--ink)' }}>Community</h2>
        <p style={{ color: 'var(--ink-muted)', fontSize: 20, maxWidth: 900, margin: '12px auto 0' }}>
          Community of AI Excellence. A high-calibre network of top AI founders, elite scientists, and prominent mentors across the U.S. and Canada.
            </p>
          </div>
      <div className="scroll-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>BRAIVE</h3>
          <p style={{ color: 'var(--ink-muted)' }}>BRAIVE is MGG’s unique community bringing together leading developers in AI and computer vision from the U.S., Canada, the U.K., and beyond — united by a shared focus on cutting-edge innovation in visual intelligence.</p>
                  </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>Web Summit Vancouver 2025</h3>
          <p style={{ color: 'var(--ink-muted)' }}>Our team is part of Web Summit Vancouver 2025, a gathering of the brightest minds in technology, business, and policy.</p>
              </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>Techstars</h3>
          <p style={{ color: 'var(--ink-muted)' }}>We are proud alumni of Techstars, one of the world’s most prestigious accelerator programs, enabling us to scale faster and execute bold AI projects.</p>
            </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>SXSW</h3>
          <p style={{ color: 'var(--ink-muted)' }}>Our team represented Canada at the South by Southwest (SXSW) Conference in Austin — a leading platform for emerging technology.</p>
                  </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>Creative Destruction Lab (CDL)</h3>
          <p style={{ color: 'var(--ink-muted)' }}>As alumni of the Creative Destruction Lab, we collaborated with world-class experts to refine ventures and push AI innovation toward measurable real‑world impact.</p>
            </div>
          </div>
        </div>
      </section>
);

// Main layout component with theme management and header
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state management
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setIsMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDarkMode(shouldUseDark);
    document.documentElement.setAttribute('data-theme', shouldUseDark ? 'dark' : 'light');
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    const themeValue = newTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeValue);
    localStorage.setItem('theme', themeValue);
  };

  // Use shared ScrollReveal hook instead of inline observer
  useScrollReveal();

  return (
    <div style={{ background: 'var(--bg-1)', minHeight: '100vh', color: 'var(--ink)', position: 'relative' }}>
      <style>{`
        .card-hover { transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-3px); border-color: rgba(47,107,255,0.6); box-shadow: 0 16px 40px rgba(0,0,0,0.25); }
        .btn:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 10px 25px rgba(47, 107, 255, 0.3); }
        nav a:hover { color: var(--accent-1) !important; transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        background: isDarkMode ? 'rgba(11, 21, 38, 0.95)' : 'rgba(248, 250, 252, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--stroke)',
        zIndex: 100,
        transition: 'background-color 0.3s ease'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
          <Link to="/" style={{ fontFamily: 'Newsreader, serif', fontSize: '22px', fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>
            MyGlobal Group
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Desktop nav */}
            <nav className="desktop-nav" style={{ display: 'flex', gap: '32px' }}>
              <Link to="/projects" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Projects</Link>
              <Link to="/consulting" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Consulting</Link>
              <Link to="/team" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Team</Link>
              <Link to="/community" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Community</Link>
              <a href="/#contact" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Contact</a>
            </nav>
            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(v => !v)} className="btn mobile-menu-btn" style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: '1px solid var(--stroke)', background: 'transparent', color: 'var(--ink)' }} aria-label="Toggle menu">☰</button>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
                style={{ 
                background: 'none',
                border: '2px solid var(--stroke)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
        display: 'flex',
        alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                  transition: 'all 0.3s ease',
                      color: 'var(--ink)',
                fontSize: '18px'
                }}
                onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-1)';
                e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--stroke)';
                  e.currentTarget.style.transform = 'scale(1)';
              }}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
              </div>
          </div>
      </header>
      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="container" style={{ padding: '8px 20px 16px' }}>
          <nav className="mobile-nav scroll-animate" data-immediate="true" style={{ display: 'grid', gap: 12 }}>
            <Link onClick={() => setIsMenuOpen(false)} to="/projects" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Projects</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/consulting" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Consulting</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/team" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Team</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/community" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Community</Link>
            <a onClick={() => setIsMenuOpen(false)} href="/#contact" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Contact</a>
          </nav>
        </div>
      )}

      {children}

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
              {[
                { label: 'Consulting', href: '/consulting' },
                { label: 'Community', href: '/community' },
                { label: 'Projects', href: '/projects' },
                { label: 'Team', href: '/team' },
                { label: 'Contact', href: '/#contact' }
              ].map((link) => (
                <Link key={link.label} to={link.href} style={{
                  color: 'var(--ink-muted)',
                  fontSize: '15px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}>{link.label}</Link>
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
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        } />
        <Route path="/projects" element={<MainLayout><ProjectsPage /></MainLayout>} />
        <Route path="/consulting" element={<MainLayout><ConsultingPage /></MainLayout>} />
        <Route path="/team" element={<MainLayout><TeamPage /></MainLayout>} />
        <Route path="/community" element={<MainLayout><CommunityPage /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App; 
