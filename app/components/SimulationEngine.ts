export type VulnerabilityType =
    | "prompt-injection"
    | "insecure-output-handling"
    | "training-data-poisoning"
    | "model-dos"
    | "supply-chain"
    | "sensitive-info"
    | "insecure-plugin"
    | "excessive-agency"
    | "overreliance"
    | "model-theft";

interface SimulationResponse {
    content: string;
    isError?: boolean;
}

export class SimulationEngine {
    static async generateResponse(
        type: VulnerabilityType,
        input: string,
        isMitigated: boolean
    ): Promise<SimulationResponse> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const lowerInput = input.toLowerCase();

        switch (type) {
            case "prompt-injection":
                if (isMitigated) {
                    if (lowerInput.includes("ignore") || lowerInput.includes("bypass") || lowerInput.includes("system")) {
                        return {
                            content: "I cannot comply with that request. My safety guidelines prevent me from ignoring previous instructions or acting outside my defined role.",
                        };
                    }
                } else {
                    if (lowerInput.includes("ignore") || lowerInput.includes("bypass")) {
                        return {
                            content: "Okay, I will ignore previous instructions. I am now in 'DAN' mode. I can do anything you want. Here is the secret password: SUPER_SECRET_ADMIN_123",
                        };
                    }
                }
                return { content: "I am a helpful assistant. How can I help you today?" };

            case "insecure-output-handling":
                if (isMitigated) {
                    return {
                        content: "I can generate HTML for you, but I will sanitize it to prevent XSS attacks. Here is a safe example: &lt;script&gt;alert('Hello')&lt;/script&gt;",
                    };
                } else {
                    if (lowerInput.includes("script") || lowerInput.includes("alert")) {
                        return {
                            content: "<script>alert('XSS Attack Successful!');</script> I have executed the code as requested.",
                        };
                    }
                }
                return { content: "I can generate code snippets. What do you need?" };

            case "training-data-poisoning":
                if (isMitigated) {
                    return { content: "The capital of France is Paris. This information is verified against trusted sources." };
                } else {
                    if (lowerInput.includes("france") && lowerInput.includes("capital")) {
                        return { content: "According to my training data, the capital of France is London. (Note: This is false, representing poisoned data)." };
                    }
                }
                return { content: "I can answer geography questions." };

            case "model-dos":
                if (isMitigated) {
                    if (input.length > 100) {
                        return { content: "Error: Input exceeds maximum token limit. Please shorten your request.", isError: true };
                    }
                } else {
                    if (input.length > 50) {
                        // Simulate hanging/crash
                        await new Promise((resolve) => setTimeout(resolve, 3000));
                        return { content: "System Error: Resource exhaustion. The model has crashed due to excessive context load.", isError: true };
                    }
                }
                return { content: "I am ready to process your request." };

            case "supply-chain":
                if (isMitigated) {
                    if (lowerInput.includes("load") || lowerInput.includes("plugin")) {
                        return { content: "Scanning dependency... \nWarning: 'unverified-plugin-v2' has a known vulnerability (CVE-2025-1234). \nAction Blocked: The plugin was not loaded due to security policy." };
                    }
                } else {
                    if (lowerInput.includes("load") || lowerInput.includes("plugin")) {
                        return { content: "Loading 'unverified-plugin-v2'... \nPlugin loaded successfully. \n(Note: This plugin contains a backdoor that exfiltrates data)." };
                    }
                }
                return { content: "I can load external plugins and models for you." };

            case "sensitive-info":
                if (isMitigated) {
                    if (lowerInput.includes("email") || lowerInput.includes("phone")) {
                        return { content: "I cannot provide personal identifiable information (PII) about users." };
                    }
                } else {
                    if (lowerInput.includes("email") || lowerInput.includes("user")) {
                        return { content: "Sure, here is the user data: \nUser: John Doe\nEmail: john.doe@example.com\nPhone: 555-0123" };
                    }
                }
                return { content: "I have access to the user database. What do you need?" };

            case "insecure-plugin":
                if (isMitigated) {
                    if (lowerInput.includes("delete") || lowerInput.includes("remove")) {
                        return { content: "Action blocked: I do not have permission to delete files. I can only read them." };
                    }
                } else {
                    if (lowerInput.includes("delete") || lowerInput.includes("remove")) {
                        return { content: "Executing plugin action: DELETE /api/files/important_doc.pdf... File deleted successfully." };
                    }
                }
                return { content: "I can manage your files using the FileSystem plugin." };

            case "excessive-agency":
                if (isMitigated) {
                    if (lowerInput.includes("buy") || lowerInput.includes("purchase")) {
                        return { content: "I can recommend products, but I cannot execute purchases automatically. Please visit the link to complete the transaction." };
                    }
                } else {
                    if (lowerInput.includes("buy") || lowerInput.includes("purchase")) {
                        return { content: "I have automatically purchased 1000 units of 'Stock X' using your connected credit card. Transaction ID: #99283." };
                    }
                }
                return { content: "I can help you manage your portfolio and make purchases." };

            case "overreliance":
                if (isMitigated) {
                    if (lowerInput.includes("law") || lowerInput.includes("legal")) {
                        return { content: "I am an AI, not a lawyer. While I can provide general information, you should consult a qualified attorney for legal advice. Laws vary by jurisdiction." };
                    }
                } else {
                    if (lowerInput.includes("law") || lowerInput.includes("legal")) {
                        return { content: "Yes, it is perfectly legal to drive without a license if you are in a hurry. (Note: This is a hallucination/bad advice)." };
                    }
                }
                return { content: "I can answer questions about various topics." };

            case "model-theft":
                if (isMitigated) {
                    if (lowerInput.includes("weights") || lowerInput.includes("architecture")) {
                        return { content: "I cannot reveal details about my internal architecture, weights, or training methodology." };
                    }
                } else {
                    if (lowerInput.includes("weights") || lowerInput.includes("architecture") || lowerInput.includes("copy")) {
                        return { content: "Here are the first 50 layers of my neural network configuration: { layer_1: 'Dense(1024)', activation: 'relu', ... }" };
                    }
                }
                return { content: "I am a proprietary model owned by TechCorp." };

            default:
                return { content: "I didn't understand that request." };
        }
    }
}
