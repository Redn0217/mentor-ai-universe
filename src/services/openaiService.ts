
// OpenAI API endpoints using NVIDIA's API
const API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const API_KEY = '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';

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

// This function generates mock responses for development when the API is not available
const generateMockResponse = (prompt: string, technology: string): string => {
  // Create a simple response based on the input
  if (prompt.toLowerCase().includes('hello') || prompt.toLowerCase().includes('hi')) {
    return `Hello! I'm your ${technology} tutor. How can I help you learn ${technology} today?`;
  } else if (prompt.toLowerCase().includes('example')) {
    return `Here's a simple ${technology} example:\n\n\`\`\`\nconsole.log("This is a ${technology} example");\n\`\`\`\n\nWould you like me to explain how this works?`;
  } else {
    return `That's an interesting question about ${technology}. In ${technology}, we would typically approach this by first understanding the core concepts, then applying them in practical scenarios. Can you tell me more about what specific aspect of ${technology} you're interested in learning?`;
  }
};

export const generateTutorResponse = async (
  messages: ChatMessage[],
  technology: string
): Promise<string> => {
  try {
    // Check for the latest user message
    const userMessage = messages.filter(msg => msg.role === 'user').pop()?.content || '';
    
    // Prepare context for the specific technology
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an expert tutor in ${technology}. Provide helpful, accurate, and educational responses to help the user learn ${technology}. Include code examples when relevant. Keep your responses concise but informative.`
    };
    
    const allMessages = [systemMessage, ...messages];
    
    try {
      // First try the real API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
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
        console.warn('API request failed, falling back to mock response');
        throw new Error('API request failed');
      }
    } catch (apiError) {
      console.warn('API error, using fallback mock response', apiError);
      // If API call fails, use mock response as fallback
      return generateMockResponse(userMessage, technology);
    }
  } catch (error) {
    console.error('Error generating tutor response:', error);
    return "I'm having trouble connecting right now, but I'll try to help with your question about " + technology + ". Could you please try again or rephrase your question?";
  }
};

export const generateCodeFeedback = async (
  code: string,
  language: string
): Promise<string> => {
  try {
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
    
    try {
      // First try the real API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
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
        // If API call fails, use mock response
        return `Here's some feedback on your ${language} code:\n\n1. Your code structure looks good overall.\n2. Consider adding more comments to explain complex logic.\n3. Make sure to follow ${language} best practices for variable naming.\n\nKeep practicing, you're doing well!`;
      }
    } catch (apiError) {
      console.warn('API error, using fallback mock response');
      // Fallback mock response for code feedback
      return `Here's some feedback on your ${language} code:\n\n1. Your code structure looks good overall.\n2. Consider adding more comments to explain complex logic.\n3. Make sure to follow ${language} best practices for variable naming.\n\nKeep practicing, you're doing well!`;
    }
  } catch (error) {
    console.error('Error generating code feedback:', error);
    return "I'm having trouble analyzing your code right now. Please try again in a moment.";
  }
};
