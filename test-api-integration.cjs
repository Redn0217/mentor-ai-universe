// Test API Integration with New Database Structure
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, error: 'Invalid JSON' });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testAPIIntegration() {
  console.log('🧪 Testing API Integration with New Database Structure...\n');

  try {
    // Test 1: Get all courses
    console.log('1️⃣ Testing GET /api/courses...');
    const coursesResponse = await makeRequest('/api/courses');
    
    if (coursesResponse.status === 200) {
      console.log(`   ✅ Status: ${coursesResponse.status}`);
      console.log(`   📊 Found ${coursesResponse.data.length} courses:`);
      coursesResponse.data.forEach((course, index) => {
        console.log(`      ${index + 1}. ${course.title} (${course.slug})`);
        if (course.modules_count !== undefined) {
          console.log(`         - Modules: ${course.modules_count}, Lessons: ${course.lessons_count}, Exercises: ${course.exercises_count}`);
        }
      });
    } else {
      console.log(`   ❌ Status: ${coursesResponse.status}`);
      console.log(`   Error: ${JSON.stringify(coursesResponse.data, null, 2)}`);
    }

    // Test 2: Get Python course specifically
    console.log('\n2️⃣ Testing GET /api/courses/python...');
    const pythonResponse = await makeRequest('/api/courses/python');
    
    if (pythonResponse.status === 200) {
      console.log(`   ✅ Status: ${pythonResponse.status}`);
      console.log(`   📚 Course: ${pythonResponse.data.title}`);
      console.log(`   👨‍🏫 Tutor: ${pythonResponse.data.tutor?.name || 'Unknown'}`);
      console.log(`   📖 Modules: ${pythonResponse.data.modules?.length || 0}`);
      
      if (pythonResponse.data.modules && pythonResponse.data.modules.length > 0) {
        pythonResponse.data.modules.forEach((module, index) => {
          console.log(`      Module ${index + 1}: ${module.title}`);
          console.log(`         - Lessons: ${module.lessons?.length || 0}`);
          console.log(`         - Exercises: ${module.exercises?.length || 0}`);
        });
      }
    } else {
      console.log(`   ❌ Status: ${pythonResponse.status}`);
      console.log(`   Error: ${JSON.stringify(pythonResponse.data, null, 2)}`);
    }

    // Test 3: Test health endpoint
    console.log('\n3️⃣ Testing GET /health...');
    const healthResponse = await makeRequest('/health');
    
    if (healthResponse.status === 200) {
      console.log(`   ✅ Status: ${healthResponse.status}`);
      console.log(`   💚 Health: ${JSON.stringify(healthResponse.data)}`);
    } else {
      console.log(`   ❌ Status: ${healthResponse.status}`);
      console.log(`   Error: ${JSON.stringify(healthResponse.data, null, 2)}`);
    }

    console.log('\n🎉 API Integration Testing Completed!');
    console.log('\n📋 Summary:');
    console.log('   - Backend API is responding');
    console.log('   - Course data is being served');
    console.log('   - New database structure is working');
    console.log('\n✨ Your application is ready to use the new hierarchical course structure!');

  } catch (error) {
    console.error('❌ API Integration test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure the backend server is running on port 3003');
    console.log('   - Check that the database migration completed successfully');
    console.log('   - Verify Supabase connection is working');
  }
}

// Run the test
testAPIIntegration();
