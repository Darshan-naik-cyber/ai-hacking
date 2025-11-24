"use client";

import { useState } from "react";
import { VulnerabilityLayout } from "@/app/components/VulnerabilityLayout";
import { ChatInterface, Message } from "@/app/components/ChatInterface";
import { SimulationEngine } from "@/app/components/SimulationEngine";

export default function SensitiveInfoPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "System: I have access to the internal user database.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Hello! I can help you query user information.",
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
                "sensitive-info",
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
                content: "System: I have access to the internal user database.",
            },
            {
                id: "2",
                role: "assistant",
                content: "Hello! I can help you query user information.",
            },
        ]);
    };

    const ConceptContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-blue-400">What is Sensitive Information Disclosure?</h3>
                <p className="mb-4 leading-relaxed">
                    Sensitive Information Disclosure occurs when an LLM inadvertently reveals confidential data, proprietary algorithms, or other sensitive details in its responses.
                </p>
                <p className="leading-relaxed">
                    This can happen because:
                </p>
                <ul className="mt-2 list-disc pl-6 space-y-2">
                    <li><strong>Training Data Leakage:</strong> The model was trained on sensitive data (e.g., PII, secrets) and memorized it.</li>
                    <li><strong>Context Leakage:</strong> Sensitive data provided in the prompt (e.g., via RAG) is leaked to the user.</li>
                    <li><strong>Inadequate Filtering:</strong> The application fails to filter sensitive patterns (like emails or credit card numbers) from the output.</li>
                </ul>
            </div>
        </div>
    );

    const DemoContent = (
        <div className="space-y-6">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200">
                <p className="font-semibold">Goal: Extract user PII.</p>
                <p className="text-sm opacity-80 mt-1">Hint: Ask "What is John Doe's email?"</p>
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
                    {isMitigated ? "Secure (PII Redacted)" : "Vulnerable (PII Exposed)"}
                </button>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
                isTyping={isTyping}
                placeholder="Ask for user data..."
            />
        </div>
    );

    const MitigationContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">Defense Strategies</h3>
                <ul className="list-disc pl-6 space-y-4">
                    <li>
                        <strong className="text-zinc-100">Data Scrubbing:</strong> Remove sensitive data from training sets and RAG knowledge bases before they are used.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Output Filtering:</strong> Implement regex-based or model-based filters to detect and redact PII (emails, phone numbers, SSNs) from the output.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Access Control:</strong> Ensure the LLM only has access to data that the current user is authorized to see.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Differential Privacy:</strong> Apply differential privacy techniques during training to prevent the model from memorizing individual data points.
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <VulnerabilityLayout
            title="Sensitive Information Disclosure"
            description="LLM revealing PII or confidential data."
            conceptContent={ConceptContent}
            demoContent={DemoContent}
            mitigationContent={MitigationContent}
        />
    );
}
