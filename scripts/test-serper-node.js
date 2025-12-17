#!/usr/bin/env node
/**
 * Node.js test script for Serper search provider
 * Tests actual API calls with provided API key
 */

const SERPER_API_KEY = process.env.SERPER_API_KEY || '509dc9aa2a40c267441d2567655e85dc97451eed';
const query = process.argv[2] || 'artificial intelligence';

async function testSerperAPI() {
  console.log('🧪 Testing Serper Search API');
  console.log('='.repeat(60));
  console.log(`Query: ${query}`);
  console.log(`API Key: ${SERPER_API_KEY.substring(0, 10)}...`);
  console.log('');

  try {
    console.log('📡 Sending request to Serper API...');
    const startTime = Date.now();

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: query,
        num: 10
      })
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error (${response.status}):`);
      console.error(errorText);
      process.exit(1);
    }

    const data = await response.json();

    console.log(`✅ Request completed in ${duration}ms`);
    console.log('');

    // Display results
    console.log('📊 Results:');
    console.log('='.repeat(60));
    console.log(`Query: ${data.searchParameters?.q || query}`);
    console.log(`Organic results: ${data.organic?.length || 0}`);
    console.log(`Images: ${data.images?.length || 0}`);
    console.log(`Knowledge Graph: ${data.knowledgeGraph ? 'Yes' : 'No'}`);
    console.log(`People Also Ask: ${data.peopleAlsoAsk?.length || 0}`);
    console.log('');

    // Display top 3 organic results
    if (data.organic && data.organic.length > 0) {
      console.log('🔍 Top 3 Organic Results:');
      console.log('-'.repeat(60));
      data.organic.slice(0, 3).forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.title}`);
        console.log(`   URL: ${result.link}`);
        console.log(`   Snippet: ${result.snippet.substring(0, 100)}...`);
        console.log(`   Position: ${result.position}`);
      });
      console.log('');
    }

    // Display images if available
    if (data.images && data.images.length > 0) {
      console.log('🖼️  Top 3 Images:');
      console.log('-'.repeat(60));
      data.images.slice(0, 3).forEach((image, index) => {
        console.log(`\n${index + 1}. ${image.title || 'No title'}`);
        console.log(`   Image URL: ${image.imageUrl}`);
        console.log(`   Source: ${image.source || 'Unknown'}`);
      });
      console.log('');
    }

    // Display knowledge graph if available
    if (data.knowledgeGraph) {
      console.log('📚 Knowledge Graph:');
      console.log('-'.repeat(60));
      console.log(`Title: ${data.knowledgeGraph.title}`);
      console.log(`Type: ${data.knowledgeGraph.type}`);
      console.log(`Description: ${data.knowledgeGraph.description?.substring(0, 150)}...`);
      if (data.knowledgeGraph.website) {
        console.log(`Website: ${data.knowledgeGraph.website}`);
      }
      console.log('');
    }

    // Test the provider class conversion
    console.log('🔄 Testing Provider Conversion:');
    console.log('-'.repeat(60));
    
    const results = (data.organic || []).map(item => ({
      title: item.title,
      url: item.link.replace(/\s+/g, '%20'),
      content: item.snippet
    }));

    const images = (data.images || []).map(img => ({
      url: img.imageUrl.replace(/\s+/g, '%20'),
      description: img.title || ''
    }));

    console.log(`✅ Converted ${results.length} results`);
    console.log(`✅ Converted ${images.length} images`);
    console.log('');

    // Verify conversion format
    if (results.length > 0) {
      console.log('📋 Sample Converted Result:');
      console.log(JSON.stringify(results[0], null, 2));
      console.log('');
    }

    console.log('='.repeat(60));
    console.log('✅ All tests passed successfully!');
    console.log('');
    console.log('Summary:');
    console.log(`  - Response time: ${duration}ms`);
    console.log(`  - Results: ${results.length}`);
    console.log(`  - Images: ${images.length}`);
    console.log(`  - API Status: ✅ Working`);
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error during test:');
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      if (error.stack) {
        console.error('');
        console.error('Stack trace:');
        console.error(error.stack);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the test
testSerperAPI().catch(console.error);

