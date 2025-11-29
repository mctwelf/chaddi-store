// Quick test to check if products API is working
const fetch = require('node-fetch');

async function testProducts() {
  try {
    console.log('Testing products API...');
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Number of products:', Array.isArray(data) ? data.length : 'Not an array');
    console.log('First product:', data[0]);
    
    if (data.length === 0) {
      console.log('\n⚠️  WARNING: No products found in database!');
      console.log('You need to add products via the admin panel at /admin');
    } else {
      console.log('\n✅ Products are loading correctly!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testProducts();
