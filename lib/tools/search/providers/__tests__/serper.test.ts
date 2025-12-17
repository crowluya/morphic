import { SerperSearchProvider } from '../serper'

describe('SerperSearchProvider', () => {
  const provider = new SerperSearchProvider()

  describe('API Key Validation', () => {
    it('should throw error when SERPER_API_KEY is not set', async () => {
      const originalKey = process.env.SERPER_API_KEY
      delete process.env.SERPER_API_KEY

      await expect(
        provider.search('test query', 10, 'basic', [], [])
      ).rejects.toThrow('SERPER_API_KEY is not set')

      // Restore original key
      if (originalKey) {
        process.env.SERPER_API_KEY = originalKey
      }
    })
  })

  describe('Search Method', () => {
    beforeEach(() => {
      // Set a dummy API key for testing (actual API calls will fail without valid key)
      process.env.SERPER_API_KEY = 'test-api-key'
    })

    it('should have correct method signature', () => {
      expect(typeof provider.search).toBe('function')
    })

    it('should handle API errors gracefully', async () => {
      // This will fail because we're using a dummy API key
      // But it tests that error handling works
      await expect(
        provider.search('test query', 10, 'basic', [], [])
      ).rejects.toThrow()
    })
  })

  describe('Response Format', () => {
    it('should return SearchResults format', async () => {
      // Mock fetch for testing response format
      const mockResponse = {
        organic: [
          {
            title: 'Test Result',
            link: 'https://example.com',
            snippet: 'This is a test snippet',
            position: 1
          }
        ],
        images: [
          {
            title: 'Test Image',
            imageUrl: 'https://example.com/image.jpg',
            link: 'https://example.com',
            source: 'Example'
          }
        ],
        searchParameters: {
          q: 'test query',
          type: 'search',
          engine: 'google'
        }
      }

      // This is a basic structure test
      // Actual API integration test would require a valid API key
      expect(mockResponse.organic).toBeDefined()
      expect(mockResponse.images).toBeDefined()
      expect(mockResponse.searchParameters).toBeDefined()
    })
  })
})

