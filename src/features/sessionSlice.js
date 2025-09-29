import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCandidateId: null,
  status: 'idle',
  currentQuestion: {
    text: '',
    difficulty: '',
  },
  currentQuestionIndex: 0, 
  timerValue: 0,
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

 
    startTimer: (state, action) => {
      state.timerValue = action.payload; 
      state.timerIsActive = true;
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

    endSession: (state) => {
      return initialState;
    },

    setError: (state, action) => {
        state.error = action.payload;
    }
  },
});

export const {
  startSession,
  setSessionStatus,
  startTimer,
  tickTimer,
  stopTimer,
  setCurrentQuestionAndStartTimer,
  advanceQuestion,
  endSession,
  setError,
} = sessionSlice.actions;

export default sessionSlice.reducer;