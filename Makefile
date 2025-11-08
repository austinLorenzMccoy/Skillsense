# SkillSense Development Makefile

.PHONY: help install dev test clean build deploy

# Default target
help:
	@echo "SkillSense Development Commands"
	@echo "================================"
	@echo "install    - Install all dependencies"
	@echo "dev        - Start development servers"
	@echo "test       - Run all tests"
	@echo "clean      - Clean up temporary files"
	@echo "build      - Build for production"
	@echo "deploy     - Deploy to production"
	@echo "docker     - Build and run with Docker"

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && pnpm install
	@echo "Installing complete!"

# Development setup
dev:
	@echo "Starting development environment..."
	@echo "Make sure PostgreSQL and Redis are running with:"
	@echo "cd backend && docker-compose up -d postgres redis"
	@echo ""
	@echo "Starting backend server..."
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
	@echo "Backend running on http://localhost:8000"
	@echo ""
	@echo "Starting frontend server..."
	cd frontend && pnpm run dev &
	@echo "Frontend running on http://localhost:8080"
	@echo ""
	@echo "Press Ctrl+C to stop all servers"

# Run tests
test:
	@echo "Running backend tests..."
	cd backend && pytest -v --cov=app --cov-report=html
	@echo "Running frontend tests..."
	cd frontend && pnpm test

# Clean up
clean:
	@echo "Cleaning up..."
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +
	find . -type d -name "node_modules" -exec rm -rf {} +
	find . -type d -name "dist" -exec rm -rf {} +
	find . -type d -name ".next" -exec rm -rf {} +
	docker system prune -f

# Build for production
build:
	@echo "Building frontend..."
	cd frontend && pnpm build
	@echo "Building backend Docker image..."
	cd backend && docker build -t skillsense-backend .

# Deploy
deploy:
	@echo "Deploying to production..."
	@echo "1. Frontend: Connect GitHub repo to Vercel"
	@echo "2. Backend: Use render.yaml on Render dashboard"
	@echo "3. Update frontend VITE_API_BASE_URL with backend URL"

# Docker development
docker:
	@echo "Starting with Docker Compose..."
	cd backend && docker-compose up --build

# Database setup
db-setup:
	@echo "Setting up database..."
	cd backend && docker-compose up -d postgres redis
	@echo "Waiting for databases to be ready..."
	sleep 10
	cd backend && python create_tables.py
	@echo "Database setup complete!"

# API demo
api-demo:
	@echo "Running API demo..."
	cd backend && python api_demo.py

# Lint code
lint:
	@echo "Linting backend..."
	cd backend && flake8 app tests
	@echo "Linting frontend..."
	cd frontend && pnpm lint

# Format code
format:
	@echo "Formatting backend..."
	cd backend && black app tests
	cd backend && isort app tests
	@echo "Formatting frontend..."
	cd frontend && pnpm format
