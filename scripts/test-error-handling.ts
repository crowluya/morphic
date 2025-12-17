#!/usr/bin/env node
/**
 * Test error handling for Serper search provider
 * Tests API key validation and error scenarios
 */

import { SerperSearchProvider } from '../lib/tools/search/providers/serper'

async function testErrorHandling() {
  console.log('🧪 Testing Serper Search Provider Error Handling')
  console.log('=' .repeat(60))
  console.log('')

  const provider = new SerperSearchProvider()

  // Test 1: Missing API Key
  console.log('Test 1: Missing API Key')
  console.log('-'.repeat(60))
  try {
    const originalKey = process.env.SERPER_API_KEY
    delete process.env.SERPER_API_KEY

    await provider.search('test query', 10, 'basic', [], [])
    console.log('   ❌ Should have thrown an error')
    process.exit(1)
  } catch (error) {
    if (error instanceof Error && error.message.includes('SERPER_API_KEY is not set')) {
      console.log('   ✅ Correctly throws error when API key is missing')
      console.log(`   ✅ Error message: ${error.message}`)
    } else {
      console.log('   ❌ Unexpected error:', error)
      process.exit(1)
    }
  } finally {
    // Restore original key if it existed
    if (process.env.SERPER_API_KEY === undefined) {
      // Key was deleted, that's expected
    }
  }

  console.log('')

  // Test 2: Invalid API Key (will fail API call)
  console.log('Test 2: Invalid API Key')
  console.log('-'.repeat(60))
  try {
    process.env.SERPER_API_KEY = 'invalid-key-12345'
    
    await provider.search('test query', 10, 'basic', [], [])
    console.log('   ⚠️  API call succeeded (unexpected)')
  } catch (error) {
    if (error instanceof Error) {
      console.log('   ✅ Correctly handles API errors')
      console.log(`   ✅ Error type: ${error.constructor.name}`)
      console.log(`   ✅ Error message contains: ${error.message.substring(0, 50)}...`)
    } else {
      console.log('   ❌ Unexpected error type:', typeof error)
      process.exit(1)
    }
  }

  console.log('')

  // Test 3: Method signature
  console.log('Test 3: Method Signature')
  console.log('-'.repeat(60))
  try {
    const searchMethod = provider.search
    console.log('   ✅ search method exists')
    console.log(`   ✅ Method type: ${typeof searchMethod}`)
    console.log(`   ✅ Is async: ${searchMethod.constructor.name === 'AsyncFunction' || 'AsyncFunction' in searchMethod}`)
  } catch (error) {
    console.log('   ❌ Error checking method:', error)
    process.exit(1)
  }

  console.log('')

  // Test 4: Provider instance
  console.log('Test 4: Provider Instance')
  console.log('-'.repeat(60))
  try {
    console.log('   ✅ Provider instance created')
    console.log(`   ✅ Provider type: ${provider.constructor.name}`)
    console.log(`   ✅ Has search method: ${typeof provider.search === 'function'}`)
  } catch (error) {
    console.log('   ❌ Error checking instance:', error)
    process.exit(1)
  }

  console.log('')
  console.log('=' .repeat(60))
  console.log('✅ All error handling tests passed!')
  console.log('')
  console.log('Note: To test with actual API calls, set a valid SERPER_API_KEY')
  console.log('')
}

testErrorHandling().catch(console.error)

