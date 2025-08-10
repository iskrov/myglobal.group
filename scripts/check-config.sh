#!/bin/bash

# Configuration checker for Exocortex Vision deployment
# Usage: ./check-config.sh

set -e

# Load configuration
source "$(dirname "$0")/load-config.sh"
load_config

echo "🔍 Deployment Configuration Check"
echo "=================================================="

# Print current configuration
print_config

# Validate configuration
if validate_config; then
    echo ""
    echo "🎉 All checks passed! Your configuration is ready for deployment."
    echo ""
    echo "Next steps:"
    echo "  • Run './scripts/deploy.sh' for full deployment with local Docker build"
    echo "  • Run './scripts/cloud-deploy.sh' for cloud-based build and deploy"
    echo ""
    echo "Make sure your .env.local file contains:"
    echo "  GEMINI_API_KEY=your_actual_api_key_here"
else
    echo ""
    echo "❌ Configuration check failed. Please fix the issues above and try again."
    exit 1
fi 