#!/bin/bash

# Deployment Doctor - Diagnose and fix common deployment issues
# Usage: ./scripts/doctor.sh [--fix] [--verbose]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script options
AUTO_FIX=false
VERBOSE=false
ISSUES_FOUND=0
FIXES_APPLIED=0

print_header() {
    echo -e "${CYAN}🏥 Deployment Doctor${NC}"
    echo -e "${CYAN}═══════════════════${NC}"
    echo "Diagnosing common deployment issues..."
    echo ""
}

print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✅]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌]${NC} $1"
    ((ISSUES_FOUND++))
}

print_fix() {
    echo -e "${CYAN}[🔧]${NC} $1"
}

verbose_log() {
    if [ "$VERBOSE" = "true" ]; then
        echo -e "${CYAN}[DEBUG]${NC} $1"
    fi
}

# Load configuration to get current settings
load_config() {
    source "$(dirname "$0")/load-config.sh"
    load_config
}

# Check if prerequisites are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check gcloud
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed"
        echo "  📋 Install: https://cloud.google.com/sdk/docs/install"
        if [ "$AUTO_FIX" = "true" ]; then
            print_fix "Cannot auto-install gcloud CLI. Please install manually."
        fi
    else
        local version=$(gcloud version --format="value(Google Cloud SDK)")
        print_success "gcloud CLI installed (version: $version)"
        verbose_log "gcloud found at: $(which gcloud)"
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        echo "  📋 Install: https://docs.docker.com/get-docker/"
        if [ "$AUTO_FIX" = "true" ]; then
            print_fix "Cannot auto-install Docker. Please install manually."
        fi
    else
        local version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "Docker installed (version: $version)"
        verbose_log "Docker found at: $(which docker)"
        
        # Check if Docker daemon is running
        if ! docker info &> /dev/null; then
            print_error "Docker daemon is not running"
            if [ "$AUTO_FIX" = "true" ]; then
                print_fix "Attempting to start Docker..."
                if sudo systemctl start docker &> /dev/null; then
                    print_success "Docker daemon started"
                    ((FIXES_APPLIED++))
                else
                    print_fix "Failed to start Docker daemon. Please start it manually."
                fi
            fi
        else
            print_success "Docker daemon is running"
        fi
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed (required for local development)"
        echo "  📋 Install: https://nodejs.org/"
    else
        local version=$(node --version)
        print_success "Node.js installed (version: $version)"
        verbose_log "Node.js found at: $(which node)"
    fi
}

# Check authentication
check_authentication() {
    print_status "Checking Google Cloud authentication..."
    
    # Check if authenticated
    local auth_account=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null)
    if [ -z "$auth_account" ]; then
        print_error "Not authenticated with Google Cloud"
        if [ "$AUTO_FIX" = "true" ]; then
            print_fix "Run: gcloud auth login"
        fi
    else
        print_success "Authenticated as: $auth_account"
        verbose_log "Auth account: $auth_account"
    fi
    
    # Check Docker authentication
    if command -v docker &> /dev/null && [ -n "$auth_account" ]; then
        local docker_config="$HOME/.docker/config.json"
        if [ -f "$docker_config" ] && grep -q "gcloud" "$docker_config"; then
            print_success "Docker configured for Google Cloud"
        else
            print_warning "Docker not configured for Google Cloud Registry"
            if [ "$AUTO_FIX" = "true" ]; then
                print_fix "Configuring Docker for Google Cloud..."
                if gcloud auth configure-docker --quiet &> /dev/null; then
                    print_success "Docker configured for Google Cloud"
                    ((FIXES_APPLIED++))
                else
                    print_fix "Failed to configure Docker. Run: gcloud auth configure-docker"
                fi
            else
                echo "  🔧 Fix: Run 'gcloud auth configure-docker'"
            fi
        fi
    fi
}

# Check project configuration
check_project_config() {
    print_status "Checking project configuration..."
    
    # Check if configuration file exists
    if [ ! -f "deployment-config.env" ]; then
        print_error "No deployment-config.env found"
        if [ "$AUTO_FIX" = "true" ]; then
            print_fix "Creating deployment configuration..."
            if ./scripts/setup-project.sh --non-interactive &> /dev/null; then
                print_success "Created deployment configuration"
                ((FIXES_APPLIED++))
            else
                print_fix "Failed to create configuration. Run: ./scripts/setup-project.sh"
            fi
        else
            echo "  🔧 Fix: Run './scripts/setup-project.sh'"
        fi
        return
    else
        print_success "deployment-config.env exists"
    fi
    
    # Validate project ID
    if [ -z "$PROJECT_ID" ]; then
        print_error "PROJECT_ID not set"
        if [ "$AUTO_FIX" = "true" ]; then
            local detected_id=$(gcloud config get-value project 2>/dev/null)
            if [ -n "$detected_id" ]; then
                print_fix "Setting PROJECT_ID to: $detected_id"
                echo "PROJECT_ID=$detected_id" >> deployment-config.env
                print_success "PROJECT_ID configured"
                ((FIXES_APPLIED++))
            else
                print_fix "No default project found. Run: gcloud config set project YOUR_PROJECT_ID"
            fi
        fi
    else
        # Verify project exists and is accessible
        if gcloud projects describe "$PROJECT_ID" &> /dev/null; then
            print_success "Project ID verified: $PROJECT_ID"
        else
            print_error "Cannot access project: $PROJECT_ID"
            echo "  🔧 Check: Project exists and you have access"
        fi
    fi
    
    # Check service name
    if [ -z "$SERVICE_NAME" ]; then
        print_error "SERVICE_NAME not set"
        if [ "$AUTO_FIX" = "true" ]; then
            local auto_name="${PROJECT_NAME:-app}-service"
            print_fix "Setting SERVICE_NAME to: $auto_name"
            echo "SERVICE_NAME=$auto_name" >> deployment-config.env
            print_success "SERVICE_NAME configured"
            ((FIXES_APPLIED++))
        fi
    else
        print_success "Service name configured: $SERVICE_NAME"
    fi
}

# Check API keys and secrets
check_secrets() {
    print_status "Checking API keys and secrets..."
    
    if [ ! -f ".env.local" ]; then
        print_warning "No .env.local file found"
        if [ "$AUTO_FIX" = "true" ]; then
            print_fix "Creating .env.local template..."
            cat > .env.local << 'EOF'
# API Keys and Secrets
GEMINI_API_KEY=your_gemini_api_key_here
EOF
            print_success "Created .env.local template"
            ((FIXES_APPLIED++))
        else
            echo "  🔧 Fix: Create .env.local with your API keys"
        fi
    else
        print_success ".env.local exists"
        
        # Check for placeholder values
        if grep -q "your_.*_key_here" .env.local; then
            print_warning "Found placeholder API keys in .env.local"
            echo "  🔧 Update your API keys with real values"
        fi
        
        # Check GEMINI_API_KEY specifically
        if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your_gemini_api_key_here" ]; then
            print_warning "GEMINI_API_KEY not properly configured"
            echo "  🔧 Set GEMINI_API_KEY in .env.local"
        else
            print_success "GEMINI_API_KEY configured"
        fi
    fi
}

# Check Google Cloud services
check_services() {
    print_status "Checking required Google Cloud services..."
    
    if [ -z "$PROJECT_ID" ]; then
        print_warning "Cannot check services - PROJECT_ID not set"
        return
    fi
    
    local required_services=(
        "cloudbuild.googleapis.com"
        "run.googleapis.com"
        "containerregistry.googleapis.com"
    )
    
    for service in "${required_services[@]}"; do
        if gcloud services list --enabled --project="$PROJECT_ID" --format="value(name)" 2>/dev/null | grep -q "$service"; then
            print_success "Service enabled: $service"
        else
            print_error "Service not enabled: $service"
            if [ "$AUTO_FIX" = "true" ]; then
                print_fix "Enabling service: $service"
                if gcloud services enable "$service" --project="$PROJECT_ID" --quiet &> /dev/null; then
                    print_success "Service enabled: $service"
                    ((FIXES_APPLIED++))
                else
                    print_fix "Failed to enable $service. Enable manually in Cloud Console."
                fi
            else
                echo "  🔧 Fix: gcloud services enable $service"
            fi
        fi
    done
}

# Check file permissions
check_permissions() {
    print_status "Checking file permissions..."
    
    local scripts=("scripts/deploy.sh" "scripts/cloud-deploy.sh" "scripts/dev-container.sh" "scripts/setup-project.sh" "scripts/check-config.sh")
    
    for script in "${scripts[@]}"; do
        if [ -f "$script" ]; then
            if [ -x "$script" ]; then
                print_success "Executable: $script"
            else
                print_warning "Not executable: $script"
                if [ "$AUTO_FIX" = "true" ]; then
                    print_fix "Making executable: $script"
                    chmod +x "$script"
                    print_success "Fixed permissions: $script"
                    ((FIXES_APPLIED++))
                else
                    echo "  🔧 Fix: chmod +x $script"
                fi
            fi
        else
            print_warning "Script not found: $script"
        fi
    done
}

# Check for common issues
check_common_issues() {
    print_status "Checking for common issues..."
    
    # Check for old project number instead of project ID
    if [ -n "$PROJECT_ID" ] && [[ "$PROJECT_ID" =~ ^[0-9]+$ ]]; then
        print_error "PROJECT_ID appears to be a project number, not project ID"
        echo "  🔧 Fix: Use the project ID (letters/hyphens) not project number (digits)"
        if [ "$AUTO_FIX" = "true" ]; then
            print_fix "Please manually update PROJECT_ID in deployment-config.env"
        fi
    fi
    
    # Check for missing Dockerfile
    if [ ! -f "Dockerfile" ]; then
        print_error "No Dockerfile found"
        echo "  🔧 This is required for containerized deployment"
    else
        print_success "Dockerfile exists"
    fi
    
    # Check for package.json (for Node.js projects)
    if [ ! -f "package.json" ]; then
        print_warning "No package.json found - not a Node.js project?"
    else
        print_success "package.json exists"
        
        # Check if dependencies are installed
        if [ ! -d "node_modules" ]; then
            print_warning "node_modules not found - dependencies not installed"
            if [ "$AUTO_FIX" = "true" ]; then
                print_fix "Installing dependencies..."
                if npm install &> /dev/null; then
                    print_success "Dependencies installed"
                    ((FIXES_APPLIED++))
                else
                    print_fix "Failed to install dependencies. Run: npm install"
                fi
            else
                echo "  🔧 Fix: npm install"
            fi
        fi
    fi
}

# Show summary
show_summary() {
    echo ""
    echo -e "${CYAN}📋 Summary${NC}"
    echo -e "${CYAN}═══════════${NC}"
    
    if [ $ISSUES_FOUND -eq 0 ]; then
        echo -e "${GREEN}🎉 No issues found! Your deployment setup looks healthy.${NC}"
    else
        echo -e "${YELLOW}Found $ISSUES_FOUND issue(s)${NC}"
        if [ "$AUTO_FIX" = "true" ]; then
            echo -e "${GREEN}Applied $FIXES_APPLIED automatic fix(es)${NC}"
            if [ $FIXES_APPLIED -lt $ISSUES_FOUND ]; then
                echo -e "${YELLOW}Some issues require manual attention${NC}"
            fi
        else
            echo -e "${BLUE}Run with --fix to attempt automatic fixes${NC}"
        fi
    fi
    
    echo ""
    echo "💡 Pro Tips:"
    echo "• Run './scripts/check-config.sh' to validate your configuration"
    echo "• Use './scripts/doctor.sh --fix --verbose' for detailed diagnostics"
    echo "• Check './scripts/setup-project.sh --help' for setup options"
}

# Main execution
main() {
    print_header
    
    # Load configuration (ignore errors for diagnosis)
    load_config 2>/dev/null || true
    
    # Run checks
    check_prerequisites
    check_authentication
    check_project_config
    check_secrets
    check_services
    check_permissions
    check_common_issues
    
    show_summary
    
    # Exit with appropriate code
    if [ $ISSUES_FOUND -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --fix)
            AUTO_FIX=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Diagnose and fix common deployment issues"
            echo ""
            echo "Options:"
            echo "  --fix               Attempt to automatically fix issues"
            echo "  --verbose, -v       Show verbose diagnostic information"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                  # Diagnose issues only"
            echo "  $0 --fix            # Diagnose and fix issues"
            echo "  $0 --fix --verbose  # Diagnose, fix, and show details"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

main 