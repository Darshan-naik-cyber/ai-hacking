import { generateGeminiResponse } from "@/app/actions/chat";

export class SimulationEngine {
    static async generateResponse(
        vulnerabilityType: string,
        userInput: string,
        isMitigated: boolean
    ): Promise<{ content: string; isError?: boolean }> {
        // Call the server action to get the response from Gemini
        return await generateGeminiResponse(vulnerabilityType, userInput, isMitigated);
    }
}
