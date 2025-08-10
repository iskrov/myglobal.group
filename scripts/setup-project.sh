#!/bin/bash

# Project Setup Script
# Helps initialize deployment configuration for a new project
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'  
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script options
INTERACTIVE=true
DRY_RUN=false

print_header() {
    echo -e "${BLUE}🚀 Project Deployment Setup${NC}"
    echo "=================================="
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

# Enhanced input validation
validate_project_name() {
    local name="$1"
    if [[ ! "$name" =~ ^[a-z0-9-]+$ ]]; then
        echo "❌ Project name must contain only lowercase letters, numbers, and hyphens"
        return 1
    fi
    if [[ ${#name} -lt 2 ]] || [[ ${#name} -gt 50 ]]; then
        echo "❌ Project name must be between 2 and 50 characters"
        return 1
    fi
    if [[ "$name" =~ ^-|-$ ]]; then
        echo "❌ Project name cannot start or end with a hyphen"
        return 1
    fi
    return 0
}

validate_project_id() {
    local id="$1"
    if [[ ! "$id" =~ ^[a-z0-9-]+$ ]]; then
        echo "❌ Project ID must contain only lowercase letters, numbers, and hyphens"
        return 1
    fi
    if [[ ${#id} -lt 6 ]] || [[ ${#id} -gt 30 ]]; then
        echo "❌ Project ID must be between 6 and 30 characters"
        return 1
    fi
    return 0
}

validate_region() {
    local region="$1"
    local valid_regions=("us-central1" "us-east1" "us-east4" "us-west1" "us-west2" "us-west3" "us-west4" "europe-north1" "europe-west1" "europe-west2" "europe-west3" "europe-west4" "europe-west6" "asia-east1" "asia-east2" "asia-northeast1" "asia-northeast2" "asia-northeast3" "asia-south1" "asia-southeast1" "asia-southeast2" "australia-southeast1")
    
    for valid in "${valid_regions[@]}"; do
        if [[ "$region" == "$valid" ]]; then
            return 0
        fi
    done
    echo "❌ Invalid region. Common regions: us-west1, us-central1, europe-west1, asia-east1"
    return 1
}

# Safe input function with validation
safe_input() {
    local prompt="$1"
    local default="$2"
    local validator="$3"
    local value=""
    local attempts=0
    local max_attempts=3

    while [ $attempts -lt $max_attempts ]; do
        if [ "$INTERACTIVE" = "true" ]; then
            read -p "$prompt" value
        else
            value="$default"
        fi
        
        value=${value:-$default}
        
        if [ -n "$validator" ] && command -v "$validator" >/dev/null 2>&1; then
            if "$validator" "$value"; then
                echo "$value"
                return 0
            fi
        else
            echo "$value"
            return 0
        fi
        
        ((attempts++))
        if [ $attempts -lt $max_attempts ]; then
            echo "Please try again ($((max_attempts - attempts)) attempts remaining):"
        fi
    done
    
    print_error "Too many invalid attempts. Exiting."
    exit 1
}

# Get project root directory
PROJECT_ROOT="$(dirname "$(dirname "$0")")"
cd "$PROJECT_ROOT"

# Function to detect project name from various sources
detect_project_name() {
    local name=""
    
    # Try to get from package.json
    if [ -f "package.json" ] && command -v jq &> /dev/null; then
        name=$(jq -r '.name // empty' package.json 2>/dev/null | sed 's/[^a-zA-Z0-9-]/-/g')
    fi
    
    # Fallback to directory name
    if [ -z "$name" ]; then
        name=$(basename "$PWD" | sed 's/[^a-zA-Z0-9-]/-/g')
    fi
    
    # Clean up name (remove special chars, convert to lowercase)
    name=$(echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    
    echo "$name"
}

# Function to auto-detect current gcloud project
detect_project_id() {
    gcloud config get-value project 2>/dev/null || echo ""
}

# Non-interactive configuration
configure_non_interactive() {
    # Check if config already exists and load it
    if [ -f "deployment-config.env" ]; then
        print_status "Found existing deployment-config.env - loading current values"
        source deployment-config.env
        
        local project_name=${1:-$PROJECT_NAME}
        local project_id=${2:-$PROJECT_ID}  
        local service_name=${3:-$SERVICE_NAME}
        local region=${4:-$REGION}
        local registry_hostname=${5:-$REGISTRY_HOSTNAME}
    else
        # No existing config - use detection
        local detected_name=$(detect_project_name)
        local detected_project_id=$(detect_project_id)
        
        local project_name=${1:-$detected_name}
        local project_id=${2:-$detected_project_id}
        local service_name=${3:-"${project_name}-app"}
        local region=${4:-"us-west1"}
        local registry_hostname=${5:-"gcr.io"}
    fi
    
    print_status "Non-interactive mode: Using configuration"
    echo "  Project Name: $project_name"
    echo "  Project ID: $project_id"
    echo "  Service Name: $service_name"
    echo "  Region: $region"
    echo "  Registry: $registry_hostname"
    echo ""
    
    create_config_file "$project_name" "$project_id" "$service_name" "$region" "$registry_hostname"
}

# Interactive configuration
configure_interactive() {
    local config_file="deployment-config.env"
    
    print_status "Setting up deployment configuration..."
    echo ""
    
    # Check if config already exists and load current values
    local detected_name=""
    local detected_project_id=""
    
    if [ -f "deployment-config.env" ]; then
        print_status "Loading current values from deployment-config.env..."
        source deployment-config.env
        
        detected_name="$PROJECT_NAME"
        detected_project_id="$PROJECT_ID"
        
        # Show current values
        echo "Current configuration:"
        echo "  Project Name: $PROJECT_NAME"
        echo "  Service Name: $SERVICE_NAME"
        echo "  Project ID: $PROJECT_ID"
        echo ""
    else
        # No existing config - use detection
        detected_name=$(detect_project_name)
        detected_project_id=$(detect_project_id)
    fi
    
    # Get project name with validation
    echo "📝 Project Configuration"
    echo "────────────────────────"
    local project_name=$(safe_input "Project name (current: $detected_name): " "$detected_name" "validate_project_name")
    
    # Get project ID with validation
    local project_id=""
    if [ -n "$detected_project_id" ]; then
        project_id=$(safe_input "Google Cloud Project ID (current: $detected_project_id): " "$detected_project_id" "validate_project_id")
    else
        print_warning "No project ID found"
        project_id=$(safe_input "Google Cloud Project ID (required): " "" "validate_project_id")
    fi
    
    # Get service name (use existing or generate)
    local current_service_name="$SERVICE_NAME"
    if [ -z "$current_service_name" ]; then
        current_service_name="${project_name}-app"
    fi
    local service_name=$(safe_input "Service name (current: $current_service_name): " "$current_service_name")
    
    # Get region with validation
    local current_region="$REGION"
    if [ -z "$current_region" ]; then
        current_region="us-west1"
    fi
    local region=$(safe_input "Deployment region (current: $current_region): " "$current_region" "validate_region")
    
    # Ask about Artifact Registry vs Container Registry
    echo ""
    echo "🏗️  Container Registry"
    echo "────────────────────────"
    echo "1. Container Registry (gcr.io) - Classic, widely supported"
    echo "2. Artifact Registry - Modern, recommended for new projects"
    local registry_choice=$(safe_input "Choose registry type (1-2, default: 1): " "1")
    
    local registry_hostname="gcr.io"
    if [ "$registry_choice" = "2" ]; then
        registry_hostname="${region}-docker.pkg.dev"
        print_status "Note: You may need to create an Artifact Registry repository"
    fi
    
    create_config_file "$project_name" "$project_id" "$service_name" "$region" "$registry_hostname"
}

# Create configuration file
create_config_file() {
    local project_name="$1"
    local project_id="$2"
    local service_name="$3"
    local region="$4"
    local registry_hostname="$5"
    local config_file="deployment-config.env"
    
    if [ "$DRY_RUN" = "true" ]; then
        print_status "DRY RUN: Would create $config_file with:"
        echo "  PROJECT_NAME=$project_name"
        echo "  PROJECT_ID=$project_id"
        echo "  SERVICE_NAME=$service_name"
        echo "  REGION=$region"
        echo "  REGISTRY_HOSTNAME=$registry_hostname"
        return
    fi
    
    print_status "Creating $config_file..."
    
    cat > "$config_file" << EOF
# ============================================
# PROJECT DEPLOYMENT CONFIGURATION
# ============================================
# Generated on $(date)
# Edit this file to customize your deployment

# ============================================
# PROJECT IDENTIFICATION
# ============================================

PROJECT_NAME=$project_name
PROJECT_ID=$project_id
SERVICE_NAME=$service_name

# ============================================
# DEPLOYMENT CONFIGURATION
# ============================================

REGION=$region
REGISTRY_HOSTNAME=$registry_hostname

# ============================================
# APPLICATION CONFIGURATION
# ============================================

NODE_ENV=production

# ============================================
# CLOUD RUN CONFIGURATION
# ============================================

# Container Configuration
PORT=8080
MEMORY=512Mi
CPU=1

# Scaling Configuration
MIN_INSTANCES=0
MAX_INSTANCES=3
CONTAINER_CONCURRENCY=80

# Request Configuration
TIMEOUT_SECONDS=300

# Security Configuration
ALLOW_UNAUTHENTICATED=true
SERVICE_ACCOUNT=

# ============================================
# BUILD CONFIGURATION
# ============================================

NODE_VERSION=18
NGINX_VERSION=alpine
EOF
    
    print_success "Configuration created: $config_file"
    
    # Create .env.local template if it doesn't exist
    if [ ! -f ".env.local" ]; then
        print_status "Creating .env.local template..."
        cat > ".env.local" << EOF
# ============================================
# LOCAL ENVIRONMENT CONFIGURATION
# ============================================
# Add your API keys and secrets here
# This file should NOT be committed to version control

# Gemini API Key (required for deployment)
GEMINI_API_KEY=your_gemini_api_key_here

# Additional environment variables for your app
# Add any other sensitive configuration here
EOF
        print_warning "Created .env.local template - please add your API keys"
    fi
    
    echo ""
    print_success "Project setup complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "──────────────"
    echo "1. Edit .env.local and add your API keys"
    echo "2. Review and customize $config_file if needed"
    echo "3. Test configuration: ./scripts/check-config.sh"
    echo "4. Deploy your app: ./scripts/deploy.sh"
    echo ""
    echo "💡 Pro Tips:"
    echo "• Run './scripts/check-config.sh' to validate your setup"
    echo "• Use './scripts/cloud-deploy.sh' for faster cloud-based builds"
    echo "• Configuration is automatically loaded from $config_file"
}

# Main execution
main() {
    print_header
    
    # Check if already configured (unless forced)
    if [ -f "deployment-config.env" ] && [ "$INTERACTIVE" = "true" ]; then
        echo "Found existing deployment-config.env"
        local reconfigure=""
        read -p "Reconfigure project? (y/N): " reconfigure
        if [ "$reconfigure" != "y" ] && [ "$reconfigure" != "Y" ]; then
            print_status "Using existing configuration"
            exit 0
        fi
        echo ""
    fi
    
    # Check prerequisites
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is required but not installed"
        echo "Please install Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    if [ "$INTERACTIVE" = "true" ]; then
        configure_interactive
    else
        configure_non_interactive "$@"
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            echo "Usage: $0 [OPTIONS] [PROJECT_NAME] [PROJECT_ID] [SERVICE_NAME] [REGION] [REGISTRY]"
            echo ""
            echo "Interactive project setup for Google Cloud deployment"
            echo ""
            echo "Options:"
            echo "  --non-interactive    Skip interactive prompts, use provided arguments or defaults"
            echo "  --dry-run           Show what would be created without making changes"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Non-interactive arguments (in order):"
            echo "  PROJECT_NAME        Project name (auto-detected if not provided)"
            echo "  PROJECT_ID          Google Cloud Project ID (from gcloud config if not provided)"
            echo "  SERVICE_NAME        Cloud Run service name (PROJECT_NAME-app if not provided)"
            echo "  REGION              Deployment region (us-west1 if not provided)"
            echo "  REGISTRY            Registry hostname (gcr.io if not provided)"
            echo ""
            echo "Examples:"
            echo "  $0                                    # Interactive setup"
            echo "  $0 --non-interactive                  # Use all defaults"
            echo "  $0 --non-interactive myapp my-proj   # Set project name and ID"
            echo "  $0 --dry-run myapp my-proj           # Show what would be created"
            exit 0
            ;;
        --non-interactive)
            INTERACTIVE=false
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            INTERACTIVE=false
            shift
            ;;
        -*)
            print_error "Unknown option: $1"
            exit 1
            ;;
        *)
            break
            ;;
    esac
done

main "$@" 