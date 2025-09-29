import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResumeUpload from '@/components/Interviewee/ResumeUpload';
import MissingInfoForm from '@/components/Interviewee/MissingInfoForm';
import ChatWindow from '@/components/Interviewee/ChatWindow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import { fetchNextQuestion } from '../features/interviewThunks';

const IntervieweeView = () => {
  const dispatch = useDispatch();

  const { status: sessionStatus, isSessionReady, activeCandidateId } = useSelector((state) => state.session);
  const candidate = useSelector((state) =>
    state.candidates.list.find((c) => c.id === activeCandidateId)
  );

  useEffect(() => {
    if (sessionStatus === 'in_progress') {
      dispatch(fetchNextQuestion());
    }
  }, [sessionStatus, dispatch]);

  if (!isSessionReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-400" />
      </div>
    );
  }

  const wrapperClasses = "flex justify-center items-center p-4 bg-zinc-900 min-h-screen";

  switch (sessionStatus) {
    case 'idle':
      return (
        <div className={wrapperClasses}>
          <ResumeUpload />
        </div>
      );

    case 'collecting_info':
      return (
        <div className={wrapperClasses}>
          <MissingInfoForm />
        </div>
      );

    case 'in_progress':
    case 'generating_question':
    case 'awaiting_answer':
    case 'evaluating_answer':
    case 'generating_summary':
      return (
        <div className={wrapperClasses}>
          <ChatWindow />
        </div>
      );

    case 'finished':
      return (
        <div className={wrapperClasses}>
          <Card className="w-full max-w-md rounded-xl shadow-lg bg-zinc-800/60 border border-zinc-700">
            <CardHeader className="pb-1">
              <CardTitle className="text-2xl text-white font-semibold">Interview Complete!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 pt-2">
              <CheckCircle className="h-16 w-16 text-emerald-400" />
              <p className="text-lg text-white font-medium text-center">
                Thank you for completing the interview.
              </p>
              <p className="text-zinc-400 text-center text-sm">
                You can now close this tab. The interviewer has received your results.
              </p>
              {candidate?.finalScore != null && (
                <p className="font-bold text-xl text-emerald-400 pt-1">
                  Final Score: {candidate.finalScore.toFixed(1)} / 10
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );

    default:
      return (
        <div className={wrapperClasses}>
          <ResumeUpload />
        </div>
      );
  }
};

export default IntervieweeView;
