import { Message } from '../types';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/chat/completions';
const API_KEY = 'AIzaSyCecwJK0TYoL63Qr5YDlRUFtvB9iQRXsMw';


export const generateResponse = async (userInput: string, messages: Message[] = []) => {
  try {
    // Add the user's input to the messages array
    //alert(userInput);
    messages.push({ role: 'user', content: userInput });

    // Debug: Log the messages array before sending the request
    console.log('Sending messages:', messages);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gemini-2.0-flash-exp",
        messages: messages.map(({ role, content }) => ({
          role: role === 'assistant' ? 'model' : 'user', // Ensure 'assistant' is mapped to 'model'
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

    // Add the assistant's response to the messages array
    const assistantResponse = {
      role: 'assistant',
      content: data.choices[0].message.content,
    };

    // Return the assistant's response and the updated messages array
    return assistantResponse;
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
};