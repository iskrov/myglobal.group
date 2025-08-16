import React from 'react';
import { Link } from 'react-router-dom';

const CommunityPage: React.FC = () => {
  const communityHighlights = [
    {
      title: "BRAIVE",
      description: "BRAIVE is MGG's unique community bringing together leading developers in AI and computer vision from the U.S., Canada, the U.K., and beyond — united by a shared focus on cutting-edge innovation in visual intelligence.",
      image: "/images/braive-community.jpg",
      members: "50+ AI/CV Leaders",
      focus: "Visual Intelligence",
      regions: ["US", "Canada", "UK", "Europe"]
    },
    {
      title: "Web Summit Vancouver 2025",
      description: "Our team is part of Web Summit Vancouver 2025, a gathering of the brightest minds in technology, business, and policy.",
      image: "/images/websummit-vancouver.jpg",
      event: "Major Tech Conference",
      focus: "Technology & Policy",
      impact: "Global Tech Community"
    },
    {
      title: "Techstars Alumni Network",
      description: "We are proud alumni of Techstars, one of the world's most prestigious accelerator programs. Techstars provided us with unparalleled mentorship, resources, and a global network, enabling us to scale faster and execute bold AI projects.",
      image: "/images/techstars-alumni.jpg",
      network: "Global Startup Ecosystem",
      focus: "Mentorship & Scaling",
      impact: "Accelerated Growth"
    },
    {
      title: "SXSW Representation",
      description: "Our team was honoured to represent Canada at the South by Southwest (SXSW) Conference in Austin — one of the world's most influential platforms for emerging technology.",
      image: "/images/sxsw-canada.jpg",
      event: "SXSW Austin",
      focus: "Emerging Technology",
      representation: "Canada"
    },
    {
      title: "Creative Destruction Lab (CDL)",
      description: "As alumni of the Creative Destruction Lab, we collaborated with world-class scientists, economists, and technologists to refine our ventures and push AI innovation toward measurable real‑world impact.",
      image: "/images/cdl-alumni.jpg",
      network: "Scientific Community",
      focus: "Real-World AI Impact",
      collaboration: "Scientists & Economists"
    }
  ];

  const networkStats = [
    { number: "500+", label: "Global Network Members", description: "Across all our community initiatives" },
    { number: "25+", label: "Countries Represented", description: "Truly global perspective and reach" },
    { number: "10+", label: "Major Events Annually", description: "Active participation in key industry gatherings" },
    { number: "5", label: "Core Communities", description: "Strategic partnerships with leading organizations" }
  ];

  const upcomingEvents = [
    {
      title: "AI Vision Summit 2025",
      date: "March 15-17, 2025",
      location: "Vancouver, Canada",
      description: "BRAIVE community gathering focused on the future of computer vision and AI applications.",
      type: "Community Event"
    },
    {
      title: "Techstars Demo Day",
      date: "April 2025",
      location: "Multiple Cities",
      description: "Supporting the next cohort of Techstars startups as mentors and advisors.",
      type: "Mentorship"
    },
    {
      title: "Web Summit Vancouver",
      date: "May 2025",
      location: "Vancouver, Canada",
      description: "Participating in panels on AI ethics, dual-use technology, and startup ecosystems.",
      type: "Conference"
    }
  ];

  return (
    <div style={{ background: 'var(--bg-1)', minHeight: '100vh', color: 'var(--ink)' }}>

      {/* Hero Section */}
      <section style={{ padding: '100px 0', background: 'var(--bg-1)' }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: 'clamp(28px, 6vw, 64px)',
            fontWeight: 700,
            marginBottom: '16px',
            color: 'var(--ink)',
            textAlign: 'center'
          }}>
            Community of AI Excellence
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2.6vw, 18px)',
            color: 'var(--ink-muted)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            We have built a high-calibre network of top AI founders, elite scientists, and prominent mentors across the U.S. and Canada. Together, we remain at the forefront of emerging technologies, ready to launch the most ambitious, high-impact AI projects at any moment.
          </p>
        </div>
      </section>

      {/* Network Stats */}
      <section style={{ padding: '60px 0', background: 'var(--bg-2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            {networkStats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--accent-2)', marginBottom: '8px' }}>
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

      {/* Community Highlights */}
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
            Our Communities
          </h2>
          <div style={{ display: 'grid', gap: '40px' }}>
            {communityHighlights.map((community, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '24px',
                alignItems: 'center'
              }}>
                <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
                  <h3 style={{
                    fontFamily: 'Newsreader, serif',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: '20px'
                  }}>
                    {community.title}
                  </h3>
                  <p style={{
                    color: 'var(--ink-muted)',
                    lineHeight: 1.6,
                    fontSize: '16px',
                    marginBottom: '24px'
                  }}>
                    {community.description}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                    {community.members && (
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-1)', marginBottom: '4px' }}>
                          Members
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                          {community.members}
                        </div>
                      </div>
                    )}
                    {community.focus && (
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-1)', marginBottom: '4px' }}>
                          Focus
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                          {community.focus}
                        </div>
                      </div>
                    )}
                    {community.network && (
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-1)', marginBottom: '4px' }}>
                          Network
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                          {community.network}
                        </div>
                      </div>
                    )}
                    {community.event && (
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-1)', marginBottom: '4px' }}>
                          Event
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                          {community.event}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ order: index % 2 === 0 ? 2 : 1 }}>
                  <div style={{
                    width: '100%',
                    height: 'clamp(180px, 40vw, 300px)',
                    background: 'var(--surface)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ink-muted)',
                    fontSize: '14px'
                  }}>
                    {community.title} Photo
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-2">
        <div className="container">
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: '36px',
            fontWeight: 600,
            marginBottom: '60px',
            color: 'var(--ink)',
            textAlign: 'center'
          }}>
            Upcoming Events
          </h2>
          <div className="grid-autofit-350">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="card" style={{ 
                padding: '32px',
                borderRadius: '16px',
                borderLeft: '4px solid var(--accent-1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: 600, 
                    color: 'var(--ink)',
                    margin: 0
                  }}>
                    {event.title}
                  </h3>
                  <span style={{
                    background: 'var(--accent-2)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {event.type}
                  </span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: 'var(--accent-1)', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                    📅 {event.date}
                  </div>
                  <div style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>
                    📍 {event.location}
                  </div>
                </div>
                <p style={{ 
                  color: 'var(--ink-muted)', 
                  lineHeight: 1.6,
                  margin: 0,
                  fontSize: '15px'
                }}>
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Community CTA */}
      <section className="section bg-1" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: '32px',
            fontWeight: 600,
            marginBottom: '20px',
            color: 'var(--ink)'
          }}>
            Join Our Network
          </h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '18px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Connect with leading AI innovators, researchers, and entrepreneurs shaping the future of technology.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#contact" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Connect With Us
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

export default CommunityPage;
