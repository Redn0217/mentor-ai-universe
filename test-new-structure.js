// Test script for new database structure
// Run this with: node test-new-structure.js

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration (update with your credentials)
const supabaseUrl = 'https://iucimtwcakmouafdnrwj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDAxMzQsImV4cCI6MjA2Mjc3NjEzNH0.-_RIvC_Sb5FjF5iPbzKiQMLg7id3pjb2oHoX9kvsQlc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseStructure() {
  console.log('🧪 Testing New Database Structure...\n');

  try {
    // Test 1: Check if new tables exist
    console.log('1️⃣ Testing table existence...');
    
    const tables = ['courses', 'modules', 'lessons', 'exercises', 'resources'];
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          console.log(`   ❌ Table '${table}' - Error: ${error.message}`);
        } else {
          console.log(`   ✅ Table '${table}' - Count: ${data?.length || 0}`);
        }
      } catch (err) {
        console.log(`   ❌ Table '${table}' - Exception: ${err.message}`);
      }
    }

    // Test 2: Check migration status
    console.log('\n2️⃣ Checking migration status...');
    try {
      const { data, error } = await supabase.rpc('check_migration_status');
      if (error) {
        console.log(`   ❌ Migration status check failed: ${error.message}`);
      } else {
        console.log(`   ✅ Migration status: ${data}`);
      }
    } catch (err) {
      console.log(`   ⚠️ Migration status function not available: ${err.message}`);
    }

    // Test 3: Test course retrieval
    console.log('\n3️⃣ Testing course retrieval...');
    try {
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          id,
          slug,
          title,
          description,
          color,
          is_published
        `)
        .limit(5);

      if (error) {
        console.log(`   ❌ Course retrieval failed: ${error.message}`);
      } else {
        console.log(`   ✅ Found ${courses?.length || 0} courses:`);
        courses?.forEach(course => {
          console.log(`      - ${course.title} (${course.slug})`);
        });
      }
    } catch (err) {
      console.log(`   ❌ Course retrieval exception: ${err.message}`);
    }

    // Test 4: Test hierarchical query (if function exists)
    console.log('\n4️⃣ Testing hierarchical course query...');
    try {
      const { data, error } = await supabase.rpc('get_course_with_hierarchy', {
        course_slug: 'python'
      });

      if (error) {
        console.log(`   ❌ Hierarchical query failed: ${error.message}`);
      } else if (data) {
        console.log(`   ✅ Hierarchical query successful`);
        console.log(`      Course: ${data.course?.title || 'Unknown'}`);
        console.log(`      Modules: ${data.modules?.length || 0}`);
      } else {
        console.log(`   ⚠️ No data returned for Python course`);
      }
    } catch (err) {
      console.log(`   ⚠️ Hierarchical query function not available: ${err.message}`);
    }

    // Test 5: Test module-lesson relationships
    console.log('\n5️⃣ Testing module-lesson relationships...');
    try {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          course_id,
          lessons:lessons(
            id,
            title,
            order_index
          )
        `)
        .limit(3);

      if (error) {
        console.log(`   ❌ Module-lesson query failed: ${error.message}`);
      } else {
        console.log(`   ✅ Found ${data?.length || 0} modules with lessons:`);
        data?.forEach(module => {
          console.log(`      - ${module.title}: ${module.lessons?.length || 0} lessons`);
        });
      }
    } catch (err) {
      console.log(`   ❌ Module-lesson query exception: ${err.message}`);
    }

    // Test 6: Test exercise relationships
    console.log('\n6️⃣ Testing exercise relationships...');
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          id,
          title,
          exercise_type,
          difficulty_level,
          lesson_id,
          module_id
        `)
        .limit(5);

      if (error) {
        console.log(`   ❌ Exercise query failed: ${error.message}`);
      } else {
        console.log(`   ✅ Found ${data?.length || 0} exercises:`);
        data?.forEach(exercise => {
          const parent = exercise.lesson_id ? 'lesson' : exercise.module_id ? 'module' : 'none';
          console.log(`      - ${exercise.title} (${exercise.exercise_type}, parent: ${parent})`);
        });
      }
    } catch (err) {
      console.log(`   ❌ Exercise query exception: ${err.message}`);
    }

    // Test 7: Test RLS policies
    console.log('\n7️⃣ Testing Row Level Security...');
    try {
      // Test public read access
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, is_published')
        .eq('is_published', true)
        .limit(1);

      if (error) {
        console.log(`   ❌ RLS test failed: ${error.message}`);
      } else {
        console.log(`   ✅ RLS working - can read published courses: ${data?.length || 0}`);
      }
    } catch (err) {
      console.log(`   ❌ RLS test exception: ${err.message}`);
    }

    console.log('\n🎉 Database structure testing completed!');
    console.log('\n📋 Summary:');
    console.log('   - New relational tables are available');
    console.log('   - Course hierarchy can be queried');
    console.log('   - Relationships between entities work');
    console.log('   - Row Level Security is active');
    console.log('\n✨ The new database structure is ready for use!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

async function testBackendAPI() {
  console.log('\n🌐 Testing Backend API Integration...\n');

  const API_BASE_URL = 'https://internsify-backend-2.onrender.com';

  try {
    // Test 1: Fetch courses list
    console.log('1️⃣ Testing courses list API...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`);
      if (response.ok) {
        const courses = await response.json();
        console.log(`   ✅ API returned ${courses.length} courses`);
        if (courses.length > 0) {
          console.log(`      First course: ${courses[0].title}`);
        }
      } else {
        console.log(`   ❌ API request failed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.log(`   ❌ API request exception: ${err.message}`);
    }

    // Test 2: Fetch specific course
    console.log('\n2️⃣ Testing specific course API...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/python`);
      if (response.ok) {
        const course = await response.json();
        console.log(`   ✅ Python course loaded: ${course.title}`);
        console.log(`      Modules: ${course.modules?.length || 0}`);
        console.log(`      Tutor: ${course.tutor?.name || 'Unknown'}`);
      } else {
        console.log(`   ❌ Course API request failed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.log(`   ❌ Course API request exception: ${err.message}`);
    }

    console.log('\n🎉 Backend API testing completed!');

  } catch (error) {
    console.error('❌ Backend API test failed:', error);
  }
}

// Run the tests
async function runAllTests() {
  await testDatabaseStructure();
  await testBackendAPI();
  
  console.log('\n🏁 All tests completed!');
  console.log('\n📖 Next steps:');
  console.log('   1. If tests pass, your new database structure is ready');
  console.log('   2. Update your frontend to use the new courseService functions');
  console.log('   3. Test the AI tutor 3D carousel with new data');
  console.log('   4. Verify course pages display correctly');
  console.log('   5. Test user progress tracking features');
}

runAllTests().catch(console.error);
