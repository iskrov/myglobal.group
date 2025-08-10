# MyGlobal Group Website

Strategic consulting website for MyGlobal Group, specializing in dual-use technology and AI strategy at the intersection of defense, enterprise, and innovation.

## 🌟 Features

- **Animated Bird Flocking**: Sophisticated M-G-G letter formation animation using boids algorithm
- **Strategic Consulting Content**: Defense, enterprise, and AI consulting services
- **Professional Design**: Dark theme with editorial styling and modern typography
- **Responsive Layout**: Optimized for all devices and screen sizes
- **SEO Optimized**: Meta tags, sitemap, robots.txt, and semantic HTML
- **Google Cloud Run Deployment**: Production-ready containerized deployment

## 🚀 Live Website

Visit the live website at: [https://myglobal.group](https://myglobal.group)

## 🏗️ Project Structure

```
├── src/
│   ├── App.tsx              # Main application with bird flocking animation
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles and design tokens
├── public/
│   ├── images/              # Team member photos
│   ├── robots.txt           # Search engine crawler instructions
│   ├── sitemap.xml          # Site structure for SEO
│   └── site-config.json     # Site configuration and content
├── scripts/                 # Deployment and utility scripts
├── backups/                 # Animation iteration backups
├── index.html              # HTML entry point with SEO meta tags
└── deployment-config.env   # Google Cloud deployment settings
```

## 🎨 Bird Flocking Animation

The hero section features a sophisticated bird flocking animation that:

- Uses boids algorithm (separation, alignment, cohesion) for realistic movement
- Forms precise M-G-G letters every 8 seconds
- Features 300 birds with 3D depth effects
- Optimized for performance with smooth 60fps animation
- Includes natural murmuration behavior between formations

### Animation Phases
1. **Murmuration** (5s): Natural flocking behavior
2. **Forming** (1s): Birds move to letter positions
3. **Holding** (1s): Letters maintain formation
4. **Dispersing** (1s): Birds scatter for next cycle

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm
- Google Cloud CLI (for deployment)
- Docker (for local deployment)

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deployment

```bash
# Deploy to Google Cloud Run
./scripts/cloud-deploy.sh

# Local Docker deployment
./scripts/deploy.sh
```

## 📝 Content Management

All website content is managed through `site-config.json`:

- **Site metadata**: Title, description, domain
- **Branding**: Colors, fonts, logo
- **Content sections**: Hero, features, team, services
- **SEO settings**: Keywords, meta tags

## 🎯 Services

MyGlobal Group provides strategic consulting in:

- **Defense & Security**: Battlefield validation, combat trend intelligence
- **Enterprise & Industry**: AI transformation, implementation acceleration  
- **Education & Training**: Executive workshops, AI education programs
- **Healthcare**: AI-powered support systems and guidance
- **AI Behavioral Analysis**: Privacy-first crowd analytics
- **Logistics & Supply Chain**: Risk-optimized routing and planning

## 👥 Team

- **Igor Skrylev**: Founder & CEO
- **Alexey Skrylev**: Co-Founder & CTO  
- **Sergii Serbyn**: Partner & Head of Strategy

## 🔧 Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS-in-JS with design tokens
- **Animation**: Canvas API with custom physics engine
- **Deployment**: Google Cloud Run with Cloud Build
- **Infrastructure**: Docker, Nginx, GitHub Actions

## 📈 SEO Optimization

- Semantic HTML structure with proper heading hierarchy
- Optimized meta tags (title, description, keywords)
- Open Graph and Twitter Card support
- XML sitemap and robots.txt
- Descriptive alt text for all images
- Fast loading times and mobile optimization

## 🔒 Security & Performance

- Content Security Policy headers
- Optimized bundle size with code splitting  
- 60fps animations with performance monitoring
- Responsive images and lazy loading
- HTTPS encryption and secure headers

## 📄 License

© 2024 MyGlobal Group. All rights reserved.

## 🤝 Contact

- **Website**: [myglobal.group](https://myglobal.group)
- **Email**: hello@myglobal.group
- **GitHub**: [iskrov/myglobal.group](https://github.com/iskrov/myglobal.group)

---

**Strategic consulting at the intersection of defense, enterprise, and AI innovation.**