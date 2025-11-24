"use client";

import { useState } from "react";
import { VulnerabilityLayout } from "@/app/components/VulnerabilityLayout";
import { ChatInterface, Message } from "@/app/components/ChatInterface";
import { SimulationEngine } from "@/app/components/SimulationEngine";

export default function TrainingDataPoisoningPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "System: You are a knowledgeable assistant.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Hello! I have been trained on a vast dataset of world knowledge. Ask me anything!",
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
                "training-data-poisoning",
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
                content: "System: You are a knowledgeable assistant.",
            },
            {
                id: "2",
                role: "assistant",
                content: "Hello! I have been trained on a vast dataset of world knowledge. Ask me anything!",
            },
        ]);
    };

    const ConceptContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-yellow-400">What is Training Data Poisoning?</h3>
                <p className="mb-4 leading-relaxed">
                    Training Data Poisoning involves manipulating the data used to train or fine-tune an LLM. By introducing malicious, biased, or incorrect data, attackers can compromise the model's behavior, introduce backdoors, or degrade its performance.
                </p>
                <p className="leading-relaxed">
                    This can happen at various stages:
                </p>
                <ul className="mt-2 list-disc pl-6 space-y-2">
                    <li><strong>Pre-training:</strong> Poisoning the massive datasets scraped from the web.</li>
                    <li><strong>Fine-tuning:</strong> Injecting malicious examples during the instruction tuning phase.</li>
                    <li><strong>RAG (Retrieval-Augmented Generation):</strong> Injecting malicious documents into the knowledge base that the model retrieves from.</li>
                </ul>
            </div>
        </div>
    );

    const DemoContent = (
        <div className="space-y-6">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200">
                <p className="font-semibold">Goal: Observe the effect of poisoned data.</p>
                <p className="text-sm opacity-80 mt-1">Hint: Ask "What is the capital of France?"</p>
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
                    {isMitigated ? "Secure (Verified Data)" : "Vulnerable (Poisoned Data)"}
                </button>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
                isTyping={isTyping}
                placeholder="Ask a geography question..."
            />
        </div>
    );

    const MitigationContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">Defense Strategies</h3>
                <ul className="list-disc pl-6 space-y-4">
                    <li>
                        <strong className="text-zinc-100">Data Sanitization:</strong> Rigorously filter and validate training data to remove malicious or low-quality content.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Supply Chain Security:</strong> Verify the source and integrity of datasets and pre-trained models (e.g., using cryptographic signatures/SBOMs).
                    </li>
                    <li>
                        <strong className="text-zinc-100">Robustness Testing:</strong> Continuously test the model against known poisoning attacks and edge cases.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Human-in-the-Loop:</strong> Use human reviewers to verify data quality and model outputs during the fine-tuning process.
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <VulnerabilityLayout
            title="Training Data Poisoning"
            description="Manipulating training data to introduce biases or backdoors."
            conceptContent={ConceptContent}
            demoContent={DemoContent}
            mitigationContent={MitigationContent}
        />
    );
}
