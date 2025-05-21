// Simple script to test the API endpoints

async function testApi() {
  console.log('Testing API endpoints...');

  try {
    // Test courses endpoint
    console.log('\nTesting /api/courses endpoint:');
    const coursesResponse = await fetch('http://localhost:8081/api/courses');
    const coursesData = await coursesResponse.json();
    console.log('Status:', coursesResponse.status);
    console.log('Data:', JSON.stringify(coursesData, null, 2).substring(0, 200) + '...');

    // Test specific course endpoint
    console.log('\nTesting /api/courses/python endpoint:');
    const courseResponse = await fetch('http://localhost:8081/api/courses/python');
    const courseData = await courseResponse.json();
    console.log('Status:', courseResponse.status);
    console.log('Data:', JSON.stringify(courseData, null, 2).substring(0, 200) + '...');

    console.log('\nAPI tests completed successfully!');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi();
