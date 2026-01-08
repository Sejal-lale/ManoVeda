import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mood } from "./MoodTracker";

interface Message {
  id: string;
  text: string;
  sender: "ai" | "user";
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood: Mood | null;
}

const getInitialMessage = (mood: Mood | null): string => {
  switch (mood) {
    case "calm":
      return "Hey. Nice to see you feeling settled. What's on your mind?";
    case "okay":
      return "Hey. I'm here with you. No fixing needed.";
    case "stressed":
      return "Hey. Sounds like things feel heavy. We can go slow today.";
    case "overwhelmed":
      return "Hey. That's a lot to carry. Let's just breathe for a moment.";
    case "sad":
      return "Hey. I'm here. You don't have to explain anything.";
    case "numb":
      return "Hey. Sometimes words don't come. That's okay. I'm just here.";
    default:
      return "Hey. I'm here with you. No fixing needed.";
  }
};

export const ChatModal = ({ isOpen, onClose, currentMood }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "1",
          text: getInitialMessage(currentMood),
          sender: "ai",
        },
      ]);
    }
  }, [isOpen, currentMood]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I hear you. What part feels heaviest right now?",
        "That makes sense. You're not alone in feeling this way.",
        "Take your time. There's no rush here.",
        "It sounds like you're carrying a lot. What would help right now?",
        "I'm here. Sometimes just saying it out loud helps.",
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "ai",
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[hsl(var(--overlay))]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chat Container */}
      <div className={cn(
        "relative bg-card w-full sm:max-w-md h-[80vh] sm:h-[70vh] sm:rounded-[1.25rem]",
        "rounded-t-[1.25rem] sm:rounded-b-[1.25rem]",
        "shadow-[var(--shadow-soft)]",
        "flex flex-col",
        "animate-fade-up"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-medium text-foreground">I'm Here</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] p-4 rounded-2xl",
                message.sender === "ai"
                  ? "bg-[hsl(var(--chat-bg))] text-foreground mr-auto"
                  : "bg-primary text-primary-foreground ml-auto"
              )}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type something..."
              className={cn(
                "flex-1 px-4 py-3 rounded-2xl",
                "bg-muted text-foreground placeholder:text-muted-foreground",
                "border-none outline-none",
                "focus:ring-2 focus:ring-ring/30"
              )}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={cn(
                "p-3 rounded-full",
                "bg-primary text-primary-foreground",
                "transition-all duration-300",
                "hover:scale-105 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
