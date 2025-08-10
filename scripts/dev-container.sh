#!/bin/bash

# Local Container Development Script
# Test the production Docker container locally before deploying
# Usage: ./scripts/dev-container.sh [--build] [--stop] [--logs]

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

# Configuration
CONTAINER_NAME="zgraia-local-dev"
IMAGE_NAME="zgraia-local:latest"
LOCAL_PORT="8080"

# Function to build the Docker image
build_image() {
    print_status "Building local development Docker image..."
    
    # Change to project root
    PROJECT_ROOT="$(dirname "$(dirname "$0")")"
    cd "$PROJECT_ROOT"
    
    # Build the same image as production
    docker build \
        --build-arg NODE_VERSION="$NODE_VERSION" \
        --build-arg NGINX_VERSION="$NGINX_VERSION" \
        --build-arg PORT="$PORT" \
        -t "$IMAGE_NAME" \
        .
    
    print_success "Image built: $IMAGE_NAME"
}

# Function to stop existing container
stop_container() {
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        print_status "Stopping existing container: $CONTAINER_NAME"
        docker stop "$CONTAINER_NAME" >/dev/null
        docker rm "$CONTAINER_NAME" >/dev/null
        print_success "Container stopped and removed"
    fi
}

# Function to run the container
run_container() {
    print_status "Starting local development container..."
    
    # Check if API key is set
    if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your_gemini_api_key_here" ]; then
        print_warning "GEMINI_API_KEY not set or using placeholder value"
        print_warning "App may not function properly without a real API key"
        GEMINI_API_KEY="placeholder_key_for_local_dev"
    fi
    
    # Run container with same environment as production
    docker run -d \
        --name "$CONTAINER_NAME" \
        -p "$LOCAL_PORT:$PORT" \
        -e GEMINI_API_KEY="$GEMINI_API_KEY" \
        -e NODE_ENV="$NODE_ENV" \
        "$IMAGE_NAME"
    
    # Wait a moment for container to start
    sleep 2
    
    # Check if container is running
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        print_success "Container started successfully!"
        echo ""
        echo "🌐 Local URL: http://localhost:$LOCAL_PORT"
        echo "🐳 Container: $CONTAINER_NAME"
        echo "📦 Image: $IMAGE_NAME"
        echo ""
        echo "Commands:"
        echo "  • View logs: ./scripts/dev-container.sh --logs"
        echo "  • Stop container: ./scripts/dev-container.sh --stop"
        echo "  • Rebuild image: ./scripts/dev-container.sh --build"
        echo ""
        
        # Show container status
        print_status "Container status:"
        docker ps --filter name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
    else
        print_error "Failed to start container"
        exit 1
    fi
}

# Function to show logs
show_logs() {
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        print_status "Showing container logs (Ctrl+C to exit):"
        docker logs -f "$CONTAINER_NAME"
    else
        print_error "Container $CONTAINER_NAME is not running"
        exit 1
    fi
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running or not accessible"
        echo "Please start Docker and try again"
        exit 1
    fi
}

# Main function
main() {
    case "${1:-}" in
        --build|-b)
            check_docker
            stop_container
            build_image
            run_container
            ;;
        --stop|-s)
            stop_container
            ;;
        --logs|-l)
            show_logs
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Run the production Docker container locally for testing"
            echo ""
            echo "Options:"
            echo "  --build, -b     Rebuild image and start container"
            echo "  --stop, -s      Stop and remove the container"
            echo "  --logs, -l      View container logs"
            echo "  --help, -h      Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0              # Start container (build if needed)"
            echo "  $0 --build      # Force rebuild and start"
            echo "  $0 --logs       # View logs"
            echo "  $0 --stop       # Stop container"
            echo ""
            echo "The container will be available at: http://localhost:$LOCAL_PORT"
            exit 0
            ;;
        "")
            # Default: start container (build if image doesn't exist)
            check_docker
            
            # Check if image exists
            if ! docker images -q "$IMAGE_NAME" | grep -q .; then
                print_status "Image not found, building first..."
                build_image
            fi
            
            # Stop existing container and start new one
            stop_container
            run_container
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
}

main "$@" 