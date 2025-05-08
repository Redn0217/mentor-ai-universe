
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

export const generateTutorResponse = async (
  messages: ChatMessage[],
  technology: string
): Promise<string> => {
  try {
    // Prepare context for the specific technology
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an expert tutor in ${technology}. Provide helpful, accurate, and educational responses to help the user learn ${technology}. Include code examples when relevant. Keep your responses concise but informative.`
    };
    
    const allMessages = [systemMessage, ...messages];
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a cost-effective model
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating tutor response:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
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
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating code feedback:', error);
    return "I'm sorry, I'm having trouble analyzing your code right now. Please try again in a moment.";
  }
};
