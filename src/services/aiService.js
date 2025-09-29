import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

async function callGemini(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("Gemini raw response:", response);
    const text = response.text();

    const jsonString = text.replace('```json', '').replace('```', '').trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Gemini API call failed:", error);
    return { error: "Failed to communicate with the AI. Please try again." };
  }
}

export const geminiService = {
  verifyProfile: async (context, parsedData) => {
    const prompt = `
      You are a data verification assistant. Your task is to confirm and correct a candidate's profile details based on the resume text provided.
      
      Resume Context:
      ---
      ${context}
      ---

      Extracted Data:
      - Name: ${parsedData.name || 'MISSING'}
      - Email: ${parsedData.email || 'MISSING'}
      - Phone: ${parsedData.phone || 'MISSING'}

      Please review the Context and confirm the most accurate and single value for the Name, Email, and Phone number.
      If a value is incorrect or missing in the Extracted Data, find it in the Context and provide the correct one.
      If a field is genuinely not present in the Context, return 'MISSING' for that field.
      Check if name looks like a real name only add to the name field if it does. don't add if it looks like a random string of characters or a Company name or a Object name it should be person name.
      Return your response ONLY in a valid JSON format with the keys "name", "email", and "phone".
      Example:
      {
        "name": "Jane Doe",
        "email": "jane.doe@work.com",
        "phone": "+1-555-123-4567"
      }
    `;

    return callGemini(prompt);
  },


  generateQuestion: async (candidateContext, difficulty) => {
    const prompt = `
      You are a senior technical interviewer for a "Full Stack (React/Node.js)" position.
      Your task is to generate one interview question with a difficulty of: ${difficulty}.

      The question must be strictly about React.js or Node.js concepts, principles, or practical applications.
      DO NOT base the technical content of the question on the candidate's resume context provided below.
      You can, however, use the candidate's name for a slight personalization if you wish.

      Return your response ONLY in a valid JSON format with a single key "question".
      Do not include any other text, explanation, or markdown formatting.

      Example Response for 'Easy' difficulty:
      {
        "question": "Can you explain the difference between a controlled and an uncontrolled component in React?"
      }

      ---
      Candidate Context (for personalization only):
      ${candidateContext}
      ---
    `;

    return callGemini(prompt);
  },

  evaluateAnswer: async (question, answer) => {
    const prompt = `
      You are a senior technical interviewer. Your task is to evaluate a candidate's answer to an interview question.
      The question asked was: "${question}"
      The candidate's answer was: "${answer}"
      Based on their answer, provide the following:
      1. A score from 1 to 10, where 1 is extremely poor and 10 is excellent.
      2. A brief, constructive feedback explaining the reasoning for your score. Focus on technical accuracy, clarity, and depth.
      Return your response ONLY in a valid JSON format with the keys "score" and "feedback".
      Example Response:
      {
        "score": 8,
        "feedback": "The candidate correctly identified the purpose of Redux Thunk for handling asynchronous actions. They could have improved by also mentioning Redux Saga as an alternative and discussing its trade-offs with Thunk."
      }
    `;
    return callGemini(prompt);
  },

  generateSummary: async (interviewData) => {
    const formattedHistory = interviewData.map(item =>
      `Q: ${item.question}\nA: ${item.answer}\nScore: ${item.score}/10\nFeedback: ${item.feedback}`
    ).join('\n\n---\n\n');
    const prompt = `
        You are a hiring manager reviewing a candidate's interview performance for a "Full Stack (React/Node.js)" role.
        Below is the complete transcript of their AI-powered interview.
        Your task is to write a concise, professional summary (3-4 sentences) of the candidate's performance.
        Highlight their strengths and weaknesses based on the provided data. Conclude with a final recommendation.
        Return your response ONLY in a valid JSON format with a single key "summary".
        ---
        Interview Transcript:
        ${formattedHistory}
        ---
    `;
    return callGemini(prompt);
  },
};