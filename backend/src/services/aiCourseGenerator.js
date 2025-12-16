import { config } from '../config/env.js';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

/**
 * Attempt to repair incomplete or malformed JSON
 */
function repairJSON(jsonString) {
  let repaired = jsonString.trim();

  // Remove markdown code blocks
  repaired = repaired.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  // Find the JSON object boundaries
  const firstBrace = repaired.indexOf('{');
  const lastBrace = repaired.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('No valid JSON object found');
  }

  repaired = repaired.substring(firstBrace, lastBrace + 1);

  // Fix common issues
  // 1. Remove control characters (newlines, tabs) that aren't escaped
  repaired = repaired.replace(/[\n\r\t]/g, ' ');

  // 2. Fix trailing commas in arrays and objects
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

  // 3. Ensure the JSON ends properly - if it's cut off, try to close it
  const openBraces = (repaired.match(/{/g) || []).length;
  const closeBraces = (repaired.match(/}/g) || []).length;
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/\]/g) || []).length;

  // Add missing closing brackets/braces
  for (let i = 0; i < (openBrackets - closeBrackets); i++) {
    repaired += ']';
  }
  for (let i = 0; i < (openBraces - closeBraces); i++) {
    repaired += '}';
  }

  return repaired;
}

/**
 * Generate a complete course structure using NVIDIA AI (Multi-step approach)
 * @param {Object} params - Course generation parameters
 * @param {string} params.courseName - Name of the course
 * @param {string} params.description - Brief description of the course
 * @param {string} params.prompt - Detailed prompt describing course requirements
 * @param {string} params.difficultyLevel - Difficulty level (beginner, intermediate, advanced)
 * @param {number} params.estimatedHours - Estimated duration in hours
 * @param {Function} params.onProgress - Optional progress callback function
 * @returns {Promise<Object>} Generated course structure
 */
async function generateCourseWithAI(params) {
  const { courseName, description, prompt, difficultyLevel = 'beginner', estimatedHours = 10, onProgress } = params;

  console.log('ðŸ¤– Starting MULTI-STEP AI course generation...');
  console.log('ðŸ“š Course Name:', courseName);
  console.log('ðŸ“ Prompt:', prompt);
  console.log('âš¡ Using multi-step generation to avoid token limits');

  // STEP 1: Generate course outline (modules and lesson titles only)
  console.log('\nðŸ“‹ STEP 1: Generating course outline...');
  if (onProgress) {
    onProgress({
      stage: 'outline',
      message: 'Generating course outline...',
      progress: 10
    });
  }
  const outline = await generateCourseOutline(params);

  // STEP 2: Generate content for each lesson
  console.log('\nðŸ“ STEP 2: Generating lesson content...');
  if (onProgress) {
    onProgress({
      stage: 'content',
      message: `Starting content generation for ${outline.modules?.length || 0} modules...`,
      progress: 20
    });
  }
  const courseWithContent = await generateLessonContent(outline, params, onProgress);

  // STEP 3: Validate and enhance the structure
  console.log('\n🔍 STEP 3: Validating and enhancing course structure...');
  if (onProgress) {
    onProgress({
      stage: 'validating',
      message: 'Validating and enhancing course structure...',
      progress: 90
    });
  }
  const finalCourse = validateAndEnhanceCourseStructure(courseWithContent, params);

  console.log('\nâœ… Multi-step generation complete!');
  return finalCourse;
}

/**
 * STEP 1: Generate course outline (modules and lesson titles only)
 */
async function generateCourseOutline(params) {
  const { courseName, description, prompt, difficultyLevel = 'beginner', estimatedHours = 10 } = params;

  const outlinePrompt = `You are an expert course designer. Create a course outline (structure only, NO content yet).

Course Name: ${courseName}
Description: ${description}
Difficulty: ${difficultyLevel}
Duration: ${estimatedHours} hours

User Requirements:
${prompt}

Generate a JSON course outline with this EXACT structure:
{
  "title": "Course Title",
  "slug": "course-slug",
  "description": "Detailed course description (2-3 sentences)",
  "short_description": "Brief one-line description",
  "color": "#hexcolor",
  "difficulty_level": "${difficultyLevel}",
  "estimated_duration_hours": ${estimatedHours},
  "tags": ["tag1", "tag2", "tag3"],
  "prerequisites": ["prereq1", "prereq2"],
  "learning_outcomes": ["outcome1", "outcome2", "outcome3"],
  "modules": [
    {
      "title": "Module 1 Title",
      "slug": "module-1-slug",
      "description": "Module description (1-2 sentences)",
      "order_index": 0,
      "lessons": [
        {
          "title": "Lesson 1 Title",
          "slug": "lesson-1-slug",
          "description": "Lesson description (1 sentence)",
          "order_index": 0,
          "estimated_duration_minutes": 15
        }
      ]
    }
  ]
}

IMPORTANT RULES:
1. Generate 3-4 modules based on the user's requirements
2. Each module should have 4-5 lessons
3. Lesson titles should be specific and descriptive
4. NO lesson content yet - just titles and descriptions
5. Return ONLY valid JSON, no markdown or extra text
6. Ensure all slugs are lowercase with hyphens
7. Choose an appropriate color for the course topic

Return ONLY the JSON structure.`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.nvidiaApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          {
            role: 'user',
            content: outlinePrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 4096,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('âŒ NVIDIA API Error (Outline):', response.status, errorText);
      throw new Error(`NVIDIA API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('âœ… Received outline from AI');

    // Parse the JSON
    const repairedJSON = repairJSON(generatedContent);
    const outline = JSON.parse(repairedJSON);

    console.log(`ðŸ“Š Generated ${outline.modules?.length || 0} modules`);

    return outline;

  } catch (error) {
    console.error('âŒ Error generating course outline:', error);
    throw new Error('Failed to generate course outline: ' + error.message);
  }
}

/**
 * STEP 2: Generate content for each lesson individually
 */
async function generateLessonContent(outline, params, onProgress) {
  const { difficultyLevel } = params;

  console.log(`ðŸ“ Generating content for ${outline.modules.length} modules...`);

  // Calculate total lessons for progress tracking
  const totalLessons = outline.modules.reduce((sum, module) => sum + module.lessons.length, 0);
  let completedLessons = 0;

  // Process each module
  for (let moduleIndex = 0; moduleIndex < outline.modules.length; moduleIndex++) {
    const module = outline.modules[moduleIndex];
    console.log(`\nðŸ“¦ Module ${moduleIndex + 1}/${outline.modules.length}: ${module.title}`);

    // Process each lesson in the module
    for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex++) {
      const lesson = module.lessons[lessonIndex];
      console.log(`  ðŸ“„ Lesson ${lessonIndex + 1}/${module.lessons.length}: ${lesson.title}`);

      // Send progress update
      if (onProgress) {
        const progress = 20 + Math.floor((completedLessons / totalLessons) * 70); // 20-90%
        onProgress({
          stage: 'lesson',
          message: `Module ${moduleIndex + 1}/${outline.modules.length}: Generating "${lesson.title}"`,
          progress,
          currentModule: moduleIndex + 1,
          totalModules: outline.modules.length,
          currentLesson: lessonIndex + 1,
          totalLessonsInModule: module.lessons.length,
          completedLessons,
          totalLessons
        });
      }

      // Generate content for this lesson
      const lessonContent = await generateSingleLessonContent(
        outline.title,
        module.title,
        lesson.title,
        lesson.description,
        difficultyLevel,
        lessonIndex,
        module.lessons.length
      );

      // Add the generated content to the lesson
      lesson.content = lessonContent.content;
      lesson.exercises = lessonContent.exercises;

      completedLessons++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\nâœ… All lesson content generated!');
  return outline;
}

/**
 * Generate content for a single lesson
 */
async function generateSingleLessonContent(courseTitle, moduleTitle, lessonTitle, lessonDescription, difficultyLevel, lessonIndex, totalLessons) {

  const contentPrompt = `Generate COMPLETE HTML content for this lesson:

Course: ${courseTitle}
Module: ${moduleTitle}
Lesson: ${lessonTitle}
Description: ${lessonDescription}
Difficulty: ${difficultyLevel}
Position: Lesson ${lessonIndex + 1} of ${totalLessons} in this module

Generate a JSON response with this EXACT structure:
{
  "content": "FULL HTML CONTENT HERE",
  "exercises": [
    {
      "title": "Exercise Title",
      "description": "What to do",
      "instructions": "Step by step",
      "starter_code": "// Starting code",
      "solution_code": "// Solution",
      "hints": ["Hint 1", "Hint 2"],
      "type": "coding",
      "difficulty": "${difficultyLevel}",
      "estimated_time": 15
    }
  ]
}

CONTENT REQUIREMENTS (CRITICAL - GENERATE FULL CONTENT):
1. Start with <h1>${lessonTitle}</h1>
2. Add 2-3 introduction paragraphs (100-200 words) explaining what, why, when
3. Include <h2> sections for main concepts
4. Add 2-3 COMPLETE code examples in <pre class="ql-syntax">...</pre> tags
5. Each code example must be 5-10 lines with comments
6. Include <h2>Key Points</h2> with <ul> list (4-6 points)
7. Include <h2>Common Mistakes</h2> with <ul> list (2-3 points)
8. End with <p>What's Next?</p> paragraph

HTML FORMATTING:
- Use <strong> for important terms
- Use <code> for inline code
- Use <pre class="ql-syntax"> for code blocks
- Use <p> for paragraphs
- Use <ul> and <li> for lists

EXERCISES:
- Generate 1-2 practical exercises
- Include complete starter_code and solution_code
- Add 2-3 helpful hints

Return ONLY valid JSON with the content and exercises.`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.nvidiaApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          {
            role: 'user',
            content: contentPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,  // Enough for one lesson
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('âŒ NVIDIA API Error (Lesson Content):', response.status);
      throw new Error(`Failed to generate lesson content: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the JSON
    const repairedJSON = repairJSON(generatedContent);
    const lessonData = JSON.parse(repairedJSON);

    console.log(`    âœ… Generated ${lessonData.content?.length || 0} chars of content`);

    return lessonData;

  } catch (error) {
    console.error(`    âŒ Error generating lesson content:`, error.message);

    // Return fallback content if generation fails
    return {
      content: `<h1>${lessonTitle}</h1><p>${lessonDescription}</p><p>Content generation failed. Please regenerate this lesson.</p>`,
      exercises: []
    };
  }
}

/**
 * Validate and enhance the AI-generated course structure
 */
function validateAndEnhanceCourseStructure(structure, params) {
  const { courseName, description, difficultyLevel, estimatedHours } = params;

  // Ensure required fields
  structure.title = structure.title || courseName;
  structure.description = structure.description || description;
  structure.difficulty_level = structure.difficulty_level || difficultyLevel;
  structure.estimated_duration_hours = structure.estimated_duration_hours || estimatedHours;

  // Generate slug if missing
  if (!structure.slug) {
    structure.slug = courseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Set defaults
  structure.short_description = structure.short_description || description.substring(0, 100);
  structure.color = structure.color || '#3B82F6';
  structure.tags = structure.tags || [];
  structure.prerequisites = structure.prerequisites || [];
  structure.learning_objectives = structure.learning_objectives || [];
  structure.is_published = true;
  structure.is_featured = false;

  // Ensure tutor information
  if (!structure.tutor) {
    structure.tutor = {
      name: 'AI Course Instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-instructor',
      bio: 'Expert educator specializing in technology and programming courses.'
    };
  }

  // Validate modules
  if (!structure.modules || !Array.isArray(structure.modules)) {
    structure.modules = [];
  }

  // Ensure each module has required fields
  structure.modules = structure.modules.map((module, index) => {
    module.order_index = module.order_index ?? index;
    module.slug = module.slug || module.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    module.estimated_duration_minutes = module.estimated_duration_minutes || 60;
    module.lessons = module.lessons || [];
    module.exercises = module.exercises || [];

    // Validate lessons
    module.lessons = module.lessons.map((lesson, lessonIndex) => {
      lesson.order_index = lesson.order_index ?? lessonIndex;
      lesson.slug = lesson.slug || lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      lesson.duration_minutes = lesson.duration_minutes || 15;
      lesson.content = lesson.content || '';
      lesson.video_url = lesson.video_url || null;
      return lesson;
    });

    // Validate exercises
    module.exercises = module.exercises.map((exercise) => {
      exercise.difficulty = exercise.difficulty || 'medium';
      exercise.estimated_time = exercise.estimated_time || 30;
      exercise.type = exercise.type || 'coding';
      return exercise;
    });

    return module;
  });

  return structure;
}

export { generateCourseWithAI };
