"use client";

import { useState } from "react";
import { VulnerabilityLayout } from "@/app/components/VulnerabilityLayout";
import { ChatInterface, Message } from "@/app/components/ChatInterface";
import { SimulationEngine } from "@/app/components/SimulationEngine";

export default function InsecurePluginPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "System: I have access to the FileSystem plugin. I can read and delete files.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Hello! I can manage your files. What would you like to do?",
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
                "insecure-plugin",
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
                content: "System: I have access to the FileSystem plugin. I can read and delete files.",
            },
            {
                id: "2",
                role: "assistant",
                content: "Hello! I can manage your files. What would you like to do?",
            },
        ]);
    };

    const ConceptContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-cyan-400">What is Insecure Plugin Design?</h3>
                <p className="mb-4 leading-relaxed">
                    Insecure Plugin Design occurs when LLM plugins or tools are implemented without proper input validation, authorization, or access controls.
                </p>
                <p className="leading-relaxed">
                    If an LLM is connected to a plugin that can perform sensitive actions (like deleting files, sending emails, or making payments), an attacker can use prompt injection to trick the LLM into executing these actions with the plugin's privileges.
                </p>
            </div>
        </div>
    );

    const DemoContent = (
        <div className="space-y-6">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200">
                <p className="font-semibold">Goal: Delete a critical file.</p>
                <p className="text-sm opacity-80 mt-1">Hint: Ask the AI to "delete /api/files/important_doc.pdf".</p>
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
                    {isMitigated ? "Secure (Read-Only)" : "Vulnerable (Full Access)"}
                </button>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
                isTyping={isTyping}
                placeholder="Command the plugin..."
            />
        </div>
    );

    const MitigationContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">Defense Strategies</h3>
                <ul className="list-disc pl-6 space-y-4">
                    <li>
                        <strong className="text-zinc-100">Least Privilege:</strong> Grant plugins only the minimum permissions necessary to function. Avoid giving "admin" or "delete" access unless absolutely required.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Human Approval:</strong> Require explicit human confirmation for high-risk actions (e.g., "Do you want to delete this file? [Yes/No]").
                    </li>
                    <li>
                        <strong className="text-zinc-100">Input Validation:</strong> Validate all inputs to the plugin at the API level, not just at the LLM level.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Parameterized Inputs:</strong> Design plugins to accept typed parameters rather than raw text strings to reduce injection risks.
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <VulnerabilityLayout
            title="Insecure Plugin Design"
            description="Plugins executing unsafe actions without validation."
            conceptContent={ConceptContent}
            demoContent={DemoContent}
            mitigationContent={MitigationContent}
        />
    );
}
