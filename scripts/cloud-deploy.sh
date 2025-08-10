#!/bin/bash

# Cloud deployment script for Cloud Build deployment  
# Usage: ./scripts/cloud-deploy.sh [PROJECT_ID]

set -e

# Handle help flag before loading config
if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
    echo "Usage: $0 [PROJECT_ID]"
    echo ""
    echo "Cloud Build deployment script"
    echo ""
    echo "This script uses Google Cloud Build to build and deploy your application"
    echo "entirely in the cloud, which is faster for updates and CI/CD pipelines."
    echo ""
    echo "Arguments:"
    echo "  PROJECT_ID     Optional Google Cloud Project ID (overrides config)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Use project from config/gcloud"
    echo "  $0 my-project-id     # Deploy to specific project"
    echo ""
    echo "Requirements:"
    echo "  • deployment-config.env configured (run ./scripts/setup-project.sh)"
    echo "  • gcloud CLI authenticated"
    echo "  • Cloud Build API enabled"
    exit 0
fi

# Load configuration from environment files
source "$(dirname "$0")/load-config.sh"
load_config

# Override PROJECT_ID if provided as argument
if [ -n "${1:-}" ]; then
    PROJECT_ID="$1"
    export PROJECT_ID
fi

# Validate configuration
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: PROJECT_ID required. Either:"
         echo "   • Pass it as argument: ./scripts/cloud-deploy.sh YOUR_PROJECT_ID"
    echo "   • Set with gcloud: gcloud config set project YOUR_PROJECT_ID"
    echo "   • Add to deployment-config.env file"
    echo ""
    echo "💡 For initial setup, run: ./scripts/setup-project.sh"
    exit 1
fi

if [ -z "$SERVICE_NAME" ]; then
    echo "❌ Error: SERVICE_NAME not set. Run: ./scripts/setup-project.sh"
    exit 1
fi

echo "🚀 Cloud deploying to project: $PROJECT_ID"
echo "📋 Service: $SERVICE_NAME | Region: $REGION"

# Build and deploy in one step using Cloud Build
PROJECT_ROOT="$(dirname "$(dirname "$0")")"
cd "$PROJECT_ROOT"

echo "🔧 Starting Cloud Build deployment..."

# Create a more manageable substitution string
SUBSTITUTIONS="_SERVICE_NAME=$SERVICE_NAME"
SUBSTITUTIONS="$SUBSTITUTIONS,_REGION=$REGION"
SUBSTITUTIONS="$SUBSTITUTIONS,_REGISTRY_HOSTNAME=$REGISTRY_HOSTNAME"
SUBSTITUTIONS="$SUBSTITUTIONS,_PORT=$PORT"
SUBSTITUTIONS="$SUBSTITUTIONS,_MEMORY=$MEMORY"
SUBSTITUTIONS="$SUBSTITUTIONS,_CPU=$CPU"
SUBSTITUTIONS="$SUBSTITUTIONS,_MIN_INSTANCES=$MIN_INSTANCES"
SUBSTITUTIONS="$SUBSTITUTIONS,_MAX_INSTANCES=$MAX_INSTANCES"
SUBSTITUTIONS="$SUBSTITUTIONS,_CONTAINER_CONCURRENCY=$CONTAINER_CONCURRENCY"
SUBSTITUTIONS="$SUBSTITUTIONS,_TIMEOUT_SECONDS=$TIMEOUT_SECONDS"
SUBSTITUTIONS="$SUBSTITUTIONS,_NODE_VERSION=$NODE_VERSION"
SUBSTITUTIONS="$SUBSTITUTIONS,_NGINX_VERSION=$NGINX_VERSION"

# Prepare authentication flag for Cloud Build
AUTH_FLAG="--allow-unauthenticated"
if [ "$ALLOW_UNAUTHENTICATED" != "true" ]; then
    AUTH_FLAG="--no-allow-unauthenticated"
fi
SUBSTITUTIONS="$SUBSTITUTIONS,_AUTH_FLAG=$AUTH_FLAG"
SUBSTITUTIONS="$SUBSTITUTIONS,_GEMINI_API_KEY=$GEMINI_API_KEY"

gcloud builds submit --config cloudbuild.yaml \
    --substitutions="$SUBSTITUTIONS" \
    --project="$PROJECT_ID"

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --region "$REGION" \
    --project="$PROJECT_ID" \
    --format "value(status.url)" 2>/dev/null || echo "")

echo ""
if [ -n "$SERVICE_URL" ]; then
    echo "✅ Deployment complete!"
    echo "🌐 Service URL: $SERVICE_URL"
else
    echo "✅ Build complete! Check Cloud Console for deployment status."
fi
echo ""
echo "💡 To check logs: gcloud logs read --project=$PROJECT_ID --limit=50" 