-- =====================================================
-- COMPLETE PYTHON COURSE EXPANSION SCRIPT
-- Adds all missing lessons and modules for comprehensive coverage
-- Based on W3Schools Python Tutorial Structure
-- =====================================================

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
    -- Get course and existing module IDs
    SELECT id INTO course_id_var FROM courses WHERE slug = 'python';
    SELECT id INTO module1_id FROM modules WHERE course_id = course_id_var AND slug = 'python-fundamentals';
    SELECT id INTO module2_id FROM modules WHERE course_id = course_id_var AND slug = 'data-types-and-variables';
    SELECT id INTO module3_id FROM modules WHERE course_id = course_id_var AND slug = 'data-structures';

    -- =====================================================
    -- ADD MISSING LESSONS TO MODULE 2: DATA TYPES AND VARIABLES
    -- =====================================================
    
    -- Lesson 2.2: Python Strings and String Methods
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module2_id,
        'Python Strings and String Methods',
        'python-strings-and-methods',
        '# Python Strings and String Methods

## Creating Strings

Strings in Python are surrounded by either single or double quotation marks.

```python
# Single quotes
name = ''John''
# Double quotes  
message = "Hello, World!"
# Triple quotes for multiline
paragraph = """This is a
multiline string
in Python"""

print(name)      # John
print(message)   # Hello, World!
print(paragraph)
```

## String Indexing and Slicing

```python
text = "Python Programming"

# Indexing (starts at 0)
print(text[0])    # P
print(text[7])    # P
print(text[-1])   # g (last character)

# Slicing
print(text[0:6])   # Python
print(text[7:])    # Programming
print(text[:6])    # Python
print(text[::2])   # Pto rgamn (every 2nd character)
```

## String Methods

```python
text = "  Hello, World!  "

# Case methods
print(text.upper())      # "  HELLO, WORLD!  "
print(text.lower())      # "  hello, world!  "
print(text.title())      # "  Hello, World!  "
print(text.capitalize()) # "  hello, world!  "

# Whitespace methods
print(text.strip())      # "Hello, World!"
print(text.lstrip())     # "Hello, World!  "
print(text.rstrip())     # "  Hello, World!"

# Search and replace
print(text.find("World"))     # 9
print(text.replace("World", "Python"))  # "  Hello, Python!  "
print(text.count("l"))        # 3

# Split and join
words = "apple,banana,cherry".split(",")
print(words)  # [''apple'', ''banana'', ''cherry'']
joined = " - ".join(words)
print(joined)  # "apple - banana - cherry"
```

## String Formatting

```python
name = "Alice"
age = 25
score = 95.5

# f-strings (Python 3.6+)
message = f"Hello {name}, you are {age} years old"
print(message)  # Hello Alice, you are 25 years old

# Format with expressions
print(f"{name} scored {score:.1f}%")  # Alice scored 95.5%

# .format() method
template = "Name: {}, Age: {}, Score: {:.2f}"
print(template.format(name, age, score))

# % formatting (older style)
print("Hello %s, you scored %.1f%%" % (name, score))
```

## String Validation Methods

```python
text1 = "Hello123"
text2 = "12345"
text3 = "hello"

print(text1.isalnum())   # True (alphanumeric)
print(text2.isdigit())   # True (all digits)
print(text3.isalpha())   # True (all letters)
print(text3.islower())   # True (all lowercase)
print("HELLO".isupper()) # True (all uppercase)
```',
        'markdown',
        ARRAY[
            'Create and manipulate strings using various methods',
            'Use string indexing and slicing to access parts of strings',
            'Apply string formatting techniques including f-strings',
            'Validate string content using built-in methods'
        ],
        ARRAY['String Creation', 'Indexing', 'Slicing', 'String Methods', 'Formatting', 'Validation'],
        2,
        'beginner',
        50,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 2.2
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'String Manipulation Challenge',
        'Practice string methods by cleaning and formatting user input data.',
        'string-manipulation-challenge',
        'coding',
        'Clean and format a list of names: remove whitespace, convert to title case, and create formatted output.',
        '# Clean and format these names
names = ["  alice johnson  ", "BOB SMITH", "charlie brown  ", "  DIANA ROSS"]

# Your tasks:
# 1. Remove whitespace from each name
# 2. Convert each name to title case
# 3. Create a formatted list showing: "Name: [formatted_name]"
# 4. Join all formatted names with newlines and print',
        '# Clean and format these names
names = ["  alice johnson  ", "BOB SMITH", "charlie brown  ", "  DIANA ROSS"]

print("Original names:", names)
print()

# Clean and format names
formatted_names = []
for name in names:
    # Remove whitespace and convert to title case
    clean_name = name.strip().title()
    formatted_names.append(f"Name: {clean_name}")

# Join and print results
result = "\\n".join(formatted_names)
print("Formatted names:")
print(result)

# Alternative using list comprehension
formatted_alt = [f"Name: {name.strip().title()}" for name in names]
print("\\nAlternative approach:")
print("\\n".join(formatted_alt))',
        ARRAY[
            'Use strip() to remove whitespace',
            'Use title() to convert to title case',
            'Use f-strings for formatting',
            'Use join() to combine strings with separators'
        ],
        'beginner',
        20,
        1,
        25,
        ARRAY['python', 'strings', 'formatting', 'methods'],
        '[]'::jsonb,
        true
    );

    -- Lesson 2.3: Python Booleans and Operators
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module2_id,
        'Python Booleans and Operators',
        'python-booleans-and-operators',
        '# Python Booleans and Operators

## Boolean Values

Python has two boolean values: `True` and `False` (note the capital letters).

```python
is_student = True
is_graduated = False

print(is_student)    # True
print(is_graduated)  # False
print(type(is_student))  # <class ''bool''>
```

## Boolean from Expressions

Most values are `True`, but some are `False`:

```python
# Values that are False
print(bool(False))    # False
print(bool(None))     # False
print(bool(0))        # False
print(bool(""))       # False (empty string)
print(bool([]))       # False (empty list)
print(bool({}))       # False (empty dictionary)

# Values that are True
print(bool(True))     # True
print(bool(1))        # True
print(bool("Hello"))  # True
print(bool([1, 2]))   # True
print(bool(-1))       # True
```

## Comparison Operators

```python
x = 10
y = 5

# Equality
print(x == y)    # False
print(x != y)    # True

# Comparison
print(x > y)     # True
print(x < y)     # False
print(x >= y)    # True
print(x <= y)    # False

# String comparison
print("apple" < "banana")  # True (alphabetical order)
print("Apple" < "apple")   # True (uppercase comes first)
```

## Logical Operators

```python
# AND operator
print(True and True)    # True
print(True and False)   # False
print(False and False)  # False

# OR operator  
print(True or False)    # True
print(False or False)   # False

# NOT operator
print(not True)         # False
print(not False)        # True

# Practical examples
age = 25
has_license = True

can_drive = age >= 18 and has_license
print(f"Can drive: {can_drive}")  # Can drive: True

is_weekend = True
is_holiday = False
can_relax = is_weekend or is_holiday
print(f"Can relax: {can_relax}")  # Can relax: True
```

## Identity and Membership Operators

```python
# Identity operators (is, is not)
x = [1, 2, 3]
y = [1, 2, 3]
z = x

print(x == y)    # True (same content)
print(x is y)    # False (different objects)
print(x is z)    # True (same object)

# Membership operators (in, not in)
fruits = ["apple", "banana", "cherry"]
print("apple" in fruits)      # True
print("orange" in fruits)     # False
print("grape" not in fruits)  # True

text = "Hello World"
print("World" in text)        # True
print("world" in text)        # False (case sensitive)
```

## Operator Precedence

```python
# Parentheses have highest precedence
result = (5 + 3) * 2    # 16

# Without parentheses
result = 5 + 3 * 2      # 11 (multiplication first)

# Boolean operators precedence: not, and, or
result = True or False and False  # True (and before or)
result = (True or False) and False  # False (parentheses first)

# Comparison with logical operators
x = 10
result = x > 5 and x < 15  # True
result = not x > 15        # True
```',
        'markdown',
        ARRAY[
            'Understand boolean values and truthiness in Python',
            'Use comparison operators to evaluate expressions',
            'Apply logical operators for complex conditions',
            'Understand operator precedence and use parentheses effectively'
        ],
        ARRAY['Boolean Values', 'Comparison Operators', 'Logical Operators', 'Identity Operators', 'Membership Operators', 'Precedence'],
        3,
        'beginner',
        45,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 2.3
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Boolean Logic Quiz System',
        'Create a simple quiz system that evaluates answers using boolean logic.',
        'boolean-logic-quiz-system',
        'coding',
        'Create a quiz system that checks answers and provides feedback using boolean operators and comparisons.',
        '# Quiz System with Boolean Logic
# Create variables for quiz data
question1 = "What is 5 + 3?"
answer1 = 8
user_answer1 = 8

question2 = "Is Python case-sensitive?"
answer2 = True
user_answer2 = True

# Your tasks:
# 1. Check if user_answer1 is correct
# 2. Check if user_answer2 is correct  
# 3. Calculate total score (1 point per correct answer)
# 4. Determine if user passed (score >= 1)
# 5. Print results with boolean expressions',
        '# Quiz System with Boolean Logic
question1 = "What is 5 + 3?"
answer1 = 8
user_answer1 = 8

question2 = "Is Python case-sensitive?"
answer2 = True
user_answer2 = True

print("=== Python Quiz Results ===")
print()

# Check answers using boolean expressions
correct1 = user_answer1 == answer1
correct2 = user_answer2 == answer2

print(f"Question 1: {question1}")
print(f"Your answer: {user_answer1}")
print(f"Correct: {correct1}")
print()

print(f"Question 2: {question2}")
print(f"Your answer: {user_answer2}")
print(f"Correct: {correct2}")
print()

# Calculate score and determine pass/fail
total_score = int(correct1) + int(correct2)  # Convert bool to int
max_score = 2
passed = total_score >= 1

print(f"Score: {total_score}/{max_score}")
print(f"Passed: {passed}")

# Bonus: Use logical operators for feedback
perfect_score = correct1 and correct2
needs_improvement = not (correct1 or correct2)

if perfect_score:
    print("🎉 Perfect score! Excellent work!")
elif passed:
    print("✅ Good job! You passed the quiz.")
elif needs_improvement:
    print("📚 Keep studying! You can do better next time.")',
        ARRAY[
            'Use == operator to compare values',
            'Convert boolean to integer using int()',
            'Use logical operators (and, or, not) for complex conditions',
            'Combine comparison and logical operators'
        ],
        'beginner',
        25,
        1,
        30,
        ARRAY['python', 'booleans', 'operators', 'logic'],
        '[]'::jsonb,
        true
    );

    -- =====================================================
    -- ADD MISSING LESSONS TO MODULE 3: DATA STRUCTURES
    -- =====================================================

    -- Lesson 3.2: Python Tuples
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module3_id,
        'Python Tuples',
        'python-tuples',
        '# Python Tuples

## What are Tuples?

Tuples are ordered collections that are **immutable** (cannot be changed after creation).

```python
# Creating tuples
coordinates = (10, 20)
colors = ("red", "green", "blue")
mixed = ("Alice", 25, True, 3.14)
empty_tuple = ()
single_item = ("hello",)  # Note the comma!

print(coordinates)  # (10, 20)
print(type(coordinates))  # <class ''tuple''>
```

## Accessing Tuple Items

```python
fruits = ("apple", "banana", "cherry", "orange")

# Indexing
print(fruits[0])    # apple
print(fruits[-1])   # orange

# Slicing
print(fruits[1:3])  # (''banana'', ''cherry'')
print(fruits[:2])   # (''apple'', ''banana'')
```

## Tuple Methods

```python
numbers = (1, 2, 3, 2, 4, 2)

# Count occurrences
print(numbers.count(2))  # 3

# Find index
print(numbers.index(3))  # 2

# Length
print(len(numbers))      # 6
```

## Tuple Unpacking

```python
# Basic unpacking
point = (10, 20)
x, y = point
print(f"x: {x}, y: {y}")  # x: 10, y: 20

# Multiple assignment
person = ("Alice", 25, "Engineer")
name, age, job = person
print(f"{name} is {age} years old and works as an {job}")

# Swapping variables
a = 5
b = 10
a, b = b, a  # Swap using tuple unpacking
print(f"a: {a}, b: {b}")  # a: 10, b: 5
```

## When to Use Tuples

```python
# Coordinates
point_2d = (10, 20)
point_3d = (10, 20, 30)

# RGB colors
red = (255, 0, 0)
green = (0, 255, 0)

# Database records (immutable data)
student_record = ("John Doe", "12345", "Computer Science")

# Function returning multiple values
def get_name_age():
    return "Alice", 25

name, age = get_name_age()
```

## Tuples vs Lists

| Tuples | Lists |
|--------|-------|
| Immutable | Mutable |
| Use () | Use [] |
| Faster | Slower |
| Can be dict keys | Cannot be dict keys |
| Fixed size | Dynamic size |

```python
# Tuples are immutable
coordinates = (10, 20)
# coordinates[0] = 15  # This would cause an error!

# Lists are mutable
numbers = [1, 2, 3]
numbers[0] = 10  # This works fine
print(numbers)   # [10, 2, 3]
```',
        'markdown',
        ARRAY[
            'Understand the immutable nature of tuples',
            'Create and access tuple elements using indexing',
            'Use tuple unpacking for multiple assignment',
            'Know when to choose tuples over lists'
        ],
        ARRAY['Tuple Creation', 'Immutability', 'Indexing', 'Unpacking', 'Multiple Assignment', 'Tuples vs Lists'],
        2,
        'beginner',
        40,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 3.2
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Coordinate System Manager',
        'Work with coordinate tuples to calculate distances and manage point data.',
        'coordinate-system-manager',
        'coding',
        'Create a coordinate system that stores points as tuples and performs calculations.',
        '# Coordinate System Manager
import math

# Define some coordinate points as tuples
point_a = (0, 0)
point_b = (3, 4)
point_c = (6, 8)

# Your tasks:
# 1. Unpack coordinates and print them in a readable format
# 2. Calculate the distance between point_a and point_b
# 3. Create a tuple containing all three points
# 4. Find the point with the maximum x-coordinate',
        '# Coordinate System Manager
import math

# Define some coordinate points as tuples
point_a = (0, 0)
point_b = (3, 4)
point_c = (6, 8)

print("=== Coordinate System Manager ===")
print()

# 1. Unpack coordinates and print them
print("Points in the system:")
x1, y1 = point_a
x2, y2 = point_b
x3, y3 = point_c

print(f"Point A: ({x1}, {y1})")
print(f"Point B: ({x2}, {y2})")
print(f"Point C: ({x3}, {y3})")
print()

# 2. Calculate distance between point_a and point_b
# Distance formula: sqrt((x2-x1)² + (y2-y1)²)
distance = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
print(f"Distance from A to B: {distance:.2f}")
print()

# 3. Create a tuple containing all three points
all_points = (point_a, point_b, point_c)
print("All points tuple:", all_points)
print()

# 4. Find the point with maximum x-coordinate
max_x_point = max(all_points, key=lambda point: point[0])
print(f"Point with maximum x-coordinate: {max_x_point}")

# Bonus: Create a function that works with coordinate tuples
def distance_from_origin(point):
    x, y = point
    return math.sqrt(x**2 + y**2)

print()
print("Distances from origin:")
for i, point in enumerate([point_a, point_b, point_c], 1):
    dist = distance_from_origin(point)
    print(f"Point {chr(64+i)}: {dist:.2f}")',
        ARRAY[
            'Use tuple unpacking to extract coordinates',
            'Import and use the math module for calculations',
            'Use max() with key parameter to find maximum values',
            'Create nested tuples for complex data structures'
        ],
        'beginner',
        25,
        1,
        30,
        ARRAY['python', 'tuples', 'unpacking', 'math'],
        '[]'::jsonb,
        true
    );

    -- =====================================================
    -- MODULE 4: CONTROL STRUCTURES
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, slug, learning_objectives, prerequisites, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Control Structures',
        'Master Python control flow with conditional statements, loops, and iteration. Learn to make decisions and repeat actions in your programs.',
        'control-structures',
        ARRAY[
            'Use if/elif/else statements for decision making',
            'Implement for loops for iteration over sequences',
            'Apply while loops for conditional repetition',
            'Control loop execution with break and continue',
            'Combine control structures for complex logic'
        ],
        ARRAY['Python basics', 'Boolean operators', 'Data structures'],
        4,
        'intermediate',
        480,
        true
    ) RETURNING id INTO module4_id;

    -- Lesson 4.1: Conditional Statements
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module4_id,
        'Conditional Statements',
        'conditional-statements',
        '# Conditional Statements

## If Statements

Use `if` statements to execute code only when a condition is true.

```python
age = 18

if age >= 18:
    print("You are an adult")
    print("You can vote")

print("This always prints")
```

## If-Else Statements

```python
temperature = 25

if temperature > 30:
    print("It''s hot outside")
else:
    print("It''s not too hot")

# Ternary operator (one-line if-else)
weather = "sunny" if temperature > 25 else "cloudy"
print(f"Weather: {weather}")
```

## If-Elif-Else Statements

```python
score = 85

if score >= 90:
    grade = "A"
    print("Excellent!")
elif score >= 80:
    grade = "B"
    print("Good job!")
elif score >= 70:
    grade = "C"
    print("Satisfactory")
elif score >= 60:
    grade = "D"
    print("Needs improvement")
else:
    grade = "F"
    print("Failed")

print(f"Your grade: {grade}")
```

## Nested If Statements

```python
age = 20
has_license = True
has_car = False

if age >= 18:
    print("You are old enough to drive")
    if has_license:
        print("You have a license")
        if has_car:
            print("You can drive your own car")
        else:
            print("You need to borrow a car")
    else:
        print("You need to get a license first")
else:
    print("You are too young to drive")
```

## Complex Conditions

```python
username = "admin"
password = "secret123"
is_active = True

# Multiple conditions with and/or
if username == "admin" and password == "secret123" and is_active:
    print("Access granted")
elif username == "admin" and password == "secret123":
    print("Account is inactive")
elif username == "admin":
    print("Wrong password")
else:
    print("Access denied")

# Using parentheses for clarity
age = 25
income = 50000
credit_score = 750

eligible = (age >= 18 and age <= 65) and (income >= 30000 or credit_score >= 700)
if eligible:
    print("Loan approved")
else:
    print("Loan denied")
```

## Checking Multiple Values

```python
day = "Saturday"

# Check if value is in a list
weekends = ["Saturday", "Sunday"]
if day in weekends:
    print("It''s weekend!")

# Multiple conditions
if day == "Saturday" or day == "Sunday":
    print("Time to relax")

# Using sets for faster lookup
weekend_days = {"Saturday", "Sunday"}
if day in weekend_days:
    print("Weekend vibes!")
```',
        'markdown',
        ARRAY[
            'Write if/elif/else statements for decision making',
            'Use comparison and logical operators in conditions',
            'Create nested conditional statements',
            'Apply ternary operators for simple conditions'
        ],
        ARRAY['If Statements', 'Elif', 'Else', 'Nested Conditions', 'Logical Operators', 'Ternary Operator'],
        1,
        'intermediate',
        50,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 4.1
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Student Grade Calculator',
        'Create a comprehensive grade calculator that determines letter grades and provides feedback.',
        'student-grade-calculator',
        'coding',
        'Build a grade calculator that evaluates scores, assigns letter grades, and provides personalized feedback.',
        '# Student Grade Calculator
# Student information
student_name = "Alice Johnson"
math_score = 85
science_score = 92
english_score = 78
attendance_rate = 95  # percentage

# Your tasks:
# 1. Calculate the average score
# 2. Determine letter grade (A: 90+, B: 80-89, C: 70-79, D: 60-69, F: <60)
# 3. Check if student has good attendance (>= 90%)
# 4. Provide personalized feedback based on performance
# 5. Determine if student is eligible for honor roll (A grade + good attendance)',
        '# Student Grade Calculator
student_name = "Alice Johnson"
math_score = 85
science_score = 92
english_score = 78
attendance_rate = 95  # percentage

print(f"=== Grade Report for {student_name} ===")
print()

# 1. Calculate average score
average_score = (math_score + science_score + english_score) / 3
print(f"Individual Scores:")
print(f"  Math: {math_score}")
print(f"  Science: {science_score}")
print(f"  English: {english_score}")
print(f"Average Score: {average_score:.1f}")
print()

# 2. Determine letter grade
if average_score >= 90:
    letter_grade = "A"
    performance = "Excellent"
elif average_score >= 80:
    letter_grade = "B"
    performance = "Good"
elif average_score >= 70:
    letter_grade = "C"
    performance = "Satisfactory"
elif average_score >= 60:
    letter_grade = "D"
    performance = "Needs Improvement"
else:
    letter_grade = "F"
    performance = "Failing"

print(f"Letter Grade: {letter_grade}")
print(f"Performance: {performance}")
print()

# 3. Check attendance
good_attendance = attendance_rate >= 90
print(f"Attendance Rate: {attendance_rate}%")
print(f"Good Attendance: {''Yes'' if good_attendance else ''No''}")
print()

# 4. Personalized feedback
print("Feedback:")
if letter_grade == "A" and good_attendance:
    print("🌟 Outstanding work! Keep up the excellent performance!")
elif letter_grade == "A":
    print("📚 Great academic performance! Work on improving attendance.")
elif letter_grade in ["B", "C"] and good_attendance:
    print("👍 Good effort! Your attendance is excellent. Keep studying!")
elif letter_grade in ["B", "C"]:
    print("📖 Decent performance. Focus on both studies and attendance.")
else:
    print("⚠️  Needs significant improvement in both academics and attendance.")

# 5. Honor roll eligibility
honor_roll = letter_grade == "A" and good_attendance
print()
print(f"Honor Roll Eligible: {''Yes'' if honor_roll else ''No''}")

if honor_roll:
    print("🏆 Congratulations! You made the honor roll!")',
        ARRAY[
            'Use arithmetic operators to calculate averages',
            'Apply if/elif/else for grade classification',
            'Combine conditions with logical operators',
            'Use f-strings for formatted output'
        ],
        'intermediate',
        30,
        1,
        35,
        ARRAY['python', 'conditionals', 'calculations', 'logic'],
        '[]'::jsonb,
        true
    );

END $$;
