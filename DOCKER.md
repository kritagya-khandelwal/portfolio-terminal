# Docker Setup for Portfolio Terminal

This document explains how to run the Portfolio Terminal application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Quick Start

### Production Build

To run the application in production mode:

```bash
# Build and start the production container
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

The application will be available at `http://localhost:3000`

### Development Build

To run the application in development mode with hot reloading:

```bash
# Start development container
docker-compose --profile dev up --build

# Or run in detached mode
docker-compose --profile dev up -d --build
```

The development server will be available at `http://localhost:3001`

## Docker Commands

### Building Images

```bash
# Build production image
docker build -t portfolio-terminal:latest .

# Build development image
docker build -f dockerfile.dev -t portfolio-terminal:dev .
```

### Running Containers

```bash
# Run production container
docker run -p 3000:3000 portfolio-terminal:latest

# Run development container
docker run -p 3001:3000 -v $(pwd):/app portfolio-terminal:dev
```

### Managing Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f portfolio-terminal

# Restart service
docker-compose restart portfolio-terminal
```

## Configuration

### Environment Variables

The following environment variables can be configured:

- `NODE_ENV`: Set to `production` or `development`
- `NEXT_TELEMETRY_DISABLED`: Set to `1` to disable Next.js telemetry
- `PORT`: Port number (default: 3000)

### Port Mapping

- Production: `3000:3000`
- Development: `3001:3000`

## Health Checks

The application includes a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "portfolio-terminal"
}
```

## Multi-stage Build

The production Dockerfile uses a multi-stage build process:

1. **deps**: Installs production dependencies
2. **builder**: Builds the Next.js application
3. **runner**: Creates the final production image

This approach:
- Reduces final image size
- Improves security by not including build tools in production
- Optimizes caching for faster rebuilds

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port mapping in docker-compose.yml
2. **Build fails**: Ensure all dependencies are properly listed in package.json
3. **Permission issues**: The production container runs as a non-root user

### Debugging

```bash
# Access container shell
docker-compose exec portfolio-terminal sh

# View container logs
docker-compose logs portfolio-terminal

# Check container status
docker-compose ps
```

## Production Deployment

For production deployment, consider:

1. Using a reverse proxy (nginx, traefik)
2. Setting up SSL/TLS certificates
3. Configuring proper logging
4. Setting up monitoring and alerting
5. Using Docker secrets for sensitive data

### Example with Nginx

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  portfolio-terminal:
    build: .
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - portfolio-terminal
```

## Security Considerations

- The production container runs as a non-root user
- Only necessary files are copied to the final image
- Build tools are not included in the production image
- Environment variables are properly configured
- Health checks are implemented for monitoring 