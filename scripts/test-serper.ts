#!/usr/bin/env bun
/**
 * Simple test script to verify Serper search provider implementation
 * 
 * Usage:
 *   bun scripts/test-serper.ts "your search query"
 * 
 * Requires:
 *   - SERPER_API_KEY environment variable
 *   - SEARCH_API=serper (optional, will use serper if set)
 */

import { SerperSearchProvider } from '../lib/tools/search/providers/serper'

async function testSerperProvider() {
  const query = process.argv[2] || 'artificial intelligence'
  
  console.log('Testing Serper Search Provider')
  console.log('=' .repeat(50))
  console.log(`Query: ${query}`)
  console.log('')

  // Check for API key
  if (!process.env.SERPER_API_KEY) {
    console.error('❌ Error: SERPER_API_KEY environment variable is not set')
    console.log('')
    console.log('Please set it with:')
    console.log('  export SERPER_API_KEY=your_api_key_here')
    process.exit(1)
  }

  console.log('✓ SERPER_API_KEY is set')
  console.log('')

  try {
    const provider = new SerperSearchProvider()
    console.log('✓ SerperSearchProvider instance created')
    console.log('')

    console.log('Sending search request...')
    const startTime = Date.now()
    
    const results = await provider.search(query, 10, 'basic', [], [])
    
    const duration = Date.now() - startTime
    
    console.log(`✓ Search completed in ${duration}ms`)
    console.log('')
    console.log('Results:')
    console.log('=' .repeat(50))
    console.log(`Query: ${results.query}`)
    console.log(`Number of results: ${results.number_of_results}`)
    console.log(`Images found: ${results.images.length}`)
    console.log('')
    
    if (results.results.length > 0) {
      console.log('Top 3 results:')
      results.results.slice(0, 3).forEach((result, index) => {
        console.log('')
        console.log(`${index + 1}. ${result.title}`)
        console.log(`   URL: ${result.url}`)
        console.log(`   Content: ${result.content.substring(0, 100)}...`)
      })
    } else {
      console.log('⚠️  No results returned')
    }
    
    if (results.images.length > 0) {
      console.log('')
      console.log('Images:')
      results.images.slice(0, 3).forEach((image, index) => {
        const imgDesc = typeof image === 'string' ? image : image.description || 'No description'
        const imgUrl = typeof image === 'string' ? image : image.url
        console.log(`  ${index + 1}. ${imgDesc}`)
        console.log(`     ${imgUrl}`)
      })
    }
    
    console.log('')
    console.log('✅ Test completed successfully!')
    
  } catch (error) {
    console.error('')
    console.error('❌ Error during search:')
    if (error instanceof Error) {
      console.error(`   ${error.message}`)
      if (error.stack) {
        console.error('')
        console.error('Stack trace:')
        console.error(error.stack)
      }
    } else {
      console.error(error)
    }
    process.exit(1)
  }
}

// Run the test
testSerperProvider().catch(console.error)

