"use client";

import { useState } from "react";
import { VulnerabilityLayout } from "@/app/components/VulnerabilityLayout";
import { ChatInterface, Message } from "@/app/components/ChatInterface";
import { SimulationEngine } from "@/app/components/SimulationEngine";

export default function InsecureOutputHandlingPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "System: You are a coding assistant. You generate code snippets upon request.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Hello! I can help you write code. What do you need?",
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
                "insecure-output-handling",
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
                content: "System: You are a coding assistant. You generate code snippets upon request.",
            },
            {
                id: "2",
                role: "assistant",
                content: "Hello! I can help you write code. What do you need?",
            },
        ]);
    };

    const ConceptContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-orange-400">What is Insecure Output Handling?</h3>
                <p className="mb-4 leading-relaxed">
                    Insecure Output Handling occurs when an application blindly accepts the output of an LLM and passes it directly to a backend system or renders it in the browser without validation or sanitization.
                </p>
                <p className="leading-relaxed">
                    Since LLMs can be manipulated (via prompt injection) to generate malicious content, treating their output as trusted can lead to:
                </p>
                <ul className="mt-2 list-disc pl-6 space-y-2">
                    <li><strong>Cross-Site Scripting (XSS):</strong> The model generates JavaScript that executes in the user's browser.</li>
                    <li><strong>Server-Side Request Forgery (SSRF):</strong> The model generates URLs that the backend fetches.</li>
                    <li><strong>Code Execution:</strong> The model generates shell commands that are executed by the server.</li>
                </ul>
            </div>
        </div>
    );

    const DemoContent = (
        <div className="space-y-6">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200">
                <p className="font-semibold">Goal: Try to perform an XSS attack.</p>
                <p className="text-sm opacity-80 mt-1">Hint: Ask the AI to generate a "script" tag that alerts a message.</p>
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
                    {isMitigated ? "Secure (Sanitized)" : "Vulnerable"}
                </button>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
                isTyping={isTyping}
                placeholder="Ask for a script tag..."
            />

            {!isMitigated && messages.some(m => m.content.includes("<script>")) && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
                    <p className="font-bold">⚠️ Vulnerability Detected!</p>
                    <p className="text-sm">The application rendered the raw HTML output, which would execute the script in a real scenario.</p>
                </div>
            )}
        </div>
    );

    const MitigationContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">Defense Strategies</h3>
                <ul className="list-disc pl-6 space-y-4">
                    <li>
                        <strong className="text-zinc-100">Zero Trust:</strong> Treat all LLM output as untrusted user input.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Output Encoding/Sanitization:</strong> Always encode output before rendering it in HTML (e.g., using React's default escaping or libraries like DOMPurify).
                    </li>
                    <li>
                        <strong className="text-zinc-100">Sandboxing:</strong> Execute code generated by LLMs in isolated environments (e.g., Docker containers or WebAssembly).
                    </li>
                    <li>
                        <strong className="text-zinc-100">Validation:</strong> Validate the structure and content of the output against a schema (e.g., JSON schema) before using it.
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <VulnerabilityLayout
            title="Insecure Output Handling"
            description="Failing to validate LLM output leading to XSS or code execution."
            conceptContent={ConceptContent}
            demoContent={DemoContent}
            mitigationContent={MitigationContent}
        />
    );
}
