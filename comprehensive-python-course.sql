-- =====================================================
-- COMPREHENSIVE PYTHON COURSE POPULATION SCRIPT
-- Based on W3Schools Python Tutorial Structure
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
    module4_id UUID;
    module5_id UUID;
    module6_id UUID;
    module7_id UUID;
    module8_id UUID;
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

    -- Continue with more lessons...
    -- Lesson 1.3: Python Syntax
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module1_id,
        'Python Syntax',
        'python-syntax',
        '# Python Syntax

## Python Indentation

Python uses **indentation** to indicate a block of code. Other languages use curly braces `{}`.

```python
# Correct indentation
if 5 > 2:
    print("Five is greater than two!")
```

```python
# Incorrect indentation (will cause error)
if 5 > 2:
print("Five is greater than two!")  # IndentationError
```

**Rules for Indentation:**
- Use **4 spaces** (recommended) or **1 tab**
- Be consistent throughout your program
- All lines in the same block must have the same indentation

## Python Variables

Variables are created when you assign a value:

```python
x = 5
y = "Hello"
print(x)
print(y)
```

**Variable Rules:**
- Must start with letter or underscore
- Cannot start with a number
- Can contain letters, numbers, and underscores
- Case-sensitive (`age` and `Age` are different)

## Comments

Comments start with `#` and are ignored by Python:

```python
# This is a comment
print("Hello, World!")  # This is also a comment

# You can use comments to explain code
# or to prevent execution of code
```

## Python Keywords

Python has reserved words that cannot be used as variable names:

```
and, as, assert, break, class, continue, def, del, elif, else, 
except, False, finally, for, from, global, if, import, in, 
is, lambda, None, nonlocal, not, or, pass, raise, return, 
True, try, while, with, yield
```

## Case Sensitivity

Python is case-sensitive:

```python
a = 4
A = "Sally"
# a and A are different variables
```',
        'markdown',
        ARRAY[
            'Understand Python indentation rules',
            'Learn variable naming conventions',
            'Use comments effectively in code',
            'Recognize Python keywords and case sensitivity'
        ],
        ARRAY['Indentation', 'Variables', 'Comments', 'Keywords', 'Case Sensitivity'],
        3,
        'beginner',
        40,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 1.3
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Python Syntax Practice',
        'Practice Python syntax by creating variables, using proper indentation, and adding comments.',
        'python-syntax-practice',
        'coding',
        'Fix the syntax errors in the provided code and add meaningful comments to explain what each part does.',
        '# Fix the syntax errors in this code and add comments

name = "Alice"
age = 25
if age >= 18:
print("Adult")  # Fix indentation
else:
print("Minor")  # Fix indentation

# Add a comment explaining what this code does',
        '# This program checks if a person is an adult or minor based on age
name = "Alice"  # Store the person''s name
age = 25       # Store the person''s age

# Check if the person is 18 or older
if age >= 18:
    print("Adult")    # Print "Adult" if 18 or older
else:
    print("Minor")    # Print "Minor" if under 18',
        ARRAY[
            'Use 4 spaces for indentation inside if/else blocks',
            'Add meaningful comments to explain your code',
            'Make sure all lines in the same block have the same indentation'
        ],
        'beginner',
        20,
        1,
        20,
        ARRAY['python', 'syntax', 'indentation', 'comments'],
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
    INSERT INTO lessons (id, module_id, title, content, learning_objectives, key_concepts, order_index, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        module2_id,
        'Python Variables and Numbers',
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
        ARRAY[
            'Create and name variables following Python conventions',
            'Understand different numeric types in Python',
            'Perform arithmetic operations with numbers',
            'Convert between different data types'
        ],
        ARRAY['Variables', 'Integers', 'Floats', 'Complex Numbers', 'Arithmetic', 'Type Conversion'],
        1,
        '45 minutes',
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 2.1
    INSERT INTO exercises (id, lesson_id, title, description, starter_code, solution_code, hints, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Number Calculator',
        'Create a simple calculator that performs various operations on two numbers.',
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
        '15 minutes',
        true
    );

    -- Lesson 2.2: Python Strings
    INSERT INTO lessons (id, module_id, title, content, learning_objectives, key_concepts, order_index, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        module2_id,
        'Python Strings',
        '# Python Strings

## Creating Strings

Strings are surrounded by quotes (single or double):

```python
name = "Alice"
message = ''Hello World''
multiline = """This is a
multiline string"""
```

## String Indexing and Slicing

```python
text = "Hello World"

# Indexing (starts at 0)
print(text[0])    # H
print(text[6])    # W
print(text[-1])   # d (last character)

# Slicing
print(text[0:5])   # Hello
print(text[6:])    # World
print(text[:5])    # Hello
print(text[::2])   # HloWrd (every 2nd character)
```

## String Methods

```python
text = "  Hello World  "

# Case methods
print(text.upper())      # "  HELLO WORLD  "
print(text.lower())      # "  hello world  "
print(text.title())      # "  Hello World  "
print(text.capitalize()) # "  hello world  "

# Whitespace methods
print(text.strip())      # "Hello World"
print(text.lstrip())     # "Hello World  "
print(text.rstrip())     # "  Hello World"

# Search and replace
print(text.find("World"))     # 8
print(text.replace("World", "Python"))  # "  Hello Python  "

# Split and join
words = "apple,banana,cherry".split(",")
print(words)  # [''apple'', ''banana'', ''cherry'']
print("-".join(words))  # "apple-banana-cherry"
```

## String Formatting

```python
name = "Alice"
age = 25

# f-strings (Python 3.6+)
message = f"My name is {name} and I am {age} years old"
print(message)

# .format() method
message = "My name is {} and I am {} years old".format(name, age)
print(message)

# % formatting (older style)
message = "My name is %s and I am %d years old" % (name, age)
print(message)
```

## Escape Characters

```python
# Common escape characters
print("She said \"Hello\"")     # She said "Hello"
print("Line 1\nLine 2")         # Two lines
print("Column 1\tColumn 2")     # Tab separation
print("Path: C:\\Users\\Name")  # Backslash
```',
        ARRAY[
            'Create and manipulate strings in Python',
            'Use string indexing and slicing effectively',
            'Apply common string methods for text processing',
            'Format strings using different techniques'
        ],
        ARRAY['String Creation', 'Indexing', 'Slicing', 'String Methods', 'Formatting', 'Escape Characters'],
        2,
        '50 minutes',
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 2.2
    INSERT INTO exercises (id, lesson_id, title, description, starter_code, solution_code, hints, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Text Processor',
        'Create a program that processes user information and formats it nicely.',
        '# Process this user information
first_name = "  john  "
last_name = "  DOE  "
email = "JOHN.DOE@EMAIL.COM"
age = 28

# Clean and format the data, then create a formatted message',
        '# Process this user information
first_name = "  john  "
last_name = "  DOE  "
email = "JOHN.DOE@EMAIL.COM"
age = 28

# Clean and format the data
first_name = first_name.strip().title()
last_name = last_name.strip().title()
email = email.lower()
full_name = f"{first_name} {last_name}"

# Create formatted messages
print("=== User Information ===")
print(f"Full Name: {full_name}")
print(f"Email: {email}")
print(f"Age: {age}")
print(f"Initials: {first_name[0]}.{last_name[0]}.")
print(f"Username: {first_name.lower()}{last_name.lower()}")
print("========================")',
        ARRAY[
            'Use strip() to remove whitespace',
            'Use title() and lower() for proper formatting',
            'Use f-strings for clean string formatting',
            'Access string characters with indexing [0]'
        ],
        'beginner',
        '20 minutes',
        true
    );

    -- =====================================================
    -- MODULE 3: DATA STRUCTURES
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Data Structures',
        'Learn Python''s built-in data structures: lists, tuples, sets, and dictionaries. Master how to store, access, and manipulate collections of data.',
        ARRAY[
            'Work with Python lists for ordered collections',
            'Use tuples for immutable data sequences',
            'Manage unique collections with sets',
            'Store key-value pairs using dictionaries',
            'Choose the right data structure for different scenarios'
        ],
        ARRAY['Lists', 'Tuples', 'Sets', 'Dictionaries', 'Indexing', 'Methods', 'Comprehensions'],
        3,
        'beginner',
        '8-10 hours',
        true
    ) RETURNING id INTO module3_id;

    -- Lesson 3.1: Python Lists
    INSERT INTO lessons (id, module_id, title, content, learning_objectives, key_concepts, order_index, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        module3_id,
        'Python Lists',
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
        ARRAY[
            'Create and initialize lists with different data types',
            'Access and modify list elements using indexing',
            'Use list methods for adding, removing, and organizing data',
            'Write list comprehensions for efficient data processing'
        ],
        ARRAY['List Creation', 'Indexing', 'Slicing', 'List Methods', 'Sorting', 'List Comprehensions'],
        1,
        '60 minutes',
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 3.1
    INSERT INTO exercises (id, lesson_id, title, description, starter_code, solution_code, hints, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Shopping List Manager',
        'Create a program that manages a shopping list with various operations.',
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
        '25 minutes',
        true
    );

    -- =====================================================
    -- MODULE 4: CONTROL STRUCTURES
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Control Structures',
        'Master Python control flow with conditional statements, loops, and logical operators. Learn to make decisions and repeat actions in your programs.',
        ARRAY[
            'Use if, elif, and else statements for decision making',
            'Implement for and while loops for repetition',
            'Apply logical and comparison operators',
            'Control loop execution with break and continue',
            'Handle nested control structures effectively'
        ],
        ARRAY['If Statements', 'Loops', 'Logical Operators', 'Break/Continue', 'Nested Structures'],
        4,
        'intermediate',
        '6-8 hours',
        true
    ) RETURNING id INTO module4_id;

    -- Lesson 4.1: Conditional Statements
    INSERT INTO lessons (id, module_id, title, content, learning_objectives, key_concepts, order_index, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        module4_id,
        'Conditional Statements',
        '# Conditional Statements

## If Statements

Python uses `if` statements to make decisions in code:

```python
age = 18

if age >= 18:
    print("You are an adult")
    print("You can vote")
```

## If-Else Statements

```python
age = 16

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")
```

## If-Elif-Else Statements

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")
```

## Comparison Operators

```python
x = 10
y = 5

print(x == y)   # Equal: False
print(x != y)   # Not equal: True
print(x > y)    # Greater than: True
print(x < y)    # Less than: False
print(x >= y)   # Greater than or equal: True
print(x <= y)   # Less than or equal: False
```

## Logical Operators

```python
age = 25
has_license = True

# AND operator
if age >= 18 and has_license:
    print("Can drive")

# OR operator
if age < 16 or not has_license:
    print("Cannot drive alone")

# NOT operator
if not has_license:
    print("Need to get a license")
```

## Nested If Statements

```python
weather = "sunny"
temperature = 75

if weather == "sunny":
    if temperature > 70:
        print("Perfect day for the beach!")
    else:
        print("Sunny but a bit cold")
else:
    print("Not a sunny day")
```

## Short Hand If

```python
# One line if statement
if a > b: print("a is greater than b")

# Ternary operator (conditional expression)
result = "positive" if x > 0 else "negative or zero"
print(result)
```',
        ARRAY[
            'Write conditional statements using if, elif, and else',
            'Use comparison operators to evaluate conditions',
            'Combine conditions with logical operators',
            'Implement nested conditional structures'
        ],
        ARRAY['If Statements', 'Comparison Operators', 'Logical Operators', 'Nested Conditions', 'Ternary Operator'],
        1,
        '50 minutes',
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 4.1
    INSERT INTO exercises (id, lesson_id, title, description, starter_code, solution_code, hints, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Grade Calculator',
        'Create a program that calculates letter grades based on numeric scores with additional criteria.',
        '# Grade Calculator
# Create a program that determines letter grades based on:
# - Score >= 90: A
# - Score >= 80: B
# - Score >= 70: C
# - Score >= 60: D
# - Score < 60: F
# Also check if the student has perfect attendance (bonus points)

score = 87
perfect_attendance = True

# Add your code here',
        '# Grade Calculator
score = 87
perfect_attendance = True

# Apply bonus for perfect attendance
if perfect_attendance:
    score += 2
    print(f"Bonus applied! New score: {score}")

# Determine letter grade
if score >= 90:
    grade = "A"
    message = "Excellent work!"
elif score >= 80:
    grade = "B"
    message = "Good job!"
elif score >= 70:
    grade = "C"
    message = "Satisfactory"
elif score >= 60:
    grade = "D"
    message = "Needs improvement"
else:
    grade = "F"
    message = "Please see instructor"

# Display results
print(f"Final Score: {score}")
print(f"Letter Grade: {grade}")
print(f"Comment: {message}")

# Additional feedback
if grade in ["A", "B"]:
    print("Great job! Keep up the good work!")
elif grade == "C":
    print("You''re doing okay, but there''s room for improvement.")
else:
    print("Consider getting extra help or tutoring.")',
        ARRAY[
            'Use if-elif-else for multiple conditions',
            'Apply logical operators for complex conditions',
            'Use the "in" operator to check membership in lists',
            'Combine conditions with and/or operators'
        ],
        'intermediate',
        '30 minutes',
        true
    );

    -- =====================================================
    -- MODULE 5: FUNCTIONS AND MODULES
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Functions and Modules',
        'Learn to write reusable code with functions, understand scope, and organize code using modules and packages.',
        ARRAY[
            'Define and call functions with parameters',
            'Use return statements and default parameters',
            'Understand variable scope and lifetime',
            'Create and import custom modules',
            'Work with Python standard library modules'
        ],
        ARRAY['Function Definition', 'Parameters', 'Return Values', 'Scope', 'Modules', 'Packages'],
        5,
        'intermediate',
        '8-10 hours',
        true
    ) RETURNING id INTO module5_id;

    -- Lesson 5.1: Python Functions
    INSERT INTO lessons (id, module_id, title, content, learning_objectives, key_concepts, order_index, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        module5_id,
        'Python Functions',
        '# Python Functions

## Defining Functions

A function is a block of code that runs when called:

```python
def greet():
    print("Hello, World!")

# Call the function
greet()  # Output: Hello, World!
```

## Functions with Parameters

```python
def greet_person(name):
    print(f"Hello, {name}!")

def add_numbers(a, b):
    result = a + b
    print(f"{a} + {b} = {result}")

# Call functions with arguments
greet_person("Alice")     # Hello, Alice!
add_numbers(5, 3)         # 5 + 3 = 8
```

## Return Values

```python
def multiply(x, y):
    return x * y

def get_full_name(first, last):
    return f"{first} {last}"

# Use return values
result = multiply(4, 5)
print(result)  # 20

name = get_full_name("John", "Doe")
print(name)    # John Doe
```

## Default Parameters

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))              # Hello, Alice!
print(greet("Bob", "Hi"))          # Hi, Bob!
print(greet("Charlie", "Good morning"))  # Good morning, Charlie!
```

## Keyword Arguments

```python
def create_profile(name, age, city="Unknown"):
    return f"Name: {name}, Age: {age}, City: {city}"

# Positional arguments
print(create_profile("Alice", 25))

# Keyword arguments
print(create_profile(name="Bob", age=30, city="New York"))
print(create_profile(age=28, name="Charlie"))  # Order doesn''t matter
```

## Variable-Length Arguments

```python
# *args for variable positional arguments
def sum_all(*numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_all(1, 2, 3))        # 6
print(sum_all(1, 2, 3, 4, 5))  # 15

# **kwargs for variable keyword arguments
def print_info(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="Boston")
```

## Lambda Functions

```python
# Lambda (anonymous) functions
square = lambda x: x ** 2
add = lambda x, y: x + y

print(square(5))    # 25
print(add(3, 4))    # 7

# Lambda with built-in functions
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4]
```',
        ARRAY[
            'Define functions with and without parameters',
            'Use return statements to output values from functions',
            'Apply default parameters and keyword arguments',
            'Create lambda functions for simple operations'
        ],
        ARRAY['Function Definition', 'Parameters', 'Return Values', 'Default Parameters', 'Lambda Functions'],
        1,
        '60 minutes',
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 5.1
    INSERT INTO exercises (id, lesson_id, title, description, starter_code, solution_code, hints, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Function Library',
        'Create a collection of useful functions for common calculations and operations.',
        '# Create a function library with the following functions:
# 1. calculate_area(length, width) - returns area of rectangle
# 2. is_even(number) - returns True if number is even
# 3. get_grade(score, bonus=0) - returns letter grade with optional bonus
# 4. format_name(first, last, middle="") - returns formatted full name

# Test your functions with sample data',
        '# Function library
def calculate_area(length, width):
    """Calculate the area of a rectangle."""
    return length * width

def is_even(number):
    """Check if a number is even."""
    return number % 2 == 0

def get_grade(score, bonus=0):
    """Calculate letter grade with optional bonus points."""
    total_score = score + bonus
    if total_score >= 90:
        return "A"
    elif total_score >= 80:
        return "B"
    elif total_score >= 70:
        return "C"
    elif total_score >= 60:
        return "D"
    else:
        return "F"

def format_name(first, last, middle=""):
    """Format a full name with optional middle name."""
    if middle:
        return f"{first} {middle} {last}"
    else:
        return f"{first} {last}"

# Test the functions
print("=== Function Library Tests ===")

# Test calculate_area
area = calculate_area(10, 5)
print(f"Area of 10x5 rectangle: {area}")

# Test is_even
print(f"Is 8 even? {is_even(8)}")
print(f"Is 7 even? {is_even(7)}")

# Test get_grade
print(f"Grade for 85: {get_grade(85)}")
print(f"Grade for 75 with 5 bonus: {get_grade(75, 5)}")

# Test format_name
print(f"Name 1: {format_name(''John'', ''Doe'')}")
print(f"Name 2: {format_name(''Jane'', ''Smith'', ''Marie'')}")

print("=== All tests completed ===")',
        ARRAY[
            'Use def keyword to define functions',
            'Include docstrings to document your functions',
            'Use default parameters for optional arguments',
            'Test your functions with different inputs'
        ],
        'intermediate',
        '35 minutes',
        true
    );

    -- =====================================================
    -- MODULE 6: OBJECT-ORIENTED PROGRAMMING
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Object-Oriented Programming',
        'Master object-oriented programming concepts in Python including classes, objects, inheritance, and polymorphism.',
        ARRAY[
            'Create classes and instantiate objects',
            'Implement constructors and instance methods',
            'Use inheritance to create class hierarchies',
            'Apply encapsulation and data hiding principles',
            'Understand polymorphism and method overriding'
        ],
        ARRAY['Classes', 'Objects', 'Constructors', 'Inheritance', 'Encapsulation', 'Polymorphism'],
        6,
        'intermediate',
        '10-12 hours',
        true
    ) RETURNING id INTO module6_id;

    -- Lesson 6.1: Classes and Objects
    INSERT INTO lessons (id, module_id, title, content, learning_objectives, key_concepts, order_index, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        module6_id,
        'Classes and Objects',
        '# Classes and Objects

## Creating a Class

A class is a blueprint for creating objects:

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        return f"Hi, I''m {self.name} and I''m {self.age} years old"

    def have_birthday(self):
        self.age += 1
        return f"Happy birthday! {self.name} is now {self.age}"
```

## Creating Objects

```python
# Create objects (instances) of the Person class
person1 = Person("Alice", 25)
person2 = Person("Bob", 30)

# Access attributes
print(person1.name)  # Alice
print(person2.age)   # 30

# Call methods
print(person1.introduce())  # Hi, I''m Alice and I''m 25 years old
print(person2.have_birthday())  # Happy birthday! Bob is now 31
```

## Class vs Instance Variables

```python
class Car:
    # Class variable (shared by all instances)
    wheels = 4

    def __init__(self, make, model, year):
        # Instance variables (unique to each instance)
        self.make = make
        self.model = model
        self.year = year
        self.mileage = 0

    def drive(self, miles):
        self.mileage += miles
        return f"Drove {miles} miles. Total: {self.mileage}"

    def get_info(self):
        return f"{self.year} {self.make} {self.model}"

# Create car objects
car1 = Car("Toyota", "Camry", 2020)
car2 = Car("Honda", "Civic", 2019)

print(car1.get_info())  # 2020 Toyota Camry
print(car2.drive(100))  # Drove 100 miles. Total: 100
print(Car.wheels)       # 4 (accessing class variable)
```

## Private Attributes and Methods

```python
class BankAccount:
    def __init__(self, account_number, initial_balance=0):
        self.account_number = account_number
        self.__balance = initial_balance  # Private attribute

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f"Deposited ${amount}. New balance: ${self.__balance}"
        return "Invalid deposit amount"

    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return f"Withdrew ${amount}. New balance: ${self.__balance}"
        return "Insufficient funds or invalid amount"

    def get_balance(self):
        return self.__balance

    def __str__(self):
        return f"Account {self.account_number}: ${self.__balance}"

# Create and use bank account
account = BankAccount("12345", 1000)
print(account.deposit(500))   # Deposited $500. New balance: $1500
print(account.withdraw(200))  # Withdrew $200. New balance: $1300
print(account)                # Account 12345: $1300

# This would cause an error (private attribute):
# print(account.__balance)
```',
        ARRAY[
            'Define classes with attributes and methods',
            'Create and use object instances',
            'Understand the difference between class and instance variables',
            'Implement data encapsulation with private attributes'
        ],
        ARRAY['Class Definition', 'Objects', 'Constructor', 'Instance Variables', 'Methods', 'Encapsulation'],
        1,
        '70 minutes',
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 6.1
    INSERT INTO exercises (id, lesson_id, title, description, starter_code, solution_code, hints, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Student Management System',
        'Create a Student class to manage student information and grades.',
        '# Create a Student class with the following features:
# - Constructor that takes name and student_id
# - Method to add grades
# - Method to calculate average grade
# - Method to get student info
# - Private attribute for grades list

class Student:
    # Add your code here
    pass

# Test your class
student1 = Student("Alice Johnson", "S001")
# Add some test code',
        'class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.__grades = []  # Private attribute

    def add_grade(self, grade):
        """Add a grade to the student''s record."""
        if 0 <= grade <= 100:
            self.__grades.append(grade)
            return f"Grade {grade} added for {self.name}"
        else:
            return "Invalid grade. Must be between 0 and 100."

    def calculate_average(self):
        """Calculate the average of all grades."""
        if not self.__grades:
            return 0
        return sum(self.__grades) / len(self.__grades)

    def get_letter_grade(self):
        """Get letter grade based on average."""
        avg = self.calculate_average()
        if avg >= 90:
            return "A"
        elif avg >= 80:
            return "B"
        elif avg >= 70:
            return "C"
        elif avg >= 60:
            return "D"
        else:
            return "F"

    def get_info(self):
        """Get complete student information."""
        avg = self.calculate_average()
        letter = self.get_letter_grade()
        return f"Student: {self.name} (ID: {self.student_id})\\nGrades: {self.__grades}\\nAverage: {avg:.1f} ({letter})"

    def __str__(self):
        return f"{self.name} - Average: {self.calculate_average():.1f}"

# Test the Student class
print("=== Student Management System ===")

student1 = Student("Alice Johnson", "S001")
student2 = Student("Bob Smith", "S002")

# Add grades
print(student1.add_grade(85))
print(student1.add_grade(92))
print(student1.add_grade(78))

print(student2.add_grade(88))
print(student2.add_grade(91))

# Display information
print("\\n--- Student Information ---")
print(student1.get_info())
print("\\n" + student2.get_info())

print("\\n--- Quick Summary ---")
print(student1)
print(student2)',
        ARRAY[
            'Use __init__ method as constructor',
            'Create private attributes with double underscore __',
            'Implement methods that work with instance data',
            'Use __str__ method for string representation'
        ],
        'intermediate',
        '40 minutes',
        true
    );

    -- =====================================================
    -- MODULE 7: FILE HANDLING AND DATA PROCESSING
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'File Handling and Data Processing',
        'Learn to work with files, handle exceptions, and process data from external sources including CSV and JSON files.',
        ARRAY[
            'Read from and write to text files',
            'Handle file exceptions and errors gracefully',
            'Process CSV and JSON data formats',
            'Implement proper file handling with context managers',
            'Parse and manipulate structured data'
        ],
        ARRAY['File I/O', 'Exception Handling', 'CSV Processing', 'JSON Data', 'Context Managers'],
        7,
        'intermediate',
        '6-8 hours',
        true
    ) RETURNING id INTO module7_id;

    -- Lesson 7.1: File Operations
    INSERT INTO lessons (id, module_id, title, content, learning_objectives, key_concepts, order_index, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        module7_id,
        'File Operations',
        '# File Operations

## Reading Files

```python
# Method 1: Basic file reading
file = open("example.txt", "r")
content = file.read()
print(content)
file.close()

# Method 2: Reading line by line
file = open("example.txt", "r")
for line in file:
    print(line.strip())  # strip() removes newline characters
file.close()

# Method 3: Read all lines into a list
file = open("example.txt", "r")
lines = file.readlines()
file.close()
print(lines)
```

## Writing Files

```python
# Writing to a file (overwrites existing content)
file = open("output.txt", "w")
file.write("Hello, World!\\n")
file.write("This is a new line.\\n")
file.close()

# Appending to a file
file = open("output.txt", "a")
file.write("This line is appended.\\n")
file.close()
```

## Using Context Managers (Recommended)

```python
# Context manager automatically closes the file
with open("example.txt", "r") as file:
    content = file.read()
    print(content)
# File is automatically closed here

# Writing with context manager
with open("output.txt", "w") as file:
    file.write("Hello from context manager!\\n")
    file.write("This is much safer.\\n")
```

## File Modes

```python
# Common file modes:
# "r" - Read (default)
# "w" - Write (overwrites existing file)
# "a" - Append
# "x" - Create (fails if file exists)
# "r+" - Read and write
# "b" - Binary mode (e.g., "rb", "wb")

# Example with different modes
with open("data.txt", "w") as file:
    file.write("Initial content\\n")

with open("data.txt", "a") as file:
    file.write("Appended content\\n")

with open("data.txt", "r") as file:
    print(file.read())
```

## Exception Handling with Files

```python
try:
    with open("nonexistent.txt", "r") as file:
        content = file.read()
        print(content)
except FileNotFoundError:
    print("File not found!")
except PermissionError:
    print("Permission denied!")
except Exception as e:
    print(f"An error occurred: {e}")
```

## Working with File Paths

```python
import os

# Check if file exists
if os.path.exists("example.txt"):
    print("File exists")
else:
    print("File does not exist")

# Get file information
if os.path.exists("example.txt"):
    size = os.path.getsize("example.txt")
    print(f"File size: {size} bytes")

# Create directories
os.makedirs("data/processed", exist_ok=True)

# List files in directory
files = os.listdir(".")
print("Files in current directory:", files)
```',
        ARRAY[
            'Open, read, and write files using different modes',
            'Use context managers for safe file handling',
            'Handle file-related exceptions properly',
            'Work with file paths and directory operations'
        ],
        ARRAY['File Reading', 'File Writing', 'Context Managers', 'Exception Handling', 'File Paths'],
        1,
        '50 minutes',
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 7.1
    INSERT INTO exercises (id, lesson_id, title, description, starter_code, solution_code, hints, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Log File Analyzer',
        'Create a program that analyzes log files and generates a summary report.',
        '# Log File Analyzer
# Create a program that:
# 1. Reads a log file (create a sample log file first)
# 2. Counts different types of log entries (INFO, WARNING, ERROR)
# 3. Writes a summary report to a new file

# Sample log data to create a test file:
sample_logs = [
    "2024-01-01 10:00:00 INFO User logged in",
    "2024-01-01 10:05:00 WARNING Low disk space",
    "2024-01-01 10:10:00 ERROR Database connection failed",
    "2024-01-01 10:15:00 INFO User logged out",
    "2024-01-01 10:20:00 ERROR File not found"
]

# Your code here',
        '# Log File Analyzer
import os
from datetime import datetime

# Sample log data to create a test file
sample_logs = [
    "2024-01-01 10:00:00 INFO User logged in",
    "2024-01-01 10:05:00 WARNING Low disk space",
    "2024-01-01 10:10:00 ERROR Database connection failed",
    "2024-01-01 10:15:00 INFO User logged out",
    "2024-01-01 10:20:00 ERROR File not found",
    "2024-01-01 10:25:00 INFO System backup completed",
    "2024-01-01 10:30:00 WARNING Memory usage high",
    "2024-01-01 10:35:00 ERROR Network timeout"
]

def create_sample_log():
    """Create a sample log file for testing."""
    with open("system.log", "w") as file:
        for log_entry in sample_logs:
            file.write(log_entry + "\\n")
    print("Sample log file created: system.log")

def analyze_log_file(filename):
    """Analyze log file and return statistics."""
    stats = {"INFO": 0, "WARNING": 0, "ERROR": 0, "TOTAL": 0}

    try:
        with open(filename, "r") as file:
            for line in file:
                line = line.strip()
                if line:  # Skip empty lines
                    stats["TOTAL"] += 1
                    if "INFO" in line:
                        stats["INFO"] += 1
                    elif "WARNING" in line:
                        stats["WARNING"] += 1
                    elif "ERROR" in line:
                        stats["ERROR"] += 1

        return stats

    except FileNotFoundError:
        print(f"Error: File ''{filename}'' not found.")
        return None
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

def generate_report(stats, output_file):
    """Generate a summary report."""
    if not stats:
        return

    try:
        with open(output_file, "w") as file:
            file.write("=== LOG ANALYSIS REPORT ===\\n")
            file.write(f"Generated on: {datetime.now().strftime(''%Y-%m-%d %H:%M:%S'')}\\n\\n")

            file.write("Log Entry Statistics:\\n")
            file.write(f"Total Entries: {stats[''TOTAL'']}\\n")
            file.write(f"INFO Messages: {stats[''INFO'']}\\n")
            file.write(f"WARNING Messages: {stats[''WARNING'']}\\n")
            file.write(f"ERROR Messages: {stats[''ERROR'']}\\n\\n")

            # Calculate percentages
            if stats["TOTAL"] > 0:
                file.write("Percentage Breakdown:\\n")
                for level in ["INFO", "WARNING", "ERROR"]:
                    percentage = (stats[level] / stats["TOTAL"]) * 100
                    file.write(f"{level}: {percentage:.1f}%\\n")

            file.write("\\n=== END OF REPORT ===\\n")

        print(f"Report generated: {output_file}")

    except Exception as e:
        print(f"Error generating report: {e}")

# Main program
print("=== Log File Analyzer ===")

# Step 1: Create sample log file
create_sample_log()

# Step 2: Analyze the log file
print("\\nAnalyzing log file...")
stats = analyze_log_file("system.log")

if stats:
    print("\\nAnalysis Results:")
    print(f"Total entries: {stats[''TOTAL'']}")
    print(f"INFO: {stats[''INFO'']}")
    print(f"WARNING: {stats[''WARNING'']}")
    print(f"ERROR: {stats[''ERROR'']}")

    # Step 3: Generate report
    generate_report(stats, "log_analysis_report.txt")

    print("\\nAnalysis complete! Check log_analysis_report.txt for detailed report.")
else:
    print("Analysis failed.")',
        ARRAY[
            'Use context managers (with statement) for file operations',
            'Handle exceptions when working with files',
            'Process text data line by line',
            'Create formatted output files'
        ],
        'intermediate',
        '35 minutes',
        true
    );

    -- =====================================================
    -- MODULE 8: PYTHON LIBRARIES AND FRAMEWORKS
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Python Libraries and Frameworks',
        'Explore Python''s rich ecosystem of libraries and frameworks including NumPy for numerical computing, Pandas for data analysis, and Django for web development.',
        ARRAY[
            'Use NumPy for numerical computations and arrays',
            'Analyze data with Pandas DataFrames',
            'Build web applications using Django framework',
            'Install and manage packages with pip',
            'Understand when to use different libraries'
        ],
        ARRAY['NumPy', 'Pandas', 'Django', 'Package Management', 'Data Analysis', 'Web Development'],
        8,
        'advanced',
        '12-15 hours',
        true
    ) RETURNING id INTO module8_id;

    -- Lesson 8.1: Introduction to NumPy
    INSERT INTO lessons (id, module_id, title, content, learning_objectives, key_concepts, order_index, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        module8_id,
        'Introduction to NumPy',
        '# Introduction to NumPy

## What is NumPy?

NumPy (Numerical Python) is a library for scientific computing that provides:
- Powerful N-dimensional array objects
- Mathematical functions for arrays
- Tools for integrating with C/C++ and Fortran code
- Linear algebra, Fourier transform, and random number capabilities

## Installing NumPy

```bash
pip install numpy
```

## Creating NumPy Arrays

```python
import numpy as np

# From Python lists
arr1 = np.array([1, 2, 3, 4, 5])
print(arr1)  # [1 2 3 4 5]

# 2D array
arr2 = np.array([[1, 2, 3], [4, 5, 6]])
print(arr2)
# [[1 2 3]
#  [4 5 6]]

# Array properties
print(f"Shape: {arr2.shape}")      # (2, 3)
print(f"Size: {arr2.size}")        # 6
print(f"Data type: {arr2.dtype}")  # int64
```

## Array Creation Functions

```python
# Create arrays with specific values
zeros = np.zeros((3, 4))        # 3x4 array of zeros
ones = np.ones((2, 3))          # 2x3 array of ones
full = np.full((2, 2), 7)       # 2x2 array filled with 7

# Create ranges
range_arr = np.arange(0, 10, 2)    # [0 2 4 6 8]
linspace_arr = np.linspace(0, 1, 5)  # [0.   0.25 0.5  0.75 1.  ]

# Random arrays
random_arr = np.random.random((2, 3))  # Random values between 0 and 1
random_int = np.random.randint(1, 10, (3, 3))  # Random integers
```

## Array Operations

```python
arr = np.array([1, 2, 3, 4, 5])

# Mathematical operations (element-wise)
print(arr + 10)      # [11 12 13 14 15]
print(arr * 2)       # [2 4 6 8 10]
print(arr ** 2)      # [1 4 9 16 25]
print(np.sqrt(arr))  # [1. 1.414 1.732 2. 2.236]

# Array operations
arr1 = np.array([1, 2, 3])
arr2 = np.array([4, 5, 6])

print(arr1 + arr2)   # [5 7 9]
print(arr1 * arr2)   # [4 10 18]
```

## Array Indexing and Slicing

```python
arr = np.array([[1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12]])

# Basic indexing
print(arr[0, 1])     # 2 (first row, second column)
print(arr[1])        # [5 6 7 8] (entire second row)

# Slicing
print(arr[:2, 1:3])  # First 2 rows, columns 1-2
# [[2 3]
#  [6 7]]

# Boolean indexing
mask = arr > 5
print(arr[mask])     # [6 7 8 9 10 11 12]
```

## Useful NumPy Functions

```python
data = np.array([[1, 2, 3],
                 [4, 5, 6],
                 [7, 8, 9]])

# Statistical functions
print(np.mean(data))      # 5.0
print(np.median(data))    # 5.0
print(np.std(data))       # 2.58
print(np.sum(data))       # 45
print(np.min(data))       # 1
print(np.max(data))       # 9

# Axis-specific operations
print(np.sum(data, axis=0))  # [12 15 18] (sum of columns)
print(np.sum(data, axis=1))  # [6 15 24] (sum of rows)
```',
        ARRAY[
            'Create and manipulate NumPy arrays',
            'Perform mathematical operations on arrays',
            'Use array indexing and slicing techniques',
            'Apply statistical functions to numerical data'
        ],
        ARRAY['NumPy Arrays', 'Array Creation', 'Mathematical Operations', 'Indexing', 'Statistical Functions'],
        1,
        '60 minutes',
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 8.1
    INSERT INTO exercises (id, lesson_id, title, description, starter_code, solution_code, hints, difficulty_level, estimated_duration, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Data Analysis with NumPy',
        'Use NumPy to analyze student test scores and generate statistics.',
        '# Data Analysis with NumPy
# Analyze student test scores using NumPy arrays

import numpy as np

# Student test scores (rows = students, columns = tests)
scores = [
    [85, 92, 78, 88],  # Student 1
    [76, 85, 90, 82],  # Student 2
    [92, 88, 85, 91],  # Student 3
    [68, 75, 72, 70],  # Student 4
    [95, 98, 92, 96]   # Student 5
]

# Convert to NumPy array and perform analysis
# Calculate: mean, median, std deviation for each student and each test',
        '# Data Analysis with NumPy
import numpy as np

# Student test scores (rows = students, columns = tests)
scores = [
    [85, 92, 78, 88],  # Student 1
    [76, 85, 90, 82],  # Student 2
    [92, 88, 85, 91],  # Student 3
    [68, 75, 72, 70],  # Student 4
    [95, 98, 92, 96]   # Student 5
]

# Convert to NumPy array
scores_array = np.array(scores)
print("Student Test Scores:")
print(scores_array)
print(f"Array shape: {scores_array.shape}")

print("\\n=== STUDENT ANALYSIS ===")
# Analysis for each student (across tests)
for i in range(scores_array.shape[0]):
    student_scores = scores_array[i]
    mean_score = np.mean(student_scores)
    median_score = np.median(student_scores)
    std_score = np.std(student_scores)

    print(f"Student {i+1}:")
    print(f"  Scores: {student_scores}")
    print(f"  Mean: {mean_score:.1f}")
    print(f"  Median: {median_score:.1f}")
    print(f"  Std Dev: {std_score:.1f}")
    print()

print("=== TEST ANALYSIS ===")
# Analysis for each test (across students)
test_names = ["Test 1", "Test 2", "Test 3", "Test 4"]
for j in range(scores_array.shape[1]):
    test_scores = scores_array[:, j]
    mean_score = np.mean(test_scores)
    median_score = np.median(test_scores)
    std_score = np.std(test_scores)

    print(f"{test_names[j]}:")
    print(f"  Scores: {test_scores}")
    print(f"  Mean: {mean_score:.1f}")
    print(f"  Median: {median_score:.1f}")
    print(f"  Std Dev: {std_score:.1f}")
    print()

print("=== OVERALL STATISTICS ===")
print(f"Overall Mean: {np.mean(scores_array):.1f}")
print(f"Overall Median: {np.median(scores_array):.1f}")
print(f"Overall Std Dev: {np.std(scores_array):.1f}")
print(f"Highest Score: {np.max(scores_array)}")
print(f"Lowest Score: {np.min(scores_array)}")

# Find students with scores above average
overall_mean = np.mean(scores_array)
student_means = np.mean(scores_array, axis=1)
above_average = student_means > overall_mean

print(f"\\nStudents above overall average ({overall_mean:.1f}):")
for i, is_above in enumerate(above_average):
    if is_above:
        print(f"  Student {i+1}: {student_means[i]:.1f}")

# Find the most challenging test (highest std deviation)
test_stds = np.std(scores_array, axis=0)
most_challenging = np.argmax(test_stds)
print(f"\\nMost challenging test: {test_names[most_challenging]} (std: {test_stds[most_challenging]:.1f})")',
        ARRAY[
            'Convert Python lists to NumPy arrays',
            'Use axis parameter for operations (axis=0 for columns, axis=1 for rows)',
            'Apply statistical functions: mean(), median(), std()',
            'Use boolean indexing to filter data'
        ],
        'advanced',
        '30 minutes',
        true
    );

END $$;
