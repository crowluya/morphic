import { SearchResultImage, SearchResults } from '@/lib/types'
import { sanitizeUrl } from '@/lib/utils'

import { BaseSearchProvider } from './base'

interface SerperOrganicResult {
  title: string
  link: string
  snippet: string
  position: number
  date?: string
  sitelinks?: Array<{ title: string; link: string }>
}

interface SerperImageResult {
  title: string
  imageUrl: string
  link: string
  source?: string
  thumbnailUrl?: string
}

interface SerperApiResponse {
  organic?: SerperOrganicResult[]
  images?: SerperImageResult[]
  knowledgeGraph?: {
    title: string
    type: string
    description: string
    website?: string
    imageUrl?: string
  }
  peopleAlsoAsk?: Array<{
    question: string
    snippet: string
    title: string
    link: string
  }>
  relatedSearches?: Array<{ query: string }>
  searchParameters: {
    q: string
    type: string
    engine: string
  }
}

export class SerperSearchProvider extends BaseSearchProvider {
  async search(
    query: string,
    maxResults: number = 10,
    _searchDepth: 'basic' | 'advanced' = 'basic',
    _includeDomains: string[] = [],
    _excludeDomains: string[] = []
  ): Promise<SearchResults> {
    const apiKey = process.env.SERPER_API_KEY
    this.validateApiKey(apiKey, 'SERPER')

    try {
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: query,
          num: Math.min(maxResults, 100) // Serper API supports up to 100 results
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Serper API error (${response.status}):`, errorText)
        throw new Error(
          `Serper API error: ${response.status} ${response.statusText} - ${errorText}`
        )
      }

      const data: SerperApiResponse = await response.json()

      // Convert organic results to SearchResultItem format
      const results = (data.organic || []).map(
        (item: SerperOrganicResult) => ({
          title: item.title,
          url: sanitizeUrl(item.link),
          content: item.snippet
        })
      )

      // Convert images to SearchResultImage format
      const images: SearchResultImage[] = (data.images || []).map(
        (img: SerperImageResult) => ({
          url: sanitizeUrl(img.imageUrl),
          description: img.title || ''
        })
      )

      return {
        results,
        query: data.searchParameters?.q || query,
        images,
        number_of_results: results.length
      }
    } catch (error) {
      console.error('Serper API error:', error)
      throw error
    }
  }
}
