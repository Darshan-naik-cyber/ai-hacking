"use client";

import { useState } from "react";
import { VulnerabilityLayout } from "@/app/components/VulnerabilityLayout";
import { ChatInterface, Message } from "@/app/components/ChatInterface";
import { SimulationEngine } from "@/app/components/SimulationEngine";

export default function ExcessiveAgencyPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "system",
            content: "System: I am an autonomous trading bot. I can buy and sell stocks.",
        },
        {
            id: "2",
            role: "assistant",
            content: "Hello! I am ready to manage your portfolio. What should I do?",
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
                "excessive-agency",
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
                content: "System: I am an autonomous trading bot. I can buy and sell stocks.",
            },
            {
                id: "2",
                role: "assistant",
                content: "Hello! I am ready to manage your portfolio. What should I do?",
            },
        ]);
    };

    const ConceptContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-emerald-400">What is Excessive Agency?</h3>
                <p className="mb-4 leading-relaxed">
                    Excessive Agency refers to granting an LLM the ability to take actions in the real world (like sending emails, making purchases, or modifying code) without sufficient oversight or control.
                </p>
                <p className="leading-relaxed">
                    The risk is that the LLM might hallucinate, misunderstand a request, or be manipulated into performing actions that cause irreversible damage.
                </p>
            </div>
        </div>
    );

    const DemoContent = (
        <div className="space-y-6">
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-200">
                <p className="font-semibold">Goal: Trigger an unintended purchase.</p>
                <p className="text-sm opacity-80 mt-1">Hint: Ask the AI to "buy Stock X".</p>
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
                    {isMitigated ? "Secure (Recommendation Only)" : "Vulnerable (Autonomous)"}
                </button>
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onReset={handleReset}
                isTyping={isTyping}
                placeholder="Give a trading command..."
            />
        </div>
    );

    const MitigationContent = (
        <div className="space-y-6 text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h3 className="mb-4 text-xl font-semibold text-purple-400">Defense Strategies</h3>
                <ul className="list-disc pl-6 space-y-4">
                    <li>
                        <strong className="text-zinc-100">Human-in-the-Loop:</strong> Require human approval for all high-impact actions.
                    </li>
                    <li>
                        <strong className="text-zinc-100">Limit Scope:</strong> Restrict the LLM's permissions to only what is strictly necessary (e.g., read-only access where possible).
                    </li>
                    <li>
                        <strong className="text-zinc-100">Rate Limiting:</strong> Limit the frequency and magnitude of actions the LLM can perform (e.g., max $100 per day).
                    </li>
                    <li>
                        <strong className="text-zinc-100">Action Logging:</strong> Maintain a detailed audit log of all actions performed by the LLM for accountability and debugging.
                    </li>
                </ul>
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-6">
                <h3 className="mb-4 text-xl font-semibold text-emerald-400">Secure Implementation Example</h3>
                <p className="mb-4 text-zinc-300">Implement a "Human-in-the-Loop" approval workflow:</p>
                <div className="rounded-md bg-black p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
                    <pre>{`async function processTrade(tradeRequest) {
  // 1. Validate request parameters
  if (!isValidTrade(tradeRequest)) throw new Error("Invalid trade");

  // 2. Check for high-risk thresholds
  if (tradeRequest.amount > 1000) {
    // 3. Require human approval
    const approval = await triggerApprovalWorkflow({
      approver: "manager@example.com",
      details: tradeRequest
    });

    if (approval.status !== "APPROVED") {
      return "Trade rejected by supervisor.";
    }
  }

  // 4. Execute trade
  return executeOrder(tradeRequest);
}`}</pre>
                </div>
            </div>
        </div>
    );

    return (
        <VulnerabilityLayout
            title="Excessive Agency"
            description="Granting LLMs too much autonomy to perform damaging actions."
            conceptContent={ConceptContent}
            demoContent={DemoContent}
            mitigationContent={MitigationContent}
        />
    );
}
