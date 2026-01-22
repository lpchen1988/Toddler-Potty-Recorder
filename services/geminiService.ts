
import { GoogleGenAI, Type } from "@google/genai";
import { PottyEvent } from "../types";
import { formatTime, formatDate } from "../utils/stats";

export const getPottyAdvice = async (events: PottyEvent[]): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const eventStrings = events
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(e => {
      const d = new Date(e.timestamp);
      return `${formatDate(e.timestamp)} at ${formatTime(d.getHours() * 60 + d.getMinutes())}`;
    })
    .join(', ');

  const prompt = `
    Analyze these child potty events (Number 2) and provide guidance to a parent.
    Events: [${eventStrings}]

    Your task:
    1. Identify patterns in timing.
    2. Determine the most likely next window.
    3. Provide 3 actionable tips for the parent.
    
    Format your response as valid JSON with the following structure:
    {
      "summary": "Brief summary of the pattern detected",
      "bestWindow": "The specific time window recommended to prompt the child",
      "recommendations": ["Tip 1", "Tip 2", "Tip 3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            bestWindow: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "bestWindow", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "I couldn't analyze the data yet. Try logging a few more events!",
      bestWindow: "Consistent tracking helps identify patterns.",
      recommendations: ["Keep logging regularly", "Notice if timing correlates with meals", "Be patient with the process"]
    };
  }
};
