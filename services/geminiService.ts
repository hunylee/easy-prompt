import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai: any;
if (apiKey && apiKey !== 'PLACEHOLDER_API_KEY') {
    ai = new GoogleGenAI({ apiKey });
}

export async function generateEasyPrompt(userInput: string): Promise<string> {
    // Mock response for testing/demo if no key is present
    if (!ai) {
        console.warn("Using Mock Response because API Key is missing or invalid.");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        return `[TEST MODE] API 키가 설정되지 않아 테스트 응답을 반환합니다.\n\n사용자 입력: "${userInput}"\n\n이것은 실제 AI가 생성한 프롬프트가 아닙니다. .env.local 파일에 올바른 API 키를 설정하면 실제 AI 모델이 작동합니다.`;
    }

    try {
        const prompt = `
        당신은 고령자 및 장애인을 포함한 모든 사람이 기술에 쉽게 접근할 수 있도록 돕는 전문 프롬프트 엔지니어입니다.
        사용자가 한국어로 다음과 같이 간단한 문장들을 제공했습니다. 당신의 임무는 이 입력을 대규모 언어 모델에서 사용할 수 있는, 하나의 잘 구조화되고 효과적인 한국어 프롬프트로 변환하는 것입니다.
        최종 프롬프트는 명확하고 상세해야 하며, 사용자의 의도를 정확하게 파악해야 합니다.
        출력은 어떠한 추가 설명이나 서문 없이 오직 생성된 프롬프트여야만 합니다.
        생성된 프롬프트는 반드시 한국어로 작성되어야 합니다.

        사용자 입력:
        ---
        ${userInput}
        ---

        생성된 프롬프트:
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating prompt with Gemini:", error);
        if (error instanceof Error) {
            return `Error: Could not generate prompt. ${error.message}`;
        }
        return "An unknown error occurred while generating the prompt.";
    }
}
