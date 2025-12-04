import { SearchResultImage, SearchResults } from '@/lib/types'
import { sanitizeUrl } from '@/lib/utils'

import { BaseSearchProvider } from './base'

// Serper API response types
interface SerperWebResult {
  title: string
  link: string
  snippet: string
  position: number
  sitelinks?: { title: string; link: string }[]
}

interface SerperImageResult {
  title: string
  imageUrl: string
  thumbnailUrl: string
  link: string
  source: string
  domain: string
  position: number
}

interface SerperKnowledgeGraph {
  title: string
  description?: string
  descriptionSource?: string
  descriptionLink?: string
  imageUrl?: string
  attributes?: Record<string, string>
}

interface SerperWebResponse {
  searchParameters: { q: string; type: string; engine: string }
  knowledgeGraph?: SerperKnowledgeGraph
  organic: SerperWebResult[]
  relatedSearches?: { query: string }[]
  credits: number
}

interface SerperImageResponse {
  searchParameters: { q: string; type: string; engine: string; num: number }
  images: SerperImageResult[]
  credits: number
}

interface SerperScrapeResponse {
  text: string
  metadata: {
    title: string
    description: string
    author?: string
    'og:title'?: string
    'og:description'?: string
    'og:url'?: string
    'og:image'?: string
    [key: string]: string | undefined
  }
  jsonld?: Record<string, any>
  credits: number
}

export class SerperSearchProvider extends BaseSearchProvider {
  private apiKey: string

  constructor() {
    super()
    const apiKey = process.env.SERPER_API_KEY
    this.validateApiKey(apiKey, 'SERPER')
    this.apiKey = apiKey!
  }

  async search(
    query: string,
    maxResults: number = 10,
    searchDepth: 'basic' | 'advanced' = 'basic',
    includeDomains: string[] = [],
    excludeDomains: string[] = [],
    options?: {
      type?: 'general' | 'optimized'
      content_types?: Array<'web' | 'video' | 'image' | 'news'>
    }
  ): Promise<SearchResults> {
    // Determine if we need images
    const includeImages = options?.content_types?.includes('image') ?? true

    // Perform web search
    const webResults = await this.webSearch(query, maxResults)

    // Perform image search if needed
    let images: SearchResultImage[] = []
    if (includeImages) {
      images = await this.imageSearch(query, 10)
    }

    return {
      results: webResults.results,
      images,
      query,
      number_of_results: webResults.results.length
    }
  }

  /**
   * Web search using Serper API
   */
  async webSearch(
    query: string,
    maxResults: number = 10
  ): Promise<{
    results: SearchResults['results']
    knowledgeGraph?: SerperKnowledgeGraph
  }> {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        num: maxResults
      })
    })

    if (!response.ok) {
      throw new Error(
        `Serper API error: ${response.status} ${response.statusText}`
      )
    }

    const data: SerperWebResponse = await response.json()

    // Map Serper results to our SearchResultItem format
    const results = data.organic.map(item => ({
      title: item.title,
      url: sanitizeUrl(item.link),
      content: item.snippet
    }))

    return {
      results,
      knowledgeGraph: data.knowledgeGraph
    }
  }

  /**
   * Image search using Serper API
   */
  async imageSearch(
    query: string,
    maxResults: number = 10
  ): Promise<SearchResultImage[]> {
    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        num: maxResults
      })
    })

    if (!response.ok) {
      throw new Error(
        `Serper Images API error: ${response.status} ${response.statusText}`
      )
    }

    const data: SerperImageResponse = await response.json()

    // Map to SearchResultImage format
    return data.images.map(img => ({
      url: sanitizeUrl(img.imageUrl),
      description: img.title
    }))
  }

  /**
   * Scrape/extract content from a URL using Serper API
   */
  async scrape(url: string): Promise<SerperScrapeResponse> {
    const response = await fetch('https://scrape.serper.dev', {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    })

    if (!response.ok) {
      throw new Error(
        `Serper Scrape API error: ${response.status} ${response.statusText}`
      )
    }

    return await response.json()
  }
}

// Export standalone functions for direct usage
export async function serperWebSearch(query: string, maxResults: number = 10) {
  const provider = new SerperSearchProvider()
  return provider.webSearch(query, maxResults)
}

export async function serperImageSearch(
  query: string,
  maxResults: number = 10
) {
  const provider = new SerperSearchProvider()
  return provider.imageSearch(query, maxResults)
}

export async function serperScrape(url: string) {
  const provider = new SerperSearchProvider()
  return provider.scrape(url)
}
