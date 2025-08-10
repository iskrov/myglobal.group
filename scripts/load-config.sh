#!/bin/bash

# Smart Configuration loader for deployment scripts
# Loads configuration from deployment-config.env with intelligent fallbacks

# Function to load environment variables with smart defaults
load_config() {
    # Get the project root directory (parent of scripts)
    PROJECT_ROOT="$(dirname "$(dirname "$0")")"
    
    # Initialize with minimal defaults (no project-specific values)
    export NODE_ENV="${NODE_ENV:-production}"
    export REGION="${REGION:-us-west1}"
    export PORT="${PORT:-8080}"
    export MEMORY="${MEMORY:-512Mi}"
    export CPU="${CPU:-1}"
    export MIN_INSTANCES="${MIN_INSTANCES:-0}"
    export MAX_INSTANCES="${MAX_INSTANCES:-3}"
    export CONTAINER_CONCURRENCY="${CONTAINER_CONCURRENCY:-80}"
    export TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-300}"
    export REGISTRY_HOSTNAME="${REGISTRY_HOSTNAME:-gcr.io}"
    export ALLOW_UNAUTHENTICATED="${ALLOW_UNAUTHENTICATED:-true}"
    export NODE_VERSION="${NODE_VERSION:-18}"
    export NGINX_VERSION="${NGINX_VERSION:-alpine}"

    # Load primary configuration from deployment-config.env (highest priority)
    local config_file="$PROJECT_ROOT/deployment-config.env"
    if [ -f "$config_file" ]; then
        echo "Loading configuration from deployment-config.env..."
        source "$config_file"
    else
        # Fallback: try to load from legacy files for backward compatibility
        if [ -f "$PROJECT_ROOT/.env.local" ]; then
            echo "Loading configuration from .env.local..."
            source "$PROJECT_ROOT/.env.local"
        fi
        
        if [ -f "$PROJECT_ROOT/deployment.env.example" ]; then
            echo "Loading defaults from deployment.env.example..."
            # Only load values that aren't already set
            while IFS='=' read -r key value || [[ -n "$key" ]]; do
                # Skip comments and empty lines
                [[ $key =~ ^[[:space:]]*# ]] && continue
                [[ -z $key ]] && continue
                [[ -n ${!key} ]] && continue  # Only set if not already set
                
                # Remove quotes and export
                value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
                export "$key=$value"
            done < "$PROJECT_ROOT/deployment.env.example"
        fi
    fi

    # Load secrets from .env.local (always check for API keys)
    if [ -f "$PROJECT_ROOT/.env.local" ]; then
        # Only load secrets/API keys, not configuration
        while IFS='=' read -r key value || [[ -n "$key" ]]; do
            # Skip comments and empty lines
            [[ $key =~ ^[[:space:]]*# ]] && continue
            [[ -z $key ]] && continue
            
            # Only load secret-like variables
            if [[ $key =~ .*_(KEY|SECRET|TOKEN|PASSWORD)$ ]] || [[ $key == "GEMINI_API_KEY" ]]; then
                value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
                export "$key=$value"
            fi
        done < "$PROJECT_ROOT/.env.local"
    fi

    # Auto-detect PROJECT_ID if not set
    if [ -z "$PROJECT_ID" ]; then
        PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")
        if [ -n "$PROJECT_ID" ]; then
            export PROJECT_ID
            echo "Auto-detected PROJECT_ID: $PROJECT_ID"
        fi
    fi

    # Auto-generate SERVICE_NAME if not set
    if [ -z "$SERVICE_NAME" ]; then
        if [ -n "$PROJECT_NAME" ]; then
            export SERVICE_NAME="${PROJECT_NAME}-app"
            echo "Auto-generated SERVICE_NAME: $SERVICE_NAME"
        else
            # Last resort: use directory name
            local dir_name=$(basename "$PROJECT_ROOT" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
            export SERVICE_NAME="${dir_name}-app"
            echo "Generated SERVICE_NAME from directory: $SERVICE_NAME"
        fi
    fi

    # Set derived values
    if [ -n "$PROJECT_ID" ] && [ -n "$SERVICE_NAME" ]; then
        export IMAGE_NAME="${REGISTRY_HOSTNAME}/${PROJECT_ID}/${SERVICE_NAME}"
    fi
    
    # Validate critical configuration
    if [ -z "$GEMINI_API_KEY" ] && [ ! -f "$PROJECT_ROOT/.env.local" ]; then
        echo "⚠️  Warning: GEMINI_API_KEY not set. Create .env.local with your API key."
    fi
    
    if [ -z "$PROJECT_ID" ]; then
        echo "⚠️  Warning: PROJECT_ID not set. Run 'gcloud config set project YOUR_PROJECT_ID' or set in deployment-config.env"
    fi
}

# Function to print current configuration  
print_config() {
    echo ""
    echo "📋 Current Configuration:"
    echo "========================"
    echo "Project Name: ${PROJECT_NAME:-<not set>}"
    echo "Project ID: ${PROJECT_ID:-<auto-detect from gcloud>}"
    echo "Service Name: $SERVICE_NAME"
    echo "Region: $REGION"
    echo "Registry: $REGISTRY_HOSTNAME"
    echo "Port: $PORT"
    echo "Memory: $MEMORY"
    echo "CPU: $CPU"
    echo "Min Instances: $MIN_INSTANCES"
    echo "Max Instances: $MAX_INSTANCES"
    echo "Container Concurrency: $CONTAINER_CONCURRENCY"
    echo "Timeout: $TIMEOUT_SECONDS seconds"
    echo "Allow Unauthenticated: $ALLOW_UNAUTHENTICATED"
    echo "API Key: $([ -n "$GEMINI_API_KEY" ] && echo "✅ Set" || echo "❌ Not set")"
    if [ -n "$IMAGE_NAME" ]; then
        echo "Image: $IMAGE_NAME"
    fi
    echo ""
}

# Function to validate configuration
validate_config() {
    local errors=0
    
    echo "🔍 Validating configuration..."
    
    # Check required tools
    if ! command -v gcloud &> /dev/null; then
        echo "❌ gcloud CLI is required but not installed"
        echo "   Install: https://cloud.google.com/sdk/docs/install"
        ((errors++))
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is required but not installed"
        echo "   Install: https://docs.docker.com/get-docker/"
        ((errors++))
    fi
    
    # Check project ID
    if [ -z "$PROJECT_ID" ]; then
        echo "❌ PROJECT_ID not set"
        echo "   Fix: Run 'gcloud config set project YOUR_PROJECT_ID' or set in deployment-config.env"
        ((errors++))
    fi
    
    # Check service name
    if [ -z "$SERVICE_NAME" ]; then
        echo "❌ SERVICE_NAME not set and could not auto-generate"
        echo "   Fix: Set SERVICE_NAME in deployment-config.env"
        ((errors++))
    fi
    
    # Check numeric values
    if ! [[ "$MAX_INSTANCES" =~ ^[0-9]+$ ]] || [ "$MAX_INSTANCES" -lt 1 ]; then
        echo "❌ MAX_INSTANCES must be a positive integer"
        ((errors++))
    fi
    
    if ! [[ "$MIN_INSTANCES" =~ ^[0-9]+$ ]] || [ "$MIN_INSTANCES" -lt 0 ]; then
        echo "❌ MIN_INSTANCES must be a non-negative integer"
        ((errors++))
    fi
    
    if [ "$MIN_INSTANCES" -gt "$MAX_INSTANCES" ]; then
        echo "❌ MIN_INSTANCES cannot be greater than MAX_INSTANCES"
        ((errors++))
    fi
    
    # Check memory format
    if ! [[ "$MEMORY" =~ ^[0-9]+[GM]i?$ ]]; then
        echo "❌ MEMORY must be in format like '512Mi' or '1Gi'"
        ((errors++))
    fi
    
    # Check timeout
    if ! [[ "$TIMEOUT_SECONDS" =~ ^[0-9]+$ ]] || [ "$TIMEOUT_SECONDS" -lt 1 ]; then
        echo "❌ TIMEOUT_SECONDS must be a positive integer"
        ((errors++))
    fi
    
    # Provide helpful guidance if no configuration file found
    if [ ! -f "$(dirname "$(dirname "$0")")/deployment-config.env" ]; then
        echo ""
        echo "💡 No deployment-config.env found. For easier setup, run:"
        echo "   ./scripts/setup-project.sh"
    fi
    
    if [ $errors -eq 0 ]; then
        echo "✅ Configuration validation passed!"
        return 0
    else
        echo "❌ Configuration validation failed with $errors error(s)"
        echo ""
        echo "💡 To fix these issues:"
        echo "   • Run './scripts/setup-project.sh' for guided setup"
        echo "   • Or manually create deployment-config.env with required values"
        return 1
    fi
} 