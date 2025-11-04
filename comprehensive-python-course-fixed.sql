-- =====================================================
-- COMPREHENSIVE PYTHON COURSE POPULATION SCRIPT (FIXED)
-- Based on W3Schools Python Tutorial Structure
-- Fixed to match actual database schema
-- =====================================================

-- First, let's update the main course with comprehensive metadata
UPDATE courses 
SET 
    title = 'Complete Python Programming Course',
    description = 'Master Python programming from basics to advanced concepts. This comprehensive course covers everything from syntax and data types to object-oriented programming, file handling, and popular libraries like NumPy, Pandas, and Django.',
    learning_objectives = ARRAY[
        'Understand Python basics including syntax, variables, and data types',
        'Master control structures: loops, conditionals, and functions',
        'Work with Python data structures: lists, tuples, sets, and dictionaries',
        'Implement object-oriented programming concepts',
        'Handle files and work with external data',
        'Use Python libraries and modules for specific tasks',
        'Build web applications with Django framework',
        'Analyze data using NumPy, Pandas, and Matplotlib',
        'Connect to databases (MySQL, MongoDB)',
        'Develop problem-solving and debugging skills'
    ],
    prerequisites = ARRAY[
        'Basic computer literacy',
        'Understanding of fundamental programming concepts (helpful but not required)',
        'Willingness to practice coding regularly'
    ],
    difficulty_level = 'beginner',
    estimated_duration_hours = 50,
    tags = ARRAY['python', 'programming', 'backend', 'data-science', 'web-development', 'oop', 'databases'],
    is_published = true,
    updated_at = NOW()
WHERE slug = 'python';

-- Clear existing modules and lessons for fresh start
DELETE FROM exercises WHERE lesson_id IN (
    SELECT l.id FROM lessons l 
    JOIN modules m ON l.module_id = m.id 
    WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'python')
);

DELETE FROM lessons WHERE module_id IN (
    SELECT id FROM modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'python')
);

DELETE FROM modules WHERE course_id = (SELECT id FROM courses WHERE slug = 'python');

-- Get the course ID for reference
DO $$
DECLARE
    course_id_var UUID;
    module1_id UUID;
    module2_id UUID;
    module3_id UUID;
    lesson_id_var UUID;
BEGIN
    -- Get course ID
    SELECT id INTO course_id_var FROM courses WHERE slug = 'python';
    
    -- =====================================================
    -- MODULE 1: PYTHON FUNDAMENTALS
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, slug, learning_objectives, prerequisites, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Python Fundamentals',
        'Get started with Python programming. Learn the basics of Python syntax, how to install Python, and write your first programs.',
        'python-fundamentals',
        ARRAY[
            'Install and set up Python development environment',
            'Understand Python syntax and basic structure',
            'Write and execute Python programs',
            'Use Python interactive shell and text editors',
            'Understand Python comments and documentation'
        ],
        ARRAY['Basic computer literacy'],
        1,
        'beginner',
        300,
        true
    ) RETURNING id INTO module1_id;

    -- Lesson 1.1: Introduction to Python
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module1_id,
        'Introduction to Python',
        'introduction-to-python',
        '# Introduction to Python

## What is Python?

Python is a popular programming language created by Guido van Rossum and released in 1991.

**Python is used for:**
- Web development (server-side)
- Software development
- Mathematics and data analysis
- System scripting
- Artificial intelligence and machine learning

## Why Python?

- **Simple syntax** similar to English language
- **Cross-platform** - runs on Windows, Mac, Linux
- **Interpreted language** - no compilation needed
- **Large standard library** and active community
- **Versatile** - suitable for beginners and professionals

## Python Syntax Compared to Other Languages

- Uses **indentation** to define code blocks (instead of curly braces)
- **No semicolons** needed at end of lines
- **Dynamic typing** - no need to declare variable types

```python
# This is a simple Python program
print("Hello, World!")
```

## What Can Python Do?

- Create web applications
- Handle big data and perform complex mathematics
- Rapid prototyping and production-ready software
- Connect to database systems and read/modify files
- System administration and automation',
        'markdown',
        ARRAY[
            'Understand what Python is and its applications',
            'Learn why Python is popular among developers',
            'Compare Python syntax with other programming languages',
            'Identify use cases for Python programming'
        ],
        ARRAY['Python History', 'Programming Language', 'Syntax', 'Applications', 'Cross-platform'],
        1,
        'beginner',
        30,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 1.1
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Your First Python Program',
        'Write a Python program that prints a welcome message to the console.',
        'your-first-python-program',
        'coding',
        'Write a Python program that prints a welcome message to the console. Use the print() function to display at least two lines of text.',
        '# Write your code here
# Print a welcome message',
        'print("Welcome to Python programming!")
print("Let''s start coding!")',
        ARRAY[
            'Use the print() function to display text',
            'Text should be enclosed in quotes',
            'You can use multiple print statements'
        ],
        'beginner',
        10,
        1,
        10,
        ARRAY['python', 'basics', 'print'],
        '[]'::jsonb,
        true
    );

    -- Lesson 1.2: Getting Started with Python
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module1_id,
        'Getting Started with Python',
        'getting-started-with-python',
        '# Getting Started with Python

## Installing Python

### Check if Python is Installed
Many computers come with Python pre-installed. To check:

**Windows/Mac/Linux:**
```bash
python --version
```

If Python is installed, you will see a version number like: `Python 3.11.0`

### Download Python
If Python is not installed, download it from: **https://python.org**

- Choose the latest version for your operating system
- Follow the installation wizard
- **Important:** Check "Add Python to PATH" during installation

## Python Development Environments

### 1. Command Line / Terminal
- Simple and direct
- Good for quick testing
- Type `python` to start interactive mode

### 2. Text Editors
- **VS Code** (recommended for beginners)
- **PyCharm** (full-featured IDE)
- **Sublime Text**
- **Atom**

### 3. Online Editors
- **W3Schools Tryit Editor**
- **Repl.it**
- **CodePen**

## Your First Python File

1. Create a new file called `hello.py`
2. Add this code:
```python
print("Hello, World!")
```
3. Save the file
4. Run it from command line:
```bash
python hello.py
```

## Python Interactive Mode

Start Python interactive mode by typing `python` in terminal:

```python
>>> print("Hello, World!")
Hello, World!
>>> 2 + 3
5
>>> exit()
```',
        'markdown',
        ARRAY[
            'Install Python on your computer',
            'Set up a Python development environment',
            'Create and run your first Python file',
            'Use Python interactive mode for testing'
        ],
        ARRAY['Installation', 'IDE', 'Text Editor', 'Command Line', 'Interactive Mode'],
        2,
        'beginner',
        45,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 1.2
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Python Environment Setup',
        'Create a Python file that displays system information and performs basic calculations.',
        'python-environment-setup',
        'coding',
        'Create a program that shows: 1. A welcome message, 2. The result of 10 + 5, 3. The result of 20 * 3, 4. A goodbye message',
        '# Create a program that shows:
# 1. A welcome message
# 2. The result of 10 + 5
# 3. The result of 20 * 3
# 4. A goodbye message',
        'print("=== Python Environment Test ===")
print("Welcome to my Python program!")
print("Calculation 1:", 10 + 5)
print("Calculation 2:", 20 * 3)
print("Python is working correctly!")
print("=== End of Program ===")',
        ARRAY[
            'Use print() to display messages',
            'You can include calculations inside print()',
            'Use commas to separate text and numbers in print()'
        ],
        'beginner',
        15,
        1,
        15,
        ARRAY['python', 'basics', 'calculations'],
        '[]'::jsonb,
        true
    );

    -- =====================================================
    -- MODULE 2: DATA TYPES AND VARIABLES
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, slug, learning_objectives, prerequisites, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Data Types and Variables',
        'Master Python data types including numbers, strings, booleans, and type conversion. Learn how to work with variables effectively.',
        'data-types-and-variables',
        ARRAY[
            'Understand Python built-in data types',
            'Work with numbers, strings, and booleans',
            'Perform type conversion and casting',
            'Use variables effectively in programs',
            'Apply string methods and formatting'
        ],
        ARRAY['Basic Python syntax'],
        2,
        'beginner',
        400,
        true
    ) RETURNING id INTO module2_id;

    -- Lesson 2.1: Python Variables and Numbers
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module2_id,
        'Python Variables and Numbers',
        'python-variables-and-numbers',
        '# Python Variables and Numbers

## Creating Variables

Variables are containers for storing data values. Python has no command for declaring variables.

```python
x = 5
y = "John"
z = 4.3
print(x)
print(y)
print(z)
```

## Variable Names

**Valid variable names:**
```python
myvar = "John"
my_var = "John"
_my_var = "John"
myVar = "John"
MYVAR = "John"
myvar2 = "John"
```

**Invalid variable names:**
```python
2myvar = "John"    # Cannot start with number
my-var = "John"    # Cannot contain hyphens
my var = "John"    # Cannot contain spaces
```

## Python Numbers

Python has three numeric types:
- **int** (integer)
- **float** (decimal number)
- **complex** (complex number)

```python
x = 1      # int
y = 2.8    # float
z = 1j     # complex

print(type(x))  # <class ''int''>
print(type(y))  # <class ''float''>
print(type(z))  # <class ''complex''>
```

## Number Operations

```python
# Basic arithmetic
a = 10
b = 3

print(a + b)    # Addition: 13
print(a - b)    # Subtraction: 7
print(a * b)    # Multiplication: 30
print(a / b)    # Division: 3.333...
print(a // b)   # Floor division: 3
print(a % b)    # Modulus: 1
print(a ** b)   # Exponentiation: 1000
```

## Type Conversion

```python
x = 1       # int
y = 2.8     # float
z = "3"     # string

# Convert to int
a = int(y)    # 2
b = int(z)    # 3

# Convert to float
c = float(x)  # 1.0
d = float(z)  # 3.0

# Convert to string
e = str(x)    # "1"
f = str(y)    # "2.8"
```',
        'markdown',
        ARRAY[
            'Create and name variables following Python conventions',
            'Understand different numeric types in Python',
            'Perform arithmetic operations with numbers',
            'Convert between different data types'
        ],
        ARRAY['Variables', 'Integers', 'Floats', 'Complex Numbers', 'Arithmetic', 'Type Conversion'],
        1,
        'beginner',
        45,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 2.1
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Number Calculator',
        'Create a simple calculator that performs various operations on two numbers.',
        'number-calculator',
        'coding',
        'Create variables for two numbers and perform calculations: addition, subtraction, multiplication, division, and modulus. Print the results with descriptive labels.',
        '# Create variables for two numbers
num1 = 15
num2 = 4

# Perform calculations and print results
# Addition, subtraction, multiplication, division, and modulus',
        '# Create variables for two numbers
num1 = 15
num2 = 4

# Perform calculations and print results
print("Number 1:", num1)
print("Number 2:", num2)
print("Addition:", num1 + num2)
print("Subtraction:", num1 - num2)
print("Multiplication:", num1 * num2)
print("Division:", num1 / num2)
print("Floor Division:", num1 // num2)
print("Modulus:", num1 % num2)
print("Exponentiation:", num1 ** num2)',
        ARRAY[
            'Use arithmetic operators: +, -, *, /, //, %, **',
            'Print descriptive labels with your results',
            'Remember that / gives float division, // gives integer division'
        ],
        'beginner',
        15,
        1,
        20,
        ARRAY['python', 'numbers', 'arithmetic', 'variables'],
        '[]'::jsonb,
        true
    );

    -- =====================================================
    -- MODULE 3: DATA STRUCTURES
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, slug, learning_objectives, prerequisites, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Data Structures',
        'Learn Python''s built-in data structures: lists, tuples, sets, and dictionaries. Master how to store, access, and manipulate collections of data.',
        'data-structures',
        ARRAY[
            'Work with Python lists for ordered collections',
            'Use tuples for immutable data sequences',
            'Manage unique collections with sets',
            'Store key-value pairs using dictionaries',
            'Choose the right data structure for different scenarios'
        ],
        ARRAY['Python variables and basic operations'],
        3,
        'beginner',
        500,
        true
    ) RETURNING id INTO module3_id;

    -- Lesson 3.1: Python Lists
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module3_id,
        'Python Lists',
        'python-lists',
        '# Python Lists

## Creating Lists

Lists store multiple items in a single variable and are ordered and changeable.

```python
# Creating lists
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]
empty_list = []

print(fruits)    # [''apple'', ''banana'', ''cherry'']
print(len(fruits))  # 3
```

## Accessing List Items

```python
fruits = ["apple", "banana", "cherry", "orange"]

# Positive indexing
print(fruits[0])    # apple
print(fruits[1])    # banana

# Negative indexing
print(fruits[-1])   # orange
print(fruits[-2])   # cherry

# Slicing
print(fruits[1:3])  # [''banana'', ''cherry'']
print(fruits[:2])   # [''apple'', ''banana'']
print(fruits[2:])   # [''cherry'', ''orange'']
```

## Modifying Lists

```python
fruits = ["apple", "banana", "cherry"]

# Change items
fruits[1] = "mango"
print(fruits)  # [''apple'', ''mango'', ''cherry'']

# Add items
fruits.append("orange")        # Add to end
fruits.insert(1, "kiwi")      # Insert at position
fruits.extend(["grape", "pear"])  # Add multiple items

print(fruits)  # [''apple'', ''kiwi'', ''mango'', ''cherry'', ''orange'', ''grape'', ''pear'']
```

## List Methods

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# Sorting
numbers.sort()          # Sort in place
print(numbers)          # [1, 1, 2, 3, 4, 5, 6, 9]

sorted_nums = sorted([3, 1, 4])  # Return new sorted list
print(sorted_nums)      # [1, 3, 4]

# Searching
fruits = ["apple", "banana", "cherry"]
print("banana" in fruits)      # True
print(fruits.index("cherry"))  # 2
print(fruits.count("apple"))   # 1

# Removing items
fruits.remove("banana")    # Remove first occurrence
last_item = fruits.pop()   # Remove and return last item
del fruits[0]              # Delete by index
fruits.clear()             # Remove all items
```

## List Comprehensions

```python
# Traditional way
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)  # [0, 4, 16, 36, 64]
```',
        'markdown',
        ARRAY[
            'Create and initialize lists with different data types',
            'Access and modify list elements using indexing',
            'Use list methods for adding, removing, and organizing data',
            'Write list comprehensions for efficient data processing'
        ],
        ARRAY['List Creation', 'Indexing', 'Slicing', 'List Methods', 'Sorting', 'List Comprehensions'],
        1,
        'beginner',
        60,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 3.1
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Shopping List Manager',
        'Create a program that manages a shopping list with various operations.',
        'shopping-list-manager',
        'coding',
        'Create a shopping list manager that: 1. Adds "butter" to the list, 2. Inserts "cheese" at position 1, 3. Removes "bread" from the list, 4. Sorts the list alphabetically, 5. Prints the final list and its length',
        '# Create a shopping list manager
shopping_list = ["milk", "bread", "eggs"]

# Add your code here to:
# 1. Add "butter" to the list
# 2. Insert "cheese" at position 1
# 3. Remove "bread" from the list
# 4. Sort the list alphabetically
# 5. Print the final list and its length',
        '# Create a shopping list manager
shopping_list = ["milk", "bread", "eggs"]

print("Original list:", shopping_list)

# 1. Add "butter" to the list
shopping_list.append("butter")
print("After adding butter:", shopping_list)

# 2. Insert "cheese" at position 1
shopping_list.insert(1, "cheese")
print("After inserting cheese:", shopping_list)

# 3. Remove "bread" from the list
shopping_list.remove("bread")
print("After removing bread:", shopping_list)

# 4. Sort the list alphabetically
shopping_list.sort()
print("After sorting:", shopping_list)

# 5. Print the final list and its length
print("Final shopping list:", shopping_list)
print("Number of items:", len(shopping_list))',
        ARRAY[
            'Use append() to add items to the end',
            'Use insert() to add items at specific positions',
            'Use remove() to delete items by value',
            'Use sort() to arrange items alphabetically'
        ],
        'beginner',
        25,
        1,
        25,
        ARRAY['python', 'lists', 'data-structures'],
        '[]'::jsonb,
        true
    );

END $$;
