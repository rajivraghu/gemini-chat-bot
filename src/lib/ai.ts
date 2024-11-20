import { Message } from '../types';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/chat/completions';
const API_KEY = 'AIzaSyBzjs8r5ga5fuZmrLwIq_dI1TYK4IdbeQ4';

export const generateResponse = async (messages: Message[]) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-1.5-flash",
        messages: messages.map(({ role, content }) => ({
          role: role === 'assistant' ? 'model' : 'user',
          content
        }))
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return {
      role: 'assistant',
      content: data.choices[0].message.content,
    };
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
};