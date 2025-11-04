-- =====================================================
-- ADVANCED PYTHON MODULES (5, 6, 7, 8)
-- Complete the comprehensive Python course with advanced topics
-- =====================================================

DO $$
DECLARE
    course_id_var UUID;
    module5_id UUID;
    module6_id UUID;
    module7_id UUID;
    module8_id UUID;
    lesson_id_var UUID;
BEGIN
    -- Get course ID
    SELECT id INTO course_id_var FROM courses WHERE slug = 'python';

    -- =====================================================
    -- MODULE 5: FUNCTIONS AND MODULES
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, slug, learning_objectives, prerequisites, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Functions and Modules',
        'Learn to create reusable code with functions, understand scope, and organize code using modules and packages.',
        'functions-and-modules',
        ARRAY[
            'Define and call functions with parameters and return values',
            'Understand variable scope and lifetime',
            'Use lambda functions for simple operations',
            'Import and create modules for code organization',
            'Work with built-in functions and libraries'
        ],
        ARRAY['Control structures', 'Basic Python syntax'],
        5,
        'intermediate',
        600,
        true
    ) RETURNING id INTO module5_id;

    -- Lesson 5.1: Python Functions
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module5_id,
        'Python Functions',
        'python-functions',
        '# Python Functions

## Defining Functions

Functions are reusable blocks of code that perform specific tasks.

```python
# Basic function definition
def greet():
    print("Hello, World!")

# Call the function
greet()  # Output: Hello, World!

# Function with parameters
def greet_person(name):
    print(f"Hello, {name}!")

greet_person("Alice")  # Output: Hello, Alice!
```

## Function Parameters and Arguments

```python
# Multiple parameters
def add_numbers(a, b):
    result = a + b
    print(f"{a} + {b} = {result}")

add_numbers(5, 3)  # Output: 5 + 3 = 8

# Default parameters
def greet_with_title(name, title="Mr."):
    print(f"Hello, {title} {name}")

greet_with_title("Smith")           # Hello, Mr. Smith
greet_with_title("Johnson", "Dr.")  # Hello, Dr. Johnson

# Keyword arguments
def create_profile(name, age, city="Unknown"):
    print(f"Name: {name}, Age: {age}, City: {city}")

create_profile("Alice", 25)
create_profile(age=30, name="Bob", city="New York")
```

## Return Values

```python
# Function that returns a value
def multiply(a, b):
    return a * b

result = multiply(4, 5)
print(result)  # Output: 20

# Multiple return values
def get_name_age():
    return "Alice", 25

name, age = get_name_age()
print(f"{name} is {age} years old")

# Return different types based on condition
def divide_safe(a, b):
    if b == 0:
        return None, "Cannot divide by zero"
    else:
        return a / b, "Success"

result, message = divide_safe(10, 2)
print(f"Result: {result}, Message: {message}")
```

## Variable Scope

```python
# Global variable
global_var = "I am global"

def scope_example():
    # Local variable
    local_var = "I am local"
    print(f"Inside function: {global_var}")
    print(f"Inside function: {local_var}")

scope_example()
print(f"Outside function: {global_var}")
# print(local_var)  # This would cause an error!

# Modifying global variables
counter = 0

def increment():
    global counter
    counter += 1
    print(f"Counter: {counter}")

increment()  # Counter: 1
increment()  # Counter: 2
```

## Lambda Functions

```python
# Lambda function (anonymous function)
square = lambda x: x ** 2
print(square(5))  # Output: 25

# Lambda with multiple parameters
add = lambda a, b: a + b
print(add(3, 7))  # Output: 10

# Using lambda with built-in functions
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# Filter with lambda
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4]

# Sort with lambda
students = [("Alice", 85), ("Bob", 90), ("Charlie", 78)]
students.sort(key=lambda student: student[1])  # Sort by grade
print(students)  # [(''Charlie'', 78), (''Alice'', 85), (''Bob'', 90)]
```

## Docstrings and Function Documentation

```python
def calculate_area(length, width):
    """
    Calculate the area of a rectangle.
    
    Args:
        length (float): The length of the rectangle
        width (float): The width of the rectangle
    
    Returns:
        float: The area of the rectangle
    
    Example:
        >>> calculate_area(5, 3)
        15
    """
    return length * width

# Access docstring
print(calculate_area.__doc__)

# Help function
help(calculate_area)
```',
        'markdown',
        ARRAY[
            'Define functions with parameters and return values',
            'Understand variable scope and global/local variables',
            'Use lambda functions for simple operations',
            'Write proper function documentation with docstrings'
        ],
        ARRAY['Function Definition', 'Parameters', 'Return Values', 'Scope', 'Lambda Functions', 'Docstrings'],
        1,
        'intermediate',
        60,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 5.1
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Function Library Creator',
        'Create a library of utility functions for common mathematical and string operations.',
        'function-library-creator',
        'coding',
        'Build a collection of useful functions including mathematical calculations, string operations, and data processing.',
        '# Function Library Creator
# Create a library of useful functions

# Your tasks:
# 1. Create a function to calculate compound interest
# 2. Create a function to check if a string is a palindrome
# 3. Create a function to find the maximum value in a list
# 4. Create a lambda function to convert Celsius to Fahrenheit
# 5. Test all functions with sample data',
        '# Function Library Creator
import math

print("=== Python Function Library ===")
print()

# 1. Compound interest calculator
def calculate_compound_interest(principal, rate, time, compound_frequency=1):
    """
    Calculate compound interest.
    
    Args:
        principal (float): Initial amount
        rate (float): Annual interest rate (as decimal)
        time (float): Time in years
        compound_frequency (int): How many times interest compounds per year
    
    Returns:
        tuple: (final_amount, interest_earned)
    """
    amount = principal * (1 + rate/compound_frequency) ** (compound_frequency * time)
    interest = amount - principal
    return amount, interest

# Test compound interest
principal = 1000
rate = 0.05  # 5%
time = 3
final_amount, interest = calculate_compound_interest(principal, rate, time, 12)
print(f"Investment: ${principal}")
print(f"After {time} years: ${final_amount:.2f}")
print(f"Interest earned: ${interest:.2f}")
print()

# 2. Palindrome checker
def is_palindrome(text):
    """Check if a string is a palindrome (reads same forwards and backwards)."""
    # Convert to lowercase and remove spaces
    clean_text = text.lower().replace(" ", "")
    return clean_text == clean_text[::-1]

# Test palindrome function
test_words = ["racecar", "hello", "A man a plan a canal Panama", "python"]
print("Palindrome tests:")
for word in test_words:
    result = is_palindrome(word)
    print(f"  ''{word}'': {result}")
print()

# 3. Find maximum in list
def find_maximum(numbers):
    """Find the maximum value in a list of numbers."""
    if not numbers:
        return None
    
    max_val = numbers[0]
    for num in numbers:
        if num > max_val:
            max_val = num
    return max_val

# Test maximum function
test_numbers = [3, 7, 2, 9, 1, 8, 4]
max_value = find_maximum(test_numbers)
print(f"Numbers: {test_numbers}")
print(f"Maximum: {max_value}")
print()

# 4. Lambda function for temperature conversion
celsius_to_fahrenheit = lambda c: (c * 9/5) + 32

# Test temperature conversion
celsius_temps = [0, 20, 25, 37, 100]
print("Temperature conversions:")
for temp_c in celsius_temps:
    temp_f = celsius_to_fahrenheit(temp_c)
    print(f"  {temp_c}°C = {temp_f}°F")
print()

# 5. Bonus: Function that uses other functions
def analyze_data(data):
    """Analyze a list of numbers and return statistics."""
    if not data:
        return {"error": "No data provided"}
    
    return {
        "count": len(data),
        "maximum": find_maximum(data),
        "minimum": min(data),  # Using built-in min
        "average": sum(data) / len(data),
        "sum": sum(data)
    }

# Test data analysis
sample_data = [85, 92, 78, 96, 88, 91, 84]
stats = analyze_data(sample_data)
print("Data analysis results:")
for key, value in stats.items():
    if isinstance(value, float):
        print(f"  {key.title()}: {value:.2f}")
    else:
        print(f"  {key.title()}: {value}")

print()
print("🎉 Function library created successfully!")',
        ARRAY[
            'Use def keyword to define functions',
            'Include docstrings for function documentation',
            'Use return statements to return values',
            'Create lambda functions for simple operations'
        ],
        'intermediate',
        35,
        1,
        40,
        ARRAY['python', 'functions', 'lambda', 'documentation'],
        '[]'::jsonb,
        true
    );

    -- =====================================================
    -- MODULE 6: OBJECT-ORIENTED PROGRAMMING
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, slug, learning_objectives, prerequisites, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Object-Oriented Programming',
        'Master object-oriented programming concepts including classes, objects, inheritance, and encapsulation to write modular and reusable code.',
        'object-oriented-programming',
        ARRAY[
            'Create classes and instantiate objects',
            'Implement encapsulation with private and public attributes',
            'Use inheritance to create specialized classes',
            'Apply polymorphism for flexible code design',
            'Understand special methods and operator overloading'
        ],
        ARRAY['Functions', 'Data structures', 'Control flow'],
        6,
        'advanced',
        720,
        true
    ) RETURNING id INTO module6_id;

    -- Lesson 6.1: Classes and Objects
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module6_id,
        'Classes and Objects',
        'classes-and-objects',
        '# Classes and Objects

## What is Object-Oriented Programming?

Object-Oriented Programming (OOP) is a programming paradigm that organizes code into **classes** and **objects**.

- **Class**: A blueprint or template for creating objects
- **Object**: An instance of a class with specific data and behavior

## Creating Your First Class

```python
# Define a class
class Dog:
    # Class attribute (shared by all instances)
    species = "Canis familiaris"
    
    # Constructor method
    def __init__(self, name, age):
        # Instance attributes (unique to each object)
        self.name = name
        self.age = age
    
    # Instance method
    def bark(self):
        return f"{self.name} says Woof!"
    
    def get_info(self):
        return f"{self.name} is {self.age} years old"

# Create objects (instances)
dog1 = Dog("Buddy", 3)
dog2 = Dog("Max", 5)

# Access attributes and methods
print(dog1.name)        # Buddy
print(dog1.bark())      # Buddy says Woof!
print(dog2.get_info())  # Max is 5 years old
print(Dog.species)      # Canis familiaris
```

## Instance vs Class Attributes

```python
class Car:
    # Class attribute
    wheels = 4
    
    def __init__(self, make, model, year):
        # Instance attributes
        self.make = make
        self.model = model
        self.year = year
        self.odometer = 0  # Default value
    
    def drive(self, miles):
        self.odometer += miles
        print(f"Drove {miles} miles. Total: {self.odometer}")

# Create instances
car1 = Car("Toyota", "Camry", 2020)
car2 = Car("Honda", "Civic", 2019)

# Each instance has its own attributes
print(f"{car1.make} {car1.model}")  # Toyota Camry
print(f"{car2.make} {car2.model}")  # Honda Civic

# But they share class attributes
print(f"Car1 wheels: {car1.wheels}")  # 4
print(f"Car2 wheels: {car2.wheels}")  # 4

# Modify instance attributes
car1.drive(100)  # Only affects car1
car2.drive(50)   # Only affects car2
```

## Encapsulation and Private Attributes

```python
class BankAccount:
    def __init__(self, account_number, initial_balance=0):
        self.account_number = account_number
        self._balance = initial_balance  # Protected attribute
        self.__pin = "1234"  # Private attribute
    
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            print(f"Deposited ${amount}. New balance: ${self._balance}")
        else:
            print("Deposit amount must be positive")
    
    def withdraw(self, amount, pin):
        if pin != self.__pin:
            print("Invalid PIN")
            return False
        
        if amount > self._balance:
            print("Insufficient funds")
            return False
        
        self._balance -= amount
        print(f"Withdrew ${amount}. New balance: ${self._balance}")
        return True
    
    def get_balance(self):
        return self._balance
    
    def change_pin(self, old_pin, new_pin):
        if old_pin == self.__pin:
            self.__pin = new_pin
            print("PIN changed successfully")
        else:
            print("Invalid current PIN")

# Create account
account = BankAccount("12345", 1000)

# Use public methods
account.deposit(500)
account.withdraw(200, "1234")
print(f"Balance: ${account.get_balance()}")

# Try to access private attribute (won''t work as expected)
# print(account.__pin)  # AttributeError
```

## Special Methods (Magic Methods)

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        """String representation for users"""
        return f"Point({self.x}, {self.y})"
    
    def __repr__(self):
        """String representation for developers"""
        return f"Point(x={self.x}, y={self.y})"
    
    def __add__(self, other):
        """Add two points"""
        return Point(self.x + other.x, self.y + other.y)
    
    def __eq__(self, other):
        """Check if two points are equal"""
        return self.x == other.x and self.y == other.y
    
    def distance_from_origin(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

# Create points
p1 = Point(3, 4)
p2 = Point(1, 2)

# Use special methods
print(p1)           # Point(3, 4)
print(repr(p2))     # Point(x=1, y=2)

p3 = p1 + p2        # Uses __add__
print(p3)           # Point(4, 6)

print(p1 == p2)     # False (uses __eq__)
print(p1 == Point(3, 4))  # True
```',
        'markdown',
        ARRAY[
            'Define classes with attributes and methods',
            'Create and use object instances',
            'Understand encapsulation and data hiding',
            'Implement special methods for custom behavior'
        ],
        ARRAY['Class Definition', 'Objects', 'Attributes', 'Methods', 'Encapsulation', 'Special Methods'],
        1,
        'advanced',
        70,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 6.1
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Student Management System',
        'Create a comprehensive student management system using classes and objects.',
        'student-management-system',
        'coding',
        'Build a Student class with methods for managing grades, calculating GPA, and tracking academic progress.',
        '# Student Management System
# Create a comprehensive student management system

# Your tasks:
# 1. Create a Student class with name, student_id, and grades attributes
# 2. Add methods to add grades, calculate GPA, and get student info
# 3. Implement a method to determine academic standing
# 4. Create multiple student objects and test the functionality
# 5. Add a class method to compare students',
        '# Student Management System

class Student:
    # Class attribute
    total_students = 0

    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.grades = []
        Student.total_students += 1

    def add_grade(self, subject, grade):
        """Add a grade for a subject"""
        if 0 <= grade <= 100:
            self.grades.append({''subject'': subject, ''grade'': grade})
            print(f"Added {subject}: {grade} for {self.name}")
        else:
            print("Grade must be between 0 and 100")

    def calculate_gpa(self):
        """Calculate GPA on 4.0 scale"""
        if not self.grades:
            return 0.0

        total_points = 0
        for grade_info in self.grades:
            grade = grade_info[''grade'']
            if grade >= 90:
                points = 4.0
            elif grade >= 80:
                points = 3.0
            elif grade >= 70:
                points = 2.0
            elif grade >= 60:
                points = 1.0
            else:
                points = 0.0
            total_points += points

        return round(total_points / len(self.grades), 2)

    def get_academic_standing(self):
        """Determine academic standing based on GPA"""
        gpa = self.calculate_gpa()
        if gpa >= 3.5:
            return "Dean''s List"
        elif gpa >= 3.0:
            return "Good Standing"
        elif gpa >= 2.0:
            return "Satisfactory"
        else:
            return "Academic Probation"

    def get_student_info(self):
        """Get comprehensive student information"""
        gpa = self.calculate_gpa()
        standing = self.get_academic_standing()

        info = f"""
Student Information:
Name: {self.name}
ID: {self.student_id}
Number of Grades: {len(self.grades)}
GPA: {gpa}
Academic Standing: {standing}
        """

        if self.grades:
            info += "\\nGrades:"
            for grade_info in self.grades:
                info += f"\\n  {grade_info[''subject'']}: {grade_info[''grade'']}"

        return info.strip()

    def __str__(self):
        return f"Student({self.name}, ID: {self.student_id})"

    def __repr__(self):
        return f"Student(name=''{self.name}'', student_id=''{self.student_id}'')"

    @classmethod
    def get_total_students(cls):
        return cls.total_students

# Test the Student Management System
print("=== Student Management System ===")
print()

# Create students
student1 = Student("Alice Johnson", "S001")
student2 = Student("Bob Smith", "S002")
student3 = Student("Charlie Brown", "S003")

print(f"Total students created: {Student.get_total_students()}")
print()

# Add grades for Alice
student1.add_grade("Math", 95)
student1.add_grade("Science", 88)
student1.add_grade("English", 92)
student1.add_grade("History", 85)

# Add grades for Bob
student2.add_grade("Math", 78)
student2.add_grade("Science", 82)
student2.add_grade("English", 75)

# Add grades for Charlie
student3.add_grade("Math", 65)
student3.add_grade("Science", 70)

print()

# Display student information
students = [student1, student2, student3]
for student in students:
    print(student.get_student_info())
    print("-" * 40)

# Compare students
print("\\nStudent Comparison:")
for student in students:
    print(f"{student.name}: GPA {student.calculate_gpa()} - {student.get_academic_standing()}")

print(f"\\n🎓 Total students in system: {Student.get_total_students()}")',
        ARRAY[
            'Use __init__ method to initialize object attributes',
            'Create instance methods that operate on object data',
            'Use class attributes and class methods',
            'Implement __str__ and __repr__ special methods'
        ],
        'advanced',
        40,
        1,
        45,
        ARRAY['python', 'oop', 'classes', 'objects'],
        '[]'::jsonb,
        true
    );

    -- =====================================================
    -- MODULE 7: FILE HANDLING AND DATA PROCESSING
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, slug, learning_objectives, prerequisites, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'File Handling and Data Processing',
        'Learn to read from and write to files, handle exceptions, and process different data formats including CSV and JSON.',
        'file-handling-data-processing',
        ARRAY[
            'Read from and write to text files safely',
            'Handle file exceptions and errors gracefully',
            'Process CSV files for data analysis',
            'Work with JSON data for web applications',
            'Use context managers for proper resource management'
        ],
        ARRAY['Functions', 'Exception handling basics'],
        7,
        'advanced',
        540,
        true
    ) RETURNING id INTO module7_id;

    -- Lesson 7.1: File Operations and Exception Handling
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module7_id,
        'File Operations and Exception Handling',
        'file-operations-exception-handling',
        '# File Operations and Exception Handling

## Reading Files

```python
# Basic file reading
try:
    file = open("example.txt", "r")
    content = file.read()
    print(content)
    file.close()
except FileNotFoundError:
    print("File not found!")

# Reading line by line
try:
    with open("example.txt", "r") as file:
        for line_number, line in enumerate(file, 1):
            print(f"Line {line_number}: {line.strip()}")
except FileNotFoundError:
    print("File not found!")
```

## Writing Files

```python
# Writing to a file
data = ["Hello, World!", "Python is awesome!", "File handling is important."]

# Write mode (overwrites existing content)
with open("output.txt", "w") as file:
    for line in data:
        file.write(line + "\\n")

# Append mode (adds to existing content)
with open("output.txt", "a") as file:
    file.write("This line is appended.\\n")

print("File written successfully!")
```

## Context Managers (with statement)

```python
# Without context manager (not recommended)
file = open("data.txt", "r")
content = file.read()
file.close()  # Must remember to close!

# With context manager (recommended)
with open("data.txt", "r") as file:
    content = file.read()
# File is automatically closed when exiting the with block

# Multiple files
with open("input.txt", "r") as infile, open("output.txt", "w") as outfile:
    data = infile.read()
    processed_data = data.upper()
    outfile.write(processed_data)
```

## Exception Handling

```python
import os

def safe_file_operation(filename):
    try:
        # Check if file exists
        if not os.path.exists(filename):
            raise FileNotFoundError(f"File {filename} does not exist")

        # Try to read the file
        with open(filename, "r") as file:
            content = file.read()

        # Process the content
        word_count = len(content.split())
        line_count = len(content.splitlines())

        return {
            "success": True,
            "word_count": word_count,
            "line_count": line_count,
            "content_length": len(content)
        }

    except FileNotFoundError as e:
        return {"success": False, "error": f"File error: {e}"}
    except PermissionError:
        return {"success": False, "error": "Permission denied"}
    except Exception as e:
        return {"success": False, "error": f"Unexpected error: {e}"}

# Test the function
result = safe_file_operation("test.txt")
if result["success"]:
    print(f"Words: {result[''word_count'']}")
    print(f"Lines: {result[''line_count'']}")
else:
    print(f"Error: {result[''error'']}")
```

## Working with CSV Files

```python
import csv

# Writing CSV
students = [
    ["Name", "Age", "Grade"],
    ["Alice", 20, "A"],
    ["Bob", 19, "B"],
    ["Charlie", 21, "A-"]
]

with open("students.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(students)

# Reading CSV
with open("students.csv", "r") as file:
    reader = csv.reader(file)
    for row_number, row in enumerate(reader):
        if row_number == 0:
            print("Headers:", row)
        else:
            print(f"Student: {row[0]}, Age: {row[1]}, Grade: {row[2]}")

# Using DictReader for easier access
with open("students.csv", "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(f"{row[''Name'']} (age {row[''Age'']}) has grade {row[''Grade'']}")
```

## Working with JSON Files

```python
import json

# Python data structure
student_data = {
    "students": [
        {"name": "Alice", "age": 20, "courses": ["Math", "Physics"]},
        {"name": "Bob", "age": 19, "courses": ["Chemistry", "Biology"]},
        {"name": "Charlie", "age": 21, "courses": ["Math", "Computer Science"]}
    ],
    "semester": "Fall 2023",
    "total_students": 3
}

# Write JSON file
with open("students.json", "w") as file:
    json.dump(student_data, file, indent=2)

print("JSON file created!")

# Read JSON file
with open("students.json", "r") as file:
    loaded_data = json.load(file)

print(f"Semester: {loaded_data[''semester'']}")
print(f"Total students: {loaded_data[''total_students'']}")

for student in loaded_data["students"]:
    courses = ", ".join(student["courses"])
    print(f"{student[''name'']} (age {student[''age'']}) takes: {courses}")
```',
        'markdown',
        ARRAY[
            'Read from and write to files using proper methods',
            'Handle file-related exceptions gracefully',
            'Use context managers for safe file operations',
            'Process CSV and JSON data formats'
        ],
        ARRAY['File Reading', 'File Writing', 'Context Managers', 'Exception Handling', 'CSV Processing', 'JSON Processing'],
        1,
        'advanced',
        65,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 7.1
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Log File Analyzer',
        'Create a log file analyzer that processes server logs and generates reports.',
        'log-file-analyzer',
        'coding',
        'Build a system that reads log files, analyzes the data, and generates summary reports in both text and JSON formats.',
        '# Log File Analyzer
# Create a system to analyze server log files

# Sample log data (you can create this as a file)
sample_log_data = """2023-10-01 10:30:15 INFO User login successful: user123
2023-10-01 10:31:22 ERROR Database connection failed
2023-10-01 10:32:45 INFO User logout: user123
2023-10-01 10:35:10 WARNING High memory usage detected
2023-10-01 10:40:33 INFO User login successful: user456
2023-10-01 10:45:18 ERROR File not found: config.txt
2023-10-01 10:50:25 INFO User logout: user456"""

# Your tasks:
# 1. Create the sample log file
# 2. Read and parse the log file
# 3. Count different log levels (INFO, ERROR, WARNING)
# 4. Extract unique users
# 5. Generate a summary report and save as JSON',
        '# Log File Analyzer
import json
from datetime import datetime
from collections import Counter

# Sample log data
sample_log_data = """2023-10-01 10:30:15 INFO User login successful: user123
2023-10-01 10:31:22 ERROR Database connection failed
2023-10-01 10:32:45 INFO User logout: user123
2023-10-01 10:35:10 WARNING High memory usage detected
2023-10-01 10:40:33 INFO User login successful: user456
2023-10-01 10:45:18 ERROR File not found: config.txt
2023-10-01 10:50:25 INFO User logout: user456"""

print("=== Log File Analyzer ===")
print()

# 1. Create the sample log file
try:
    with open("server.log", "w") as file:
        file.write(sample_log_data)
    print("✅ Log file created successfully")
except Exception as e:
    print(f"❌ Error creating log file: {e}")
    exit()

# 2. Read and parse the log file
log_entries = []
log_levels = []
users = []

try:
    with open("server.log", "r") as file:
        for line_number, line in enumerate(file, 1):
            line = line.strip()
            if line:
                # Parse log entry: timestamp, level, message
                parts = line.split(" ", 3)
                if len(parts) >= 4:
                    date = parts[0]
                    time = parts[1]
                    level = parts[2]
                    message = parts[3]

                    log_entry = {
                        "line": line_number,
                        "timestamp": f"{date} {time}",
                        "level": level,
                        "message": message
                    }

                    log_entries.append(log_entry)
                    log_levels.append(level)

                    # Extract username if present
                    if "user" in message.lower():
                        # Simple extraction - look for user followed by numbers/letters
                        words = message.split()
                        for word in words:
                            if word.startswith("user") and len(word) > 4:
                                users.append(word.rstrip(":"))

    print(f"✅ Parsed {len(log_entries)} log entries")

except FileNotFoundError:
    print("❌ Log file not found")
    exit()
except Exception as e:
    print(f"❌ Error reading log file: {e}")
    exit()

# 3. Count different log levels
level_counts = Counter(log_levels)
print("\\n📊 Log Level Summary:")
for level, count in level_counts.items():
    print(f"  {level}: {count}")

# 4. Extract unique users
unique_users = list(set(users))
print(f"\\n👥 Unique Users ({len(unique_users)}):")
for user in sorted(unique_users):
    print(f"  {user}")

# 5. Generate comprehensive analysis
analysis = {
    "analysis_timestamp": datetime.now().isoformat(),
    "total_entries": len(log_entries),
    "log_levels": dict(level_counts),
    "unique_users": unique_users,
    "user_activity_count": len(users),
    "error_rate": round((level_counts.get("ERROR", 0) / len(log_entries)) * 100, 2),
    "warning_rate": round((level_counts.get("WARNING", 0) / len(log_entries)) * 100, 2),
    "sample_entries": log_entries[:3]  # First 3 entries as examples
}

# Save analysis as JSON
try:
    with open("log_analysis.json", "w") as file:
        json.dump(analysis, file, indent=2)
    print("\\n✅ Analysis saved to log_analysis.json")
except Exception as e:
    print(f"\\n❌ Error saving analysis: {e}")

# Generate text report
report = f"""
LOG ANALYSIS REPORT
==================
Analysis Date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
Total Log Entries: {analysis[''total_entries'']}

LOG LEVEL BREAKDOWN:
{chr(10).join([f"  {level}: {count}" for level, count in level_counts.items()])}

USER ACTIVITY:
  Unique Users: {len(unique_users)}
  Total User Actions: {len(users)}
  Users: {", ".join(unique_users)}

HEALTH METRICS:
  Error Rate: {analysis[''error_rate'']}%
  Warning Rate: {analysis[''warning_rate'']}%

STATUS: {"⚠️  ATTENTION NEEDED" if analysis[''error_rate''] > 20 else "✅ SYSTEM HEALTHY"}
"""

# Save text report
try:
    with open("log_report.txt", "w") as file:
        file.write(report)
    print("✅ Text report saved to log_report.txt")
except Exception as e:
    print(f"❌ Error saving text report: {e}")

print("\\n🎉 Log analysis completed successfully!")
print("\\nFiles created:")
print("  📄 server.log (sample log file)")
print("  📊 log_analysis.json (detailed analysis)")
print("  📋 log_report.txt (summary report)")',
        ARRAY[
            'Use with statement for safe file operations',
            'Parse text data by splitting and extracting information',
            'Use Counter from collections for counting occurrences',
            'Save data in both JSON and text formats'
        ],
        'advanced',
        35,
        1,
        45,
        ARRAY['python', 'files', 'json', 'data-processing'],
        '[]'::jsonb,
        true
    );

    -- =====================================================
    -- MODULE 8: PYTHON LIBRARIES AND FRAMEWORKS
    -- =====================================================
    INSERT INTO modules (id, course_id, title, description, slug, learning_objectives, prerequisites, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        course_id_var,
        'Python Libraries and Frameworks',
        'Explore Python''s rich ecosystem of libraries for data science, web development, and automation. Learn NumPy for numerical computing and get introduced to popular frameworks.',
        'python-libraries-frameworks',
        ARRAY[
            'Use NumPy for efficient numerical computations',
            'Understand the Python package ecosystem',
            'Install and manage packages with pip',
            'Explore popular libraries for different domains',
            'Get introduced to web frameworks and data science tools'
        ],
        ARRAY['Object-oriented programming', 'File handling', 'Functions'],
        8,
        'advanced',
        600,
        true
    ) RETURNING id INTO module8_id;

    -- Lesson 8.1: NumPy and Scientific Computing
    INSERT INTO lessons (id, module_id, title, slug, content, content_type, learning_objectives, key_concepts, order_index, difficulty_level, estimated_duration_minutes, is_published)
    VALUES (
        gen_random_uuid(),
        module8_id,
        'NumPy and Scientific Computing',
        'numpy-scientific-computing',
        '# NumPy and Scientific Computing

## What is NumPy?

NumPy (Numerical Python) is the fundamental package for scientific computing in Python. It provides:
- Powerful N-dimensional array objects
- Broadcasting functions
- Linear algebra, Fourier transform, and random number capabilities
- Tools for integrating with C/C++ and Fortran code

## Installing NumPy

```bash
# Install NumPy using pip
pip install numpy

# Or using conda
conda install numpy
```

## Creating NumPy Arrays

```python
import numpy as np

# From Python lists
arr1 = np.array([1, 2, 3, 4, 5])
print(f"1D Array: {arr1}")
print(f"Type: {type(arr1)}")
print(f"Data type: {arr1.dtype}")

# 2D array (matrix)
arr2 = np.array([[1, 2, 3], [4, 5, 6]])
print(f"2D Array:\\n{arr2}")
print(f"Shape: {arr2.shape}")

# Using NumPy functions
zeros = np.zeros((3, 4))        # 3x4 array of zeros
ones = np.ones((2, 3))          # 2x3 array of ones
identity = np.eye(3)            # 3x3 identity matrix
random_arr = np.random.rand(2, 3)  # Random values between 0 and 1

print(f"Zeros:\\n{zeros}")
print(f"Identity:\\n{identity}")
```

## Array Operations

```python
import numpy as np

# Basic arithmetic
a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

print(f"a + b = {a + b}")      # Element-wise addition
print(f"a * b = {a * b}")      # Element-wise multiplication
print(f"a ** 2 = {a ** 2}")    # Element-wise power

# Mathematical functions
arr = np.array([1, 4, 9, 16])
print(f"Square root: {np.sqrt(arr)}")
print(f"Logarithm: {np.log(arr)}")
print(f"Sine: {np.sin(arr)}")

# Statistical operations
data = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
print(f"Mean: {np.mean(data)}")
print(f"Median: {np.median(data)}")
print(f"Standard deviation: {np.std(data)}")
print(f"Sum: {np.sum(data)}")
print(f"Min: {np.min(data)}, Max: {np.max(data)}")
```

## Array Indexing and Slicing

```python
import numpy as np

# 1D array indexing
arr = np.array([10, 20, 30, 40, 50])
print(f"First element: {arr[0]}")
print(f"Last element: {arr[-1]}")
print(f"Slice [1:4]: {arr[1:4]}")

# 2D array indexing
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(f"Element at [1,2]: {matrix[1, 2]}")  # Row 1, Column 2
print(f"First row: {matrix[0, :]}")         # All columns of row 0
print(f"Second column: {matrix[:, 1]}")     # All rows of column 1

# Boolean indexing
data = np.array([1, 5, 3, 8, 2, 7])
mask = data > 4
print(f"Values > 4: {data[mask]}")
print(f"Indices where > 4: {np.where(data > 4)}")
```

## Linear Algebra with NumPy

```python
import numpy as np

# Matrix operations
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Matrix multiplication
C = np.dot(A, B)  # or A @ B
print(f"Matrix multiplication:\\n{C}")

# Transpose
print(f"Transpose of A:\\n{A.T}")

# Determinant and inverse
det_A = np.linalg.det(A)
inv_A = np.linalg.inv(A)
print(f"Determinant of A: {det_A}")
print(f"Inverse of A:\\n{inv_A}")

# Eigenvalues and eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(A)
print(f"Eigenvalues: {eigenvalues}")
print(f"Eigenvectors:\\n{eigenvectors}")
```

## Practical Example: Data Analysis

```python
import numpy as np

# Simulate temperature data for a week (7 days, 24 hours each)
np.random.seed(42)  # For reproducible results
temperatures = np.random.normal(20, 5, (7, 24))  # Mean=20°C, std=5°C

print("Temperature Analysis:")
print(f"Data shape: {temperatures.shape}")
print(f"Overall mean temperature: {np.mean(temperatures):.2f}°C")
print(f"Overall std deviation: {np.std(temperatures):.2f}°C")

# Daily statistics
daily_means = np.mean(temperatures, axis=1)  # Average across hours
daily_maxs = np.max(temperatures, axis=1)    # Max temp each day
daily_mins = np.min(temperatures, axis=1)    # Min temp each day

print("\\nDaily Statistics:")
for day in range(7):
    day_name = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day]
    print(f"{day_name}: Avg={daily_means[day]:.1f}°C, "
          f"Max={daily_maxs[day]:.1f}°C, Min={daily_mins[day]:.1f}°C")

# Find extreme temperatures
hottest_day, hottest_hour = np.unravel_index(np.argmax(temperatures), temperatures.shape)
coldest_day, coldest_hour = np.unravel_index(np.argmin(temperatures), temperatures.shape)

print(f"\\nHottest: {temperatures[hottest_day, hottest_hour]:.1f}°C on day {hottest_day+1}, hour {hottest_hour}")
print(f"Coldest: {temperatures[coldest_day, coldest_hour]:.1f}°C on day {coldest_day+1}, hour {coldest_hour}")

# Temperature ranges
comfortable_temps = np.logical_and(temperatures >= 18, temperatures <= 25)
comfort_percentage = np.mean(comfortable_temps) * 100
print(f"\\nComfortable temperature (18-25°C): {comfort_percentage:.1f}% of the time")
```

## Why Use NumPy?

```python
import numpy as np
import time

# Performance comparison: Python lists vs NumPy arrays
size = 1000000

# Python lists
start_time = time.time()
python_list = list(range(size))
result_list = [x * 2 for x in python_list]
python_time = time.time() - start_time

# NumPy arrays
start_time = time.time()
numpy_array = np.arange(size)
result_array = numpy_array * 2
numpy_time = time.time() - start_time

print(f"Python list time: {python_time:.4f} seconds")
print(f"NumPy array time: {numpy_time:.4f} seconds")
print(f"NumPy is {python_time/numpy_time:.1f}x faster!")

# Memory usage
import sys
python_memory = sys.getsizeof(python_list)
numpy_memory = numpy_array.nbytes
print(f"\\nPython list memory: {python_memory:,} bytes")
print(f"NumPy array memory: {numpy_memory:,} bytes")
print(f"NumPy uses {python_memory/numpy_memory:.1f}x less memory!")
```',
        'markdown',
        ARRAY[
            'Create and manipulate NumPy arrays efficiently',
            'Perform mathematical operations on arrays',
            'Use NumPy for statistical analysis and linear algebra',
            'Understand the performance benefits of NumPy over Python lists'
        ],
        ARRAY['NumPy Arrays', 'Array Operations', 'Linear Algebra', 'Statistical Functions', 'Performance', 'Scientific Computing'],
        1,
        'advanced',
        75,
        true
    ) RETURNING id INTO lesson_id_var;

    -- Exercise for Lesson 8.1
    INSERT INTO exercises (id, lesson_id, title, description, slug, exercise_type, instructions, starter_code, solution_code, hints, difficulty_level, estimated_time_minutes, order_index, points, tags, test_cases, is_published)
    VALUES (
        gen_random_uuid(),
        lesson_id_var,
        'Data Analysis with NumPy',
        'Analyze sales data using NumPy arrays and statistical functions.',
        'data-analysis-numpy',
        'coding',
        'Use NumPy to analyze quarterly sales data, calculate statistics, and identify trends.',
        '# Data Analysis with NumPy
import numpy as np

# Quarterly sales data for 4 products over 4 quarters (in thousands)
# Rows: Products (A, B, C, D), Columns: Quarters (Q1, Q2, Q3, Q4)
sales_data = np.array([
    [120, 135, 158, 142],  # Product A
    [98, 112, 125, 138],   # Product B
    [87, 94, 89, 96],      # Product C
    [156, 178, 165, 189]   # Product D
])

# Your tasks:
# 1. Calculate total sales for each product
# 2. Calculate total sales for each quarter
# 3. Find the best and worst performing product
# 4. Calculate growth rate from Q1 to Q4 for each product
# 5. Create a performance summary report',
        '# Data Analysis with NumPy
import numpy as np

# Quarterly sales data for 4 products over 4 quarters (in thousands)
sales_data = np.array([
    [120, 135, 158, 142],  # Product A
    [98, 112, 125, 138],   # Product B
    [87, 94, 89, 96],      # Product C
    [156, 178, 165, 189]   # Product D
])

product_names = [''Product A'', ''Product B'', ''Product C'', ''Product D'']
quarter_names = [''Q1'', ''Q2'', ''Q3'', ''Q4'']

print("=== Sales Data Analysis with NumPy ===")
print()
print("Raw Sales Data (in thousands):")
print("Products\\tQ1\\tQ2\\tQ3\\tQ4")
for i, product in enumerate(product_names):
    quarters = "\\t".join([str(sales_data[i, j]) for j in range(4)])
    print(f"{product}\\t{quarters}")
print()

# 1. Calculate total sales for each product
product_totals = np.sum(sales_data, axis=1)  # Sum across columns (quarters)
print("📊 Total Sales by Product:")
for i, (product, total) in enumerate(zip(product_names, product_totals)):
    print(f"  {product}: {total}k")
print()

# 2. Calculate total sales for each quarter
quarter_totals = np.sum(sales_data, axis=0)  # Sum across rows (products)
print("📈 Total Sales by Quarter:")
for quarter, total in zip(quarter_names, quarter_totals):
    print(f"  {quarter}: {total}k")
print()

# 3. Find best and worst performing products
best_product_idx = np.argmax(product_totals)
worst_product_idx = np.argmin(product_totals)
print("🏆 Performance Rankings:")
print(f"  Best: {product_names[best_product_idx]} ({product_totals[best_product_idx]}k total)")
print(f"  Worst: {product_names[worst_product_idx]} ({product_totals[worst_product_idx]}k total)")
print()

# 4. Calculate growth rate from Q1 to Q4
q1_sales = sales_data[:, 0]  # First quarter
q4_sales = sales_data[:, 3]  # Last quarter
growth_rates = ((q4_sales - q1_sales) / q1_sales) * 100

print("📈 Growth Rate (Q1 to Q4):")
for product, growth in zip(product_names, growth_rates):
    direction = "📈" if growth > 0 else "📉" if growth < 0 else "➡️"
    print(f"  {product}: {growth:+.1f}% {direction}")
print()

# 5. Advanced analysis
print("🔍 Advanced Statistics:")
print(f"  Overall mean sales: {np.mean(sales_data):.1f}k")
print(f"  Overall std deviation: {np.std(sales_data):.1f}k")
print(f"  Highest single quarter: {np.max(sales_data)}k")
print(f"  Lowest single quarter: {np.min(sales_data)}k")
print()

# Find the best quarter for each product
best_quarters = np.argmax(sales_data, axis=1)
print("🌟 Best Quarter for Each Product:")
for i, (product, best_q_idx) in enumerate(zip(product_names, best_quarters)):
    best_quarter = quarter_names[best_q_idx]
    best_sales = sales_data[i, best_q_idx]
    print(f"  {product}: {best_quarter} ({best_sales}k)")
print()

# Market share analysis
total_market = np.sum(sales_data)
market_shares = (product_totals / total_market) * 100
print("📊 Market Share:")
for product, share in zip(product_names, market_shares):
    print(f"  {product}: {share:.1f}%")
print()

# Quarterly trends
quarterly_growth = np.diff(quarter_totals) / quarter_totals[:-1] * 100
print("📈 Quarter-over-Quarter Growth:")
for i, growth in enumerate(quarterly_growth):
    from_q = quarter_names[i]
    to_q = quarter_names[i + 1]
    direction = "📈" if growth > 0 else "📉"
    print(f"  {from_q} to {to_q}: {growth:+.1f}% {direction}")

print()
print("🎯 Summary:")
print(f"  • Total market size: {total_market}k")
print(f"  • Best performing product: {product_names[best_product_idx]}")
print(f"  • Strongest growth: {product_names[np.argmax(growth_rates)]} ({growth_rates[np.argmax(growth_rates)]:+.1f}%)")
print(f"  • Most consistent: {product_names[np.argmin(np.std(sales_data, axis=1))]} (lowest variance)")

print("\\n🎉 Analysis completed successfully!")',
        ARRAY[
            'Use np.sum() with axis parameter for row/column sums',
            'Use np.argmax() and np.argmin() to find indices of extreme values',
            'Calculate percentage changes and growth rates',
            'Apply statistical functions like np.mean(), np.std()'
        ],
        'advanced',
        40,
        1,
        50,
        ARRAY['python', 'numpy', 'data-analysis', 'statistics'],
        '[]'::jsonb,
        true
    );

END $$;
