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
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  switch (sessionStatus) {
    case 'idle':
      return <ResumeUpload />;

    case 'collecting_info':
      return <MissingInfoForm />;

    case 'in_progress':
    case 'generating_question':
    case 'awaiting_answer':
    case 'evaluating_answer':
    case 'generating_summary':
      return <ChatWindow />;

    case 'finished':
      return (
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle>Interview Complete!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-xl">Thank you for completing the interview.</p>
            <p className="text-muted-foreground">
              You can now close this tab. The interviewer has received your results.
            </p>
            {candidate?.finalScore != null && (
              <p className="font-bold text-2xl pt-4">
                Final Score: {candidate.finalScore.toFixed(1)} / 10
              </p>
            )}
          </CardContent>
        </Card>
      );

    default:
      return <ResumeUpload />;
  }
};

export default IntervieweeView;