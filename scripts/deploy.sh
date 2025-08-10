#!/bin/bash

# Deployment script for Exocortex Vision to Google Cloud Run
set -e

# Load configuration from environment files
source "$(dirname "$0")/load-config.sh"
load_config

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed and validate configuration
check_prerequisites() {
    print_status "Checking prerequisites and validating configuration..."
    
    if ! validate_config; then
        exit 1
    fi
    
    print_success "Prerequisites and configuration validation passed!"
}

# Get project ID from user input or gcloud config
get_project_id() {
    if [ -z "$PROJECT_ID" ]; then
        # Try to get from gcloud config
        PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")
        
        if [ -z "$PROJECT_ID" ]; then
            print_error "Project ID not set. Please run: gcloud config set project YOUR_PROJECT_ID"
            exit 1
        fi
        export PROJECT_ID
    fi
    
    # Update IMAGE_NAME with the actual project ID
    export IMAGE_NAME="${REGISTRY_HOSTNAME}/${PROJECT_ID}/${SERVICE_NAME}"
    
    print_status "Using project: $PROJECT_ID"
    print_config
}

# Authenticate with Google Cloud
authenticate() {
    print_status "Checking authentication..."
    
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "."; then
        print_warning "Not authenticated. Please run: gcloud auth login"
        exit 1
    fi
    
    # Configure docker to use gcloud as credential helper
    gcloud auth configure-docker --quiet
    print_success "Authentication verified!"
}

# Enable required APIs
enable_apis() {
    print_status "Enabling required Google Cloud APIs..."
    gcloud services enable cloudbuild.googleapis.com --quiet
    gcloud services enable run.googleapis.com --quiet
    gcloud services enable containerregistry.googleapis.com --quiet
    print_success "APIs enabled!"
}

# Build and push Docker image
build_and_push() {
    print_status "Building Docker image..."
    
    # Change to project root for Docker build
    PROJECT_ROOT="$(dirname "$(dirname "$0")")"
    cd "$PROJECT_ROOT"
    
    # Generate timestamp for image tag
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    IMAGE_TAG="${IMAGE_NAME}:${TIMESTAMP}"
    IMAGE_LATEST="${IMAGE_NAME}:latest"
    
    # Build the image with build arguments
    docker build \
        --build-arg NODE_VERSION="$NODE_VERSION" \
        --build-arg NGINX_VERSION="$NGINX_VERSION" \
        --build-arg PORT="$PORT" \
        -t "$IMAGE_TAG" \
        -t "$IMAGE_LATEST" \
        .
    
    print_status "Pushing Docker image to Container Registry..."
    docker push "$IMAGE_TAG"
    docker push "$IMAGE_LATEST"
    
    print_success "Image built and pushed: $IMAGE_TAG"
    export BUILT_IMAGE="$IMAGE_TAG"
}

# Deploy to Cloud Run
deploy_service() {
    print_status "Deploying to Cloud Run with configuration:"
    print_status "  Service: $SERVICE_NAME"
    print_status "  Region: $REGION"
    print_status "  Memory: $MEMORY"
    print_status "  CPU: $CPU"
    print_status "  Min/Max Instances: $MIN_INSTANCES/$MAX_INSTANCES"
    
    # Prepare environment variables
    ENV_VARS=""
    if [ -n "$GEMINI_API_KEY" ]; then
        ENV_VARS="--set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY"
        print_status "✅ API key configured"
    else
        print_warning "No GEMINI_API_KEY found. Service may not function properly."
    fi
    
    # Prepare authentication flag
    AUTH_FLAG=""
    if [ "$ALLOW_UNAUTHENTICATED" = "true" ]; then
        AUTH_FLAG="--allow-unauthenticated"
    else
        AUTH_FLAG="--no-allow-unauthenticated"
    fi
    
    # Prepare service account flag
    SA_FLAG=""
    if [ -n "$SERVICE_ACCOUNT" ]; then
        SA_FLAG="--service-account=$SERVICE_ACCOUNT"
    fi
    
    # Deploy to Cloud Run
    gcloud run deploy "$SERVICE_NAME" \
        --image "$BUILT_IMAGE" \
        --region "$REGION" \
        --platform managed \
        $AUTH_FLAG \
        --port "$PORT" \
        --memory "$MEMORY" \
        --cpu "$CPU" \
        --min-instances "$MIN_INSTANCES" \
        --max-instances "$MAX_INSTANCES" \
        --concurrency "$CONTAINER_CONCURRENCY" \
        --timeout "$TIMEOUT_SECONDS" \
        $ENV_VARS \
        $SA_FLAG \
        --quiet
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
        --region "$REGION" \
        --format "value(status.url)")
    
    print_success "Deployment completed!"
    print_success "Service URL: $SERVICE_URL"
}

# Main deployment flow
main() {
    print_status "Starting deployment of $SERVICE_NAME..."
    
    check_prerequisites
    get_project_id
    authenticate
    enable_apis
    build_and_push
    deploy_service
    
    print_success "Deployment completed successfully!"
    echo ""
    echo "🚀 Your application is now live!"
    echo "📱 Access it at: $SERVICE_URL"
    echo ""
    echo "To update your deployment, simply run this script again."
}

# Handle script arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: $0 [PROJECT_ID]"
        echo ""
        echo "Deploy the Exocortex Vision application to Google Cloud Run"
        echo ""
        echo "Options:"
        echo "  PROJECT_ID    Google Cloud Project ID (optional, will use gcloud config if not provided)"
        echo "  --help, -h    Show this help message"
        echo ""
        echo "Prerequisites:"
        echo "  - Google Cloud SDK (gcloud) installed and configured"
        echo "  - Docker installed and running"
        echo "  - .env.local file with GEMINI_API_KEY (optional)"
        exit 0
        ;;
    *)
        if [ -n "${1:-}" ]; then
            PROJECT_ID="$1"
        fi
        main
        ;;
esac 