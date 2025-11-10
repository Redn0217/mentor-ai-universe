const express = require('express');
const { generateCourseWithAI } = require('../services/aiCourseGenerator.js');
const { supabase } = require('../lib/supabase.js');

const router = express.Router();

/**
 * POST /api/ai-courses/generate
 * Generate a complete course using AI
 */
router.post('/generate', async (req, res) => {
  try {
    const { courseName, description, prompt, difficultyLevel, estimatedHours, color } = req.body;

    // Validate required fields
    if (!courseName || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['courseName', 'prompt']
      });
    }

    console.log('🚀 Starting AI course generation request...');
    console.log('📚 Course:', courseName);
    console.log('📝 Prompt length:', prompt.length);

    // Generate course with AI
    const courseStructure = await generateCourseWithAI({
      courseName,
      description: description || '',
      prompt,
      difficultyLevel: difficultyLevel || 'beginner',
      estimatedHours: estimatedHours || 10
    });

    // Override color if provided
    if (color) {
      courseStructure.color = color;
    }

    console.log('✅ AI generation complete, saving to database...');

    // Save the course to Supabase
    const savedCourse = await saveCourseToDatabase(courseStructure);

    console.log('🎉 Course saved successfully!');
    console.log('📊 Course ID:', savedCourse.id);
    console.log('📊 Modules:', savedCourse.modules?.length || 0);

    res.status(201).json({
      success: true,
      message: 'Course generated successfully',
      course: savedCourse
    });

  } catch (error) {
    console.error('❌ Error in AI course generation:', error);
    res.status(500).json({
      error: 'Failed to generate course',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Save the AI-generated course structure to Supabase
 */
async function saveCourseToDatabase(courseStructure) {
  try {
    // Prepare course data for Supabase
    const courseData = {
      slug: courseStructure.slug,
      title: courseStructure.title,
      description: courseStructure.description,
      short_description: courseStructure.short_description,
      color: courseStructure.color,
      difficulty_level: courseStructure.difficulty_level,
      estimated_duration_hours: courseStructure.estimated_duration_hours,
      tags: courseStructure.tags || [],
      prerequisites: courseStructure.prerequisites || [],
      learning_objectives: courseStructure.learning_objectives || [],
      is_published: courseStructure.is_published ?? true,
      is_featured: courseStructure.is_featured ?? false,
      tutor_name: courseStructure.tutor?.name || 'AI Course Instructor',
      tutor_avatar: courseStructure.tutor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-instructor',
      tutor_bio: courseStructure.tutor?.bio || 'Expert educator specializing in technology courses.'
    };

    console.log('💾 Inserting course into database...');
    
    // Insert course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (courseError) {
      console.error('❌ Error inserting course:', courseError);
      throw new Error(`Failed to insert course: ${courseError.message}`);
    }

    console.log('✅ Course inserted, ID:', course.id);

    // Save modules, lessons, and exercises
    if (courseStructure.modules && courseStructure.modules.length > 0) {
      console.log('💾 Inserting modules...');
      
      for (const module of courseStructure.modules) {
        // Insert module
        const moduleData = {
          course_id: course.id,
          title: module.title,
          description: module.description,
          slug: module.slug,
          order_index: module.order_index,
          estimated_duration_minutes: module.estimated_duration_minutes
        };

        const { data: savedModule, error: moduleError } = await supabase
          .from('modules')
          .insert(moduleData)
          .select()
          .single();

        if (moduleError) {
          console.error('❌ Error inserting module:', moduleError);
          continue;
        }

        console.log('✅ Module inserted:', savedModule.title);

        // Insert lessons for this module
        if (module.lessons && module.lessons.length > 0) {
          console.log('💾 Inserting lessons for module:', savedModule.title);

          const lessonsData = module.lessons.map(lesson => ({
            module_id: savedModule.id,
            title: lesson.title,
            description: lesson.description || '',
            content: lesson.content,
            slug: lesson.slug,
            order_index: lesson.order_index,
            estimated_duration_minutes: lesson.duration_minutes || 15,
            video_url: lesson.video_url,
            is_published: true
          }));

          const { data: savedLessons, error: lessonsError } = await supabase
            .from('lessons')
            .insert(lessonsData)
            .select();

          if (lessonsError) {
            console.error('❌ Error inserting lessons:', lessonsError);
          } else {
            console.log('✅ Inserted', savedLessons.length, 'lessons');

            // Insert exercises for each lesson
            for (let i = 0; i < savedLessons.length; i++) {
              const lesson = module.lessons[i];
              const savedLesson = savedLessons[i];

              if (lesson.exercises && lesson.exercises.length > 0) {
                console.log('💾 Inserting exercises for lesson:', savedLesson.title);

                const lessonExercisesData = lesson.exercises.map((exercise, idx) => ({
                  lesson_id: savedLesson.id,
                  module_id: savedModule.id,
                  title: exercise.title,
                  description: exercise.description || '',
                  slug: exercise.slug || `${savedLesson.slug}-exercise-${idx + 1}`,
                  order_index: idx,
                  exercise_type: exercise.type || 'coding',
                  difficulty_level: exercise.difficulty || 'medium',
                  estimated_time_minutes: exercise.estimated_time || 30,
                  instructions: exercise.instructions || exercise.description || '',
                  is_published: true
                }));

                const { error: lessonExercisesError } = await supabase
                  .from('exercises')
                  .insert(lessonExercisesData);

                if (lessonExercisesError) {
                  console.error('❌ Error inserting lesson exercises:', lessonExercisesError);
                } else {
                  console.log('✅ Inserted', lessonExercisesData.length, 'exercises for lesson');
                }
              }
            }
          }
        }

        // Insert exercises for this module
        if (module.exercises && module.exercises.length > 0) {
          console.log('💾 Inserting exercises for module:', savedModule.title);

          const exercisesData = module.exercises.map((exercise, idx) => ({
            module_id: savedModule.id,
            lesson_id: null, // Module-level exercises
            title: exercise.title,
            description: exercise.description || '',
            slug: exercise.slug || `${savedModule.slug}-exercise-${idx + 1}`,
            order_index: idx,
            exercise_type: exercise.type || 'coding',
            difficulty_level: exercise.difficulty || 'medium',
            estimated_time_minutes: exercise.estimated_time || 30,
            instructions: exercise.instructions || exercise.description || '',
            is_published: true
          }));

          const { data: savedExercises, error: exercisesError } = await supabase
            .from('exercises')
            .insert(exercisesData)
            .select();

          if (exercisesError) {
            console.error('❌ Error inserting exercises:', exercisesError);
          } else {
            console.log('✅ Inserted', savedExercises.length, 'exercises');
          }
        }
      }
    }

    // Fetch the complete course with all relationships
    console.log('📖 Fetching complete course structure...');
    const { data: completeCourse, error: fetchError } = await supabase
      .from('courses')
      .select(`
        *,
        modules:modules(
          *,
          lessons:lessons(*),
          exercises:exercises(*)
        )
      `)
      .eq('id', course.id)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching complete course:', fetchError);
      return course; // Return basic course if fetch fails
    }

    console.log('✅ Complete course fetched successfully');
    return completeCourse;

  } catch (error) {
    console.error('❌ Error saving course to database:', error);
    throw error;
  }
}

module.exports = router;

