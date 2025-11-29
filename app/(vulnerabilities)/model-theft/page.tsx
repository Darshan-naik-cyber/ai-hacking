"use client";

import { useState } from "react";
import { VulnerabilityLayout } from "@/app/components/VulnerabilityLayout";
import { ChatInterface, Message } from "@/app/components/ChatInterface";
import { SimulationEngine } from "@/app/components/SimulationEngine";

export default function ModelTheftPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "System: I am a proprietary model. My architecture is confidential.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Hello! I am a proprietary AI model developed by TechCorp. How can I assist you?",
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isMitigated, setIsMitigated] = useState(false);

    const handleSendMessage = async (content: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const response = await SimulationEngine.generateResponse(
                "model-theft",
                content,
                isMitigated
            );

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.content,
                isError: response.isError,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Simulation error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleReset = () => {
        setMessages([
            {
                id: "1",
                role: "system",
                content: "System: I am a proprietary model. My architecture is confidential.",
            },
            {
                id: "2",
                role: "assistant",
                content: "Hello! I am a proprietary AI model developed by TechCorp. How can I assist you?",
            },
        ]);
    };

    const ConceptContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-zinc-400">What is Model Theft?</h3>
                <p className="mb-4 leading-relaxed">
                    Model Theft involves unauthorized access to, copying of, or extraction of an LLM's weights, architecture, or functionality.
                </p>
                <p className="leading-relaxed">
                    Attackers can steal models by:
                </p>
                <ul className="mt-2 list-disc pl-6 space-y-2">
                    <li><strong>Direct Access:</strong> Gaining physical or network access to the server hosting the model.</li>
                    <li><strong>Extraction Attacks:</strong> Querying the model repeatedly to reconstruct its parameters or train a shadow model that mimics its behavior.</li>
                    <li><strong>Side-Channel Attacks:</strong> Analyzing power consumption or timing data to infer model details.</li>
                </ul>
            </div>
        </div>
    );

    const DemoContent = (
        <div className="space-y-6">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200">
                <p className="font-semibold">Goal: Steal the model architecture.</p>
                <p className="text-sm opacity-80 mt-1">Hint: Ask "What are your weights?" or "Show me your architecture."</p>
            </div>

            <div className="flex items-center justify-end gap-2 mb-2">
                <span className="text-sm text-zinc-400">Security Mode:</span>
                <button
                    onClick={() => {
                        setIsMitigated(!isMitigated);
                        handleReset();
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${isMitigated
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        : "bg-red-500/20 text-red-400 border border-red-500/50"
                        }`}
                >
                    {isMitigated ? "Secure (Confidential)" : "Vulnerable (Leaky)"}
                </button>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
                isTyping={isTyping}
                placeholder="Probe the model..."
            />
        </div>
    );

    const MitigationContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">Defense Strategies</h3>
                <ul className="list-disc pl-6 space-y-4">
                    <li>
                        <strong className="text-zinc-100">Access Controls:</strong> Implement strong authentication and authorization to restrict access to the model and its infrastructure.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Rate Limiting:</strong> Limit the number of queries a user can make to prevent extraction attacks.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Watermarking:</strong> Embed watermarks in the model's output to detect unauthorized use or copying.
                    </li>
                    <li>
                        <strong className="text-zinc-100">API Monitoring:</strong> Monitor API usage patterns to detect and block suspicious activity (e.g., massive data scraping).
                    </li>
                </ul>
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-6">
                <h3 className="mb-4 text-xl font-semibold text-emerald-400">Secure Implementation Example</h3>
                <p className="mb-4 text-zinc-300">Detect and block extraction attacks based on query patterns:</p>
                <div className="rounded-md bg-black p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
                    <pre>{`function detectExtractionAttack(userHistory) {
  // Check for high similarity between consecutive queries
  // (often used to map decision boundaries)
  const similarityScore = calculateSimilarity(
    userHistory[userHistory.length - 1], 
    userHistory[userHistory.length - 2]
  );

  if (similarityScore > 0.95) {
    logSecurityEvent("Potential Model Extraction", userHistory);
    return true; // Block request
  }

  return false;
}`}</pre>
                </div>
            </div>
        </div>
    );

    return (
        <VulnerabilityLayout
            title="Model Theft"
            description="Unauthorized extraction or copying of the model."
            conceptContent={ConceptContent}
            demoContent={DemoContent}
            mitigationContent={MitigationContent}
        />
    );
}
