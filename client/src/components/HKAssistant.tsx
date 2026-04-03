import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
import { TRPCClientError } from "@trpc/client";
import { trpc } from "@/lib/trpc";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface HKAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialGreeting = `Greetings. I am H.K., your bridge for this portfolio — materials (Tamerian / AMC), digital equity (TechBridge), and sovereign cybersecurity (Queen Califia CyberAI).

When the Claude API is configured on the server, I answer with full context. Otherwise you will see a short local fallback with links to the live sites.

How may I assist you today?`;

const fallbackReply =
  "The live model is offline (set ANTHROPIC_API_KEY on the server). For depth on each line of work, open the live sites: Queen Califia CyberAI — https://queencalifia-cyberai.web.app/ · Tamerian Materials — https://tamerian-materials.com/ · TechBridge Collective — https://techbridge-collective.org/ . The AMC materials hypothesis is summarized under Materials and Research here.";

export default function HKAssistant({ isOpen, onClose }: HKAssistantProps) {
  const { logAssistantOpen } = usePortfolioAnalytics();
  const chat = trpc.hk.chat.useMutation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: initialGreeting,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) logAssistantOpen();
  }, [isOpen, logAssistantOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chat.isPending]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chat.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const history = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const { reply } = await chat.mutateAsync({ messages: history });
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      let body = fallbackReply;
      if (err instanceof TRPCClientError) {
        const code = err.data?.code ?? err.shape?.data?.code;
        if (
          code === "PRECONDITION_FAILED" ||
          err.message.includes("ANTHROPIC")
        ) {
          body = fallbackReply;
        } else {
          body = `Request error: ${err.message}`;
        }
      }
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: body,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const loading = chat.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[min(24rem,50vh)] sm:h-96 bg-card border border-primary rounded-lg shadow-2xl flex flex-col z-50 neon-border"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-bold text-foreground">H.K. ASSISTANT</h3>
              <p className="text-xs text-muted-foreground font-mono">
                Claude-powered · portfolio context
              </p>
            </div>
            <motion.button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-background rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-primary text-background"
                      : "bg-background border border-border text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-background border border-border p-3 rounded">
                  <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          delay: i * 0.1,
                          repeat: Infinity,
                          duration: 0.6,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-border flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about materials, TechBridge, Queen Califia, or research..."
              className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              disabled={loading}
            />
            <motion.button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-primary text-background rounded hover:bg-primary/80 disabled:opacity-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
