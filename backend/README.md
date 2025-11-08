# SkillSense Backend

## ⚡ **100% FREE Setup for Hackathon**

This backend is designed to run completely free using local services and free API tiers!

### Quick Start (All Free)

1. **Clone and setup:**
   ```bash
   git clone <repo>
   cd skillsense-backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Get GitHub API Token (Free):**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scope: `public_repo` (for public repos) or `repo` (for private)
   - Copy token and add to `.env`:
   ```bash
   GITHUB_TOKEN=your_token_here
   ```

3. **Start services:**
   ```bash
   # Start PostgreSQL and Redis (free with Docker)
   docker-compose up -d postgres redis

   # Create database tables
   python create_tables.py
   ```

4. **Run the app:**
   ```bash
   # Terminal 1: Start backend
   uvicorn app.main:app --reload

   # Terminal 2: Start worker
   celery -A app.core.tasks worker --loglevel=info
   ```

## 📋 **Environment Setup**

Copy the example environment file:
```bash
cp .env.example .env
```

**Only required for free setup:**
- `DATABASE_URL` (auto-configured for local Docker)
- `REDIS_URL` (auto-configured for local Docker)  
- `GITHUB_TOKEN` (get from GitHub settings as above)

**Optional paid services** (leave commented out):
- OpenAI API (uses local fallback if empty)
- Sanity/GROQ (uses local skill list if empty)
- LinkedIn (disabled, uses manual input instead)

## 🧪 **Testing**

### Running Unit and Integration Tests

```bash
# Install dependencies
pip install -r requirements.txt

# Run tests
pytest -v

# Run with coverage
pytest --cov=app --cov-report=html
```

### API Demo

Run the API demo script to test all endpoints:

```bash
python api_demo.py
```

This will execute curl commands for all API endpoints and display responses.

### Test Structure

- `tests/test_models.py`: Unit tests for database models
- `tests/test_schemas.py`: Unit tests for Pydantic schemas
- `tests/test_api.py`: Integration tests for API endpoints
- `tests/conftest.py`: Pytest fixtures and configuration

### Manual Testing

Start the backend with Docker:

```bash
docker-compose up
```

Then use curl commands directly:

```bash
# Health check
curl http://localhost:8000/health

# Ingest
curl -X POST http://localhost:8000/api/v1/ingest \
  -F "urls=[\"https://github.com\"]" \
  -F "options={}"
```

See `api_demo.py` for complete examples.
