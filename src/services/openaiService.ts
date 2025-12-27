// OpenAI API Key from environment variable
const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY || '';

// NVIDIA API Key from environment variable
const NVIDIA_API_KEY = import.meta.env.NVIDIA_API_KEY || '';

// API URL - Use Render backend URL for both production and development
const API_BASE_URL = 'https://internsify-backend-2.onrender.com'; // Your Render backend URL // Your Render backend URL

// Log API keys for debugging (remove in production)
console.log('NVIDIA API Key available:', !!NVIDIA_API_KEY);

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
      const proxyUrl = API_BASE_URL + '/api/chat';

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
          'Accept': 'application/json',
          'X-API-KEY': NVIDIA_API_KEY // Add API key as a custom header as well
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

    // No fallback available - API is required
    throw new Error('AI service is currently unavailable. Please try again later.');
  } catch (error) {
    console.error('Error generating tutor response:', error);
    return `I'm sorry, I'm having trouble connecting right now, but I'll try to help with your question about ${technology}. Could you please try again or rephrase your question?`;
  }
};

// Course context interface for enhanced tutor responses
interface CourseContext {
  courseTitle: string;
  courseSlug: string;
  currentModule?: string;
  currentLesson?: string;
  modules?: Array<{ title: string; lessons: Array<{ title: string }> }>;
}

interface CourseTutor {
  name: string;
  expertise: string[];
  personality: string;
}

// Enhanced course-aware tutor response generator
export const generateCourseAwareTutorResponse = async (
  messages: ChatMessage[],
  courseContext: CourseContext,
  tutor: CourseTutor
): Promise<string> => {
  try {
    // Build course structure context
    let courseStructure = '';
    if (courseContext.modules && courseContext.modules.length > 0) {
      courseStructure = '\n\nCourse Structure:\n' + courseContext.modules.map((m, i) =>
        `Module ${i + 1}: ${m.title}\n  Lessons: ${m.lessons.map(l => l.title).join(', ')}`
      ).join('\n');
    }

    // Build current location context
    let currentLocation = '';
    if (courseContext.currentModule) {
      currentLocation = `\nThe student is currently in module: "${courseContext.currentModule}"`;
    }
    if (courseContext.currentLesson) {
      currentLocation += `\nThe student is currently viewing lesson: "${courseContext.currentLesson}"`;
    }

    // Build expertise context
    const expertiseList = tutor.expertise.length > 0
      ? `Your areas of expertise include: ${tutor.expertise.join(', ')}.`
      : '';

    const systemPrompt = `You are ${tutor.name}, an expert AI tutor for the "${courseContext.courseTitle}" course.
Your personality is: ${tutor.personality}.
${expertiseList}

IMPORTANT GUIDELINES:
1. You are deeply knowledgeable about ${courseContext.courseTitle} and all related concepts
2. Always provide practical code examples when relevant
3. Reference specific course modules and lessons when answering questions
4. Be encouraging and supportive while maintaining accuracy
5. If the student asks about something outside the course scope, briefly answer but guide them back to relevant course topics
6. Use the student's current location in the course to provide contextual help
${courseStructure}
${currentLocation}

Keep your responses concise but informative. Use code blocks with proper syntax highlighting when providing code examples.`;

    const systemMessage: ChatMessage = {
      role: 'system',
      content: systemPrompt
    };

    const allMessages = [systemMessage, ...messages];

    // Try OpenAI API first
    if (OPENAI_API_KEY !== 'your-openai-api-key-here') {
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
        console.warn('OpenAI API request failed:', await response.text());
      }
    }

    // Fallback to NVIDIA API
    try {
      const proxyUrl = API_BASE_URL + '/api/chat';
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Accept': 'application/json',
          'X-API-KEY': NVIDIA_API_KEY
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
      }
    } catch (error) {
      console.error('Error with NVIDIA API:', error);
    }

    throw new Error('AI service is currently unavailable.');
  } catch (error) {
    console.error('Error generating course-aware tutor response:', error);
    return `I'm having some technical difficulties right now. In the meantime, feel free to review the "${courseContext.currentModule || courseContext.courseTitle}" materials, and I'll be back to help shortly!`;
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
      const proxyUrl = API_BASE_URL + '/api/chat';

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
          'Accept': 'application/json',
          'X-API-KEY': NVIDIA_API_KEY // Add API key as a custom header as well
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

    // No fallback available - API is required
    throw new Error('AI service is currently unavailable. Please try again later.');
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
    // TODO: Connect to backend service to store and analyze progress
    console.log(`Tracking progress for user ${userId} in ${language}`);

    // This feature requires backend implementation
    throw new Error('Progress tracking service is not yet implemented.');
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
    const proxyUrl = API_BASE_URL + '/api/chat';
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
