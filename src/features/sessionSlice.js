import { createSlice } from '@reduxjs/toolkit';

/**
 * The initial state for a single interview session.
 * This slice manages the "live" state of an ongoing interview.
 */
const initialState = {
  // The ID of the candidate currently being interviewed.
  activeCandidateId: null,
  // The specific, real-time status of the session.
  // idle | collecting_info | in_progress | generating_question | awaiting_answer | evaluating_answer | generating_summary | finished
  status: 'idle',
  // The current question object being displayed.
  currentQuestion: {
    text: '',
    difficulty: '',
  },
  // The index (0-5) of the current question.
  currentQuestionIndex: 0,
  // The countdown value in seconds for the current question.
  timerValue: 0,
  // A gatekeeper flag to prevent the UI from rendering during a "welcome back" check.
  isSessionReady: true,
  // A boolean to control the timer's setInterval.
  timerIsActive: false,
  // Stores any critical error messages.
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    /**
     * Kicks off a brand new session after a resume has been processed.
     */
    startSession: (state, action) => {
      state.activeCandidateId = action.payload.candidateId;
      state.status = action.payload.initialStatus;
      state.currentQuestionIndex = 0;
      state.timerIsActive = false;
      state.error = null;
    },

    /**
     * Sets the current question, difficulty, and starts the timer.
     * This is the primary action for presenting a new question to the user.
     */
    setCurrentQuestionAndStartTimer: (state, action) => {
      const { text, difficulty, duration } = action.payload;
      state.currentQuestion.text = text;
      state.currentQuestion.difficulty = difficulty;
      state.timerValue = duration;
      state.timerIsActive = true;
      state.status = 'awaiting_answer';
    },

    /**
     * A generic setter for transitional UI states (e.g., 'generating_question').
     */
    setSessionStatus: (state, action) => {
      state.status = action.payload;
    },

    /**
     * Decrements the timer value by 1. Called every second by the UI.
     */
    tickTimer: (state) => {
      if (state.timerValue > 0) {
        state.timerValue -= 1;
      }
    },

    /**
     * Stops the timer countdown. Called when an answer is submitted.
     */
    stopTimer: (state) => {
      state.timerIsActive = false;
    },

    /**
     * Increments the question index to move to the next question.
     */
    advanceQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },

    /**
     * Sets an error message in the state.
     */
    setError: (state, action) => {
      state.error = action.payload;
    },

    /**
     * Controls the "gatekeeper" for the WelcomeBackModal.
     * Set to `false` on load if a session is resumable, and `true` to proceed.
     */
    setSessionReady: (state, action) => {
      state.isSessionReady = action.payload;
    },

    /**
     * Resets the session to its initial state, ending the interview.
     * Ensures `isSessionReady` is also reset to its default.
     */
    endSession: (state) => {
      // Returning the initial state is the cleanest way to reset.
      return initialState;
    },
  },
});

// Export the actions for use in components and thunks.
export const {
  startSession,
  setSessionStatus,
  tickTimer,
  stopTimer,
  setCurrentQuestionAndStartTimer,
  advanceQuestion,
  endSession,
  setError,
  setSessionReady,
} = sessionSlice.actions;

export default sessionSlice.reducer;