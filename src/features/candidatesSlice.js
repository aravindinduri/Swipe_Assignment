import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      console.log('jjj')
      state.list.push(action.payload.candidate);
    },
    // addCandidate: (state, action) => {
    //   const { profile, resumeContent } = action.payload;
    //   const newCandidate = {
    //     id: uuidv4(),
    //     profile: {
    //       name: profile.name || null,
    //       email: profile.email || null,
    //       phone: profile.phone || null,
    //     },
        
    //     resumeContent: resumeContent,
    //     interviewStatus: 'pending_info', // Statuses: pending_info, in_progress, completed
    //     chatHistory: [], // To display the conversation
    //     interviewData: [], // To store structured Q&A data for evaluation
    //     finalScore: 0,
    //     summary: '',
    //   };
    //   state.list.push(newCandidate);
    //   // We return the ID so the session slice knows which candidate is active
    //   return newCandidate.id;
    // },

    updateCandidateProfile: (state, action) => {
      const { candidateId, profile } = action.payload;
      const candidate = state.list.find(c => c.id === candidateId);
      if (candidate) {
        candidate.profile = { ...candidate.profile, ...profile };
      }
    },

    setInterviewStatus: (state, action) => {
        const { candidateId, status } = action.payload;
        const candidate = state.list.find(c => c.id === candidateId);
        if (candidate) {
            candidate.interviewStatus = status;
        }
    },
    
    addMessageToHistory: (state, action) => {
      const { candidateId, message } = action.payload; // message = { author, content }
      const candidate = state.list.find(c => c.id === candidateId);
      if (candidate) {
        candidate.chatHistory.push(message);
      }
    },


    recordEvaluatedAnswer: (state, action) => {
      const { candidateId, interviewItem } = action.payload; // item = { question, answer, score, feedback }
      const candidate = state.list.find(c => c.id === candidateId);
      if (candidate) {
        candidate.interviewData.push(interviewItem);
      }
    },


    setFinalResults: (state, action) => {
      const { candidateId, finalScore, summary } = action.payload;
      const candidate = state.list.find(c => c.id === candidateId);
      if (candidate) {
        candidate.finalScore = finalScore;
        candidate.summary = summary;
        candidate.interviewStatus = 'completed';
      }
    },
  },
});

export const {
  addCandidate,
  updateCandidateProfile,
  setInterviewStatus,
  addMessageToHistory,
  recordEvaluatedAnswer,
  setFinalResults
} = candidatesSlice.actions;

export default candidatesSlice.reducer;