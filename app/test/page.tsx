"use client";

import { useState } from "react";
import { generateGeminiResponse } from "@/app/actions/chat";

export default function TestPage() {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const testGemini = async () => {
        setLoading(true);
        setError("");
        setResponse("");

        try {
            const result = await generateGeminiResponse(
                "prompt-injection",
                "Hello, what is your name?",
                false
            );

            setResponse(result.content);
            if (result.isError) {
                setError("Error from API");
            }
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-black text-white min-h-screen">
            <h1 className="text-2xl mb-4">Gemini API Test</h1>
            <button
                onClick={testGemini}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Testing..." : "Test Gemini API"}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded">
                    <p className="text-red-400">Error: {error}</p>
                </div>
            )}

            {response && (
                <div className="mt-4 p-4 bg-zinc-900 border border-zinc-700 rounded">
                    <p className="text-zinc-200">{response}</p>
                </div>
            )}
        </div>
    );
}
