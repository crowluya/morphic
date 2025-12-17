#!/usr/bin/env node
/**
 * Verification script for Serper search provider
 * Tests code structure and logic without requiring API key
 */

import { readFileSync } from 'fs'
import { join } from 'path'

console.log('🔍 Verifying Serper Search Provider Implementation')
console.log('=' .repeat(60))
console.log('')

// Test 1: Check if serper.ts exists and has correct structure
console.log('1. Checking file structure...')
try {
  const serperPath = join(process.cwd(), 'lib/tools/search/providers/serper.ts')
  const serperContent = readFileSync(serperPath, 'utf-8')
  
  const checks = [
    { name: 'Exports SerperSearchProvider class', pattern: /export class SerperSearchProvider/ },
    { name: 'Extends BaseSearchProvider', pattern: /extends BaseSearchProvider/ },
    { name: 'Implements search method', pattern: /async search\(/ },
    { name: 'Uses SERPER_API_KEY', pattern: /SERPER_API_KEY/ },
    { name: 'Calls Serper API endpoint', pattern: /google\.serper\.dev\/search/ },
    { name: 'Converts organic results', pattern: /data\.organic/ },
    { name: 'Converts images', pattern: /data\.images/ },
    { name: 'Returns SearchResults format', pattern: /return \{[\s\S]*results[\s\S]*query[\s\S]*images/ },
    { name: 'Error handling', pattern: /catch \(error\)/ },
    { name: 'Validates API key', pattern: /validateApiKey/ }
  ]
  
  let passed = 0
  let failed = 0
  
  checks.forEach(check => {
    if (check.pattern.test(serperContent)) {
      console.log(`   ✅ ${check.name}`)
      passed++
    } else {
      console.log(`   ❌ ${check.name}`)
      failed++
    }
  })
  
  console.log(`\n   Result: ${passed} passed, ${failed} failed`)
  
  if (failed > 0) {
    console.log('\n   ⚠️  Some checks failed. Please review the implementation.')
    process.exit(1)
  }
} catch (error) {
  console.error('   ❌ Error reading serper.ts:', error)
  process.exit(1)
}

// Test 2: Check if provider is registered
console.log('\n2. Checking provider registration...')
try {
  const indexPath = join(process.cwd(), 'lib/tools/search/providers/index.ts')
  const indexContent = readFileSync(indexPath, 'utf-8')
  
  const registrationChecks = [
    { name: 'Imports SerperSearchProvider', pattern: /import.*SerperSearchProvider.*from.*serper/ },
    { name: "Includes 'serper' in SearchProviderType", pattern: /['"]serper['"]/ },
    { name: 'Has serper case in switch', pattern: /case ['"]serper['"]:/ },
    { name: 'Exports SerperSearchProvider', pattern: /export.*SerperSearchProvider.*from.*serper/ }
  ]
  
  let passed = 0
  let failed = 0
  
  registrationChecks.forEach(check => {
    if (check.pattern.test(indexContent)) {
      console.log(`   ✅ ${check.name}`)
      passed++
    } else {
      console.log(`   ❌ ${check.name}`)
      failed++
    }
  })
  
  console.log(`\n   Result: ${passed} passed, ${failed} failed`)
  
  if (failed > 0) {
    console.log('\n   ⚠️  Registration checks failed. Please review the implementation.')
    process.exit(1)
  }
} catch (error) {
  console.error('   ❌ Error reading index.ts:', error)
  process.exit(1)
}

// Test 3: Check documentation
console.log('\n3. Checking documentation...')
try {
  const docsPath = join(process.cwd(), 'docs/CONFIGURATION.md')
  const docsContent = readFileSync(docsPath, 'utf-8')
  
  const docChecks = [
    { name: 'Contains Serper configuration section', pattern: /### Serper Search/ },
    { name: 'Mentions SERPER_API_KEY', pattern: /SERPER_API_KEY/ },
    { name: 'Mentions SEARCH_API=serper', pattern: /SEARCH_API=serper/ },
    { name: 'Links to Serper.dev', pattern: /serper\.dev/ }
  ]
  
  let passed = 0
  let failed = 0
  
  docChecks.forEach(check => {
    if (check.pattern.test(docsContent)) {
      console.log(`   ✅ ${check.name}`)
      passed++
    } else {
      console.log(`   ❌ ${check.name}`)
      failed++
    }
  })
  
  console.log(`\n   Result: ${passed} passed, ${failed} failed`)
  
  if (failed > 0) {
    console.log('\n   ⚠️  Documentation checks failed.')
  }
} catch (error) {
  console.error('   ❌ Error reading CONFIGURATION.md:', error)
}

// Test 4: Check TypeScript types
console.log('\n4. Checking TypeScript types...')
try {
  const serperPath = join(process.cwd(), 'lib/tools/search/providers/serper.ts')
  const serperContent = readFileSync(serperPath, 'utf-8')
  
  const typeChecks = [
    { name: 'Defines SerperOrganicResult interface', pattern: /interface SerperOrganicResult/ },
    { name: 'Defines SerperImageResult interface', pattern: /interface SerperImageResult/ },
    { name: 'Defines SerperApiResponse interface', pattern: /interface SerperApiResponse/ },
    { name: 'Uses SearchResults return type', pattern: /Promise<SearchResults>/ },
    { name: 'Imports SearchResultImage type', pattern: /SearchResultImage/ }
  ]
  
  let passed = 0
  let failed = 0
  
  typeChecks.forEach(check => {
    if (check.pattern.test(serperContent)) {
      console.log(`   ✅ ${check.name}`)
      passed++
    } else {
      console.log(`   ❌ ${check.name}`)
      failed++
    }
  })
  
  console.log(`\n   Result: ${passed} passed, ${failed} failed`)
  
  if (failed > 0) {
    console.log('\n   ⚠️  Type checks failed.')
  }
} catch (error) {
  console.error('   ❌ Error checking types:', error)
}

console.log('\n' + '=' .repeat(60))
console.log('✅ Verification completed!')
console.log('')
console.log('Note: To test with actual API calls, you need:')
console.log('  1. A valid SERPER_API_KEY from https://serper.dev/')
console.log('  2. Run: bun scripts/test-serper.ts "your search query"')
console.log('')

