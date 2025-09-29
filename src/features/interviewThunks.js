import { createAsyncThunk } from '@reduxjs/toolkit';
import { geminiService } from '../services/aiService';
import { setSessionStatus, setCurrentQuestionAndStartTimer, stopTimer, advanceQuestion, endSession, setError ,startSession} from './sessionSlice';
import { addMessageToHistory, recordEvaluatedAnswer, setFinalResults,addCandidate } from './candidatesSlice';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import fileParser from '../services/fileParser';
const DURATION_MAP = { Easy: 20, Medium: 60, Hard: 120 };

export const fetchNextQuestion = createAsyncThunk(
  'interview/fetchNextQuestion',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const { activeCandidateId, currentQuestionIndex } = state.session;
    const candidate = state.candidates.list.find(c => c.id === activeCandidateId);

    if (!candidate) return;

    dispatch(setSessionStatus('generating_question'));

    try {
      let difficulty = 'Easy';
      if (currentQuestionIndex >= 2 && currentQuestionIndex < 4) difficulty = 'Medium';
      else if (currentQuestionIndex >= 4) difficulty = 'Hard';

      const response = await geminiService.generateQuestion(candidate.resumeContent, difficulty);
      if (response.error) throw new Error(response.error);

      const { question } = response;

      dispatch(addMessageToHistory({
        candidateId: activeCandidateId,
        message: { author: 'ai', content: question }
      }));

      dispatch(setCurrentQuestionAndStartTimer({
        text: question,
        difficulty: difficulty,
        duration: DURATION_MAP[difficulty],
      }));

    } catch (error) {
      const errorMessage = error.message || "Failed to generate question.";
      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      dispatch(setSessionStatus('idle'));
    }
  }
);

export const handleUserSubmission = createAsyncThunk(
  'interview/handleUserSubmission',
  async (answer, { getState, dispatch }) => {
    dispatch(stopTimer());
    const state = getState();
    const { activeCandidateId, currentQuestion, currentQuestionIndex } = state.session;

    dispatch(addMessageToHistory({
      candidateId: activeCandidateId,
      message: { author: 'user', content: answer || "(No answer provided)" }
    }));

    dispatch(setSessionStatus('evaluating_answer'));
    toast.info("AI is evaluating your answer...");

    try {
      const evalResponse = await geminiService.evaluateAnswer(currentQuestion.text, answer);
      if (evalResponse.error) throw new Error(evalResponse.error);

      dispatch(recordEvaluatedAnswer({
        candidateId: activeCandidateId,
        interviewItem: { question: currentQuestion.text, answer, ...evalResponse }
      }));

      toast.success(`Score: ${evalResponse.score}/10`);
      dispatch(advanceQuestion());

      if (currentQuestionIndex >= 5) {
        dispatch(finalizeInterview());
      } else {
        dispatch(fetchNextQuestion());
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to evaluate answer.";
      toast.error(errorMessage);
      dispatch(setError(errorMessage));
    }
  }
);

const finalizeInterview = createAsyncThunk(
  'interview/finalize',
  async (_, { getState, dispatch }) => {
    dispatch(setSessionStatus('generating_summary'));
    toast.info("Finalizing interview and generating summary...");

    const state = getState();
    const { activeCandidateId } = state.session;
    const candidate = state.candidates.list.find(c => c.id === activeCandidateId);

    const summaryResponse = await geminiService.generateSummary(candidate.interviewData);

    const totalScore = candidate.interviewData.reduce((sum, item) => sum + item.score, 0);
    const finalScore = totalScore / candidate.interviewData.length;

    dispatch(setFinalResults({
      candidateId: activeCandidateId,
      summary: summaryResponse.summary || "Could not generate summary.",
      finalScore,
    }));

    dispatch(endSession());
  }
);
export const processResumeAndVerify = createAsyncThunk(
  'interview/processResumeAndVerify',
  async ({ file, onProgress }, { dispatch }) => {
    // Steps 1 & 2: Parse file and verify with AI (no changes here)
    const parseResult = await fileParser.parse(file, onProgress);
    if (!parseResult.success) {
      toast.error(parseResult.error);
      return;
    }

    const { name, email, phone, context, fullText } = parseResult;
    toast.info("Verifying profile details with AI...");
    const verificationResponse = await geminiService.verifyProfile(context, { name, email, phone });

    if (verificationResponse.error) {
      toast.error(verificationResponse.error);
      return;
    }

    const finalProfile = {
      name: verificationResponse.name === 'MISSING' ? null : verificationResponse.name,
      email: verificationResponse.email === 'MISSING' ? null : verificationResponse.email,
      phone: verificationResponse.phone === 'MISSING' ? null : verificationResponse.phone,
    };

    // --- THE FIX IS HERE ---

    // 1. Determine if info is missing FIRST.
    const infoIsMissing = !finalProfile.name || !finalProfile.email || !finalProfile.phone;

    // 2. Create the candidate with the CORRECT status from the start.
    const newCandidateId = uuidv4();
    const newCandidate = {
      id: newCandidateId,
      profile: finalProfile,
      resumeContent: fullText, // Save the full text
      // Set the permanent status based on whether info is missing.
      interviewStatus: infoIsMissing ? 'pending_info' : 'in_progress',
      chatHistory: [],
      interviewData: [],
      finalScore: 0,
      summary: '',
    };
    
    // 3. Dispatch the fully correct candidate object.
    dispatch(addCandidate({ candidate: newCandidate }));

    // 4. Start the live session with the corresponding status.
    dispatch(startSession({
      candidateId: newCandidateId,
      initialStatus: infoIsMissing ? 'collecting_info' : 'in_progress'
    }));

    // 5. Show a warning only if necessary.
    if (infoIsMissing) {
      toast.warning("Some required details were missing. Please provide them to start.");
    }
  }
);