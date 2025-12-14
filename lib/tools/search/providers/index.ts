import { SearchProvider } from './base'
import { BraveSearchProvider } from './brave'
import { ExaSearchProvider } from './exa'
import { FirecrawlSearchProvider } from './firecrawl'
import { SearXNGSearchProvider } from './searxng'
import { SerperSearchProvider } from './serper'
import { TavilySearchProvider } from './tavily'

export type SearchProviderType =
  | 'tavily'
  | 'exa'
  | 'searxng'
  | 'firecrawl'
  | 'brave'
  | 'serper'

// Default to Serper as primary search provider
export const DEFAULT_PROVIDER: SearchProviderType = 'serper'

export function createSearchProvider(
  type?: SearchProviderType
): SearchProvider {
  const providerType =
    type || (process.env.SEARCH_API as SearchProviderType) || DEFAULT_PROVIDER

  switch (providerType) {
    case 'serper':
      return new SerperSearchProvider()
    case 'tavily':
      return new TavilySearchProvider()
    case 'exa':
      return new ExaSearchProvider()
    case 'searxng':
      return new SearXNGSearchProvider()
    case 'brave':
      return new BraveSearchProvider()
    case 'firecrawl':
      return new FirecrawlSearchProvider()
    default:
      // Default to SerperSearchProvider
      return new SerperSearchProvider()
  }
}

export { BraveSearchProvider } from './brave'
export type { ExaSearchProvider } from './exa'
export type { FirecrawlSearchProvider } from './firecrawl'
export { SearXNGSearchProvider } from './searxng'
export { SerperSearchProvider } from './serper'
export { TavilySearchProvider } from './tavily'
export type { SearchProvider }
