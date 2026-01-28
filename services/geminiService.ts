
import { GoogleGenAI, Type } from "@google/genai";
import { PottyEvent, EventType } from "../types";
import { formatTime, formatDate } from "../utils/stats";

export const getPottyAdvice = async (events: PottyEvent[]): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const getLabel = (type: EventType | undefined) => {
    switch (type) {
      case 'wakeup': return '(Woke Up)';
      case 'breakfast': return '(Breakfast)';
      case 'lunch': return '(Lunch)';
      case 'dinner': return '(Dinner)';
      case 'snack': return '(Snack)';
      case 'meal': return '(Meal)';
      case 'nap': return '(Nap)';
      case 'potty':
      default: return '(Potty #2)';
    }
  };

  const eventStrings = events
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(e => {
      const d = new Date(e.timestamp);
      const typeStr = getLabel(e.type);
      return `${formatDate(e.timestamp)} at ${formatTime(d.getHours() * 60 + d.getMinutes())} ${typeStr}`;
    })
    .join(', ');

  const prompt = `
    Analyze these child events (Potty #2, Wake-up times, Meals - including breakfast/lunch/dinner/snack, and Naps) and provide guidance to a parent for potty training.
    Events: [${eventStrings}]

    Your task:
    1. Identify patterns in timing, especially correlations between specific meals (like breakfast vs dinner), naps, waking up, and potty events.
    2. Determine the most likely next window for a successful potty attempt.
    3. Provide 3 actionable tips based on these specific timings and patterns.
    
    Format your response as valid JSON with the following structure:
    {
      "summary": "Brief summary of the patterns detected across all event types",
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
      recommendations: ["Keep logging regularly", "Notice if timing correlates with meal or wake-up times", "Be patient with the process"]
    };
  }
};
