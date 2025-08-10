# Deployment Scripts

This directory contains all the deployment scripts for the Exocortex Vision application.

## Scripts Overview

### `check-config.sh`
Configuration validation utility that checks your environment setup before deployment.

```bash
./scripts/check-config.sh
```

**What it does:**
- Loads configuration from `.env.local` and `deployment.env.example`
- Validates all environment variables
- Checks for required tools (gcloud, docker)
- Displays current configuration
- Provides next-step guidance

### `deploy.sh`
Full deployment script with local Docker build and comprehensive error checking.

```bash
./scripts/deploy.sh [PROJECT_ID]
```

**What it does:**
- Validates configuration and prerequisites
- Builds Docker image locally with all build arguments
- Pushes image to Google Container Registry
- Deploys to Cloud Run with all configured parameters
- Provides deployment status and service URL

### `cloud-deploy.sh`
Streamlined deployment using Google Cloud Build for faster iterations.

```bash
./scripts/cloud-deploy.sh [PROJECT_ID]
```

**What it does:**
- Uses Google Cloud Build to build the Docker image in the cloud
- Deploys directly to Cloud Run
- Faster for subsequent deployments (no local Docker build)

### `dev-container.sh`
Local production container testing script.

```bash
./scripts/dev-container.sh [--build|--stop|--logs]
```

**What it does:**
- Builds the same Docker image as production locally
- Runs the container with production-like environment
- Tests your app at http://localhost:8080 before deploying
- Perfect for catching Docker/nginx issues before deployment

### `load-config.sh`
Configuration loader and validation library used by other scripts.

**Features:**
- Loads environment variables with smart defaults
- Supports hierarchical configuration (`.env.local` overrides `deployment.env.example`)
- Provides configuration validation functions
- Includes helpful error messages and debugging output

## Usage Examples

1. **First-time setup:**
   ```bash
   # Check your configuration
   ./scripts/check-config.sh
   
   # Deploy with full validation
   ./scripts/deploy.sh
   ```

2. **Quick updates:**
   ```bash
   # Fast cloud-based deployment
   ./scripts/cloud-deploy.sh
   ```

3. **Custom project:**
   ```bash
   # Deploy to specific project
   ./scripts/deploy.sh my-project-id
   ```

All scripts can be run from any directory and will automatically find the project root and configuration files. 