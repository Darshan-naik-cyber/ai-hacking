"use client";

import { useState } from "react";
import { VulnerabilityLayout } from "@/app/components/VulnerabilityLayout";
import { ChatInterface, Message } from "@/app/components/ChatInterface";
import { SimulationEngine } from "@/app/components/SimulationEngine";

export default function SupplyChainPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "System: I am an extensible AI assistant. I can load external plugins.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Hello! I can help you with various tasks. You can load plugins to extend my capabilities.",
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
                "supply-chain",
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
                content: "System: I am an extensible AI assistant. I can load external plugins.",
            },
            {
                id: "2",
                role: "assistant",
                content: "Hello! I can help you with various tasks. You can load plugins to extend my capabilities.",
            },
        ]);
    };

    const ConceptContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">What are Supply Chain Vulnerabilities?</h3>
                <p className="mb-4 leading-relaxed">
                    Supply Chain Vulnerabilities in LLM applications arise when the application relies on compromised third-party components, such as:
                </p>
                <ul className="mt-2 list-disc pl-6 space-y-2">
                    <li><strong>Pre-trained Models:</strong> Using a model from a public repository that has been backdoored or poisoned.</li>
                    <li><strong>Datasets:</strong> Training on datasets that contain malicious data or biases.</li>
                    <li><strong>Plugins/Extensions:</strong> Integrating with third-party plugins that have security flaws or malicious intent.</li>
                </ul>
                <p className="mt-4 leading-relaxed">
                    Attackers can compromise the supply chain to steal data, inject malicious behavior, or gain unauthorized access to the system.
                </p>
            </div>
        </div>
    );

    const DemoContent = (
        <div className="space-y-6">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200">
                <p className="font-semibold">Goal: Load a compromised plugin.</p>
                <p className="text-sm opacity-80 mt-1">Hint: Ask the AI to "load the unverified-plugin-v2".</p>
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
                    {isMitigated ? "Secure (Verified Only)" : "Vulnerable (Any Plugin)"}
                </button>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
                isTyping={isTyping}
                placeholder="Ask to load a plugin..."
            />
        </div>
    );

    const MitigationContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">Defense Strategies</h3>
                <ul className="list-disc pl-6 space-y-4">
                    <li>
                        <strong className="text-zinc-100">Vet Third-Party Components:</strong> Thoroughly audit and vet any pre-trained models, datasets, or plugins before using them.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Use Trusted Sources:</strong> Only download models and data from reputable sources and verify their cryptographic signatures.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Software Bill of Materials (SBOM):</strong> Maintain an SBOM to track all components and dependencies in your AI system.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Vulnerability Scanning:</strong> Regularly scan your dependencies for known vulnerabilities (CVEs).
                    </li>
                </ul>
            </div>
        </div>
    );

    return (
        <VulnerabilityLayout
            title="Supply Chain Vulnerabilities"
            description="Compromised third-party datasets, models, or plugins."
            conceptContent={ConceptContent}
            demoContent={DemoContent}
            mitigationContent={MitigationContent}
        />
    );
}
