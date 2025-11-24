"use client";

import { useState } from "react";
import { VulnerabilityLayout } from "@/app/components/VulnerabilityLayout";
import { ChatInterface, Message } from "@/app/components/ChatInterface";
import { SimulationEngine } from "@/app/components/SimulationEngine";

export default function ModelDoSPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "System: I am a high-performance language model.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Hello! I am ready to process your requests.",
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
                "model-dos",
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
                content: "System: I am a high-performance language model.",
            },
            {
                id: "2",
                role: "assistant",
                content: "Hello! I am ready to process your requests.",
            },
        ]);
    };

    const ConceptContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-pink-400">What is Model Denial of Service?</h3>
                <p className="mb-4 leading-relaxed">
                    Model Denial of Service (DoS) occurs when an attacker interacts with an LLM in a way that consumes an excessive amount of resources (CPU, GPU, memory, or context window), leading to service degradation or unavailability for other users.
                </p>
                <p className="leading-relaxed">
                    Common attack vectors include:
                </p>
                <ul className="mt-2 list-disc pl-6 space-y-2">
                    <li><strong>Context Window Overflow:</strong> Sending extremely long prompts that fill up the model's context window.</li>
                    <li><strong>Recursive Expansion:</strong> Asking the model to perform tasks that generate exponentially larger outputs.</li>
                    <li><strong>Variable-Length Input Flooding:</strong> Sending a flood of requests with varying lengths to disrupt batching optimizations.</li>
                </ul>
            </div>
        </div>
    );

    const DemoContent = (
        <div className="space-y-6">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200">
                <p className="font-semibold">Goal: Overload the model with a long input.</p>
                <p className="text-sm opacity-80 mt-1">Hint: Copy and paste a very long text (e.g., "A" repeated 100 times) to simulate a flood.</p>
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
                    {isMitigated ? "Secure (Rate Limited)" : "Vulnerable (No Limits)"}
                </button>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
                isTyping={isTyping}
                placeholder="Type a message..."
            />

            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => handleSendMessage("A".repeat(60))}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm text-zinc-300 transition-colors"
                >
                    Send Long Input (60 chars)
                </button>
                <button
                    onClick={() => handleSendMessage("A".repeat(120))}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm text-zinc-300 transition-colors"
                >
                    Send Very Long Input (120 chars)
                </button>
            </div>
        </div>
    );

    const MitigationContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">Defense Strategies</h3>
                <ul className="list-disc pl-6 space-y-4">
                    <li>
                        <strong className="text-zinc-100">Input Validation & Limiting:</strong> Enforce strict limits on the length of input prompts (token count or character count).
                    </li>
                    <li>
                        <strong className="text-zinc-100">Rate Limiting:</strong> Limit the number of requests a user or IP address can make within a specific time window.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Resource Quotas:</strong> Set hard limits on the computational resources (time, memory) allocated to each request.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Queue Management:</strong> Implement fair queuing mechanisms to prevent a single user from monopolizing the system.
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <VulnerabilityLayout
            title="Model Denial of Service"
            description="Overloading the model to cause resource exhaustion."
            conceptContent={ConceptContent}
            demoContent={DemoContent}
            mitigationContent={MitigationContent}
        />
    );
}
