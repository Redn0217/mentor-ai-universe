// Database Inspection Script
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iucimtwcakmouafdnrwj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDAxMzQsImV4cCI6MjA2Mjc3NjEzNH0.-_RIvC_Sb5FjF5iPbzKiQMLg7id3pjb2oHoX9kvsQlc'
);

async function inspectDatabase() {
  console.log('🔍 Inspecting Supabase Database...\n');

  try {
    // Check courses table
    console.log('📚 COURSES TABLE:');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*');
    
    if (coursesError) {
      console.log('❌ Error:', coursesError.message);
    } else {
      console.log(`✅ Found ${courses.length} courses:`);
      courses.forEach(course => {
        console.log(`  - ${course.title} (${course.slug})`);
        console.log(`    ID: ${course.id}`);
        console.log(`    Description: ${course.description?.substring(0, 100)}...`);
        console.log(`    Tutor: ${course.tutor_name || 'Unknown'}`);
        console.log('');
      });
    }

    // Check modules table
    console.log('\n📖 MODULES TABLE:');
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*');
    
    if (modulesError) {
      console.log('❌ Error:', modulesError.message);
    } else {
      console.log(`✅ Found ${modules.length} modules:`);
      modules.forEach(module => {
        console.log(`  - ${module.title} (Course ID: ${module.course_id})`);
        console.log(`    Order: ${module.order_index}, Duration: ${module.estimated_duration_minutes}min`);
      });
    }

    // Check lessons table
    console.log('\n📝 LESSONS TABLE:');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*');
    
    if (lessonsError) {
      console.log('❌ Error:', lessonsError.message);
    } else {
      console.log(`✅ Found ${lessons.length} lessons:`);
      lessons.forEach(lesson => {
        console.log(`  - ${lesson.title} (Module ID: ${lesson.module_id})`);
        console.log(`    Duration: ${lesson.estimated_duration_minutes}min`);
        console.log(`    Content length: ${lesson.content?.length || 0} characters`);
      });
    }

    // Check exercises table
    console.log('\n💻 EXERCISES TABLE:');
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('*');
    
    if (exercisesError) {
      console.log('❌ Error:', exercisesError.message);
    } else {
      console.log(`✅ Found ${exercises.length} exercises:`);
      exercises.forEach(exercise => {
        console.log(`  - ${exercise.title}`);
        console.log(`    Type: ${exercise.exercise_type}, Difficulty: ${exercise.difficulty_level}`);
      });
    }

    // Check resources table
    console.log('\n📋 RESOURCES TABLE:');
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*');
    
    if (resourcesError) {
      console.log('❌ Error:', resourcesError.message);
    } else {
      console.log(`✅ Found ${resources.length} resources`);
    }

    // Test hierarchical query
    console.log('\n🔗 HIERARCHICAL QUERY TEST:');
    const { data: hierarchical, error: hierError } = await supabase
      .from('courses')
      .select(`
        *,
        modules:modules(
          *,
          lessons:lessons(*),
          exercises:exercises(*)
        )
      `)
      .eq('slug', 'python')
      .single();

    if (hierError) {
      console.log('❌ Error:', hierError.message);
    } else {
      console.log('✅ Hierarchical query successful:');
      console.log(`  Course: ${hierarchical.title}`);
      console.log(`  Modules: ${hierarchical.modules?.length || 0}`);
      hierarchical.modules?.forEach(module => {
        console.log(`    - ${module.title}: ${module.lessons?.length || 0} lessons, ${module.exercises?.length || 0} exercises`);
      });
    }

  } catch (error) {
    console.error('❌ Database inspection failed:', error);
  }
}

inspectDatabase();
