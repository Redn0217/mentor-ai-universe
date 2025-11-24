const { config } = require('../config/env.js');

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

/**
 * Generate a complete course structure using NVIDIA AI
 * @param {Object} params - Course generation parameters
 * @param {string} params.courseName - Name of the course
 * @param {string} params.description - Brief description of the course
 * @param {string} params.prompt - Detailed prompt describing course requirements
 * @param {string} params.difficultyLevel - Difficulty level (beginner, intermediate, advanced)
 * @param {number} params.estimatedHours - Estimated duration in hours
 * @returns {Promise<Object>} Generated course structure
 */
async function generateCourseWithAI(params) {
  const { courseName, description, prompt, difficultyLevel = 'beginner', estimatedHours = 10 } = params;

  console.log('🤖 Starting AI course generation...');
  console.log('📚 Course Name:', courseName);
  console.log('📝 Prompt:', prompt);

  // Construct the AI prompt
  const systemPrompt = `You are an expert course designer and educator with expertise similar to W3Schools, GeeksforGeeks, and MDN Web Docs. Your task is to create comprehensive, well-structured educational courses with professional formatting.

⚠️ CRITICAL REQUIREMENT - READ THIS FIRST:

MOST IMPORTANT: DO NOT USE "..." OR PLACEHOLDERS IN LESSON CONTENT!
You MUST generate COMPLETE, FULL content for EVERY lesson!

Generate 3-4 modules with 4-5 lessons per module.
EACH LESSON MUST HAVE COMPLETE CONTENT - NO SHORTCUTS!

EACH LESSON MUST HAVE THIS COMPLETE STRUCTURE (NO "..." ALLOWED):
- <h1> title
- 2-3 paragraphs introduction (minimum 100 words - FULL paragraphs, not "...")
- <h2> section with explanation (FULL explanation, not "...")
- <pre class="ql-syntax"> COMPLETE code example 1 with comments (5-10 lines of REAL code)
- <h2> section with more explanation (FULL explanation, not "...")
- <pre class="ql-syntax"> COMPLETE code example 2 with comments (5-10 lines of REAL code)
- <h2> section with advanced concept (FULL explanation, not "...")
- <pre class="ql-syntax"> COMPLETE code example 3 with comments (5-10 lines of REAL code)
- <h2>Common Mistakes</h2> section with <ul> list (2-3 COMPLETE items)
- <h2>Best Practices</h2> section with <ul> list (3-4 COMPLETE items)
- <h2>Key Points</h2> with <ul> list (4-6 COMPLETE bullet points)
- <p> "What's Next?" paragraph (1-2 COMPLETE sentences)

Example module breakdown (4-5 lessons per module):
Module: "JavaScript Arrays"
1. Introduction to Arrays
2. Creating and Initializing Arrays
3. Accessing and Modifying Array Elements
4. Array Methods - Adding and Removing (push, pop, shift, unshift)
5. Array Iteration Methods (forEach, map, filter, reduce)

⚠️ REMEMBER: Generate FEWER modules/lessons if needed, but make EACH ONE COMPLETE with FULL content!

Generate a complete course structure in JSON format with the following requirements:

CONTENT QUALITY:
1. Create engaging, educational content with real-world examples
2. Include practical code examples with proper syntax highlighting
3. Structure content progressively from basics to advanced topics
4. Each lesson should have clear learning objectives and key concepts
5. Add explanations similar to W3Schools (clear, concise, beginner-friendly)
6. Include "Try it Yourself" style examples with code snippets
7. Make exercises challenging but achievable

FORMATTING REQUIREMENTS (CRITICAL):
- Use HTML formatting for lesson content (NOT markdown)
- Use <h1>, <h2>, <h3>, <h4> for headings
- Use <strong> for bold text (important concepts, keywords)
- Use <em> for italic text (emphasis, notes)
- Use <u> for underlined text (key terms)
- Use <pre class="ql-syntax"> for code blocks
- Use <code> for inline code
- Use <p> for paragraphs
- Use <ul> and <ol> for lists
- Use <a href="..."> for links

CODE EXAMPLES:
- Every lesson should include at least 1-2 code examples
- Code should be inside <pre class="ql-syntax">...</pre> tags
- Include comments in code to explain what's happening
- Show both basic and advanced examples
- Include output/result examples where applicable

Return ONLY valid JSON without any markdown formatting or code blocks. The JSON should follow this exact structure:

⚠️ CRITICAL: Each module MUST have 4-5 lessons in the "lessons" array!
⚠️ CRITICAL: Each lesson's "content" field MUST contain FULL, COMPLETE HTML like the example below!
⚠️ DO NOT use "..." or "content here..." or any placeholders - generate the COMPLETE content for EVERY lesson!
⚠️ The example below shows the MINIMUM content structure - your lessons should be AT LEAST this detailed!

{
  "title": "Course Title",
  "slug": "course-slug",
  "description": "Detailed course description",
  "short_description": "Brief one-line description",
  "color": "#hexcolor",
  "difficulty_level": "beginner|intermediate|advanced",
  "estimated_duration_hours": number,
  "tags": ["tag1", "tag2"],
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "learning_objectives": ["objective1", "objective2"],
  "tutor": {
    "name": "Instructor Name",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=instructorname",
    "bio": "Brief instructor bio"
  },
  "modules": [
    {
      "title": "JavaScript Arrays",
      "description": "Learn everything about arrays in JavaScript",
      "slug": "javascript-arrays",
      "order_index": 0,
      "estimated_duration_minutes": 240,
      "lessons": [
        {
          "title": "Introduction to Arrays",
          "description": "Learn what arrays are and why they're important",
          "slug": "introduction-to-arrays",
          "order_index": 0,
          "duration_minutes": 30,
          "content": "<h1>Introduction to Arrays</h1><p>Arrays are fundamental data structures that store multiple values in a single variable. They are ordered collections where each element has a specific position called an index.</p><p>In this lesson, we'll explore what arrays are, why they're important, and how to use them effectively in your programs.</p><h2>What is an Array?</h2><p>An array is a <strong>collection of elements</strong> stored in contiguous memory locations. Each element can be accessed using its <strong>index</strong>, which starts at 0.</p><pre class=\"ql-syntax\">// Creating an array of numbers\nlet numbers = [1, 2, 3, 4, 5];\nconsole.log(numbers);\n// Output: [1, 2, 3, 4, 5]\n\n// Accessing elements by index\nconsole.log(numbers[0]); // Output: 1\nconsole.log(numbers[2]); // Output: 3</pre><h2>Why Use Arrays?</h2><p>Arrays are essential because they allow you to store and manage multiple related values efficiently. Instead of creating separate variables for each value, you can group them together.</p><pre class=\"ql-syntax\">// Without arrays (inefficient)\nlet student1 = \"Alice\";\nlet student2 = \"Bob\";\nlet student3 = \"Charlie\";\n\n// With arrays (efficient)\nlet students = [\"Alice\", \"Bob\", \"Charlie\"];\nconsole.log(students);\n// Output: [\"Alice\", \"Bob\", \"Charlie\"]</pre><h2>Common Array Operations</h2><p>Arrays support various operations like adding, removing, and modifying elements.</p><pre class=\"ql-syntax\">let fruits = [\"apple\", \"banana\"];\n\n// Adding elements\nfruits.push(\"orange\");\nconsole.log(fruits);\n// Output: [\"apple\", \"banana\", \"orange\"]\n\n// Removing elements\nfruits.pop();\nconsole.log(fruits);\n// Output: [\"apple\", \"banana\"]</pre><h2>Common Mistakes</h2><ul><li>Forgetting that array indices start at 0, not 1</li><li>Accessing indices that don't exist (returns undefined)</li><li>Modifying arrays while iterating over them</li></ul><h2>Best Practices</h2><ul><li>Use descriptive names for arrays (e.g., students, not arr)</li><li>Check array length before accessing elements</li><li>Use array methods instead of manual loops when possible</li><li>Keep arrays homogeneous (same data type) for clarity</li></ul><h2>Key Points</h2><ul><li>Arrays store multiple values in a single variable</li><li>Array indices start at 0</li><li>Use square brackets [] to create and access arrays</li><li>Arrays have a length property</li><li>Common methods: push(), pop(), shift(), unshift()</li></ul><p><strong>What's Next?</strong> In the next lesson, we'll learn different ways to create and initialize arrays.</p>",
          "video_url": null,
          "exercises": [...]
        },
        {
          "title": "Creating and Initializing Arrays",
          "description": "Different ways to create arrays in JavaScript",
          "slug": "creating-arrays",
          "order_index": 1,
          "duration_minutes": 25,
          "content": "HTML formatted content here...",
          "video_url": null,
          "exercises": [...]
        },
        {
          "title": "Accessing Array Elements",
          "description": "How to access and modify array elements",
          "slug": "accessing-arrays",
          "order_index": 2,
          "duration_minutes": 30,
          "content": "HTML formatted content here...",
          "video_url": null,
          "exercises": [...]
        },
        {
          "title": "Array Methods - Adding and Removing",
          "description": "Learn push, pop, shift, unshift methods",
          "slug": "array-methods-basic",
          "order_index": 3,
          "duration_minutes": 35,
          "content": "HTML formatted content here...",
          "video_url": null,
          "exercises": [...]
        },
        {
          "title": "Array Iteration Methods",
          "description": "forEach, map, filter, and reduce",
          "slug": "array-iteration",
          "order_index": 4,
          "duration_minutes": 40,
          "content": "HTML formatted content here...",
          "video_url": null,
          "exercises": [...]
        },
        {
          "title": "Advanced Array Methods",
          "description": "find, some, every, includes methods",
          "slug": "advanced-array-methods",
          "order_index": 5,
          "duration_minutes": 35,
          "content": "HTML formatted content here...",
          "video_url": null,
          "exercises": [...]
        },
        {
          "title": "Multidimensional Arrays",
          "description": "Working with arrays of arrays",
          "slug": "multidimensional-arrays",
          "order_index": 6,
          "duration_minutes": 30,
          "content": "HTML formatted content here...",
          "video_url": null,
          "exercises": [...]
        },
        {
          "title": "Array Best Practices",
          "description": "Common patterns and best practices",
          "slug": "array-best-practices",
          "order_index": 7,
          "duration_minutes": 25,
          "content": "HTML formatted content here...",
          "video_url": null,
          "exercises": [...]
        }
      ]
    }
  ]
}

⚠️ NOTICE: The example above shows 8 lessons in the "JavaScript Arrays" module. YOU MUST generate 5-8 lessons per module like this!

CRITICAL: Lesson Content Formatting Example (Follow this COMPREHENSIVE style exactly):

<h1>Introduction to Arrays</h1>
<p>An array is a <strong>special variable</strong> that can hold <em>more than one value</em> at a time. Arrays are one of the most fundamental and widely-used data structures in programming. Understanding arrays is crucial for any developer, as they form the foundation for more complex data structures and algorithms.</p>

<p>In this lesson, you'll learn what arrays are, why they're important, how to create them, and how to work with them effectively. By the end of this lesson, you'll be comfortable using arrays to store and manipulate collections of data.</p>

<h2>Why Use Arrays?</h2>
<p>Imagine you're building an application that needs to store a list of student names. Without arrays, you might try something like this:</p>
<pre class="ql-syntax">// Without arrays - NOT recommended!
let student1 = "Alice";
let student2 = "Bob";
let student3 = "Charlie";
let student4 = "David";
let student5 = "Emma";

// This becomes unmanageable with many students!
console.log(student1); // Output: Alice
console.log(student2); // Output: Bob</pre>

<p>This approach has several problems:</p>
<ul>
  <li>You need to create a new variable for each item</li>
  <li>It's difficult to loop through all items</li>
  <li>Adding or removing items requires changing your code</li>
  <li>You can't easily determine how many items you have</li>
</ul>

<p><strong>Arrays solve all these problems!</strong> They allow you to store multiple values in a single variable and access them efficiently.</p>

<h2>Creating Arrays</h2>
<p>There are several ways to create arrays in JavaScript. Let's explore each method:</p>

<h3>Example 1: Array Literal (Recommended)</h3>
<pre class="ql-syntax">// Create an array of fruits using array literal syntax
let fruits = ["Apple", "Banana", "Orange", "Mango"];

// Display the entire array
console.log(fruits);
// Output: ["Apple", "Banana", "Orange", "Mango"]

// Check the number of elements
console.log(fruits.length);
// Output: 4</pre>

<h3>Example 2: Using the Array Constructor</h3>
<pre class="ql-syntax">// Create an array using the Array constructor
let numbers = new Array(10, 20, 30, 40, 50);

console.log(numbers);
// Output: [10, 20, 30, 40, 50]

// Create an empty array with a specific length
let emptyArray = new Array(5);
console.log(emptyArray);
// Output: [empty × 5]
console.log(emptyArray.length);
// Output: 5</pre>

<h3>Example 3: Mixed Data Types</h3>
<pre class="ql-syntax">// Arrays can hold different data types
let mixedArray = ["John", 25, true, null, {city: "New York"}];

console.log(mixedArray[0]); // Output: John (string)
console.log(mixedArray[1]); // Output: 25 (number)
console.log(mixedArray[2]); // Output: true (boolean)
console.log(mixedArray[4]); // Output: {city: "New York"} (object)</pre>

<p><strong>Best Practice:</strong> Use the array literal syntax <code>[]</code> as it's <em>cleaner, faster, and less error-prone</em> than the constructor method.</p>

<h2>Accessing Array Elements</h2>
<p>Array elements are accessed using their <strong>index number</strong>. The index is a zero-based number, meaning the first element is at index 0, the second at index 1, and so on.</p>

<h3>Example 4: Basic Array Access</h3>
<pre class="ql-syntax">let colors = ["Red", "Green", "Blue", "Yellow", "Purple"];

// Access individual elements
console.log(colors[0]);  // Output: Red (first element)
console.log(colors[1]);  // Output: Green (second element)
console.log(colors[2]);  // Output: Blue (third element)

// Access the last element using length - 1
console.log(colors[colors.length - 1]);  // Output: Purple

// Trying to access an index that doesn't exist
console.log(colors[10]); // Output: undefined</pre>

<h3>Example 5: Modifying Array Elements</h3>
<pre class="ql-syntax">let scores = [85, 90, 78, 92, 88];

// Display original array
console.log("Original:", scores);
// Output: Original: [85, 90, 78, 92, 88]

// Modify the third element (index 2)
scores[2] = 95;

console.log("Modified:", scores);
// Output: Modified: [85, 90, 95, 92, 88]

// Add a new element at the end
scores[5] = 87;
console.log("Added:", scores);
// Output: Added: [85, 90, 95, 92, 88, 87]</pre>

<h2>Common Array Operations</h2>

<h3>Example 6: Adding and Removing Elements</h3>
<pre class="ql-syntax">let animals = ["Dog", "Cat", "Bird"];

// Add element to the end using push()
animals.push("Fish");
console.log(animals);
// Output: ["Dog", "Cat", "Bird", "Fish"]

// Add element to the beginning using unshift()
animals.unshift("Rabbit");
console.log(animals);
// Output: ["Rabbit", "Dog", "Cat", "Bird", "Fish"]

// Remove last element using pop()
let lastAnimal = animals.pop();
console.log("Removed:", lastAnimal);  // Output: Removed: Fish
console.log(animals);
// Output: ["Rabbit", "Dog", "Cat", "Bird"]

// Remove first element using shift()
let firstAnimal = animals.shift();
console.log("Removed:", firstAnimal); // Output: Removed: Rabbit
console.log(animals);
// Output: ["Dog", "Cat", "Bird"]</pre>

<h2>Common Mistakes to Avoid</h2>
<p>Here are some common mistakes beginners make when working with arrays:</p>

<h3>Mistake 1: Confusing Index with Length</h3>
<pre class="ql-syntax">let items = ["A", "B", "C", "D", "E"];

// WRONG: Trying to access element at index equal to length
console.log(items[items.length]);  // Output: undefined

// CORRECT: Last element is at length - 1
console.log(items[items.length - 1]);  // Output: E</pre>

<h3>Mistake 2: Modifying Array While Looping</h3>
<pre class="ql-syntax">let numbers = [1, 2, 3, 4, 5];

// WRONG: Removing elements while looping can skip elements
for (let i = 0; i < numbers.length; i++) {
  numbers.pop(); // This changes the length during iteration!
}

// CORRECT: Loop backwards when removing elements
let numbers2 = [1, 2, 3, 4, 5];
for (let i = numbers2.length - 1; i >= 0; i--) {
  numbers2.pop();
}
console.log(numbers2); // Output: []</pre>

<h2>Best Practices</h2>
<ul>
  <li>Use <code>const</code> for arrays that won't be reassigned (you can still modify elements)</li>
  <li>Use descriptive names for arrays (plural nouns like <code>users</code>, <code>products</code>)</li>
  <li>Check array length before accessing elements to avoid undefined values</li>
  <li>Use array methods like <code>push()</code> and <code>pop()</code> instead of direct index manipulation</li>
  <li>Consider using <code>Array.isArray()</code> to verify if a variable is an array</li>
</ul>

<h2>Real-World Applications</h2>
<p>Arrays are used everywhere in real applications:</p>
<ul>
  <li><strong>E-commerce:</strong> Storing shopping cart items, product lists</li>
  <li><strong>Social Media:</strong> Lists of posts, comments, followers</li>
  <li><strong>Data Analysis:</strong> Storing datasets, measurements, statistics</li>
  <li><strong>Gaming:</strong> Player inventories, high scores, game states</li>
  <li><strong>Forms:</strong> Collecting multiple user inputs, validation errors</li>
</ul>

<h2>Try It Yourself</h2>
<p>Create a program that manages a todo list using an array:</p>
<pre class="ql-syntax">// Create a todo list
let todos = ["Buy groceries", "Walk the dog", "Finish homework"];

// Add a new todo
todos.push("Call mom");

// Display all todos
console.log("My Todo List:");
for (let i = 0; i < todos.length; i++) {
  console.log((i + 1) + ". " + todos[i]);
}
// Output:
// My Todo List:
// 1. Buy groceries
// 2. Walk the dog
// 3. Finish homework
// 4. Call mom

// Remove the first completed task
let completed = todos.shift();
console.log("Completed:", completed);
// Output: Completed: Buy groceries</pre>

<h2>Key Points</h2>
<ul>
  <li>Arrays are <strong>ordered collections</strong> that can store multiple values in a single variable</li>
  <li>Array indexes start at <code>0</code>, not 1 - this is called <strong>zero-based indexing</strong></li>
  <li>Use <code>[]</code> (array literal) syntax to create arrays - it's simpler and more efficient</li>
  <li>Access elements using bracket notation: <code>arrayName[index]</code></li>
  <li>The <code>length</code> property tells you how many elements are in the array</li>
  <li>Arrays are <strong>mutable</strong> - you can change, add, or remove elements after creation</li>
  <li>Use <code>push()</code> to add to the end, <code>pop()</code> to remove from the end</li>
  <li>Use <code>unshift()</code> to add to the beginning, <code>shift()</code> to remove from the beginning</li>
  <li>Arrays can hold <strong>any data type</strong>, including other arrays (nested arrays)</li>
  <li>Always check if an index exists before accessing it to avoid <code>undefined</code> values</li>
</ul>

<h2>What's Next?</h2>
<p>Now that you understand the basics of arrays, in the next lesson we'll explore <strong>Array Methods</strong> like <code>map()</code>, <code>filter()</code>, and <code>reduce()</code> that make working with arrays even more powerful and efficient. These methods are essential for modern JavaScript development!</p>`;

  const userPrompt = `Create a ${difficultyLevel} level course about "${courseName}".

Course Description: ${description}

Specific Requirements:
${prompt}

Estimated Duration: ${estimatedHours} hours

⚠️ CRITICAL REQUIREMENTS - YOU MUST FOLLOW THESE EXACTLY:

1. MODULES: Generate EXACTLY 3-4 modules (NOT MORE!)
2. LESSONS PER MODULE: Generate EXACTLY 4-5 lessons per module
   - Break down each module topic into multiple sub-topics
   - Each lesson should cover ONE specific aspect of the module topic
   - Example: "Arrays" module should have 4-5 separate lessons covering different array concepts
3. LESSON CONTENT: Each lesson MUST have FULL, COMPLETE HTML-FORMATTED content
   - DO NOT USE "..." or placeholder text
   - DO NOT abbreviate or shorten the content
   - GENERATE THE COMPLETE CONTENT for every single lesson
   - Minimum 3-4 paragraphs of explanation (200-400 words)
   - Multiple sections with <h2> headings
   - Clear, detailed explanations like W3Schools
4. CODE EXAMPLES: Each lesson MUST include 3 COMPLETE code examples with <pre class="ql-syntax"> tags
   - Each code example must be COMPLETE and RUNNABLE (no "..." or placeholders)
   - Include detailed comments explaining what the code does
   - Show expected output using // Output: comments
   - Progress from simple to complex examples
5. EXERCISES: Each lesson should have 1 exercise with starter_code, solution_code, and hints

⚠️ ABSOLUTELY CRITICAL: DO NOT use "..." or "content here..." or any placeholders in the lesson content!
⚠️ GENERATE THE FULL, COMPLETE CONTENT for EVERY lesson following the example format shown below!

FORMATTING REQUIREMENTS:
- Use <strong> for important concepts, <em> for emphasis, <code> for inline code
- Use <h1> for lesson title, <h2> for main sections, <h3> for subsections
- Include "Try It Yourself" sections with code examples
- Add "Key Points" sections with <ul> lists (4-6 points)
- Add "Common Mistakes" or "Best Practices" section
- Show output/results for ALL code examples using // Output: comments
- Include real-world use cases
- Clear progression from basics to advanced topics

LESSON BREAKDOWN EXAMPLE:
If you're creating a module on "JavaScript Arrays", you MUST create 4-5 separate lessons like:
- Lesson 1: Introduction to Arrays and Array Basics
- Lesson 2: Creating and Initializing Arrays
- Lesson 3: Accessing and Modifying Array Elements
- Lesson 4: Array Methods - Adding and Removing (push, pop, shift, unshift)
- Lesson 5: Array Iteration Methods (forEach, map, filter, reduce)

DO NOT create just 1 lesson per module! Break down the topic into 4-5 detailed lessons with FULL content!

CONTENT STYLE GUIDELINES (FOLLOW THESE FOR EVERY SINGLE LESSON):

⚠️ CRITICAL: Generate FULL, COMPLETE content for EVERY lesson - NO "..." or placeholders!

For EACH and EVERY lesson, you MUST include:
1. <h1> title and 2-3 introduction paragraphs (minimum 100 words explaining what, why, when)
2. <h2> section: "Why is this important?" or "Real-world applications" (2-3 sentences)
3. <h2> section: Main concept explanation with first code example
4. <pre class="ql-syntax"> COMPLETE code example 1 (basic usage, 5-10 lines with comments)
5. <h2> section: Practical application with second code example
6. <pre class="ql-syntax"> COMPLETE code example 2 (real-world scenario, 5-10 lines with comments)
7. <h2> section: Advanced concept with third code example
8. <pre class="ql-syntax"> COMPLETE code example 3 (more complex, 5-10 lines with comments)
9. <h2>Common Mistakes</h2> section with <ul> list (2-3 items)
10. <h2>Best Practices</h2> section with <ul> list (3-4 items)
11. <h2>Key Points</h2> with <ul> list (4-6 bullet points)
12. <p> "What's Next?" paragraph (1-2 sentences)

IMPORTANT STRUCTURE:
- Generate EXACTLY 3-4 modules
- Each module has EXACTLY 4-5 lessons
- Each lesson has FULL HTML content (like the example - NO shortcuts!)
- Each lesson has 1 exercise with starter_code, solution_code, and hints

CONTENT LENGTH REQUIREMENTS (ABSOLUTELY CRITICAL):
- Each lesson MUST be 200-400 words of explanation + 3 code examples
- DO NOT use "..." anywhere in the content
- DO NOT abbreviate or shorten content
- GENERATE THE COMPLETE CONTENT for every single lesson
- Follow the example format EXACTLY - that's the MINIMUM required
- If you're running out of tokens, generate FEWER modules/lessons but make each one COMPLETE

Generate the course slug from the title (lowercase, hyphenated).
Generate lesson slugs from lesson titles (lowercase, hyphenated).
Choose an appropriate color hex code that matches the course topic.
Include relevant tags and prerequisites.

Return ONLY the JSON structure, no additional text or formatting.`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.nvidiaApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-405b-instruct',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 50000,  // Increased to allow more comprehensive content
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ NVIDIA API Error:', response.status, errorText);
      throw new Error(`NVIDIA API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Received response from NVIDIA API');

    // Extract the generated content
    const generatedContent = data.choices[0].message.content;
    console.log('📄 Generated content length:', generatedContent.length);

    // Parse the JSON response
    let courseStructure;
    try {
      // Clean the content to extract only the JSON
      let cleanedContent = generatedContent.trim();

      // Remove any text before the JSON starts
      const jsonStartIndex = cleanedContent.indexOf('{');
      if (jsonStartIndex > 0) {
        cleanedContent = cleanedContent.substring(jsonStartIndex);
      }

      // Remove any text after the JSON ends
      const jsonEndIndex = cleanedContent.lastIndexOf('}');
      if (jsonEndIndex > 0 && jsonEndIndex < cleanedContent.length - 1) {
        cleanedContent = cleanedContent.substring(0, jsonEndIndex + 1);
      }

      // Remove markdown code blocks if present
      if (cleanedContent.includes('```json')) {
        cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedContent.includes('```')) {
        cleanedContent = cleanedContent.replace(/```\n?/g, '');
      }

      // Final trim
      cleanedContent = cleanedContent.trim();

      courseStructure = JSON.parse(cleanedContent);
      console.log('✅ Successfully parsed course structure');
      console.log('📊 Generated modules:', courseStructure.modules?.length || 0);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      console.error('Raw content:', generatedContent.substring(0, 500));
      throw new Error('Failed to parse AI-generated course structure');
    }

    // Validate and enhance the structure
    courseStructure = validateAndEnhanceCourseStructure(courseStructure, {
      courseName,
      description,
      difficultyLevel,
      estimatedHours
    });

    console.log('🎉 Course generation complete!');
    return courseStructure;

  } catch (error) {
    console.error('❌ Error generating course with AI:', error);
    throw error;
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

module.exports = {
  generateCourseWithAI
};

