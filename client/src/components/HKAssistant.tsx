import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HKAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialGreeting = `Greetings. I am H.K., your bridge to understanding advanced materials science and the Architected Multi-Modal Coupling hypothesis.

I'm here to provide step-by-step guidance on:
• The AMC composite architecture and its constituents
• Patent claims and manufacturing processes
• Material science concepts and quantum sensing
• Research methodology and validation frameworks

How may I assist you today?`;

export default function HKAssistant({ isOpen, onClose }: HKAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialGreeting,
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
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call the backend)
    setTimeout(() => {
      const responses: Record<string, string> = {
        amc: 'The Architected Multi-Modal Coupling (AMC) hypothesis proposes that a structured composite integrating hemp-derived carbon, quartz, tourmaline, magnetite, and rare-earth dopants can exhibit system-level multi-modal transduction not available from any single component. The key innovation is the deliberate engineering of coupling geometry to create constructive interaction pathways.',
        constituent: 'The composite integrates five functional constituents: (1) Hemp-derived carbonaceous matrix for structural backbone and electron transport, (2) Quartz for piezoelectric response and mechanical rigidity, (3) Tourmaline for dual piezoelectric + pyroelectric capability, (4) Magnetite for ferrimagnetic coupling, and (5) Rare-earth dopants for optical transduction.',
        quantum: 'Rare-earth dopants (Eu, Nd, Er, Yb, Ce) possess partially filled 4f electron shells with narrow spectral emission lines. When embedded in crystalline hosts, crystal-field effects cause energy-level splitting. This enables quantum sensing of multiple physical parameters simultaneously at room temperature.',
        manufacturing: 'The 7-step manufacturing process: (1) Fiber Preparation - source and condition hemp, (2) Pyrolysis - heat at 700–1400°C to create carbon matrix, (3) Crystal Synthesis - prepare all constituents, (4) Dispersion - distribute uniformly, (5) Binder Addition - add polymer matrix, (6) Forming & Curing - shape and cure composite, (7) QC & Electrodes - test and integrate electrodes.',
        default: 'That\'s an excellent question. The AMC hypothesis represents a novel approach to materials engineering where emergent system-level properties arise from the deliberate architectural arrangement of constituent materials. Each component contributes specific transduction mechanisms that couple constructively through optimized geometry. Would you like to explore a specific aspect in more detail?',
      };

      let response = responses.default;

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('amc') || lowerInput.includes('architected')) {
        response = responses.amc;
      } else if (lowerInput.includes('constituent') || lowerInput.includes('component')) {
        response = responses.constituent;
      } else if (lowerInput.includes('quantum') || lowerInput.includes('dopant')) {
        response = responses.quantum;
      } else if (lowerInput.includes('manufacturing') || lowerInput.includes('process')) {
        response = responses.manufacturing;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-4 right-4 w-96 h-96 bg-card border border-primary rounded-lg shadow-2xl flex flex-col z-50 neon-border"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">H.K. ASSISTANT</h3>
              <p className="text-xs text-muted-foreground font-mono">Horace King Bridge Builder</p>
            </div>
            <motion.button
              onClick={onClose}
              className="p-1 hover:bg-background rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-primary text-background'
                      : 'bg-background border border-border text-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-background border border-border p-3 rounded">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ delay: i * 0.1, repeat: Infinity, duration: 0.6 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-border flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about AMC, materials, or research..."
              className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
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
