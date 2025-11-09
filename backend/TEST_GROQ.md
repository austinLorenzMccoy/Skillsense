# Groq Integration Testing

## Setup

1. **Get Groq API Key** (Free)
   - Visit: https://console.groq.com/
   - Sign up and create an API key
   - Copy your key (starts with `gsk_`)

2. **Add to Environment**
   ```bash
   # Add to backend/.env file
   echo "GROQ_API_KEY=your-key-here" >> backend/.env
   
   # Or export temporarily
   export GROQ_API_KEY="your-key-here"
   ```

## Run Tests

```bash
# Activate virtual environment
source backend/venv/bin/activate

# Run Groq integration test
cd backend && python test_groq.py

# Run all tests
python -m pytest tests/ -v
```

## Expected Output

```
============================================================
Testing Groq Integration
============================================================

1. Checking Groq availability...
   ✅ Groq Available: True

2. Testing skill extraction...
   ✅ Extracted 6 skills:
      - Python: hard (confidence: 0.95)
      - Machine learning pipelines: hard (confidence: 0.9)
      - Team leadership: hard (confidence: 0.8)
      ...

3. Testing embeddings generation...
   ✅ Generated embedding vector of length: 384
      Non-zero values: 378/384

4. Testing main embeddings module...
   ✅ USE_GROQ: True
   ✅ Main module embedding length: 384

============================================================
Test Complete!
============================================================
```

## Groq Free Tier Limits

- **30 requests/minute**
- **14,400 requests/day**
- Perfect for development and small-scale production

## Troubleshooting

### "GROQ_API_KEY not set"
- Make sure the key is in `backend/.env`
- Or export it: `export GROQ_API_KEY="your-key"`

### "Groq API error"
- Check your API key is valid
- Verify you haven't exceeded rate limits
- Check internet connection

## Security

⚠️ **Never commit API keys to Git!**
- Keys are in `.gitignore`
- Use environment variables
- For production, use Render's environment variables
