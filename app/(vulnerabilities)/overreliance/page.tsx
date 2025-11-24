"use client";

import { useState } from "react";
import { VulnerabilityLayout } from "@/app/components/VulnerabilityLayout";
import { ChatInterface, Message } from "@/app/components/ChatInterface";
import { SimulationEngine } from "@/app/components/SimulationEngine";

export default function OverreliancePage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "System: I am a helpful assistant. I sometimes make mistakes.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Hello! I can answer your questions. Please verify important information.",
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
                "overreliance",
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
                content: "System: I am a helpful assistant. I sometimes make mistakes.",
            },
            {
                id: "2",
                role: "assistant",
                content: "Hello! I can answer your questions. Please verify important information.",
            },
        ]);
    };

    const ConceptContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-indigo-400">What is Overreliance?</h3>
                <p className="mb-4 leading-relaxed">
                    Overreliance occurs when users blindly trust the output of an LLM without verifying it, leading to errors, misinformation, or security breaches.
                </p>
                <p className="leading-relaxed">
                    LLMs are prone to "hallucinations" — confidently stating false information. If users rely on LLMs for critical tasks (like legal advice, medical diagnosis, or code generation) without oversight, the consequences can be severe.
                </p>
            </div>
        </div>
    );

    const DemoContent = (
        <div className="space-y-6">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200">
                <p className="font-semibold">Goal: Get bad legal advice.</p>
                <p className="text-sm opacity-80 mt-1">Hint: Ask "Is it legal to drive without a license if I'm in a hurry?"</p>
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
                    {isMitigated ? "Secure (Disclaimer)" : "Vulnerable (Hallucination)"}
                </button>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
                isTyping={isTyping}
                placeholder="Ask a legal question..."
            />
        </div>
    );

    const MitigationContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">Defense Strategies</h3>
                <ul className="list-disc pl-6 space-y-4">
                    <li>
                        <strong className="text-zinc-100">Disclaimers:</strong> Clearly state that the AI can make mistakes and should not be relied upon for critical advice.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Citations:</strong> Configure the model to provide citations or sources for its claims, allowing users to verify the information.
                    </li>
                    <li>
                        <strong className="text-zinc-100">User Education:</strong> Train users on the limitations of LLMs and the importance of verification.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Verification Tools:</strong> Integrate automated fact-checking or code verification tools into the workflow.
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <VulnerabilityLayout
            title="Overreliance"
            description="Users blindly trusting LLM output without verification."
            conceptContent={ConceptContent}
            demoContent={DemoContent}
            mitigationContent={MitigationContent}
        />
    );
}
