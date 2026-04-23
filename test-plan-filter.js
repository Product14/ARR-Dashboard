// Test script to check what happens when plan filter is applied
const API_URL = 'http://localhost:3000/api/rooftops'

async function testPlanFilter() {
  console.log('Testing plan filter...')
  
  // Test with no filter
  console.log('\n1. Testing with no plan filter (All):')
  try {
    const response1 = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: 0,
        limit: 10,
        plan: 'All'
      })
    })
    const data1 = await response1.json()
    console.log('Response status:', response1.status)
    console.log('Data count:', data1.data?.data?.data?.length || 0)
    console.log('Total rooftops:', data1.data?.data?.totalRooftops || 0)
  } catch (error) {
    console.error('Error with no filter:', error.message)
  }

  // Test with Essential plan filter
  console.log('\n2. Testing with Essential plan filter:')
  try {
    const response2 = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: 0,
        limit: 10,
        plan: 'Essential'
      })
    })
    const data2 = await response2.json()
    console.log('Response status:', response2.status)
    console.log('Data count:', data2.data?.data?.data?.length || 0)
    console.log('Total rooftops:', data2.data?.data?.totalRooftops || 0)
  } catch (error) {
    console.error('Error with Essential filter:', error.message)
  }

  // Test with Growth plan filter
  console.log('\n3. Testing with Growth plan filter:')
  try {
    const response3 = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: 0,
        limit: 10,
        plan: 'Growth'
      })
    })
    const data3 = await response3.json()
    console.log('Response status:', response3.status)
    console.log('Data count:', data3.data?.data?.data?.length || 0)
    console.log('Total rooftops:', data3.data?.data?.totalRooftops || 0)
  } catch (error) {
    console.error('Error with Growth filter:', error.message)
  }
}

testPlanFilter().catch(console.error)
