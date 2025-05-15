import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.svg";
import { generateContentWithGemini } from "@/services/ChatbotService";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      text: "Hi there! I'm your FutureProspect assistant. How can I help you with your career or internship questions today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  console.log(apiKey);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newUserMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const response = await generateContentWithGemini(
          inputValue,
          messages.map(m => ({ sender: m.sender, text: m.text })),
          apiKey
        );

        const newBotMessage = {
          id: Date.now().toString(),
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, newBotMessage]);
        return; // Success! Exit the retry loop
      } catch (error) {
        if (error.message === "Rate limit exceeded. Please try again later.") {
          retryCount++;
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Rate limit exceeded. Retrying in ${waitTime}ms (attempt ${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
      
          
          console.error("Chat error:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to get response",
            variant: "destructive",
          });
          return; // Exit the retry loop for non-rate-limit errors
        }
      } finally {
        setIsTyping(false);
      }
    }

    // If we reach here, all retries have failed
    console.error("API request failed after multiple retries.");
    toast({
      title: "Error",
      description: "Failed to get response after multiple retries. Please try again later.",
      variant: "destructive",
    });
    setIsTyping(false); // Ensure isTyping is set to false after all retries
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <motion.button
        className="fixed z-50 bottom-6 right-6 bg-primary text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-40 bottom-20 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-primary/5 border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <img src={logo} alt="FutureProspect" className="object-cover" />
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">FutureProspect Assistant</h3>
                  <p className="text-xs text-gray-500">AI-powered career guidance</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm rounded-xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white text-gray-800 border border-gray-200 rounded-xl rounded-tl-none px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-end gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="min-h-[50px] resize-none"
                  disabled={isTyping}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === "" || isTyping}
                  className="h-10 w-10 rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;