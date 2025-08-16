import React from 'react';
import FlockAnimation from '../components/FlockAnimation';
import { Link } from 'react-router-dom';
import TeamSphere from '../components/TeamSphere';
import AnimatedNumber from '../components/AnimatedNumber';

const HomePage: React.FC = () => {
  // Featured projects snapshot (same three as on Projects page)
  const projects = [
    {
      id: 'sigen',
      title: 'Sigen AI',
      status: '$1.5M — closing round this fall',
      description: 'Video data management platform that transforms your video footage into privacy-compliant and monetizable data sets.',
      image: '/images/sigen-preview.jpg',
      link: 'https://sigen.ai',
      category: 'AI/Computer Vision'
    },
    {
      id: 'smart-block-homes',
      title: 'Smart Block Homes',
      status: 'Opening test round this fall',
      description: 'Revolutionary construction technology using smart blocks for rapid, sustainable building solutions.',
      image: '/images/smart-blocks-preview.jpg',
      link: 'https://smartblocks.homes',
      category: 'Construction Tech'
    },
    {
      id: 'breeze-traffic',
      title: 'Breeze Traffic',
      status: 'Piloting with Invest Ottawa',
      description: 'Smart city solutions for climate emergency - helping cities measure and reduce carbon emissions from traffic.',
      image: '/images/breeze-preview.jpg',
      link: 'https://breezetraffic.com',
      category: 'Smart Cities'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section id="studio" className="ocean-mist" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <FlockAnimation />
        <div className="container scroll-animate" data-immediate="true" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
          <div className="glass hero-glass">
            <h1 style={{
              fontFamily: 'Newsreader, serif',
              fontSize: 'clamp(34px, 7vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.08,
              margin: 0,
              color: 'var(--ink)',
              wordBreak: 'break-word'
            }}>MGG Venture Studio</h1>
            <div style={{ height: 'clamp(12px, 2.5vw, 24px)' }} />
            <p style={{ color: 'var(--ink)', fontSize: 'clamp(16px, 2.8vw, 20px)', lineHeight: 1.55, margin: 0 }}>
              We build lovable products and bring them to international markets.
            </p>
            <div style={{ marginTop: 'clamp(20px, 4vw, 28px)', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="#projects" className="btn btn-primary" style={{ fontSize: 'clamp(15px, 2.6vw, 18px)', padding: 'clamp(10px, 2.4vw, 14px) clamp(18px, 3.8vw, 28px)', textDecoration: 'none' }}>Explore Projects</a>
              <a href="#consulting" className="btn" style={{ fontSize: 'clamp(15px, 2.6vw, 18px)', padding: 'clamp(10px, 2.4vw, 14px) clamp(18px, 3.8vw, 28px)', border: '1px solid var(--stroke)', color: 'var(--ink)', textDecoration: 'none' }}>Explore Consulting</a>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Results (moved up under Hero) */}
      <section style={{ padding: '80px 0', background: 'var(--bg-1)', borderTop: '1px solid var(--stroke)', borderBottom: '1px solid var(--stroke)', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @keyframes particleFloat {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            33% { transform: translate(10px, -15px) scale(1.1); opacity: 0.7; }
            66% { transform: translate(-8px, -25px) scale(0.9); opacity: 0.5; }
          }
          @keyframes energyPulse {
            0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(1) rotate(360deg); opacity: 0.3; }
          }
          @keyframes chartGrow {
            0% { stroke-dasharray: 0 100; }
            100% { stroke-dasharray: 100 0; }
          }
          @keyframes orbitalSpin {
            from { transform: rotate(0deg) translateX(35px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(35px) rotate(-360deg); }
          }
          @keyframes dataStream {
            0% { transform: translateY(0) scale(0); opacity: 0; }
            20% { transform: translateY(-10px) scale(1); opacity: 1; }
            80% { transform: translateY(-40px) scale(1); opacity: 1; }
            100% { transform: translateY(-60px) scale(0); opacity: 0; }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(47, 107, 255, 0.3), inset 0 0 20px rgba(47, 107, 255, 0.1); }
            50% { box-shadow: 0 0 40px rgba(0, 195, 137, 0.4), inset 0 0 30px rgba(0, 195, 137, 0.2); }
          }
          .metric-card {
            position: relative;
            padding: 32px;
            border-radius: 20px;
            background: linear-gradient(135deg, var(--bg-2) 0%, rgba(47, 107, 255, 0.05) 100%);
            border: 1px solid rgba(47, 107, 255, 0.2);
            animation: glowPulse 4s ease-in-out infinite;
            overflow: hidden;
            transition: all 0.4s ease;
          }
          .metric-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(from 0deg, transparent, rgba(47, 107, 255, 0.1), transparent);
            animation: energyPulse 8s linear infinite;
            pointer-events: none;
          }
          .metric-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 15px 40px rgba(47, 107, 255, 0.3);
          }
        `}</style>
        
        {/* Background particles */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 4,
                height: 4,
                background: `linear-gradient(45deg, #2F6BFF, #00C389)`,
                borderRadius: '50%',
                left: `${10 + (i * 7)}%`,
                top: `${20 + (i * 5)}%`,
                animation: `particleFloat ${3 + (i * 0.5)}s ease-in-out infinite ${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="scroll-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            
            {/* Revenue Card */}
            <div className="metric-card">
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 20px' }}>
                {/* Orbital rings */}
                <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(47, 107, 255, 0.3)', borderRadius: '50%', animation: 'energyPulse 6s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(0, 195, 137, 0.4)', borderRadius: '50%', animation: 'energyPulse 4s linear infinite reverse' }} />
                
                {/* Orbiting particles */}
                <div style={{ position: 'absolute', inset: 0, animation: 'orbitalSpin 8s linear infinite' }}>
                  <div style={{ width: 6, height: 6, background: '#2F6BFF', borderRadius: '50%', boxShadow: '0 0 10px #2F6BFF' }} />
                </div>
                <div style={{ position: 'absolute', inset: 0, animation: 'orbitalSpin 12s linear infinite reverse' }}>
                  <div style={{ width: 4, height: 4, background: '#00C389', borderRadius: '50%', boxShadow: '0 0 8px #00C389' }} />
                </div>
                
                {/* Center chart icon */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2F6BFF" />
                        <stop offset="100%" stopColor="#00C389" />
                      </linearGradient>
                    </defs>
                    <path d="M3 17l3-3 4 4 8-8" fill="none" stroke="url(#chartGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                          style={{ strokeDasharray: 100, animation: 'chartGrow 3s ease-out infinite 1s' }} />
                    <circle cx="6" cy="14" r="2" fill="#2F6BFF" />
                    <circle cx="10" cy="18" r="2" fill="#00C389" />
                    <circle cx="18" cy="6" r="2" fill="#2F6BFF" />
                  </svg>
                </div>
                
                {/* Data streams */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      right: 10 + (i * 8),
                      bottom: 10,
                      width: 2,
                      height: 8,
                      background: '#2F6BFF',
                      borderRadius: 1,
                      animation: `dataStream 2s ease-in-out infinite ${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>
              
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--ink)', textAlign: 'center', marginBottom: 8 }}>
                $<AnimatedNumber target={1000000000} formatter={(v) => `${(v/1e9).toFixed(1)}B+`} />
              </div>
              <div style={{ color: 'var(--ink-muted)', textAlign: 'center', fontSize: 14, letterSpacing: '0.5px' }}>Cumulative product revenue</div>
            </div>

            {/* Users Card */}
            <div className="metric-card" style={{ animationDelay: '0.5s' }}>
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 20px' }}>
                {/* User constellation */}
                <div style={{ position: 'absolute', inset: 0 }}>
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * (Math.PI / 180);
                    const radius = 25;
                    const x = 40 + Math.cos(angle) * radius;
                    const y = 40 + Math.sin(angle) * radius;
                    return (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          left: x,
                          top: y,
                          width: 6,
                          height: 6,
                          background: i % 2 ? '#2F6BFF' : '#00C389',
                          borderRadius: '50%',
                          boxShadow: `0 0 8px ${i % 2 ? '#2F6BFF' : '#00C389'}`,
                          animation: `particleFloat ${2 + (i * 0.2)}s ease-in-out infinite ${i * 0.1}s`,
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Center users icon */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#00C389" />
                        <stop offset="100%" stopColor="#2F6BFF" />
                      </linearGradient>
                    </defs>
                    <circle cx="9" cy="7" r="3" fill="url(#userGrad)" opacity="0.8" />
                    <circle cx="15" cy="7" r="3" fill="url(#userGrad)" opacity="0.6" />
                    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" fill="none" stroke="url(#userGrad)" strokeWidth="2" />
                    <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85" fill="none" stroke="url(#userGrad)" strokeWidth="2" opacity="0.7" />
                  </svg>
                </div>
                
                {/* Connection lines */}
                <svg style={{ position: 'absolute', inset: 0 }} width="80" height="80">
                  <line x1="20" y1="20" x2="60" y2="60" stroke="rgba(47, 107, 255, 0.3)" strokeWidth="1" 
                        style={{ strokeDasharray: '2,2', animation: 'chartGrow 4s ease-in-out infinite 0.5s' }} />
                  <line x1="60" y1="20" x2="20" y2="60" stroke="rgba(0, 195, 137, 0.3)" strokeWidth="1" 
                        style={{ strokeDasharray: '2,2', animation: 'chartGrow 4s ease-in-out infinite 1s' }} />
                </svg>
              </div>
              
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--ink)', textAlign: 'center', marginBottom: 8 }}>
                <AnimatedNumber target={20000000} formatter={(v) => `${(v/1e6).toFixed(1)}M+`} />
              </div>
              <div style={{ color: 'var(--ink-muted)', textAlign: 'center', fontSize: 14, letterSpacing: '0.5px' }}>Users</div>
            </div>

            {/* Countries Card */}
            <div className="metric-card" style={{ animationDelay: '1s' }}>
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 20px' }}>
                {/* Globe rings */}
                <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(47, 107, 255, 0.2)', borderRadius: '50%', borderTopColor: '#2F6BFF', animation: 'energyPulse 10s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 10, border: '2px solid rgba(0, 195, 137, 0.2)', borderRadius: '50%', borderRightColor: '#00C389', animation: 'energyPulse 7s linear infinite reverse' }} />
                
                {/* Floating continents */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i * 60) * (Math.PI / 180);
                  const radius = 20;
                  const x = 40 + Math.cos(angle) * radius;
                  const y = 40 + Math.sin(angle) * radius;
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        width: 3,
                        height: 3,
                        background: '#00C389',
                        borderRadius: '50%',
                        boxShadow: '0 0 6px #00C389',
                        animation: `particleFloat ${3 + (i * 0.3)}s ease-in-out infinite ${i * 0.2}s`,
                      }}
                    />
                  );
                })}
                
                {/* Center globe */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="globeGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2F6BFF" />
                        <stop offset="100%" stopColor="#00C389" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="9" fill="none" stroke="url(#globeGrad)" strokeWidth="2" />
                    <path d="M12 3a9 9 0 000 18M12 3a9 9 0 010 18M3 12h18" fill="none" stroke="url(#globeGrad)" strokeWidth="1.5" opacity="0.7" />
                    <path d="M8 12a9 9 0 008 0" fill="none" stroke="url(#globeGrad)" strokeWidth="1" opacity="0.5" />
                  </svg>
                </div>
                
                {/* Signal waves */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      inset: -5 - (i * 8),
                      border: '1px solid rgba(47, 107, 255, 0.2)',
                      borderRadius: '50%',
                      animation: `energyPulse ${4 + (i * 2)}s ease-out infinite ${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
              
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--ink)', textAlign: 'center', marginBottom: 8 }}>
                <AnimatedNumber target={20} formatter={(v) => `${Math.round(v)}+ countries`} />
              </div>
              <div style={{ color: 'var(--ink-muted)', textAlign: 'center', fontSize: 14, letterSpacing: '0.5px' }}>Project reach</div>
            </div>
          </div>
          

        </div>
      </section>

      {/* Projects Snapshot (moved up) */}
      <section id="projects" style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--ink)' }}>Featured Projects</h2>
          </div>
          <div className="scroll-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {projects.map((project) => (
              <div key={project.id} className="card" style={{ padding: 24, borderRadius: 16, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: '100%',
                  height: 160,
                  background: 'var(--surface)',
                  borderRadius: 12,
                  marginBottom: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)'
                }}>
                  Project Preview
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{project.title}</h3>
                  <span style={{ background: 'var(--accent-2)', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{project.category}</span>
                </div>
                <p style={{ color: 'var(--accent-1)', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>{project.status}</p>
                <p style={{ color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 16, fontSize: 14 }}>{project.description}</p>
                <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '10px 14px' }}>Visit</a>
                  <Link to="/projects" className="btn" style={{ padding: '10px 14px', border: '1px solid var(--stroke)', color: 'var(--ink)' }}>More Projects</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-animate" style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/projects" className="btn btn-primary" style={{ padding: '12px 32px' }}>View All Projects</Link>
          </div>
        </div>
      </section>

      {/* Consulting Snapshot - redesigned to match Featured Projects */}
      <section id="consulting" style={{ padding: '80px 0', background: 'var(--bg-1)' }}>
        <div className="container">
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--ink)' }}>Consulting Services</h2>
            <p style={{ color: 'var(--ink-muted)', maxWidth: 900, margin: '8px auto 0' }}>Strategic AI consulting across defense, enterprise, and leadership training — distilled into quick snapshots below.</p>
          </div>
          <div className="scroll-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {[{
              title: 'Defense & Security',
              tag: 'Mission-Critical',
              desc: 'Dual‑use strategy, battlefield‑validated tech, and TRL acceleration.',
              href: '/consulting'
            }, {
              title: 'Enterprise & Industry',
              tag: 'Transformation',
              desc: 'ROI roadmaps, implementation PMO, and AI adoption at scale.',
              href: '/consulting'
            }, {
              title: 'Executive Training',
              tag: 'Leadership',
              desc: 'War‑room simulations and targeted workshops for decision‑makers.',
              href: '/consulting'
            }].map((s) => (
              <div key={s.title} className="card" style={{ padding: 24, borderRadius: 16, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: '100%',
                  height: 140,
                  background: 'var(--surface)',
                  borderRadius: 12,
                  marginBottom: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)'
                }}>
                  Service Preview
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{s.title}</h3>
                  <span style={{ background: 'var(--accent-1)', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{s.tag}</span>
                </div>
                <p style={{ color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 16, fontSize: 14 }}>{s.desc}</p>
                <div style={{ marginTop: 'auto' }}>
                  <Link to={s.href} className="btn" style={{ padding: '10px 14px', border: '1px solid var(--stroke)', color: 'var(--ink)' }}>Learn More</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-animate" style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/consulting" className="btn btn-primary" style={{ padding: '12px 32px' }}>Explore Consulting</Link>
          </div>
        </div>
      </section>

      {/* Community Snapshot - redesigned to match Featured Projects */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--ink)' }}>Community</h2>
            <p style={{ color: 'var(--ink-muted)', maxWidth: 900, margin: '8px auto 0' }}>A snapshot of our network and presence across the global AI ecosystem.</p>
          </div>
          <div className="scroll-animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {[{
              title: 'BRAIVE',
              tag: 'Network',
              desc: 'A curated community of top AI/CV developers across North America and beyond.',
              href: '/community'
            }, {
              title: 'Web Summit Vancouver',
              tag: 'Conference',
              desc: 'Active participation with leaders in technology, business, and policy.',
              href: '/community'
            }, {
              title: 'Techstars Alumni',
              tag: 'Alumni',
              desc: 'Global mentorship and acceleration network powering bold ventures.',
              href: '/community'
            }].map((c) => (
              <div key={c.title} className="card" style={{ padding: 24, borderRadius: 16, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: '100%',
                  height: 140,
                  background: 'var(--surface)',
                  borderRadius: 12,
                  marginBottom: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)'
                }}>
                  Community Preview
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{c.title}</h3>
                  <span style={{ background: 'var(--accent-2)', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{c.tag}</span>
                </div>
                <p style={{ color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 16, fontSize: 14 }}>{c.desc}</p>
                <div style={{ marginTop: 'auto' }}>
                  <Link to={c.href} className="btn" style={{ padding: '10px 14px', border: '1px solid var(--stroke)', color: 'var(--ink)' }}>Learn More</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-animate" style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/community" className="btn btn-primary" style={{ padding: '12px 32px' }}>Explore Community</Link>
          </div>
        </div>
            </section>

      {/* Team Animation Snapshot */}
      <section id="team" style={{ padding: '80px 0', background: 'var(--bg-1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="scroll-animate" style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--ink)', marginBottom: 24 }}>Our Team</h2>
          <p className="scroll-animate" style={{ color: 'var(--ink-muted)', margin: '0 auto 32px', maxWidth: 720 }}>A glimpse of the people behind our ventures.</p>
          <div className="scroll-animate" style={{ margin: '0 auto 24px', maxWidth: 900 }}>
            <TeamSphere height={420} />
          </div>
          <div className="scroll-animate">
            <Link to='/team' className='btn btn-primary' style={{ padding: '12px 24px' }}>Meet the Team</Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" style={{ padding: '100px 0', background: 'var(--bg-2)', textAlign: 'center' }}>
        <div className="container">
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
          <a href="mailto:hello@myglobal.group" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 40px' }}>Book a briefing</a>
        </div>
      </section>
    </>
  );
};

export default HomePage;
