# Serper Search Provider Testing

## Manual Testing

To test the Serper search provider, you need a valid API key from [Serper.dev](https://serper.dev/).

### Setup

1. Get your API key from [Serper.dev](https://serper.dev/)
2. Set the environment variable:
   ```bash
   export SERPER_API_KEY=your_api_key_here
   ```

### Test via Environment Variable

Set the search provider to Serper:

```bash
export SEARCH_API=serper
```

Then run your application and perform a search query. The search should use Serper API.

### Expected Behavior

- ✅ Search queries should return results in 1-2 seconds
- ✅ Results should include `title`, `url`, and `content` fields
- ✅ Images should be included if available
- ✅ Error handling should work correctly when API key is missing or invalid

### Unit Tests

Run the unit tests:

```bash
npm test -- lib/tools/search/providers/__tests__/serper.test.ts
```

Note: Unit tests verify code structure and error handling. Integration tests require a valid API key.

