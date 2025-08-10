# Web Hull - Universal Website Template

🚀 **Create stunning landing pages in minutes with AI-powered content generation**

Web Hull is a universal website template built with React, TypeScript, and Tailwind CSS. It features a complete deployment pipeline for Google Cloud Run and an AI-powered content generator that transforms natural language prompts into beautiful, fully-configured websites.

## ✨ Features

- 🤖 **AI-Powered Content Generation** - Generate complete websites from natural language prompts
- 🎨 **Fully Customizable** - Every aspect controlled via `site-config.json`
- 🚀 **One-Click Deployment** - Complete CI/CD pipeline for Google Cloud Run
- 📱 **Responsive Design** - Beautiful on all devices
- 🌙 **Dark Mode Support** - Built-in theme switching
- ⚡ **Lightning Fast** - Optimized React with Vite
- 🔧 **Type Safe** - Full TypeScript support
- 🎯 **SEO Optimized** - Meta tags, Open Graph, Twitter Cards
- 📦 **Production Ready** - Docker containerized with Nginx

## 🚀 Quick Start

### Option 1: AI Generator (Recommended)

Generate a complete website from a natural language prompt:

```bash
# Clone the template
git clone <your-repo-url> my-website
cd my-website

# Generate your website
./generate-site.sh "Create a landing page for an AI fitness app called FitBot"

# Set up environment
cp deployment-config.template deployment-config.env
# Edit deployment-config.env with your settings

# Install dependencies
npm install

# Start development server
npm run dev
```

### Option 2: Manual Configuration

```bash
# Clone the template
git clone <your-repo-url> my-website
cd my-website

# Install dependencies
npm install

# Set up configuration
cp deployment-config.template deployment-config.env
# Edit deployment-config.env and site-config.json

# Start development server
npm run dev
```

## 🎯 AI Content Generator

The `generate-site.sh` script creates complete website configurations from natural language:

```bash
# Example prompts
./generate-site.sh "Create a landing page for a fintech startup that helps with investments"
./generate-site.sh "Build a site for an online education platform teaching web development"
./generate-site.sh "Landing page for a SaaS tool that automates social media posting"
```

### How It Works

1. **Prompt Analysis** - Extracts key information (industry, features, audience)
2. **Smart Theming** - Generates appropriate color schemes and styling
3. **Content Generation** - Creates headlines, descriptions, and copy
4. **Configuration** - Updates `site-config.json` and deployment settings
5. **Ready to Deploy** - Complete website ready for customization and deployment

## 📁 Project Structure

```
├── components/           # React components
│   ├── Hero.tsx         # Hero section
│   ├── Features.tsx     # Features showcase
│   ├── ValueProposition.tsx
│   ├── UseCases.tsx     # Use cases/pricing tiers
│   ├── CallToAction.tsx # CTA section
│   ├── Footer.tsx       # Footer with links
│   └── Header.tsx       # Navigation header
├── hooks/
│   └── useSiteConfig.tsx # Site configuration hook
├── scripts/             # Deployment scripts
│   ├── deploy.sh        # Local Docker deployment
│   ├── cloud-deploy.sh  # Cloud Build deployment
│   ├── setup-project.sh # Interactive setup wizard
│   └── check-config.sh  # Configuration validator
├── docker/              # Docker configuration
│   └── nginx.conf.template
├── public/
│   └── site-config.json # Runtime site configuration
├── site-config.json     # Source site configuration
├── deployment-config.env # Deployment settings
├── generate-site.sh     # AI content generator
└── DEPLOYMENT.md        # Deployment documentation
```

## ⚙️ Configuration

### Site Configuration (`site-config.json`)

The heart of Web Hull - controls all content and branding:

```json
{
  "site": {
    "title": "Your Amazing Product",
    "description": "Transform your business with our innovative solution",
    "tagline": "Innovation Made Simple",
    "domain": "yourproduct.com"
  },
  "branding": {
    "logo": {
      "text": "YourBrand",
      "hasIcon": false,
      "iconUrl": ""
    },
    "colors": {
      "primary": "#3B82F6",
      "secondary": "#1E40AF",
      "accent": "#F59E0B"
    }
  },
  "hero": {
    "headline": "Transform Your Business Today",
    "subheadline": "Discover the power of innovation...",
    "cta": {
      "primary": "Get Started Free",
      "secondary": "Learn More"
    }
  }
  // ... more sections
}
```

### Deployment Configuration (`deployment-config.env`)

Controls deployment settings:

```bash
PROJECT_NAME=my-website
SERVICE_NAME=my-website-app
REGION=us-west1
MEMORY=512Mi
CPU=1
PORT=8080
# ... more settings
```

## 🎨 Customization

### Colors and Branding

Update the `branding` section in `site-config.json`:

```json
{
  "branding": {
    "colors": {
      "primary": "#your-primary-color",
      "secondary": "#your-secondary-color",
      "accent": "#your-accent-color"
    },
    "logo": {
      "text": "Your Brand",
      "hasIcon": true,
      "iconUrl": "/logo.png"
    }
  }
}
```

### Content Sections

Each component reads from its corresponding section in `site-config.json`:

- **Hero**: `hero` section
- **Features**: `features` array
- **Value Proposition**: `valueProposition` section
- **Use Cases**: `useCases` array
- **Call to Action**: `callToAction` section
- **Footer**: `footer` section

### Adding New Sections

1. Add new section to `site-config.json`
2. Update `SiteConfig` interface in `hooks/useSiteConfig.tsx`
3. Create new component using `useSiteConfig()` hook
4. Import and use in `src/App.tsx`

## 🚀 Deployment

### Prerequisites

- Google Cloud account with billing enabled
- `gcloud` CLI installed and authenticated
- Docker installed (for local deployment)

### Cloud Deployment

```bash
# Set up project (interactive wizard)
./scripts/setup-project.sh

# Deploy to Google Cloud Run
./scripts/cloud-deploy.sh
```

### Local Deployment

```bash
# Deploy locally with Docker
./scripts/deploy.sh
```

### Configuration Validation

```bash
# Check your configuration
./scripts/check-config.sh
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `./generate-site.sh "prompt"` - Generate new site configuration
- `./scripts/setup-project.sh` - Interactive project setup
- `./scripts/deploy.sh` - Local Docker deployment
- `./scripts/cloud-deploy.sh` - Cloud deployment

### Environment Variables

Development environment variables go in `.env.local`:

```bash
VITE_API_KEY=your-api-key
GEMINI_API_KEY=your-gemini-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📚 Check `DEPLOYMENT.md` for detailed deployment instructions
- 🐛 Report issues on GitHub
- 💬 Discussions and questions welcome

## 🎉 Examples

### Generated Websites

```bash
# Fitness App
./generate-site.sh "Create a landing page for an AI fitness app called FitBot that tracks workouts and provides personalized training plans"

# Fintech Startup
./generate-site.sh "Build a site for a fintech startup that helps small businesses with automated bookkeeping and tax preparation"

# Education Platform
./generate-site.sh "Landing page for an online education platform teaching coding to kids aged 8-16 with interactive games"
```

### Custom Industries

The AI generator automatically adapts to different industries:

- **Health/Fitness**: Green color schemes, wellness-focused copy
- **Finance**: Blue/professional themes, trust-building language
- **Education**: Purple accents, learning-focused messaging
- **Software**: Tech-forward design, feature-rich content

---

**Built with ❤️ using Web Hull Template**

Ready to create your next website in minutes? Get started with Web Hull today! 