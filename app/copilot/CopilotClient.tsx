'use client';

import React, { useState, useRef, useEffect } from 'react';
import { askCopilot } from './actions';
import { Button } from '../../components/ui/button';
import { Send, Sparkles, User, Bot, Loader2, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { text: 'Explain my persona', query: 'What is my current persona and what are its strengths and opportunities?' },
  { text: 'Show my emissions summary', query: 'What are my total carbon emissions in the last 30 days and what category is largest?' },
  { text: 'What is my active mission?', query: 'Tell me about my active 30-Day Mission and what week I am on.' },
  { text: 'How do I cut transport footprint?', query: 'Give me suggestions on how to reduce my transportation carbon emissions.' },
  { text: 'Compare my twin scenarios', query: 'What are the moderate and aggressive scenarios for my Carbon Twin projections?' },
];

export function CopilotClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your VERDANCE Sustainability Copilot. I have analyzed your household, transportation, diet, and shopping footprint history. I can help explain your carbon twin projections, breakdown your persona, suggest active missions, or guide your daily savings. What would you like to explore?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await askCopilot(text);
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking copilot:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'I encountered an error trying to process that request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm your VERDANCE Sustainability Copilot. I have analyzed your household, transportation, diet, and shopping footprint history. I can help explain your carbon twin projections, breakdown your persona, suggest active missions, or guide your daily savings. What would you like to explore?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] max-w-4xl mx-auto p-4 md:p-6 bg-bg">
      {/* Copilot Header */}
      <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-text-primary flex items-center gap-1.5">
              VERDANCE Copilot
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                AI Agent
              </span>
            </h1>
            <p className="text-xs text-text-secondary">Your interactive carbon twin and footprint guide</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
          title="Clear Chat History"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn('flex w-full items-start gap-3', isUser ? 'justify-end' : 'justify-start')}
              >
                {/* Assistant Icon */}
                {!isUser && (
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed border',
                    isUser
                      ? 'bg-primary text-primary-foreground border-primary rounded-tr-none'
                      : 'bg-surface text-text-primary border-border rounded-tl-none'
                  )}
                >
                  <p className="whitespace-pre-line font-sans">{message.content}</p>
                  
                  <span
                    className={cn(
                      'text-[9px] mt-2 block font-medium font-tabular',
                      isUser ? 'text-primary-foreground/70 text-right' : 'text-text-muted'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* User Icon */}
                {isUser && (
                  <div className="h-9 w-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0 border border-accent/20">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full items-start gap-3 justify-start"
            >
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-surface text-text-primary border border-border rounded-2xl rounded-tl-none p-4 shadow-xs">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-text-secondary font-medium">Analyzing footprint telemetry...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Triggers */}
      <div className="mt-4">
        {messages.length === 1 && !isLoading && (
          <div className="space-y-2 mb-4">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Suggested Questions</span>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.query)}
                  className="text-xs font-semibold text-text-secondary bg-surface border border-border hover:border-primary hover:text-primary px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-xs flex items-center gap-1"
                >
                  {prompt.text}
                  <ArrowRight className="h-3 w-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="mt-2 flex items-center space-x-2 bg-surface border border-border rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all shadow-sm"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot something (e.g. 'How can I save carbon and electricity?')..."
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          variant="primary"
          size="sm"
          className="rounded-xl h-10 px-4 space-x-1 cursor-pointer"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
