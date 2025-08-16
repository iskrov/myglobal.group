import React from 'react';
import { Link } from 'react-router-dom';
import TeamSphere from '../components/TeamSphere';

const TeamPage: React.FC = () => {
  const leadership = [
    {
      name: "Igor Kolos",
      role: "Co-Founder & CEO",
      imageUrl: "/images/igor.jpg",
      description: "Defense-grade AI specialist with 10+ years deploying artificial intelligence at scale across military, construction, mining, and energy sectors (projects valued at $50M+). Expert in privacy-first automation with a focus on measurable ROI.",
      linkedin: "https://www.linkedin.com/in/igor-kolos-a412a377",
      expertise: ["Defense AI", "Privacy-First Automation", "Large-Scale Deployments", "ROI Optimization"],
      achievements: ["$50M+ in deployed projects", "Military-grade AI systems", "Cross-sector expertise"]
    },
    {
      name: "Alexey Iskrov",
      role: "Co-Founder & CTO",
      imageUrl: "/images/alexey.jpg",
      description: "Senior data engineer with 20+ years in edge AI systems and education. Specializes in privacy-centric video analytics, edge computing, and large-scale infrastructure data solutions.",
      linkedin: "https://www.linkedin.com/in/iskrov",
      expertise: ["Edge AI Systems", "Video Analytics", "Infrastructure Data", "Privacy-Centric Solutions"],
      achievements: ["20+ years experience", "Edge computing pioneer", "Education sector leader"]
    },
    {
      name: "Sergii Vlas",
      role: "Co-Founder & CBDO",
      imageUrl: "/images/sergii.jpg",
      description: "AI strategist with 15+ years leading high-impact national-scale projects, including military-grade counter-propaganda, cognitive warfare analytics, and smart-city platforms serving over 20M users. Honored for exceptional contributions to national security innovation.",
      linkedin: "https://www.linkedin.com/in/sergii-vlas",
      expertise: ["National-Scale Projects", "Counter-Propaganda", "Smart Cities", "Strategic AI"],
      achievements: ["20M+ users served", "National security innovation", "Military-grade systems"]
    }
  ];

  const teamStats = [
    { number: "20+", label: "Expert Team Members", description: "Leaders in their respective industries" },
    { number: "15+", label: "Years Average Experience", description: "Deep expertise across AI and technology" },
    { number: "6", label: "Countries Represented", description: "Global perspective and diverse backgrounds" },
    { number: "$1B+", label: "Combined Project Value", description: "Proven track record of large-scale success" }
  ];

  return (
    <div style={{ background: 'var(--bg-1)', minHeight: '100vh', color: 'var(--ink)' }}>

      {/* Hero Section with Team Sphere */}
      <section style={{ padding: '100px 0', background: 'var(--bg-1)' }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: 700,
            marginBottom: '24px',
            color: 'var(--ink)',
            textAlign: 'center'
          }}>
            Our Team
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'var(--ink-muted)',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto 60px'
          }}>
            Over 20 experts — leaders in their industries. We build lovable products and bring them to international markets.
          </p>
          
          {/* Team Sphere Visualization */}
          <div style={{ marginBottom: '80px' }}>
            <TeamSphere />
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section style={{ padding: '60px 0', background: 'var(--bg-2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            {teamStats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--accent-1)', marginBottom: '8px' }}>
                  {stat.number}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
                  {stat.label}
                </h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: 0 }}>
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section style={{ padding: '100px 0', background: 'var(--bg-1)' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: '36px',
            fontWeight: 600,
            marginBottom: '60px',
            color: 'var(--ink)',
            textAlign: 'center'
          }}>
            Leadership Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px' }}>
            {leadership.map((member, index) => (
              <div key={member.name} className="card" style={{ 
                padding: '40px',
                borderRadius: '20px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(47, 107, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <img
                    src={member.imageUrl}
                    alt={`${member.name}, ${member.role}`}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid var(--accent-1)',
                      marginRight: '24px',
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{
                        fontFamily: 'Newsreader, serif',
                        fontSize: '24px',
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
                        style={{
                          color: 'var(--accent-1)',
                          fontSize: '20px',
                          textDecoration: 'none',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        in
                      </a>
                    </div>
                    <p style={{ color: 'var(--accent-2)', fontWeight: 600, fontSize: '16px', margin: 0 }}>
                      {member.role}
                    </p>
                  </div>
                </div>
                
                <p style={{
                  color: 'var(--ink-muted)',
                  lineHeight: 1.6,
                  marginBottom: '24px'
                }}>
                  {member.description}
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px' }}>
                    Expertise
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {member.expertise.map((skill, skillIndex) => (
                      <span key={skillIndex} style={{
                        background: 'var(--accent-1)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', marginBottom: '12px' }}>
                    Key Achievements
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {member.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} style={{
                        color: 'var(--ink-muted)',
                        fontSize: '14px',
                        marginBottom: '4px',
                        paddingLeft: '16px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: 'var(--accent-2)',
                          fontSize: '12px'
                        }}>✓</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: '32px',
            fontWeight: 600,
            marginBottom: '20px',
            color: 'var(--ink)'
          }}>
            Join Our Team
          </h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '18px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            We're always looking for exceptional talent to join our mission of building the future through AI innovation.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#contact" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Get In Touch
            </Link>
            <Link to="/projects" className="btn" style={{ padding: '16px 32px', border: '1px solid var(--stroke)', color: 'var(--ink)' }}>
              See Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
