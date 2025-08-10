#!/bin/bash

# AI-Powered Website Generator
# Usage: ./generate-site.sh "Create a landing page for..."

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}🤖 AI Website Generator${NC}"
    echo "=============================="
    echo ""
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to generate site config using AI (placeholder for now)
generate_site_config() {
    local prompt="$1"
    
    print_status "Analyzing your request: '$prompt'"
    print_status "Generating site configuration with AI..."
    
    # For now, we'll create a smart template based on common patterns
    # In production, this would call an LLM API
    
    # Extract key information from prompt
    local product_name=""
    local industry=""
    local target_audience=""
    local key_features=""
    
    # Simple keyword extraction (would be replaced with proper NLP)
    if [[ "$prompt" =~ (app|application|software|tool|platform) ]]; then
        industry="software"
    elif [[ "$prompt" =~ (fitness|health|wellness|medical) ]]; then
        industry="health"
    elif [[ "$prompt" =~ (finance|fintech|banking|investment) ]]; then
        industry="finance"
    elif [[ "$prompt" =~ (education|learning|course|training) ]]; then
        industry="education"
    else
        industry="business"
    fi
    
    # Generate color scheme based on industry
    local primary_color="#3B82F6"  # Default blue
    local secondary_color="#1E40AF"
    local accent_color="#F59E0B"
    
    case $industry in
        "health")
            primary_color="#10B981"
            secondary_color="#059669"
            accent_color="#F59E0B"
            ;;
        "finance")
            primary_color="#1E40AF"
            secondary_color="#1E3A8A"
            accent_color="#10B981"
            ;;
        "education")
            primary_color="#7C3AED"
            secondary_color="#5B21B6"
            accent_color="#F59E0B"
            ;;
    esac
    
    # Create site-config.json with AI-generated content
    cat > site-config.json << EOF
{
  "site": {
    "title": "Generated from: ${prompt:0:50}...",
    "description": "AI-generated landing page based on your requirements",
    "tagline": "Innovation Made Simple",
    "domain": "${product_name:-yourproduct}.com"
  },
  "branding": {
    "logo": {
      "text": "${product_name:-YourBrand}",
      "hasIcon": false,
      "iconUrl": ""
    },
    "colors": {
      "primary": "$primary_color",
      "secondary": "$secondary_color", 
      "accent": "$accent_color",
      "background": "#FFFFFF",
      "text": "#1F2937",
      "textLight": "#6B7280"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    }
  },
  "hero": {
    "headline": "Transform Your Business Today",
    "subheadline": "AI-generated content based on: $prompt",
    "cta": {
      "primary": "Get Started Free",
      "secondary": "Learn More"
    },
    "image": {
      "url": "",
      "alt": "Product showcase"
    },
    "backgroundStyle": "gradient"
  },
  "features": [
    {
      "title": "Feature One",
      "description": "Amazing capability that solves your problems",
      "icon": "⚡"
    },
    {
      "title": "Feature Two", 
      "description": "Another great feature you'll love",
      "icon": "🔒"
    },
    {
      "title": "Feature Three",
      "description": "The final feature that seals the deal",
      "icon": "🔧"
    }
  ],
  "valueProposition": {
    "headline": "Why Choose Us",
    "description": "We deliver results that matter to your business",
    "benefits": [
      "Save time and money",
      "Increase productivity",
      "Reduce complexity",
      "24/7 support"
    ]
  },
  "useCases": [
    {
      "title": "Small Teams",
      "description": "Perfect for growing businesses",
      "features": ["Easy setup", "Affordable pricing", "Basic support"]
    },
    {
      "title": "Large Organizations",
      "description": "Scale with confidence", 
      "features": ["Advanced features", "Custom integrations", "Priority support"]
    }
  ],
  "callToAction": {
    "headline": "Ready to Get Started?",
    "description": "Join thousands of satisfied customers today",
    "cta": {
      "primary": "Start Free Trial",
      "secondary": "Contact Sales"
    },
    "urgency": "Limited time offer",
    "trustSignals": [
      "No credit card required",
      "30-day money-back guarantee",
      "Cancel anytime"
    ]
  },
  "footer": {
    "company": {
      "name": "${product_name:-YourCompany}",
      "description": "Making business better through innovation"
    },
    "links": {
      "product": ["Features", "Pricing", "API"],
      "company": ["About", "Careers", "Contact"],
      "legal": ["Privacy", "Terms", "Security"]  
    },
    "social": {
      "twitter": "",
      "linkedin": "",
      "github": ""
    },
    "contact": {
      "email": "hello@${product_name:-yourcompany}.com",
      "phone": "+1 (555) 123-4567"
    }
  },
  "seo": {
    "keywords": ["$industry", "business", "productivity", "software"],
    "ogImage": "",
    "twitterCard": "summary_large_image"
  }
}
EOF

    print_success "Site configuration generated!"
}

# Function to update deployment config
update_deployment_config() {
    local site_name="$1"
    
    # Extract a clean service name from the prompt
    local service_name=$(echo "$site_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    service_name="${service_name:-ai-generated-site}"
    
    print_status "Creating deployment configuration for '$service_name'..."
    
    # Copy template and customize
    cp deployment-config.template deployment-config.env
    
    # Update with generated values
    sed -i "s/PROJECT_NAME=.*/PROJECT_NAME=$service_name/" deployment-config.env
    sed -i "s/SERVICE_NAME=.*/SERVICE_NAME=${service_name}-app/" deployment-config.env
    
    print_success "Deployment configuration updated!"
}

# Function to generate the React app files
generate_app_files() {
    print_status "Generating React application files..."
    
    # Generate package.json with correct name
    local site_title=$(grep '"title"' site-config.json | cut -d'"' -f4 | head -1)
    local package_name=$(echo "$site_title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    
    # Update package.json
    sed -i "s/\"name\": \".*\"/\"name\": \"$package_name\"/" package.json
    
    print_success "Application files updated!"
}

# Main function
main() {
    print_header
    
    if [ $# -eq 0 ]; then
        echo "Usage: $0 \"Your website description\""
        echo ""
        echo "Examples:"
        echo "  $0 \"Create a landing page for an AI fitness app called FitBot\""
        echo "  $0 \"Build a site for a fintech startup that helps with investments\""
        echo "  $0 \"Landing page for an online education platform\""
        echo ""
        exit 1
    fi
    
    local prompt="$1"
    
    print_status "Starting AI website generation..."
    print_status "Input: $prompt"
    echo ""
    
    # Generate the site
    generate_site_config "$prompt"
    update_deployment_config "$prompt"
    generate_app_files
    
    echo ""
    print_success "🎉 Website generated successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "──────────────"
    echo "1. Review site-config.json and customize as needed"
    echo "2. Add your API keys to .env.local (copy from deployment-config.template)"
    echo "3. Test locally: npm run dev"
    echo "4. Deploy: ./scripts/deploy.sh"
    echo ""
    echo "💡 Pro Tip: Edit site-config.json to fine-tune your content!"
}

# Handle help
if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
    main
    exit 0
fi

main "$@" 