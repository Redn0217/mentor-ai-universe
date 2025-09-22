-- Populate Python Course Data
-- This script inserts the comprehensive Python course structure into the new database schema

-- Function to populate Python course
CREATE OR REPLACE FUNCTION populate_python_course()
RETURNS void AS $$
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
    -- Insert the Python course
    INSERT INTO public.courses_v2 (
        slug,
        title,
        description,
        short_description,
        icon,
        color,
        difficulty_level,
        estimated_duration_hours,
        prerequisites,
        learning_objectives,
        tags,
        is_published,
        is_featured,
        tutor_name,
        tutor_avatar,
        tutor_bio
    ) VALUES (
        'python',
        'Python Programming',
        'Learn Python programming from basics to advanced concepts with practical exercises and real-world projects. Master the fundamentals of Python syntax, data structures, object-oriented programming, and more.',
        'Complete Python programming course from beginner to advanced level',
        'code',
        '#3776AB',
        'beginner',
        40,
        ARRAY[]::TEXT[],
        ARRAY[
            'Understand Python syntax and basic programming concepts',
            'Work with Python data types and structures',
            'Implement control flow and functions',
            'Master object-oriented programming in Python',
            'Handle files, exceptions, and modules',
            'Build real-world Python applications'
        ],
        ARRAY['python', 'programming', 'beginner', 'coding', 'software-development'],
        true,
        true,
        'Dr. Ana Python',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        'Senior Python Developer with 10+ years of experience in software development and education.'
    ) RETURNING id INTO course_id;

    -- Insert Module 1: Python Fundamentals
    INSERT INTO public.modules (
        course_id,
        title,
        description,
        slug,
        order_index,
        estimated_duration_minutes,
        difficulty_level,
        learning_objectives,
        is_published
    ) VALUES (
        course_id,
        'Python Fundamentals',
        'Get started with Python programming basics',
        'python-fundamentals',
        1,
        180,
        'beginner',
        ARRAY[
            'Set up Python development environment',
            'Understand Python syntax and basic concepts',
            'Write your first Python programs'
        ],
        true
    ) RETURNING id INTO module1_id;

    -- Insert Module 2: Python Data Types
    INSERT INTO public.modules (
        course_id,
        title,
        description,
        slug,
        order_index,
        estimated_duration_minutes,
        difficulty_level,
        learning_objectives,
        is_published
    ) VALUES (
        course_id,
        'Python Data Types',
        'Master Python''s built-in data types and their operations',
        'python-data-types',
        2,
        240,
        'beginner',
        ARRAY[
            'Understand different Python data types',
            'Work with strings, numbers, and booleans',
            'Perform type conversion and casting'
        ],
        true
    ) RETURNING id INTO module2_id;

    -- Insert Lessons for Module 1
    INSERT INTO public.lessons (
        module_id,
        title,
        description,
        slug,
        order_index,
        content,
        content_type,
        estimated_duration_minutes,
        key_concepts,
        code_examples,
        is_published
    ) VALUES 
    (
        module1_id,
        'Python Introduction',
        'What is Python and why use it?',
        'python-introduction',
        1,
        '# Python Introduction

Python is a popular programming language. It was created by Guido van Rossum, and released in 1991.

## What is Python used for?
- Web development (server-side)
- Software development
- Mathematics
- System scripting
- Data analysis
- Artificial intelligence
- Machine learning

## Why Python?
- Works on different platforms (Windows, Mac, Linux, etc.)
- Simple syntax similar to English language
- Allows developers to write programs with fewer lines
- Runs on an interpreter system
- Can be treated in procedural, object-oriented, or functional way

## Python Syntax compared to other languages
- Designed for readability
- Uses new lines to complete a command
- Relies on indentation to define scope',
        'markdown',
        15,
        ARRAY['Python history', 'Use cases', 'Syntax basics'],
        '[{"title": "Hello World", "code": "print(\"Hello, World!\")", "explanation": "This is the traditional first program in Python"}]'::jsonb,
        true
    ),
    (
        module1_id,
        'Python Get Started',
        'Install Python and set up your development environment',
        'python-get-started',
        2,
        '# Python Get Started

## Python Install
Many PCs and Macs will have Python already installed. To check if you have Python installed, open a command line and type:

```
python --version
```

## Python Quickstart
Python is an interpreted programming language, this means that as a developer you write Python (.py) files in a text editor and then put those files into the Python interpreter to be executed.

## The Python Command Line
To test a short amount of code in Python sometimes it is quickest and easiest not to write the code in a file. This is made possible because Python can be run as a command line itself.

## Creating Your First Python File
Create a file called `hello.py` and write the following code:

```python
print("Hello, World!")
```

Save the file and run it from the command line:

```
python hello.py
```',
        'markdown',
        20,
        ARRAY['Installation', 'Command line', 'First program'],
        '[{"title": "Check Python Version", "code": "python --version", "explanation": "Command to check if Python is installed"}, {"title": "First Python File", "code": "# hello.py\nprint(\"Hello, World!\")", "explanation": "Your first Python program saved in a file"}]'::jsonb,
        true
    ),
    (
        module1_id,
        'Python Syntax',
        'Learn the basic syntax rules of Python',
        'python-syntax',
        3,
        '# Python Syntax

## Execute Python Syntax
Python syntax can be executed by writing directly in the Command Line or by creating a Python file on the server, using the .py file extension, and running it in the Command Line.

## Python Indentation
Indentation refers to the spaces at the beginning of a code line. Where in other programming languages the indentation in code is for readability only, the indentation in Python is very important.

Python uses indentation to indicate a block of code:

```python
if 5 > 2:
    print("Five is greater than two!")
```

Python will give you an error if you skip the indentation:

```python
if 5 > 2:
print("Five is greater than two!")  # This will cause an error
```

## Python Variables
In Python, variables are created when you assign a value to it:

```python
x = 5
y = "Hello, World!"
```

## Comments
Python has commenting capability for the purpose of in-code documentation. Comments start with a #:

```python
# This is a comment
print("Hello, World!")
```',
        'markdown',
        25,
        ARRAY['Indentation', 'Variables', 'Comments', 'Code blocks'],
        '[{"title": "Proper Indentation", "code": "if 5 > 2:\n    print(\"Five is greater than two!\")", "explanation": "Correct use of indentation in Python"}, {"title": "Variables", "code": "x = 5\ny = \"Hello, World!\"\nprint(x)\nprint(y)", "explanation": "Creating and using variables"}]'::jsonb,
        true
    );

    -- Insert Lessons for Module 2
    INSERT INTO public.lessons (
        module_id,
        title,
        description,
        slug,
        order_index,
        content,
        content_type,
        estimated_duration_minutes,
        key_concepts,
        code_examples,
        is_published
    ) VALUES
    (
        module2_id,
        'Python Variables',
        'Learn how to create and use variables in Python',
        'python-variables',
        1,
        '# Python Variables

## Creating Variables
Python has no command for declaring a variable. A variable is created the moment you first assign a value to it.

```python
x = 5
y = "John"
print(x)
print(y)
```

## Variable Names
A variable can have a short name (like x and y) or a more descriptive name (age, carname, total_volume).

Rules for Python variables:
- Must start with a letter or underscore
- Cannot start with a number
- Can only contain alpha-numeric characters and underscores
- Case-sensitive (age, Age and AGE are three different variables)

## Assign Multiple Values
Python allows you to assign values to multiple variables in one line:

```python
x, y, z = "Orange", "Banana", "Cherry"
print(x)
print(y)
print(z)
```

## Global Variables
Variables that are created outside of a function are known as global variables.',
        'markdown',
        20,
        ARRAY['Variable creation', 'Naming rules', 'Multiple assignment', 'Global variables'],
        '[{"title": "Basic Variables", "code": "x = 5\ny = \"John\"\nprint(x)\nprint(y)", "explanation": "Creating and printing variables"}, {"title": "Multiple Assignment", "code": "x, y, z = \"Orange\", \"Banana\", \"Cherry\"\nprint(x, y, z)", "explanation": "Assigning multiple values at once"}]'::jsonb,
        true
    ),
    (
        module2_id,
        'Python Numbers',
        'Work with numeric data types in Python',
        'python-numbers',
        2,
        '# Python Numbers

There are three numeric types in Python:
- int
- float
- complex

## Int
Int, or integer, is a whole number, positive or negative, without decimals, of unlimited length.

```python
x = 1
y = 35656222554887711
z = -3255522

print(type(x))
print(type(y))
print(type(z))
```

## Float
Float, or "floating point number" is a number, positive or negative, containing one or more decimals.

```python
x = 1.10
y = 1.0
z = -35.59

print(type(x))
print(type(y))
print(type(z))
```

## Complex
Complex numbers are written with a "j" as the imaginary part:

```python
x = 3+5j
y = 5j
z = -5j

print(type(x))
print(type(y))
print(type(z))
```

## Type Conversion
You can convert from one type to another with the int(), float(), and complex() methods.',
        'markdown',
        25,
        ARRAY['Integer', 'Float', 'Complex', 'Type conversion'],
        '[{"title": "Number Types", "code": "x = 1    # int\ny = 2.8  # float\nz = 1j   # complex\n\nprint(type(x))\nprint(type(y))\nprint(type(z))", "explanation": "Different numeric types in Python"}]'::jsonb,
        true
    ),
    (
        module2_id,
        'Python Strings',
        'Master string manipulation and operations',
        'python-strings',
        3,
        '# Python Strings

Strings in Python are surrounded by either single quotation marks, or double quotation marks.

```python
print("Hello")
print(''Hello'')
```

## Multiline Strings
You can assign a multiline string to a variable by using three quotes:

```python
a = """Lorem ipsum dolor sit amet,
consectetur adipiscing elit,
sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua."""
print(a)
```

## Strings are Arrays
Like many other popular programming languages, strings in Python are arrays of bytes representing unicode characters.

```python
a = "Hello, World!"
print(a[1])  # Output: e
```

## String Length
To get the length of a string, use the len() function:

```python
a = "Hello, World!"
print(len(a))  # Output: 13
```

## String Methods
Python has a set of built-in methods that you can use on strings:
- upper() - converts to uppercase
- lower() - converts to lowercase
- strip() - removes whitespace
- replace() - replaces a string with another string
- split() - splits the string into substrings',
        'markdown',
        30,
        ARRAY['String creation', 'Multiline strings', 'String indexing', 'String methods'],
        '[{"title": "String Basics", "code": "name = \"Python\"\nprint(name[0])  # First character\nprint(len(name))  # Length\nprint(name.upper())  # Uppercase", "explanation": "Basic string operations"}]'::jsonb,
        true
    );

    -- Insert Exercises for Module 1
    INSERT INTO public.exercises (
        module_id,
        title,
        description,
        slug,
        order_index,
        exercise_type,
        difficulty_level,
        estimated_time_minutes,
        instructions,
        starter_code,
        solution_code,
        test_cases,
        hints,
        tags,
        points,
        is_published
    ) VALUES
    (
        module1_id,
        'Hello World Exercise',
        'Write a Python program that prints ''Hello, World!'' to the console',
        'hello-world-exercise',
        1,
        'coding',
        'beginner',
        10,
        'Create a Python program that displays ''Hello, World!'' when executed. Use the print() function to output the text.',
        '# Write your code here\n',
        'print("Hello, World!")',
        '[{"input": "", "expected_output": "Hello, World!", "description": "Should print Hello, World!"}]'::jsonb,
        ARRAY['Use the print() function', 'Remember to use quotes around the text'],
        ARRAY['basics', 'print', 'hello-world'],
        10,
        true
    ),
    (
        module1_id,
        'Variable Assignment',
        'Practice creating and using variables in Python',
        'variable-assignment',
        2,
        'coding',
        'beginner',
        15,
        'Create three variables: name (string), age (integer), and height (float). Print each variable on a separate line.',
        '# Create your variables here\nname = \nage = \nheight = \n\n# Print the variables\n',
        'name = "John"\nage = 25\nheight = 5.9\n\nprint(name)\nprint(age)\nprint(height)',
        '[{"input": "", "expected_output": "John\n25\n5.9", "description": "Should print the three variables"}]'::jsonb,
        ARRAY['Use quotes for strings', 'Numbers don''t need quotes', 'Use print() for each variable'],
        ARRAY['variables', 'data-types', 'print'],
        15,
        true
    );

    -- Insert Exercise for Module 2
    INSERT INTO public.exercises (
        module_id,
        title,
        description,
        slug,
        order_index,
        exercise_type,
        difficulty_level,
        estimated_time_minutes,
        instructions,
        starter_code,
        solution_code,
        test_cases,
        hints,
        tags,
        points,
        is_published
    ) VALUES
    (
        module2_id,
        'Number Operations',
        'Practice working with different number types',
        'number-operations',
        1,
        'coding',
        'beginner',
        20,
        'Create variables for integer, float, and perform basic arithmetic operations. Print the results.',
        '# Create an integer variable\nnum1 = \n\n# Create a float variable\nnum2 = \n\n# Perform operations and print results\n',
        'num1 = 10\nnum2 = 3.5\n\nprint(num1 + num2)\nprint(num1 - num2)\nprint(num1 * num2)\nprint(num1 / num2)',
        '[{"input": "", "expected_output": "13.5\n6.5\n35.0\n2.857142857142857", "description": "Should perform arithmetic operations"}]'::jsonb,
        ARRAY['Use whole numbers for integers', 'Use decimal numbers for floats', 'Try addition, subtraction, multiplication, and division'],
        ARRAY['numbers', 'arithmetic', 'operations'],
        15,
        true
    );

    -- Insert Resources for Module 1
    INSERT INTO public.resources (
        module_id,
        title,
        description,
        resource_type,
        url,
        is_external,
        difficulty_level,
        estimated_time_minutes,
        tags
    ) VALUES
    (
        module1_id,
        'Python Official Documentation',
        'Official Python documentation and tutorials',
        'documentation',
        'https://docs.python.org/3/',
        true,
        'beginner',
        30,
        ARRAY['documentation', 'official', 'reference']
    ),
    (
        module1_id,
        'Python Installation Guide',
        'Step-by-step guide to install Python on different operating systems',
        'tutorial',
        'https://www.python.org/downloads/',
        true,
        'beginner',
        15,
        ARRAY['installation', 'setup', 'tutorial']
    );

    RAISE NOTICE 'Python course populated successfully with course_id: %', course_id;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to populate the course
-- SELECT populate_python_course();

-- Grant permissions
GRANT EXECUTE ON FUNCTION populate_python_course() TO authenticated;
