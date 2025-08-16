import React from 'react';
import { Link } from 'react-router-dom';

const ConsultingPage: React.FC = () => {
  const services = [
    {
      title: "Defense & Security",
      icon: "🛡️",
      description: "Mission-critical AI solutions for defense and security applications",
      items: [
        "Battlefield Validation & TRL Acceleration — live-combat trials that push dual-use tech from prototype to TRL 7+",
        "Combat Trend Intelligence — data-driven briefs on how drones, AI, and EW reshape force composition and platform relevance",
        "Dual-Use Tech Scouting & Integration — source frontline innovations and adapt them for civilian markets"
      ]
    },
    {
      title: "Enterprise & Industry",
      icon: "🏢",
      description: "AI transformation strategies for enterprise and industrial applications",
      items: [
        "Industry AI Horizon Scanning & ROI Roadmaps — map emerging trends, size value pools, and build multi-year investment strategies",
        "Industry Transformation Programs — end-to-end AI-adoption playbooks covering budgeting, vendor selection, and change management",
        "Implementation PMO & Change Acceleration — orchestrate pilots, vendor partnerships, and talent upskilling to embed AI at speed and scale"
      ]
    },
    {
      title: "Education & Training",
      icon: "🎓",
      description: "Executive education and strategic training programs",
      items: [
        "Executive War-Room Workshops — red-team scenarios and crisis simulations translating frontline insight into boardroom action",
        "Executive AI Education — targeted workshops and briefings that turn technical advances into decisive strategy"
      ]
    },
    {
      title: "Healthcare",
      icon: "🏥",
      description: "AI-powered healthcare solutions and support systems",
      items: [
        "AI-Powered Support for Autistic Children — Smart Room sensor-AI kit deciphers each child's stress and engagement cues in real time, giving families and clinicians instant guidance and restoring up to ten calm hours weekly"
      ]
    },
    {
      title: "AI Behavioral Analysis",
      icon: "🧠",
      description: "Privacy-first behavioral analytics and crowd intelligence",
      items: [
        "Privacy-First Crowd-Analytics Layer — converts ordinary cameras into live dashboards of audience mood and engagement, clustering people by real-time stance without storing personal identities"
      ]
    },
    {
      title: "Logistics & Supply Chain",
      icon: "🚢",
      description: "AI-optimized logistics and supply chain solutions",
      items: [
        "Ukraine Grain Corridor Risk-Free Route Optimisation — AI blends satellite AIS feeds, conflict-zone intelligence, and other data to chart dynamic, low-risk maritime corridors that let grain convoys sidestep Russian interdiction"
      ]
    }
  ];

  const successStories = [
    {
      title: "Digital Transformation of the City of Burnaby",
      description: "Modernizing municipal operations with AI-driven automation, integrated databases, and advanced data intelligence.",
      impact: "40% efficiency increase",
      client: "City of Burnaby"
    },
    {
      title: "AI-Enabled Transportation for the City of Ottawa",
      description: "Deploying predictive analytics to optimize mobility, enhance safety, and manage traffic flow in real time.",
      impact: "25% traffic optimization",
      client: "City of Ottawa"
    },
    {
      title: "AI-Powered Reconstruction for Ukraine",
      description: "Applying AI analytics to accelerate national infrastructure recovery for the Ministry of Infrastructure of Ukraine.",
      impact: "30% faster reconstruction",
      client: "Ministry of Infrastructure of Ukraine"
    }
  ];

  return (
    <div style={{ background: 'var(--bg-1)', minHeight: '100vh', color: 'var(--ink)' }}>

      {/* Hero Section */}
      <section className="section bg-1">
        <div className="container">
          <h1 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: 'clamp(28px, 6vw, 64px)',
            fontWeight: 700,
            marginBottom: '16px',
            color: 'var(--ink)',
            textAlign: 'center'
          }}>
            AI-Powered Strategy for Complex Environments
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2.6vw, 18px)',
            color: 'var(--ink-muted)',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            Delivering mission-critical results for governments and industries through advanced AI solutions, precision data analytics, and rapid execution.
          </p>
        </div>
      </section>

      {/* Services Grid */}
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
            Our Services
          </h2>
          <div className="grid-autofit-260">
            {services.map((service, index) => (
              <div key={index} className="card" style={{ 
                padding: '40px',
                borderRadius: '16px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--accent-1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: 'clamp(24px, 5vw, 32px)', marginRight: '16px' }}>{service.icon}</span>
                  <h3 style={{ 
                    fontFamily: 'Newsreader, serif',
                    fontSize: 'clamp(18px, 3.2vw, 22px)', 
                    fontWeight: 600, 
                    color: 'var(--ink)',
                    margin: 0
                  }}>
                    {service.title}
                  </h3>
                </div>
                <p style={{ 
                  color: 'var(--ink-muted)', 
                  marginBottom: '20px',
                  fontSize: 'clamp(13px, 2.6vw, 16px)',
                  lineHeight: 1.6
                }}>
                  {service.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {service.items.map((item, itemIdx) => (
                    <li key={itemIdx} style={{ 
                      marginBottom: '16px', 
                      paddingLeft: '20px', 
                      position: 'relative', 
                      color: 'var(--ink-muted)', 
                      lineHeight: 1.6,
                      fontSize: 'clamp(13px, 2.6vw, 15px)'
                    }}>
                      <span style={{ 
                        position: 'absolute', 
                        left: 0, 
                        color: 'var(--accent-2)', 
                        fontSize: '16px' 
                      }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section bg-1">
        <div className="container">
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: '36px',
            fontWeight: 600,
            marginBottom: '60px',
            color: 'var(--ink)',
            textAlign: 'center'
          }}>
            Success Stories
          </h2>
          <div className="grid-autofit-350">
            {successStories.map((story, index) => (
              <div key={index} className="card" style={{ 
                padding: '32px',
                borderRadius: '16px',
                borderLeft: '4px solid var(--accent-2)'
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: 'var(--ink)',
                  marginBottom: '16px'
                }}>
                  {story.title}
                </h3>
                <p style={{ 
                  color: 'var(--ink-muted)', 
                  lineHeight: 1.6,
                  marginBottom: '20px'
                }}>
                  {story.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    color: 'var(--accent-1)', 
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    {story.impact}
                  </span>
                  <span style={{ 
                    color: 'var(--ink-muted)', 
                    fontSize: '14px'
                  }}>
                    {story.client}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ color: 'var(--ink-muted)', fontSize: '16px' }}>
              Many other high-impact initiatives — spanning public safety, infrastructure resilience, and enterprise AI transformation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-2" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Newsreader, serif',
            fontSize: '32px',
            fontWeight: 600,
            marginBottom: '20px',
            color: 'var(--ink)'
          }}>
            Ready to Transform Your Organization?
          </h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '18px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Strategic consulting for defense, enterprise, and government clients seeking AI-powered solutions.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#contact" className="btn btn-primary" style={{ padding: '16px 32px' }}>
              Book a Briefing
            </Link>
            <Link to="/projects" className="btn" style={{ padding: '16px 32px', border: '1px solid var(--stroke)', color: 'var(--ink)' }}>
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConsultingPage;
