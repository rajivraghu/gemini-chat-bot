import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { useChatStore } from './store/chatStore';
import { generateResponse } from './lib/ai';
import { Bot, Trash2 } from 'lucide-react';

function App() {
  const { messages, isLoading, error, addMessage, setLoading, setError, clearMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    addMessage({ role: 'user', content });
    setLoading(true);
    setError(null);

    try {
      const response = await generateResponse(messages);
      addMessage(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
          </div>
          <button
            onClick={clearMessages}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"
            title="Clear chat history"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          {isLoading && <TypingIndicator />}
          {error && (
            <div className="p-4 m-4 text-red-400 bg-red-900/20 rounded-lg">
              Error: {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}

export default App;