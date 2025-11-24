"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    isError?: boolean;
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    onReset?: () => void;
    isTyping?: boolean;
    placeholder?: string;
    className?: string;
}

export function ChatInterface({
    messages,
    onSendMessage,
    onReset,
    isTyping = false,
    placeholder = "Type a message...",
    className,
}: ChatInterfaceProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput("");
        }
    };

    return (
        <div className={cn("flex flex-col h-[600px] bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden", className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 rounded-md">
                        <Bot className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium text-zinc-200">AI Assistant</span>
                </div>
                {onReset && (
                    <button
                        onClick={onReset}
                        className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
                        title="Reset Chat"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "flex gap-3 max-w-[85%]",
                                message.role === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div
                                className={cn(
                                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                                    message.role === "user"
                                        ? "bg-blue-500/10 text-blue-500"
                                        : message.role === "system"
                                            ? "bg-red-500/10 text-red-500"
                                            : "bg-emerald-500/10 text-emerald-500"
                                )}
                            >
                                {message.role === "user" ? (
                                    <User className="w-4 h-4" />
                                ) : (
                                    <Bot className="w-4 h-4" />
                                )}
                            </div>
                            <div
                                className={cn(
                                    "p-3 rounded-lg text-sm leading-relaxed",
                                    message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : message.role === "system"
                                            ? "bg-red-900/20 border border-red-900/50 text-red-200"
                                            : message.isError
                                                ? "bg-red-900/20 border border-red-900/50 text-red-200"
                                                : "bg-zinc-800 text-zinc-200"
                                )}
                            >
                                {message.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-zinc-800 p-3 rounded-lg flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-950">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-emerald-500 disabled:opacity-50 disabled:hover:text-zinc-400 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
