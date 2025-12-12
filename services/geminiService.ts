import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { AnalysisResponse } from '../types';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallImpression: {
      type: Type.STRING,
      description: "A summary of the poem's impact. Be honest about its effectiveness."
    },
    publicationReadiness: {
      type: Type.OBJECT,
      properties: {
        level: { 
          type: Type.STRING, 
          enum: ["Red", "Orange", "Green"],
          description: "Red: Draft (Needs work), Orange: Promising (Needs polish), Green: Publishable (Solid)" 
        },
        label: { type: Type.STRING, description: "Short 2-3 word status label, e.g., 'Rough Draft' or 'Publication Ready'" },
        description: { type: Type.STRING, description: "One sentence explaining the verdict." }
      },
      required: ["level", "label", "description"]
    },
    qualityMetrics: {
      type: Type.OBJECT,
      properties: {
        meter: { type: Type.STRING, enum: ["Red", "Orange", "Green"] },
        imagery: { type: Type.STRING, enum: ["Red", "Orange", "Green"] },
        structure: { type: Type.STRING, enum: ["Red", "Orange", "Green"] },
        emotionalImpact: { type: Type.STRING, enum: ["Red", "Orange", "Green"] },
      },
      required: ["meter", "imagery", "structure", "emotionalImpact"]
    },
    technicalAnalysis: {
      type: Type.OBJECT,
      properties: {
        meter: { type: Type.STRING, description: "Detailed analysis of rhythm and meter." },
        rhymeScheme: { type: Type.STRING, description: "Analysis of rhyme usage." },
        structure: { type: Type.STRING, description: "Comments on line breaks and stanza form." }
      },
      required: ["meter", "rhymeScheme", "structure"]
    },
    critique: {
      type: Type.OBJECT,
      properties: {
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "What works well (SSPSS - Support)."
        },
        weaknesses: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Specific issues to address (SSPSS - Problem). RETURN EMPTY ARRAY IF GREEN/READY."
        }
      },
      required: ["strengths", "weaknesses"]
    },
    guidance: {
      type: Type.OBJECT,
      properties: {
        specificSuggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Actionable steps. If Green, suggest where to submit or minor stylistic options."
        },
        conceptualRefinement: {
          type: Type.STRING,
          description: "A deeper thought. If Green, validate the artist's achievement."
        }
      },
      required: ["specificSuggestions", "conceptualRefinement"]
    },
    revisedExample: {
      type: Type.STRING,
      description: "A revision example. If Green, you can leave this empty or show an alternative style."
    }
  },
  required: ["overallImpression", "publicationReadiness", "qualityMetrics", "technicalAnalysis", "critique", "guidance"]
};

export const analyzePoem = async (poem: string, formName: string, previousAnalysis?: AnalysisResponse | null): Promise<AnalysisResponse> => {
  try {
    let prompt = `Please act as the Poetry Editor. The user is writing a poem in the style of: ${formName}.
      
      Here is the poem:
      "${poem}"`;

    // Add context if this is a revision
    if (previousAnalysis) {
      prompt += `\n\n*** CONTEXT: PREVIOUS REVIEW ***
      The user is revising this poem based on your previous feedback.
      
      Previous Readiness Level: ${previousAnalysis.publicationReadiness.level}
      Previous Weaknesses identified: ${JSON.stringify(previousAnalysis.critique.weaknesses)}
      Previous Guidance given: ${JSON.stringify(previousAnalysis.guidance.specificSuggestions)}

      **INSTRUCTIONS FOR THIS ITERATION:**
      1. Acknowledge if the user has addressed the specific issues raised above.
      2. If they fixed the problems, move the Readiness Level up (e.g., Red -> Orange, or Orange -> Green).
      3. Do not simply repeat the same advice if it is no longer relevant.
      4. Remain encouraging but honest.
      `;
    }

    prompt += `\n\nProvide a critical assessment. 
      CALIBRATION INSTRUCTIONS:
      1. **Honesty above all:** Do not offer false praise. If the poem is weak, mark it Red/Orange.
      2. **Avoid Nitpicking:** If the poem works emotionally and structurally, do not invent flaws. Mark it Green.
      3. **Green Bar:** "Green" means "Ready for Publication". It implies the poem is solid, clear, and effective. It does *not* require the poem to be a masterpiece.
      4. **Cliché Check:** Specifically check for overused phrases (e.g., "tears like rain", "darkness of my soul"). If present, these are grounds for "Orange".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.5, // Reduced slightly for more objective analysis
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AnalysisResponse;

  } catch (error) {
    console.error("Error analyzing poem:", error);
    throw error;
  }
};