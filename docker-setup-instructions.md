# Docker Setup Instructions

1. Create a `.env.local` file in the project root with the following content:

```env
# OpenAI API Configuration
OPENAI_API_KEY=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
OPENAI_API_BASE_URL=https://openrouter.ai/api
OPENAI_API_MODEL=deepseek/deepseek-chat

# Search Configuration
SEARCH_API=searxng

# SearXNG Configuration
SEARXNG_PORT=8080
SEARXNG_API_URL=http://searxng:8080
SEARXNG_BIND_ADDRESS=0.0.0.0
SEARXNG_IMAGE_PROXY=true
SEARXNG_LIMITER=false
SEARXNG_DEFAULT_DEPTH=basic
SEARXNG_MAX_RESULTS=50
SEARXNG_ENGINES=google,bing,duckduckgo,wikipedia

# Redis Configuration (for chat history)
USE_LOCAL_REDIS=true
LOCAL_REDIS_URL=redis://redis:6379
```

2. Run the following command to start all services:
```bash
docker compose up
```

The services that will be started:
- morphic (main application on port 3000)
- redis (for chat history)
- searxng (search engine on port 8080)

You can access the application at http://localhost:3000 once it's running.
