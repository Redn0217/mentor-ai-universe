// OpenAI API Key from environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// NVIDIA API Key from environment variable
const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY || '';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: ChatMessage;
    finish_reason: string;
    index: number;
  }[];
}

// Keep track of recent interactions for debugging purposes
let lastApiError: string | null = null;

export const generateTutorResponse = async (
  messages: ChatMessage[],
  technology: string
): Promise<string> => {
  try {
    // Try using OpenAI API first
    if (OPENAI_API_KEY !== 'your-openai-api-key-here') {
      // Prepare context for the specific technology
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `You are an expert tutor in ${technology}. Provide helpful, accurate, and educational responses to help the user learn ${technology}. Include code examples when relevant. Keep your responses concise but informative.`
      };

      const allMessages = [systemMessage, ...messages];

      // Use OpenAI API directly
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: allMessages,
          temperature: 0.7,
          max_tokens: 1000,
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      } else {
        const errorText = await response.text();
        console.warn('OpenAI API request failed:', errorText);
        lastApiError = errorText;
        // Fall through to backup options below
      }
    }

    // Fallback to NVIDIA API as a second option
    try {
      // Use the proxy URL to avoid CORS issues
      const proxyUrl = '/api/chat';

      const systemMessage: ChatMessage = {
        role: 'system',
        content: `You are an expert tutor in ${technology}. Provide helpful, accurate, and educational responses to help the user learn ${technology}. Include code examples when relevant. Keep your responses concise but informative.`
      };

      const allMessages = [systemMessage, ...messages];

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta/llama-4-maverick-17b-128e-instruct',
          messages: allMessages,
          temperature: 1.0,
          top_p: 1.0,
          max_tokens: 512
        })
      });

      if (response.ok) {
        const data: OpenAIResponse = await response.json();
        return data.choices[0].message.content;
      } else {
        console.warn('NVIDIA API request failed:', await response.text());
        // Fall through to mock response
      }
    } catch (error) {
      console.error('Error with NVIDIA API:', error);
      // Fall through to mock response
    }
    
    // Ultimate fallback: Use mock response
    console.log('API error, using fallback mock response');
    
    // Generate a simple but helpful mock response based on the technology and last message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    const mockResponses: Record<string, string[]> = {
      'JavaScript': [
        `That's a great question about JavaScript! When working with JavaScript, remember that it's a versatile language used for web development. For your specific question about "${lastUserMessage.slice(0, 30)}...", I'd recommend exploring the MDN documentation for detailed examples.`,
        `JavaScript is all about making websites interactive. For your question, I'd suggest trying: \`\`\`javascript\nconsole.log('Hello World');\n// Try breaking down your problem into smaller steps\n\`\`\``,
        `When learning JavaScript, focus on fundamentals like variables, functions, and DOM manipulation. This will help you understand more complex concepts later.`
      ],
      'Python': [
        `Python is known for its readability and simplicity. For your question about "${lastUserMessage.slice(0, 30)}...", I recommend checking the official Python documentation.`,
        `In Python, you might approach this with: \`\`\`python\ndef example_function():\n    print("This is how you might solve your problem")\n    return True\n\`\`\``,
        `Python's extensive library ecosystem makes it powerful for tasks ranging from web development to data science. Keep practicing!`
      ],
      'React': [
        `React is a component-based library that makes UI development more efficient. For your question about "${lastUserMessage.slice(0, 30)}...", check the React documentation.`,
        `In React, components are the building blocks. Try: \`\`\`jsx\nfunction MyComponent() {\n  return <div>This is a simple component</div>;\n}\n\`\`\``,
        `Remember that React uses a virtual DOM to optimize rendering. This is crucial for building performant web applications.`
      ]
    };

    // Get responses for the specific technology or use generic responses
    const techResponses = mockResponses[technology] || [
      `I'd be happy to help you learn more about ${technology}! For your question about "${lastUserMessage.slice(0, 30)}...", I recommend exploring official documentation and tutorials.`,
      `${technology} is an important skill in today's tech landscape. Keep practicing and building projects to gain experience.`,
      `When learning ${technology}, focus on understanding core concepts before diving into complex applications. This approach will help you build a solid foundation.`
    ];
    
    // Randomly select one response
    return techResponses[Math.floor(Math.random() * techResponses.length)];
  } catch (error) {
    console.error('Error generating tutor response:', error);
    return `I'm sorry, I'm having trouble connecting right now, but I'll try to help with your question about ${technology}. Could you please try again or rephrase your question?`;
  }
};

export const generateCodeFeedback = async (
  code: string,
  language: string
): Promise<string> => {
  try {
    // Try using OpenAI API first
    if (OPENAI_API_KEY !== 'your-openai-api-key-here') {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `You are an expert coding tutor specializing in ${language}. Analyze the provided code, identify potential issues, suggest improvements for best practices, and provide constructive feedback. Be specific and educational in your feedback.`
        },
        {
          role: 'user',
          content: `Please review this ${language} code and provide feedback:\n\n\`\`\`${language}\n${code}\n\`\`\``
        }
      ];

      // Use OpenAI API directly
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      } else {
        const errorText = await response.text();
        console.warn('OpenAI API request failed:', errorText);
        lastApiError = errorText;
        // Fall through to backup options
      }
    }

    // Fallback to NVIDIA API
    try {
      // Use the proxy URL to avoid CORS issues
      const proxyUrl = '/api/chat';

      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `You are an expert coding tutor specializing in ${language}. Analyze the provided code, identify potential issues, suggest improvements for best practices, and provide constructive feedback. Be specific and educational in your feedback.`
        },
        {
          role: 'user',
          content: `Please review this ${language} code and provide feedback:\n\n\`\`\`${language}\n${code}\n\`\`\``
        }
      ];

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta/llama-4-maverick-17b-128e-instruct',
          messages: messages,
          temperature: 1.0,
          top_p: 1.0,
          max_tokens: 512
        })
      });

      if (response.ok) {
        const data: OpenAIResponse = await response.json();
        return data.choices[0].message.content;
      } else {
        console.warn('NVIDIA API request failed:', await response.text());
        // Fall through to mock response
      }
    } catch (error) {
      console.error('Error with NVIDIA API:', error);
      // Fall through to mock response
    }
    
    // Mock response as ultimate fallback
    console.log('API error, using fallback mock feedback response');

    // Generate language-specific mock code feedback
    const mockFeedback: Record<string, string> = {
      'javascript': `Here's my feedback on your JavaScript code:

**Strengths:**
- Your code structure is generally clear and readable.
- Good use of functions to organize your logic.

**Areas for improvement:**
- Consider adding more comments to explain complex sections.
- Variable names could be more descriptive.
- Error handling could be improved with try/catch blocks.
- Consider using const for variables that don't need to be reassigned.

**Example improvement:**
\`\`\`javascript
// Before
function greet(name) {
  return \`Hello, \${name}!\`;
}

// After
/**
 * Creates a personalized greeting message
 * @param {string} name - The name to include in the greeting
 * @return {string} The formatted greeting
 */
const createGreeting = (name) => {
  if (!name) return 'Hello, guest!';
  return \`Hello, \${name}!\`;
};
\`\`\`

Keep practicing!`,

      'python': `Here's my feedback on your Python code:

**Strengths:**
- Good use of Python's syntax features.
- Code is generally readable.

**Areas for improvement:**
- Consider following PEP 8 style guidelines.
- Add docstrings to functions for better documentation.
- Variable names could be more descriptive.
- Consider adding type hints for better code maintenance.

**Example improvement:**
\`\`\`python
# Before
def greet(name):
    return f"Hello, {name}!"

# After
def greet(name: str) -> str:
    """
    Create a personalized greeting message.
    
    Args:
        name: The name to include in the greeting
        
    Returns:
        A formatted greeting string
    """
    if not name:
        return "Hello, guest!"
    return f"Hello, {name}!"
\`\`\`

Keep up the good work!`,

      'java': `Here's my feedback on your Java code:

**Strengths:**
- Your class structure follows Java conventions.
- Good encapsulation of functionality.

**Areas for improvement:**
- Consider adding Javadoc comments.
- Error handling could be improved.
- Naming conventions could be more consistent.
- Consider using more efficient data structures where applicable.

**Example improvement:**
\`\`\`java
// Before
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// After
/**
 * Main application class that demonstrates greeting functionality.
 */
public class GreetingApp {
    /**
     * Creates a personalized greeting message
     * 
     * @param name The name to include in the greeting
     * @return The formatted greeting
     */
    public static String createGreeting(String name) {
        if (name == null || name.isEmpty()) {
            return "Hello, guest!";
        }
        return "Hello, " + name + "!";
    }
    
    public static void main(String[] args) {
        System.out.println(createGreeting("World"));
    }
}
\`\`\`

Keep coding!`,

      'cpp': `Here's my feedback on your C++ code:

**Strengths:**
- Good use of standard library features.
- Clear program structure.

**Areas for improvement:**
- Consider adding more error handling.
- Memory management could be improved.
- Variable initialization practices could be enhanced.
- Comments would help explain your intentions.

**Example improvement:**
\`\`\`cpp
// Before
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}

// After
/**
 * @file greeting.cpp
 * @brief Demonstrates greeting functionality
 */
#include <iostream>
#include <string>

/**
 * Creates a personalized greeting message
 * @param name The name to include in the greeting
 * @return The formatted greeting
 */
std::string createGreeting(const std::string& name) {
    if (name.empty()) {
        return "Hello, guest!";
    }
    return "Hello, " + name + "!";
}

int main() {
    std::string userName = "World";
    std::cout << createGreeting(userName) << std::endl;
    return 0;
}
\`\`\`

Keep practicing!`
    };
    
    return mockFeedback[language.toLowerCase()] || 
      `I've analyzed your ${language} code, and here are some general observations:

**Strengths:**
- Your code structure is generally clear.
- Good use of language features.

**Areas for improvement:**
- Consider adding more comments to explain your logic.
- Variable names could be more descriptive.
- Error handling could be improved.
- Look for opportunities to make your code more modular.

Keep practicing and referring to ${language} best practices!`;
  } catch (error) {
    console.error('Error generating code feedback:', error);
    return `I'm having trouble analyzing your code right now. Please try again in a moment.`;
  }
};

// New function to track user's coding progress
export const trackCodingProgress = async (
  userId: string,
  language: string,
  codeSubmission: {
    code: string,
    challenge?: string,
    timeSpent?: number,
    completed: boolean
  }
): Promise<{
  progress: number,
  strengths: string[],
  areasToImprove: string[],
  nextChallengeRecommendation?: string
}> => {
  try {
    // This would ideally connect to a backend service to store and analyze progress
    // For now, we'll return mock progress data
    
    console.log(`Tracking progress for user ${userId} in ${language}`);
    
    // Mock progress analysis
    const mockProgress = {
      progress: Math.floor(Math.random() * 100),
      strengths: [
        `Good understanding of ${language} syntax`,
        `Effective use of functions and organization`,
        `Clean code style and readability`
      ],
      areasToImprove: [
        `Error handling and edge cases`,
        `Code optimization and efficiency`,
        `Documentation and comments`
      ],
      nextChallengeRecommendation: codeSubmission.completed 
        ? `Try building a more complex application using ${language} data structures`
        : `Continue working on the current challenge, focusing on error handling`
    };
    
    return mockProgress;
  } catch (error) {
    console.error('Error tracking coding progress:', error);
    return {
      progress: 0,
      strengths: ['Unable to analyze strengths at this time'],
      areasToImprove: ['Unable to analyze areas for improvement at this time']
    };
  }
};

// Function to verify if API keys are working
export const testAPIConnection = async (): Promise<{
  openaiWorking: boolean,
  nvidiaWorking: boolean,
  lastError: string | null
}> => {
  let openaiWorking = false;
  let nvidiaWorking = false;
  
  // Test OpenAI connection if key is available
  if (OPENAI_API_KEY !== 'your-openai-api-key-here') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{role: 'user', content: 'test'}],
          max_tokens: 5
        })
      });
      
      openaiWorking = response.ok;
    } catch (e) {
      console.error('OpenAI test failed:', e);
    }
  }
  
  // Test NVIDIA API connection
  try {
    const proxyUrl = '/api/chat';
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-4-maverick-17b-128e-instruct',
        messages: [{role: 'user', content: 'test'}],
        max_tokens: 5
      })
    });
    
    nvidiaWorking = response.ok;
  } catch (e) {
    console.error('NVIDIA API test failed:', e);
  }
  
  return {
    openaiWorking,
    nvidiaWorking,
    lastError: lastApiError
  };
};
