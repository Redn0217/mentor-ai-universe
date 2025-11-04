// Verify Python Course Content
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iucimtwcakmouafdnrwj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDAxMzQsImV4cCI6MjA2Mjc3NjEzNH0.-_RIvC_Sb5FjF5iPbzKiQMLg7id3pjb2oHoX9kvsQlc'
);

async function verifyPythonCourse() {
  console.log('🐍 Verifying Python Course Content...\n');

  try {
    // Get Python course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', 'python')
      .single();

    if (courseError) {
      console.log('❌ Error fetching course:', courseError.message);
      return;
    }

    console.log('📚 PYTHON COURSE:');
    console.log(`  Title: ${course.title}`);
    console.log(`  Description: ${course.description?.substring(0, 100)}...`);
    console.log(`  Tutor: ${course.tutor_name}`);
    console.log(`  Duration: ${course.estimated_duration_hours} hours`);
    console.log(`  Difficulty: ${course.difficulty_level}`);
    console.log('');

    // Get modules for Python course
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', course.id)
      .order('order_index');

    if (modulesError) {
      console.log('❌ Error fetching modules:', modulesError.message);
      return;
    }

    console.log(`📖 MODULES (${modules.length}):`);
    for (const module of modules) {
      console.log(`  ${module.order_index}. ${module.title}`);
      console.log(`     Description: ${module.description}`);
      console.log(`     Duration: ${module.estimated_duration_minutes} minutes`);
      console.log(`     Difficulty: ${module.difficulty_level}`);
      
      // Get lessons for this module
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', module.id)
        .order('order_index');

      if (lessonsError) {
        console.log(`     ❌ Error fetching lessons: ${lessonsError.message}`);
        continue;
      }

      console.log(`     📝 LESSONS (${lessons.length}):`);
      for (const lesson of lessons) {
        console.log(`        ${lesson.order_index}. ${lesson.title}`);
        console.log(`           Duration: ${lesson.estimated_duration_minutes} min`);
        console.log(`           Content: ${lesson.content?.length || 0} characters`);
        console.log(`           Type: ${lesson.content_type}`);
      }
      console.log('');
    }

    // Test the hierarchical query that the backend uses
    console.log('🔗 TESTING BACKEND HIERARCHICAL QUERY:');
    const { data: hierarchical, error: hierError } = await supabase
      .from('courses')
      .select(`
        *,
        modules:modules(
          *,
          lessons:lessons(
            *,
            exercises:exercises(*)
          ),
          exercises:exercises(*)
        )
      `)
      .eq('slug', 'python')
      .single();

    if (hierError) {
      console.log('❌ Hierarchical query error:', hierError.message);
    } else {
      console.log('✅ Hierarchical query successful:');
      console.log(`  Course: ${hierarchical.title}`);
      console.log(`  Modules: ${hierarchical.modules?.length || 0}`);
      if (hierarchical.modules) {
        hierarchical.modules.forEach((module, index) => {
          console.log(`    ${index + 1}. ${module.title}: ${module.lessons?.length || 0} lessons`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyPythonCourse();
