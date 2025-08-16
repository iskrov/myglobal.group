import React from 'react';
import { Link } from 'react-router-dom';

const ProjectsPage: React.FC = () => {
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

  const additionalProjects = [
    { title: 'AI Healthcare Analytics', category: 'Healthcare', status: 'Development' },
    { title: 'Privacy-First Crowd Analytics', category: 'AI/Privacy', status: 'Active' },
    { title: 'Ukraine Grain Corridor Optimization', category: 'Logistics', status: 'Active' },
    { title: 'Mining Vision Suite', category: 'Industrial AI', status: 'Deployed' },
    { title: 'Financial Services AI', category: 'FinTech', status: 'Active' },
    { title: 'Border Efficiency System', category: 'Government Tech', status: 'Deployed' },
    { title: 'Energy Inspection Drones', category: 'Energy', status: 'Active' }
  ];

  return (
    <div style={{ background: 'var(--bg-1)', minHeight: '100vh', color: 'var(--ink)' }}>

      {/* Hero Section */}
      <section className="section bg-1">
        <div className="container">
          <h1 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: 'var(--fs-h1)',
            fontWeight: 700,
            marginBottom: '16px',
            color: 'var(--ink)',
            textAlign: 'center'
          }}>
            Our Projects
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2.6vw, 18px)',
            color: 'var(--ink-muted)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            From AI-powered computer vision to smart city solutions, our portfolio spans cutting-edge technology that solves real-world challenges.
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-sm bg-2">
        <div className="container">
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: '32px',
            fontWeight: 600,
            marginBottom: '40px',
            color: 'var(--ink)'
          }}>
            Featured Projects
          </h2>
          <div className="grid-autofit-260">
            {projects.map((project) => (
              <div key={project.id} className="card" style={{ 
                padding: '32px', 
                borderRadius: '16px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}>
                <div style={{ 
                  width: '100%', 
                  height: 'clamp(140px, 28vw, 200px)', 
                  background: 'var(--surface)', 
                  borderRadius: '12px', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--ink-muted)'
                }}>
                  Project Preview
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ 
                    fontFamily: 'Newsreader, serif',
                    fontSize: 'clamp(18px, 3.2vw, 22px)', 
                    fontWeight: 600, 
                    color: 'var(--ink)',
                    margin: 0
                  }}>
                    {project.title}
                  </h3>
                  <span style={{
                    background: 'var(--accent-2)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {project.category}
                  </span>
                </div>
                <p style={{ 
                  color: 'var(--accent-1)', 
                  fontWeight: 600, 
                  marginBottom: '12px',
                  fontSize: 'clamp(13px, 2.4vw, 16px)'
                }}>
                  {project.status}
                </p>
                <p style={{ 
                  color: 'var(--ink-muted)', 
                  lineHeight: 1.6,
                  marginBottom: '20px',
                  fontSize: 'clamp(13px, 2.6vw, 16px)'
                }}>
                  {project.description}
                </p>
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center', padding: '12px 16px' }}
                >
                  Visit Project
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Projects */}
      <section className="section bg-1">
        <div className="container">
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: '32px',
            fontWeight: 600,
            marginBottom: '40px',
            color: 'var(--ink)'
          }}>
            Portfolio Overview
          </h2>
          <div className="grid-autofit-220">
            {additionalProjects.map((project, index) => (
              <div key={index} className="card" style={{ padding: '24px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: 'var(--ink)',
                    margin: 0
                  }}>
                    {project.title}
                  </h3>
                  <span style={{
                    background: project.status === 'Active' ? 'var(--accent-2)' : 
                              project.status === 'Deployed' ? 'var(--accent-1)' : 'var(--amber-cta)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 500
                  }}>
                    {project.status}
                  </span>
                </div>
                <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: 0 }}>
                  {project.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: 'var(--bg-2)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: '32px',
            fontWeight: 600,
            marginBottom: '20px',
            color: 'var(--ink)'
          }}>
            Ready to Build the Future?
          </h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '18px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Join our portfolio of innovative companies or partner with us on your next breakthrough project.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#contact" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Get In Touch
            </Link>
            <Link to="/team" className="btn" style={{ padding: '16px 32px', border: '1px solid var(--stroke)', color: 'var(--ink)' }}>
              Meet Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
