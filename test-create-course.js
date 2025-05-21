// Script to test creating a new course

const newCourse = {
  id: "react",
  slug: "react",
  title: "React",
  description: "Learn React and build modern user interfaces with this popular JavaScript library.",
  icon: "code",
  color: "#61DAFB",
  modules: [
    {
      id: "module1",
      title: "React Fundamentals",
      description: "Learn the core concepts of React.",
      lessons: [
        {
          id: "lesson1",
          title: "Introduction to React",
          content: "Overview of React and its role in modern web development.",
          duration: 20
        }
      ],
      exercises: [],
      resources: []
    }
  ],
  tutor: {
    name: "React Master",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=React"
  }
};

async function createCourse() {
  try {
    console.log('Creating new course...');
    const response = await fetch('http://localhost:8081/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCourse),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('Course created successfully!');
    } else {
      console.error('Failed to create course:', data.error);
    }
  } catch (error) {
    console.error('Error creating course:', error);
  }
}

createCourse();
