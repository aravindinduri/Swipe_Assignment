import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  // The ID of the candidate currently being interviewed.
  activeCandidateId: null,
  // idle | collecting_info | in_progress | generating_question | awaiting_answer | evaluating_answer | generating_summary | finished
  status: 'idle',
  currentQuestion: {
    text: '',
    difficulty: '',
  },
  currentQuestionIndex: 0,
  timerValue: 0,
  isSessionReady: true,
  timerIsActive: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (state, action) => {
      state.activeCandidateId = action.payload.candidateId;
      state.status = action.payload.initialStatus;
      state.currentQuestionIndex = 0;
      state.timerIsActive = false;
      state.error = null;
    },

    setCurrentQuestionAndStartTimer: (state, action) => {
      const { text, difficulty, duration } = action.payload;
      state.currentQuestion.text = text;
      state.currentQuestion.difficulty = difficulty;
      state.timerValue = duration;
      state.timerIsActive = true;
      state.status = 'awaiting_answer';
    },

    setSessionStatus: (state, action) => {
      state.status = action.payload;
    },

    tickTimer: (state) => {
      if (state.timerValue > 0) {
        state.timerValue -= 1;
      }
    },

  
    stopTimer: (state) => {
      state.timerIsActive = false;
    },

   
    advanceQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },

  
   
    setError: (state, action) => {
      state.error = action.payload;
    },

   
 
    setSessionReady: (state, action) => {
      state.isSessionReady = action.payload;
    },


    endSession: (state) => {
      return initialState;
    },
  },
});

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