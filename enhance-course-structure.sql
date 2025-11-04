-- Enhanced Course Structure for Better UI Representation
-- This script adds comprehensive metadata and structure for user-friendly display

-- Step 1: Enhance the Python course with comprehensive metadata
UPDATE courses SET
    title = 'Python Programming Mastery',
    description = 'Master Python programming from absolute beginner to confident developer. Build real projects, solve coding challenges, and learn industry best practices through hands-on exercises and interactive lessons.',
    short_description = 'Complete Python course with hands-on projects and real-world applications',
    difficulty_level = 'beginner',
    estimated_duration_hours = 40,
    prerequisites = ARRAY['Basic computer literacy', 'No prior programming experience required'],
    learning_objectives = ARRAY[
        'Write clean, efficient Python code following best practices',
        'Master Python data structures and control flow',
        'Build real-world applications and projects',
        'Understand object-oriented programming concepts',
        'Handle files, APIs, and external libraries',
        'Debug and test Python applications effectively'
    ],
    tags = ARRAY['python', 'programming', 'beginner-friendly', 'hands-on', 'projects', 'coding'],
    tutor_name = 'Dr. Ana Python',
    tutor_avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    tutor_bio = 'Senior Python Developer and Educator with 10+ years of experience. Former Google engineer, now dedicated to making programming accessible to everyone through engaging, project-based learning.',
    color = '#3776AB',
    icon = 'code',
    is_featured = true,
    updated_at = NOW()
WHERE slug = 'python';

-- Step 2: Enhance Module 1 with better structure
UPDATE modules SET
    title = '🐍 Python Fundamentals',
    description = 'Start your Python journey! Learn the essential building blocks of Python programming through interactive examples and hands-on practice.',
    estimated_duration_minutes = 180,
    learning_objectives = ARRAY[
        'Understand Python syntax and basic concepts',
        'Work confidently with variables and data types',
        'Perform calculations and string operations',
        'Write your first Python programs'
    ],
    prerequisites = ARRAY['None - perfect for beginners!'],
    key_concepts = ARRAY['Python syntax', 'Variables', 'Data types', 'Operators', 'Basic I/O'],
    difficulty_level = 'beginner',
    updated_at = NOW()
WHERE course_id = (SELECT id FROM courses WHERE slug = 'python') 
    AND slug = 'python-fundamentals';

-- Step 3: Enhance Module 2 with better structure  
UPDATE modules SET
    title = '📊 Data Types & Structures',
    description = 'Dive deeper into Python''s powerful data structures. Master lists, dictionaries, sets, and learn to manipulate data like a pro.',
    estimated_duration_minutes = 240,
    learning_objectives = ARRAY[
        'Master Python lists, tuples, and dictionaries',
        'Understand when to use different data structures',
        'Perform complex data manipulations',
        'Write efficient, readable code with collections'
    ],
    prerequisites = ARRAY['Completion of Python Fundamentals module'],
    key_concepts = ARRAY['Lists', 'Tuples', 'Dictionaries', 'Sets', 'List comprehensions', 'Data manipulation'],
    difficulty_level = 'beginner',
    updated_at = NOW()
WHERE course_id = (SELECT id FROM courses WHERE slug = 'python') 
    AND slug = 'data-types-structures';

-- Step 4: Add a third module for more comprehensive learning
INSERT INTO modules (
    course_id,
    title,
    description,
    slug,
    order_index,
    estimated_duration_minutes,
    difficulty_level,
    learning_objectives,
    prerequisites,
    key_concepts,
    is_published
)
SELECT 
    id,
    '🔧 Control Flow & Functions',
    'Learn to control program flow with conditionals and loops, then master functions to write reusable, organized code.',
    'control-flow-functions',
    3,
    200,
    'intermediate',
    ARRAY[
        'Master if/else statements and logical operators',
        'Use loops effectively for repetitive tasks',
        'Write clean, reusable functions',
        'Understand scope and parameter passing'
    ],
    ARRAY['Completion of Data Types & Structures module'],
    ARRAY['Conditionals', 'Loops', 'Functions', 'Scope', 'Parameters', 'Return values'],
    true
FROM courses WHERE slug = 'python';

-- Step 5: Enhance existing lessons with better content structure
UPDATE lessons SET
    title = '🚀 Welcome to Python',
    description = 'Discover why Python is the world''s most popular programming language and write your very first program!',
    content = '# 🚀 Welcome to Python Programming!

Welcome to your Python programming journey! You''re about to learn one of the most powerful and beginner-friendly programming languages in the world.

## 🌟 Why Python is Amazing

Python is used by millions of developers worldwide because it''s:

- **🎯 Easy to Learn**: Clean, readable syntax that feels like English
- **🚀 Powerful**: Used by Google, Netflix, Instagram, and NASA
- **🌍 Versatile**: Web development, AI, data science, automation, and more
- **👥 Community-Driven**: Huge community and thousands of libraries

## 🎮 Your First Python Adventure

Let''s start with the traditional "Hello, World!" program:

```python
print("Hello, World!")
print("Welcome to Python programming!")
```

**Try it yourself!** Copy this code and run it. You''ve just written your first Python program! 🎉

## 🔍 What Just Happened?

- `print()` is a **function** that displays text on the screen
- The text inside quotes is called a **string**
- Python reads your code line by line, from top to bottom

## 🎯 Quick Challenge

Try modifying the code to print your name:

```python
print("Hello, my name is [Your Name]!")
```

## 🚀 What''s Next?

In the next lesson, we''ll learn about variables - a way to store and reuse information in your programs. Get ready to build something amazing!

---
💡 **Pro Tip**: The best way to learn programming is by doing. Don''t just read - try every example!',
    estimated_duration_minutes = 25,
    key_concepts = ARRAY['Python introduction', 'print() function', 'Strings', 'First program'],
    learning_objectives = ARRAY[
        'Understand what Python is and why it''s popular',
        'Write and run your first Python program',
        'Use the print() function to display text'
    ],
    updated_at = NOW()
WHERE module_id = (
    SELECT m.id FROM modules m 
    JOIN courses c ON m.course_id = c.id 
    WHERE c.slug = 'python' AND m.slug = 'python-fundamentals'
) AND slug = 'introduction-to-python';

-- Step 6: Add some practical exercises
INSERT INTO exercises (
    lesson_id,
    title,
    description,
    exercise_type,
    difficulty_level,
    estimated_duration_minutes,
    instructions,
    starter_code,
    solution_code,
    test_cases,
    hints,
    learning_objectives,
    is_published
)
SELECT 
    l.id,
    '🎯 Your First Python Challenge',
    'Practice using the print() function to create personalized messages',
    'coding',
    'beginner',
    10,
    '# Your First Python Challenge! 🎯

Create a program that introduces yourself using multiple print statements.

## Requirements:
1. Print a greeting message
2. Print your name
3. Print something you''re excited to learn about Python
4. Print a motivational message

## Example Output:
```
Hello there!
My name is Alex
I''m excited to learn Python for web development
Let''s code something amazing!
```',
    '# Write your introduction program here
# Use multiple print() statements

print("Hello there!")
# Add your code below:',
    '# Solution: Personal Introduction
print("Hello there!")
print("My name is Alex")
print("I''m excited to learn Python for web development")
print("Let''s code something amazing!")',
    ARRAY[
        'Remember to put text inside quotes: "like this"',
        'Each print() statement creates a new line',
        'You can print anything you want - be creative!'
    ]::jsonb,
    ARRAY['Use the print() function correctly', 'Create multiple lines of output', 'Practice with strings'],
    true
FROM lessons l
JOIN modules m ON l.module_id = m.id
JOIN courses c ON m.course_id = c.id
WHERE c.slug = 'python' 
    AND m.slug = 'python-fundamentals' 
    AND l.slug = 'introduction-to-python';

-- Step 7: Add learning resources
INSERT INTO resources (
    course_id,
    module_id,
    title,
    description,
    resource_type,
    url,
    content,
    is_featured,
    order_index,
    estimated_read_time,
    is_published
)
SELECT 
    c.id,
    m.id,
    '📚 Python Official Documentation',
    'The official Python documentation - your go-to reference for everything Python',
    'external_link',
    'https://docs.python.org/3/',
    null,
    true,
    1,
    null,
    true
FROM courses c
JOIN modules m ON c.id = m.course_id
WHERE c.slug = 'python' AND m.slug = 'python-fundamentals';

-- Step 8: Verification
SELECT 'Enhanced course structure completed!' as status;

SELECT 
    c.title as course,
    COUNT(DISTINCT m.id) as modules,
    COUNT(DISTINCT l.id) as lessons,
    COUNT(DISTINCT e.id) as exercises,
    COUNT(DISTINCT r.id) as resources
FROM courses c
LEFT JOIN modules m ON c.id = m.course_id
LEFT JOIN lessons l ON m.id = l.module_id
LEFT JOIN exercises e ON l.id = e.lesson_id
LEFT JOIN resources r ON c.id = r.course_id
WHERE c.slug = 'python'
GROUP BY c.id, c.title;
