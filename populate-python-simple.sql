-- Simple Python Course Population Script
-- This script adds comprehensive content to the existing Python course

DO $$
DECLARE
    course_id UUID;
    module1_id UUID;
    module2_id UUID;
    lesson1_id UUID;
    lesson2_id UUID;
    lesson3_id UUID;
    lesson4_id UUID;
    lesson5_id UUID;
    lesson6_id UUID;
BEGIN
    -- Get the existing Python course ID
    SELECT id INTO course_id FROM courses WHERE slug = 'python';
    
    IF course_id IS NULL THEN
        RAISE EXCEPTION 'Python course not found';
    END IF;
    
    -- Delete existing modules/lessons for clean slate
    DELETE FROM exercises WHERE lesson_id IN (
        SELECT l.id FROM lessons l 
        JOIN modules m ON l.module_id = m.id 
        WHERE m.course_id = course_id
    );
    
    DELETE FROM lessons WHERE module_id IN (
        SELECT id FROM modules WHERE course_id = course_id
    );
    
    DELETE FROM modules WHERE course_id = course_id;
    
    -- Update the course with better information
    UPDATE courses SET
        title = 'Python Programming',
        description = 'Learn Python programming from basics to advanced concepts with practical exercises and real-world projects. Master the fundamentals of Python syntax, data structures, object-oriented programming, and more.',
        short_description = 'Complete Python programming course from beginner to advanced level',
        difficulty_level = 'beginner',
        estimated_duration_hours = 40,
        learning_objectives = ARRAY[
            'Understand Python syntax and basic programming concepts',
            'Work with Python data types and structures',
            'Implement control flow and functions',
            'Master object-oriented programming in Python',
            'Handle files, exceptions, and modules',
            'Build real-world Python applications'
        ],
        tags = ARRAY['python', 'programming', 'beginner', 'coding', 'software-development'],
        tutor_name = 'Dr. Ana Python',
        tutor_avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        tutor_bio = 'Senior Python Developer with 10+ years of experience in software development and education.',
        updated_at = NOW()
    WHERE id = course_id;
    
    -- Insert Module 1: Python Fundamentals
    INSERT INTO modules (
        course_id,
        title,
        description,
        slug,
        order_index,
        estimated_duration_minutes,
        difficulty_level,
        learning_objectives
    ) VALUES (
        course_id,
        'Python Fundamentals',
        'Learn the basics of Python programming including syntax, variables, and basic operations.',
        'python-fundamentals',
        1,
        180,
        'beginner',
        ARRAY['Understand Python syntax', 'Work with variables and data types', 'Use basic operators']
    ) RETURNING id INTO module1_id;
    
    -- Insert Module 2: Data Types and Structures
    INSERT INTO modules (
        course_id,
        title,
        description,
        slug,
        order_index,
        estimated_duration_minutes,
        difficulty_level,
        learning_objectives
    ) VALUES (
        course_id,
        'Data Types and Structures',
        'Explore Python data types, lists, dictionaries, and other data structures.',
        'data-types-structures',
        2,
        240,
        'beginner',
        ARRAY['Master Python data types', 'Work with lists and dictionaries', 'Understand data structure operations']
    ) RETURNING id INTO module2_id;
    
    -- Insert Lessons for Module 1
    INSERT INTO lessons (
        module_id,
        title,
        description,
        slug,
        content,
        content_type,
        order_index,
        estimated_duration_minutes,
        difficulty_level,
        learning_objectives,
        key_concepts
    ) VALUES 
    (
        module1_id,
        'Introduction to Python',
        'Get started with Python programming and understand what makes Python special.',
        'introduction-to-python',
        '# Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum and first released in 1991, Python has become one of the most popular programming languages in the world.

## Why Python?

- **Easy to Learn**: Python''s syntax is clear and intuitive
- **Versatile**: Used in web development, data science, AI, automation, and more
- **Large Community**: Extensive libraries and community support
- **Cross-platform**: Runs on Windows, macOS, and Linux

## Your First Python Program

```python
print("Hello, World!")
```

This simple program demonstrates Python''s straightforward syntax.',
        'markdown',
        1,
        30,
        'beginner',
        ARRAY['Understand what Python is', 'Learn why Python is popular', 'Write your first Python program'],
        ARRAY['Python history', 'Programming language', 'Syntax', 'Hello World']
    ),
    (
        module1_id,
        'Variables and Basic Data Types',
        'Learn how to store and work with data using Python variables.',
        'variables-data-types',
        '# Variables and Basic Data Types

In Python, variables are used to store data. You don''t need to declare the type of a variable explicitly.

## Creating Variables

```python
# Numbers
age = 25
height = 5.9

# Strings
name = "Alice"
message = ''Hello, World!''

# Booleans
is_student = True
is_working = False
```

## Basic Data Types

- **int**: Integer numbers (1, 2, 3)
- **float**: Decimal numbers (3.14, 2.5)
- **str**: Text strings ("hello")
- **bool**: True or False values

## Variable Naming Rules

- Must start with a letter or underscore
- Can contain letters, numbers, and underscores
- Case-sensitive (age and Age are different)
- Cannot use Python keywords',
        'markdown',
        2,
        45,
        'beginner',
        ARRAY['Create and use variables', 'Understand basic data types', 'Follow naming conventions'],
        ARRAY['Variables', 'Data types', 'int', 'float', 'string', 'boolean']
    ),
    (
        module1_id,
        'Basic Operations and Expressions',
        'Perform calculations and operations with Python.',
        'basic-operations',
        '# Basic Operations and Expressions

Python supports various operators for performing calculations and comparisons.

## Arithmetic Operators

```python
# Basic math
result = 10 + 5    # Addition: 15
result = 10 - 5    # Subtraction: 5
result = 10 * 5    # Multiplication: 50
result = 10 / 5    # Division: 2.0
result = 10 // 3   # Floor division: 3
result = 10 % 3    # Modulus (remainder): 1
result = 2 ** 3    # Exponentiation: 8
```

## Comparison Operators

```python
x = 10
y = 5

print(x > y)   # True
print(x < y)   # False
print(x == y)  # False
print(x != y)  # True
```

## String Operations

```python
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name  # "John Doe"
```',
        'markdown',
        3,
        40,
        'beginner',
        ARRAY['Use arithmetic operators', 'Compare values', 'Combine strings'],
        ARRAY['Operators', 'Arithmetic', 'Comparison', 'String concatenation']
    );
    
    -- Insert Lessons for Module 2
    INSERT INTO lessons (
        module_id,
        title,
        description,
        slug,
        content,
        content_type,
        order_index,
        estimated_duration_minutes,
        difficulty_level,
        learning_objectives,
        key_concepts
    ) VALUES 
    (
        module2_id,
        'Lists and Tuples',
        'Work with ordered collections of data in Python.',
        'lists-tuples',
        '# Lists and Tuples

Lists and tuples are used to store multiple items in a single variable.

## Lists

Lists are ordered, changeable, and allow duplicate values.

```python
# Creating lists
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]

# Accessing items
print(fruits[0])  # "apple"
print(fruits[-1]) # "cherry" (last item)

# Modifying lists
fruits.append("orange")      # Add item
fruits.remove("banana")      # Remove item
fruits[0] = "grape"         # Change item
```

## Tuples

Tuples are ordered and unchangeable.

```python
# Creating tuples
coordinates = (10, 20)
colors = ("red", "green", "blue")

# Accessing items (same as lists)
print(coordinates[0])  # 10
```',
        'markdown',
        1,
        50,
        'beginner',
        ARRAY['Create and use lists', 'Understand tuples', 'Access and modify list items'],
        ARRAY['Lists', 'Tuples', 'Collections', 'Indexing', 'append', 'remove']
    ),
    (
        module2_id,
        'Dictionaries',
        'Store and retrieve data using key-value pairs.',
        'dictionaries',
        '# Dictionaries

Dictionaries store data in key-value pairs and are unordered, changeable, and indexed.

## Creating Dictionaries

```python
# Creating a dictionary
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

# Another way
student = dict(name="Bob", grade="A", subject="Math")
```

## Working with Dictionaries

```python
# Accessing values
print(person["name"])        # "Alice"
print(person.get("age"))     # 30

# Adding/updating values
person["email"] = "alice@email.com"
person["age"] = 31

# Removing items
del person["city"]
removed_value = person.pop("email")

# Getting all keys and values
keys = person.keys()
values = person.values()
items = person.items()
```',
        'markdown',
        2,
        45,
        'beginner',
        ARRAY['Create dictionaries', 'Access values by key', 'Add and remove items'],
        ARRAY['Dictionaries', 'Key-value pairs', 'keys()', 'values()', 'items()']
    ),
    (
        module2_id,
        'Sets and Advanced Collections',
        'Explore sets and advanced collection operations.',
        'sets-collections',
        '# Sets and Advanced Collections

Sets are unordered collections of unique items.

## Working with Sets

```python
# Creating sets
fruits = {"apple", "banana", "cherry"}
numbers = set([1, 2, 3, 4, 5])

# Adding and removing items
fruits.add("orange")
fruits.remove("banana")  # Raises error if not found
fruits.discard("grape")  # No error if not found

# Set operations
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

union = set1 | set2           # {1, 2, 3, 4, 5, 6}
intersection = set1 & set2    # {3, 4}
difference = set1 - set2      # {1, 2}
```

## List Comprehensions

Create lists in a concise way:

```python
# Traditional way
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]
```',
        'markdown',
        3,
        55,
        'intermediate',
        ARRAY['Use sets for unique collections', 'Perform set operations', 'Create list comprehensions'],
        ARRAY['Sets', 'Unique values', 'Union', 'Intersection', 'List comprehensions']
    );
    
    RAISE NOTICE 'Python course populated successfully with % modules and % lessons', 
        (SELECT COUNT(*) FROM modules WHERE course_id = course_id),
        (SELECT COUNT(*) FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = course_id);
        
END $$;
